from django.db import models

from apps.common.models import TimeStampedModel, UUIDModel


class RawRecord(UUIDModel, TimeStampedModel):
    ingestion_job = models.ForeignKey("ingestion.IngestionJob", on_delete=models.CASCADE, related_name="raw_records")
    raw_payload = models.JSONField()
    raw_payload_hash = models.CharField(max_length=64, db_index=True)
    source_row_ref = models.CharField(max_length=255, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["ingestion_job", "raw_payload_hash"], name="unique_raw_payload_per_job"),
        ]


class NormalizedRecord(UUIDModel, TimeStampedModel):
    class Scope(models.TextChoices):
        SCOPE_1 = "scope_1", "Scope 1"
        SCOPE_2 = "scope_2", "Scope 2"
        SCOPE_3 = "scope_3", "Scope 3"

    class Status(models.TextChoices):
        IMPORTED = "imported", "Imported"
        FAILED = "failed", "Failed"
        SUSPICIOUS = "suspicious", "Suspicious"
        PENDING_REVIEW = "pending_review", "Pending review"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    class EditSource(models.TextChoices):
        INGESTION = "ingestion", "Ingestion"
        ANALYST = "analyst", "Analyst"
        ADMIN = "admin", "Admin"

    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="normalized_records")
    source_system = models.ForeignKey("ingestion.SourceSystem", on_delete=models.PROTECT, related_name="normalized_records")
    raw_record = models.ForeignKey(RawRecord, on_delete=models.PROTECT, related_name="normalized_records")
    source_record_id = models.CharField(max_length=255, blank=True)

    activity_date = models.DateField()
    activity_type = models.CharField(max_length=120)
    amount = models.DecimalField(max_digits=18, decimal_places=6)
    unit = models.CharField(max_length=50)
    normalized_amount = models.DecimalField(max_digits=18, decimal_places=6)
    normalized_unit = models.CharField(max_length=50)

    emission_category = models.CharField(max_length=120, blank=True)
    scope = models.CharField(max_length=20, choices=Scope.choices)
    emission_factor_id = models.CharField(max_length=255, blank=True)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING_REVIEW)
    suspicious_flag = models.BooleanField(default=False)
    validation_errors = models.JSONField(default=list, blank=True)

    ingestion_timestamp = models.DateTimeField(auto_now_add=True)
    last_edited_timestamp = models.DateTimeField(auto_now=True)
    edit_source = models.CharField(max_length=20, choices=EditSource.choices, default=EditSource.INGESTION)
    approval_status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING_REVIEW)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["tenant", "status"]),
            models.Index(fields=["tenant", "scope"]),
            models.Index(fields=["tenant", "activity_date"]),
            models.Index(fields=["tenant", "suspicious_flag"]),
        ]
