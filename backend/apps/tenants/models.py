from django.db import models

from apps.common.models import TimeStampedModel, UUIDModel


class Tenant(UUIDModel, TimeStampedModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    settings = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name
