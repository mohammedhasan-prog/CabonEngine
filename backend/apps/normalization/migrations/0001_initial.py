from __future__ import annotations

import django.db.models.deletion
import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("ingestion", "0001_initial"),
        ("tenants", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="RawRecord",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("raw_payload", models.JSONField()),
                ("raw_payload_hash", models.CharField(db_index=True, max_length=64)),
                ("source_row_ref", models.CharField(blank=True, max_length=255)),
                (
                    "ingestion_job",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="raw_records", to="ingestion.ingestionjob"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="NormalizedRecord",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("source_record_id", models.CharField(blank=True, max_length=255)),
                ("activity_date", models.DateField()),
                ("activity_type", models.CharField(max_length=120)),
                ("amount", models.DecimalField(decimal_places=6, max_digits=18)),
                ("unit", models.CharField(max_length=50)),
                ("normalized_amount", models.DecimalField(decimal_places=6, max_digits=18)),
                ("normalized_unit", models.CharField(max_length=50)),
                ("emission_category", models.CharField(blank=True, max_length=120)),
                ("scope", models.CharField(choices=[("scope_1", "Scope 1"), ("scope_2", "Scope 2"), ("scope_3", "Scope 3")], max_length=20)),
                ("emission_factor_id", models.CharField(blank=True, max_length=255)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("imported", "Imported"),
                            ("failed", "Failed"),
                            ("suspicious", "Suspicious"),
                            ("pending_review", "Pending review"),
                            ("approved", "Approved"),
                            ("rejected", "Rejected"),
                        ],
                        default="pending_review",
                        max_length=20,
                    ),
                ),
                ("suspicious_flag", models.BooleanField(default=False)),
                ("validation_errors", models.JSONField(blank=True, default=list)),
                ("ingestion_timestamp", models.DateTimeField(auto_now_add=True)),
                ("last_edited_timestamp", models.DateTimeField(auto_now=True)),
                (
                    "edit_source",
                    models.CharField(choices=[("ingestion", "Ingestion"), ("analyst", "Analyst"), ("admin", "Admin")], default="ingestion", max_length=20),
                ),
                (
                    "approval_status",
                    models.CharField(
                        choices=[
                            ("imported", "Imported"),
                            ("failed", "Failed"),
                            ("suspicious", "Suspicious"),
                            ("pending_review", "Pending review"),
                            ("approved", "Approved"),
                            ("rejected", "Rejected"),
                        ],
                        default="pending_review",
                        max_length=20,
                    ),
                ),
                (
                    "raw_record",
                    models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="normalized_records", to="normalization.rawrecord"),
                ),
                (
                    "source_system",
                    models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="normalized_records", to="ingestion.sourcesystem"),
                ),
                (
                    "tenant",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="normalized_records", to="tenants.tenant"),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="rawrecord",
            constraint=models.UniqueConstraint(fields=("ingestion_job", "raw_payload_hash"), name="unique_raw_payload_per_job"),
        ),
        migrations.AddIndex(
            model_name="normalizedrecord",
            index=models.Index(fields=["tenant", "status"], name="normalizati_tenant__8ec78c_idx"),
        ),
        migrations.AddIndex(
            model_name="normalizedrecord",
            index=models.Index(fields=["tenant", "scope"], name="normalizati_tenant__a99634_idx"),
        ),
        migrations.AddIndex(
            model_name="normalizedrecord",
            index=models.Index(fields=["tenant", "activity_date"], name="normalizati_tenant__d86e2f_idx"),
        ),
        migrations.AddIndex(
            model_name="normalizedrecord",
            index=models.Index(fields=["tenant", "suspicious_flag"], name="normalizati_tenant__7bcc5c_idx"),
        ),
    ]
