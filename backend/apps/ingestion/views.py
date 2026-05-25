from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import IngestionJob
from .serializers import (
    IngestionJobSerializer,
    IngestionRunSerializer,
    IngestionUploadSerializer,
)


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


class IngestionUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = IngestionUploadSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        ingestion_job = serializer.save()
        return Response(IngestionJobSerializer(ingestion_job).data, status=status.HTTP_201_CREATED)


class IngestionRunView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = IngestionRunSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        ingestion_job = serializer.save()
        return Response(IngestionJobSerializer(ingestion_job).data)
