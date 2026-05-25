from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.tenants.models import Tenant

from .models import IngestionJob, SourceSystem


class IngestionApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_model = get_user_model()

        self.tenant = Tenant.objects.create(name="Tenant A", slug="tenant-a")
        self.other_tenant = Tenant.objects.create(name="Tenant B", slug="tenant-b")

        self.user = self.user_model.objects.create_user(
            username="analyst",
            password="Passw0rd123!",
            tenant=self.tenant,
            role="analyst",
        )
        token = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(token.access_token)}")

        self.source = SourceSystem.objects.create(
            tenant=self.tenant,
            name="SAP Fuel",
            type=SourceSystem.SourceType.SAP,
            connection_mode=SourceSystem.ConnectionMode.UPLOAD,
        )
        self.other_source = SourceSystem.objects.create(
            tenant=self.other_tenant,
            name="Utility Feed",
            type=SourceSystem.SourceType.UTILITY,
            connection_mode=SourceSystem.ConnectionMode.API,
        )

    def test_upload_creates_job_for_user_tenant(self):
        response = self.client.post(
            reverse("ingestion-upload"),
            {"source_system_id": str(self.source.id), "file_name": "sap_fuel_jan.csv"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["status"], IngestionJob.Status.PENDING)
        self.assertEqual(response.json()["tenant"], str(self.tenant.id))

    def test_upload_rejects_other_tenant_source(self):
        response = self.client.post(
            reverse("ingestion-upload"),
            {"source_system_id": str(self.other_source.id), "file_name": "bad.csv"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_run_marks_job_running(self):
        job = IngestionJob.objects.create(tenant=self.tenant, source_system=self.source, initiated_by=self.user)
        response = self.client.post(reverse("ingestion-run"), {"ingestion_job_id": str(job.id)}, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], IngestionJob.Status.RUNNING)

    def test_list_is_tenant_scoped(self):
        own_job = IngestionJob.objects.create(tenant=self.tenant, source_system=self.source, initiated_by=self.user)
        other_job = IngestionJob.objects.create(tenant=self.other_tenant, source_system=self.other_source)

        response = self.client.get(reverse("ingestion-list"))

        self.assertEqual(response.status_code, 200)
        ids = {item["id"] for item in response.json()["results"]}
        self.assertIn(str(own_job.id), ids)
        self.assertNotIn(str(other_job.id), ids)
