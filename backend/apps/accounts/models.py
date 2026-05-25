import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Role(models.TextChoices):
        ANALYST = "analyst", "Analyst"
        ADMIN = "admin", "Admin"
        VIEWER = "viewer", "Read-only viewer"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ANALYST)
    tenant = models.ForeignKey(
        "tenants.Tenant",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="users",
    )

    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"
