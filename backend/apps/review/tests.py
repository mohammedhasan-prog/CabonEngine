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


class ReviewApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_model = get_user_model()

        self.tenant = Tenant.objects.create(name="Tenant A", slug="tenant-a")
        self.other_tenant = Tenant.objects.create(name="Tenant B", slug="tenant-b")

        self.analyst = self.user_model.objects.create_user(
            username="analyst",
            password="Passw0rd123!",
            role="analyst",
            tenant=self.tenant,
        )
        self.admin = self.user_model.objects.create_user(
            username="admin_user",
            password="Passw0rd123!",
            role="admin",
            tenant=self.tenant,
        )

        self.source = SourceSystem.objects.create(
            tenant=self.tenant,
            name="SAP Fuel",
            type=SourceSystem.SourceType.SAP,
            connection_mode=SourceSystem.ConnectionMode.UPLOAD,
        )
        other_source = SourceSystem.objects.create(
            tenant=self.other_tenant,
            name="Utility",
            type=SourceSystem.SourceType.UTILITY,
            connection_mode=SourceSystem.ConnectionMode.API,
        )

        self.job = IngestionJob.objects.create(tenant=self.tenant, source_system=self.source, initiated_by=self.analyst)
        other_job = IngestionJob.objects.create(tenant=self.other_tenant, source_system=other_source)

        self.raw = RawRecord.objects.create(
            ingestion_job=self.job,
            raw_payload={"row": 1, "fuel": "diesel"},
            raw_payload_hash="a" * 64,
            source_row_ref="1",
        )
        other_raw = RawRecord.objects.create(
            ingestion_job=other_job,
            raw_payload={"row": 2},
            raw_payload_hash="b" * 64,
            source_row_ref="2",
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
        self.other_record = NormalizedRecord.objects.create(
            tenant=self.other_tenant,
            source_system=other_source,
            raw_record=other_raw,
            source_record_id="u-1",
            activity_date=date(2026, 5, 1),
            activity_type="electricity",
            amount=Decimal("50.0"),
            unit="kwh",
            normalized_amount=Decimal("50.0"),
            normalized_unit="kwh",
            emission_category="power",
            scope=NormalizedRecord.Scope.SCOPE_2,
            status=NormalizedRecord.Status.PENDING_REVIEW,
            approval_status=NormalizedRecord.Status.PENDING_REVIEW,
        )

    def authenticate(self, user):
        token = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(token.access_token)}")

    def test_record_list_is_tenant_scoped(self):
        self.authenticate(self.analyst)
        response = self.client.get(reverse("record-list"))

        self.assertEqual(response.status_code, 200)
        ids = {item["id"] for item in response.json()["results"]}
        self.assertIn(str(self.record.id), ids)
        self.assertNotIn(str(self.other_record.id), ids)

    def test_record_update_endpoint(self):
        self.authenticate(self.analyst)
        response = self.client.patch(
            reverse("record-detail", kwargs={"id": self.record.id}),
            {"activity_type": "biodiesel", "note": "mapped from updated source label"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["activity_type"], "biodiesel")

    def test_approved_record_locked_for_analyst(self):
        self.record.status = NormalizedRecord.Status.APPROVED
        self.record.approval_status = NormalizedRecord.Status.APPROVED
        self.record.save(update_fields=["status", "approval_status", "updated_at", "last_edited_timestamp"])

        self.authenticate(self.analyst)
        response = self.client.patch(
            reverse("record-detail", kwargs={"id": self.record.id}),
            {"activity_type": "locked-change"},
            format="json",
        )
        self.assertEqual(response.status_code, 409)

    def test_approved_record_editable_by_admin(self):
        self.record.status = NormalizedRecord.Status.APPROVED
        self.record.approval_status = NormalizedRecord.Status.APPROVED
        self.record.save(update_fields=["status", "approval_status", "updated_at", "last_edited_timestamp"])

        self.authenticate(self.admin)
        response = self.client.patch(
            reverse("record-detail", kwargs={"id": self.record.id}),
            {"activity_type": "admin-correction"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["activity_type"], "admin-correction")

    def test_record_approve_and_reject(self):
        self.authenticate(self.analyst)
        approve = self.client.post(reverse("record-approve", kwargs={"id": self.record.id}), {"note": "ok"}, format="json")
        self.assertEqual(approve.status_code, 200)
        self.assertEqual(approve.json()["approval_status"], NormalizedRecord.Status.APPROVED)

        reject = self.client.post(reverse("record-reject", kwargs={"id": self.record.id}), {"note": "bad"}, format="json")
        self.assertEqual(reject.status_code, 200)
        self.assertEqual(reject.json()["approval_status"], NormalizedRecord.Status.REJECTED)
