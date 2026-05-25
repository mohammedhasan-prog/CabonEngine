from __future__ import annotations

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("tenants", "0001_initial"),
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="AuditEvent",
            fields=[
                (
                    "id",
                    models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("action", models.CharField(max_length=32, choices=[
                    ("create", "Create"),
                    ("update", "Update"),
                    ("delete", "Delete"),
                    ("ingest", "Ingest"),
                    ("run", "Run"),
                    ("approve", "Approve"),
                    ("reject", "Reject"),
                    ("edit", "Edit"),
                ])),
                ("object_type", models.CharField(max_length=120)),
                ("object_id", models.CharField(max_length=64, blank=True)),
                ("payload", models.JSONField(blank=True, default=dict)),
                ("tenant", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="audit_events", to="tenants.tenant")),
                ("actor", models.ForeignKey(on_delete=models.deletion.PROTECT, related_name="audit_events", to="accounts.user")),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="auditevent",
            index=models.Index(fields=["tenant", "object_type"], name="audit_tenant_object_idx"),
        ),
        migrations.AddIndex(
            model_name="auditevent",
            index=models.Index(fields=["tenant", "actor"], name="audit_tenant_actor_idx"),
        ),
    ]
