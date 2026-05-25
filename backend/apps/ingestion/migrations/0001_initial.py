from __future__ import annotations

import django.db.models.deletion
import uuid

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("tenants", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="SourceSystem",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=255)),
                ("type", models.CharField(choices=[("sap", "SAP"), ("utility", "Utility"), ("travel", "Travel")], max_length=20)),
                (
                    "connection_mode",
                    models.CharField(choices=[("upload", "Upload"), ("api", "API"), ("manual", "Manual")], max_length=20),
                ),
                (
                    "status",
                    models.CharField(choices=[("active", "Active"), ("inactive", "Inactive"), ("error", "Error")], default="active", max_length=20),
                ),
                (
                    "tenant",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="source_systems", to="tenants.tenant"),
                ),
            ],
            options={},
        ),
        migrations.CreateModel(
            name="IngestionJob",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("file_name", models.CharField(blank=True, max_length=255)),
                ("api_batch_id", models.CharField(blank=True, max_length=255)),
                ("started_at", models.DateTimeField(blank=True, null=True)),
                ("finished_at", models.DateTimeField(blank=True, null=True)),
                (
                    "status",
                    models.CharField(
                        choices=[("pending", "Pending"), ("running", "Running"), ("completed", "Completed"), ("failed", "Failed")],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("error_summary", models.TextField(blank=True)),
                (
                    "initiated_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="initiated_ingestion_jobs",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "source_system",
                    models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="ingestion_jobs", to="ingestion.sourcesystem"),
                ),
                (
                    "tenant",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="ingestion_jobs", to="tenants.tenant"),
                ),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.AddConstraint(
            model_name="sourcesystem",
            constraint=models.UniqueConstraint(fields=("tenant", "name"), name="unique_source_name_per_tenant"),
        ),
    ]
