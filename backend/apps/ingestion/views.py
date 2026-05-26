from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.views import APIView

from .models import IngestionJob, SourceSystem
from .serializers import (
    IngestionJobSerializer,
    IngestionRunSerializer,
    IngestionUploadSerializer,
    SourceSystemSerializer,
)
from apps.audit.models import AuditEvent
from .services import process_ingestion_job


class TenantIngestionQuerysetMixin:
    def get_tenant(self):
        return self.request.user.tenant

    def get_queryset(self):
        tenant = self.get_tenant()
        if tenant is None:
            return IngestionJob.objects.none()
        return IngestionJob.objects.select_related("source_system", "tenant").filter(tenant=tenant)


class IngestionJobListView(TenantIngestionQuerysetMixin, generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = IngestionJobSerializer


class IngestionJobDetailView(TenantIngestionQuerysetMixin, generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = IngestionJobSerializer
    lookup_field = "id"


class SourceSystemListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SourceSystemSerializer

    def get_queryset(self):
        tenant = getattr(self.request.user, "tenant", None)
        if tenant is None:
            return SourceSystem.objects.none()
        return SourceSystem.objects.filter(tenant=tenant).order_by("name")


class IngestionUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = IngestionUploadSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        ingestion_job = serializer.save()
        AuditEvent.objects.create(
            tenant=ingestion_job.tenant,
            actor=request.user,
            action=AuditEvent.Action.CREATE,
            object_type="IngestionJob",
            object_id=str(ingestion_job.id),
            payload={"file_name": ingestion_job.file_name, "status": ingestion_job.status},
        )
        return Response(IngestionJobSerializer(ingestion_job).data, status=status.HTTP_201_CREATED)


class IngestionRunView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = IngestionRunSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        ingestion_job = serializer.save()
        AuditEvent.objects.create(
            tenant=ingestion_job.tenant,
            actor=request.user,
            action=AuditEvent.Action.RUN,
            object_type="IngestionJob",
            object_id=str(ingestion_job.id),
            payload={"status": ingestion_job.status, "started_at": ingestion_job.started_at.isoformat() if ingestion_job.started_at else None},
        )

        processed_job = process_ingestion_job(ingestion_job, request.user)
        return Response(IngestionJobSerializer(processed_job).data)
