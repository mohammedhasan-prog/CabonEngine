from __future__ import annotations

import django.db.models.deletion
import uuid

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("normalization", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ReviewAction",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("action", models.CharField(choices=[("edit", "Edit"), ("approve", "Approve"), ("reject", "Reject")], max_length=20)),
                ("note", models.TextField(blank=True)),
                ("old_value", models.JSONField(blank=True, default=dict)),
                ("new_value", models.JSONField(blank=True, default=dict)),
                (
                    "record",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="review_actions", to="normalization.normalizedrecord"),
                ),
                (
                    "user",
                    models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="review_actions", to=settings.AUTH_USER_MODEL),
                ),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
