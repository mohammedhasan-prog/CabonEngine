from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel, UUIDModel


class SourceSystem(UUIDModel, TimeStampedModel):
    class SourceType(models.TextChoices):
        SAP = "sap", "SAP"
        UTILITY = "utility", "Utility"
        TRAVEL = "travel", "Travel"

    class ConnectionMode(models.TextChoices):
        UPLOAD = "upload", "Upload"
        API = "api", "API"
        MANUAL = "manual", "Manual"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"
        ERROR = "error", "Error"

    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="source_systems")
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=SourceType.choices)
    connection_mode = models.CharField(max_length=20, choices=ConnectionMode.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["tenant", "name"], name="unique_source_name_per_tenant"),
        ]

    def __str__(self) -> str:
        return f"{self.tenant.slug}:{self.name}"


class IngestionJob(UUIDModel, TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        RUNNING = "running", "Running"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="ingestion_jobs")
    source_system = models.ForeignKey(SourceSystem, on_delete=models.PROTECT, related_name="ingestion_jobs")
    initiated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="initiated_ingestion_jobs",
    )
    upload = models.FileField(upload_to="ingestions/%Y/%m/%d", blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True)
    api_batch_id = models.CharField(max_length=255, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    error_summary = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.tenant.slug}:{self.id}:{self.status}"
