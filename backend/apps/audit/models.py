from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel, UUIDModel


class AuditEvent(UUIDModel, TimeStampedModel):
    class Action(models.TextChoices):
        CREATE = "create", "Create"
        UPDATE = "update", "Update"
        DELETE = "delete", "Delete"
        INGEST = "ingest", "Ingest"
        RUN = "run", "Run"
        APPROVE = "approve", "Approve"
        REJECT = "reject", "Reject"
        EDIT = "edit", "Edit"

    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="audit_events")
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="audit_events")
    action = models.CharField(max_length=32, choices=Action.choices)
    object_type = models.CharField(max_length=120)
    object_id = models.CharField(max_length=64, blank=True)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["tenant", "object_type"]),
            models.Index(fields=["tenant", "actor"]),
        ]

    def save(self, *args, **kwargs):
        if not getattr(self, "_state", None) or not getattr(self._state, "adding", True):
            raise ValueError("AuditEvent instances are immutable and cannot be updated")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValueError("AuditEvent instances are immutable and cannot be deleted")
