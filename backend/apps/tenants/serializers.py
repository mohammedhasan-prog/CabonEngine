from rest_framework import serializers

from .models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ("id", "name", "slug", "settings", "is_active", "created_at", "updated_at")
        read_only_fields = ("id", "slug", "is_active", "created_at", "updated_at")
