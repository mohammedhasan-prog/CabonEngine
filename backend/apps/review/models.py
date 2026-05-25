from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel, UUIDModel


class ReviewAction(UUIDModel, TimeStampedModel):
    class Action(models.TextChoices):
        EDIT = "edit", "Edit"
        APPROVE = "approve", "Approve"
        REJECT = "reject", "Reject"

    record = models.ForeignKey("normalization.NormalizedRecord", on_delete=models.CASCADE, related_name="review_actions")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="review_actions")
    action = models.CharField(max_length=20, choices=Action.choices)
    note = models.TextField(blank=True)
    old_value = models.JSONField(default=dict, blank=True)
    new_value = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]
