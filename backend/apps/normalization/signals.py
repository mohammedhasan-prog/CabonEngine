from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.audit.models import AuditEvent
from .models import NormalizedRecord


@receiver(post_save, sender=NormalizedRecord)
def log_normalized_record_create(sender, instance, created, **kwargs):
    if not created:
        return
    actor = getattr(instance, "created_by", None)
    if not actor:
        ingestion_job = getattr(instance, "ingestion_job", None)
        if ingestion_job is not None:
            actor = getattr(ingestion_job, "initiated_by", None)

    if actor is None:
        # If we cannot determine an actor, skip creating audit event to avoid DB integrity errors.
        return

    try:
        AuditEvent.objects.create(
            tenant=instance.tenant,
            actor=actor,
            action=AuditEvent.Action.CREATE,
            object_type="NormalizedRecord",
            object_id=str(instance.id),
            payload={
                "status": instance.status,
                "approval_status": instance.approval_status,
                "source_record_id": instance.source_record_id,
            },
        )
    except Exception:
        # Avoid raising in signal path; auditing should not break normalization
        pass
