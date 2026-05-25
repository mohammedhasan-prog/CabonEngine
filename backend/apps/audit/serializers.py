from rest_framework import serializers

from .models import AuditEvent


class AuditEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditEvent
        fields = ("id", "tenant", "actor", "action", "object_type", "object_id", "payload", "created_at")
        read_only_fields = fields
