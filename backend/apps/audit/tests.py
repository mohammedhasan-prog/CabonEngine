from datetime import date

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.ingestion.models import IngestionJob, SourceSystem
from apps.normalization.models import NormalizedRecord, RawRecord
from apps.tenants.models import Tenant
from apps.audit.models import AuditEvent


class AuditEventTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_model = get_user_model()

        self.tenant = Tenant.objects.create(name="Tenant A", slug="tenant-a")

        self.analyst = self.user_model.objects.create_user(
            username="analyst",
            password="Passw0rd123!",
            role="analyst",
            tenant=self.tenant,
        )

        self.source = SourceSystem.objects.create(
            tenant=self.tenant,
            name="SAP Fuel",
            type=SourceSystem.SourceType.SAP,
            connection_mode=SourceSystem.ConnectionMode.UPLOAD,
        )

        self.job = IngestionJob.objects.create(tenant=self.tenant, source_system=self.source, initiated_by=self.analyst)

        self.raw = RawRecord.objects.create(
            ingestion_job=self.job,
            raw_payload={"row": 1, "fuel": "diesel"},
            raw_payload_hash="a" * 64,
            source_row_ref="1",
        )

        self.record = NormalizedRecord.objects.create(
            tenant=self.tenant,
            source_system=self.source,
            raw_record=self.raw,
            source_record_id="sap-1",
            activity_date=date(2026, 5, 1),
            activity_type="diesel",
            amount=Decimal("100.0"),
            unit="l",
            normalized_amount=Decimal("100.0"),
            normalized_unit="l",
            emission_category="fuel",
            scope=NormalizedRecord.Scope.SCOPE_1,
            status=NormalizedRecord.Status.PENDING_REVIEW,
            approval_status=NormalizedRecord.Status.PENDING_REVIEW,
        )

    def authenticate(self, user):
        token = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(token.access_token)}")

    def test_audit_created_on_record_edit_and_immutable(self):
        self.authenticate(self.analyst)
        response = self.client.patch(
            reverse("record-detail", kwargs={"id": self.record.id}),
            {"activity_type": "biodiesel", "note": "mapped"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)

        events = AuditEvent.objects.filter(tenant=self.tenant, object_type="NormalizedRecord", object_id=str(self.record.id))
        self.assertEqual(events.count(), 1)
        ev = events.first()
        self.assertEqual(ev.action, AuditEvent.Action.EDIT)

        # Attempt to update should raise due to immutability
        ev.payload["changed_by_test"] = True
        with self.assertRaises(ValueError):
            ev.save()

    def test_audit_created_on_ingestion_upload_and_run(self):
        self.authenticate(self.analyst)
        upload_resp = self.client.post(reverse("ingestion-upload"), {"source_system_id": str(self.source.id), "file_name": "data.csv"}, format="json")
        self.assertIn(upload_resp.status_code, (200, 201))
        # An ingestion job should exist and an audit event
        job_id = upload_resp.json().get("id")
        events = AuditEvent.objects.filter(tenant=self.tenant, object_type="IngestionJob", object_id=str(job_id))
        self.assertGreaterEqual(events.count(), 1)

        # Run ingestion
        run_resp = self.client.post(reverse("ingestion-run"), {"ingestion_job_id": job_id}, format="json")
        self.assertEqual(run_resp.status_code, 200)
        run_events = AuditEvent.objects.filter(tenant=self.tenant, object_type="IngestionJob", object_id=str(job_id), action=AuditEvent.Action.RUN)
        self.assertGreaterEqual(run_events.count(), 1)
