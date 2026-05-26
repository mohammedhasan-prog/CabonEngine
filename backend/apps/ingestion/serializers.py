from django.utils import timezone
from rest_framework import serializers

from .models import IngestionJob, SourceSystem


class SourceSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SourceSystem
        fields = ("id", "name", "type", "connection_mode", "status")


class IngestionJobSerializer(serializers.ModelSerializer):
    source_system = SourceSystemSerializer(read_only=True)

    class Meta:
        model = IngestionJob
        fields = (
            "id",
            "tenant",
            "source_system",
            "upload",
            "file_name",
            "api_batch_id",
            "started_at",
            "finished_at",
            "status",
            "error_summary",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields


class IngestionUploadSerializer(serializers.Serializer):
    source_system_id = serializers.UUIDField()
    file = serializers.FileField()

    def validate_source_system_id(self, value):
        request = self.context["request"]
        tenant = request.user.tenant
        if tenant is None:
            raise serializers.ValidationError("User is not assigned to a tenant.")
        if not SourceSystem.objects.filter(id=value, tenant=tenant).exists():
            raise serializers.ValidationError("Source system does not exist for this tenant.")
        return value

    def create(self, validated_data):
        request = self.context["request"]
        source_system = SourceSystem.objects.get(id=validated_data["source_system_id"])
        upload = validated_data["file"]
        return IngestionJob.objects.create(
            tenant=request.user.tenant,
            source_system=source_system,
            initiated_by=request.user,
            upload=upload,
            file_name=upload.name,
            status=IngestionJob.Status.PENDING,
        )


class IngestionRunSerializer(serializers.Serializer):
    ingestion_job_id = serializers.UUIDField()

    def validate_ingestion_job_id(self, value):
        request = self.context["request"]
        tenant = request.user.tenant
        if tenant is None:
            raise serializers.ValidationError("User is not assigned to a tenant.")
        if not IngestionJob.objects.filter(id=value, tenant=tenant).exists():
            raise serializers.ValidationError("Ingestion job does not exist for this tenant.")
        return value

    def save(self, **kwargs):
        request = self.context["request"]
        ingestion_job = IngestionJob.objects.get(id=self.validated_data["ingestion_job_id"], tenant=request.user.tenant)
        ingestion_job.status = IngestionJob.Status.RUNNING
        ingestion_job.started_at = ingestion_job.started_at or timezone.now()
        ingestion_job.error_summary = ""
        ingestion_job.save(update_fields=["status", "started_at", "error_summary", "updated_at"])
        return ingestion_job
