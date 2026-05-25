from rest_framework import generics, permissions

from .models import AuditEvent
from .serializers import AuditEventSerializer


class TenantAuditQuerysetMixin:
    def get_tenant(self):
        return self.request.user.tenant

    def get_queryset(self):
        tenant = self.get_tenant()
        if tenant is None:
            return AuditEvent.objects.none()
        qs = AuditEvent.objects.filter(tenant=tenant).select_related("actor").order_by("-created_at")
        params = self.request.query_params
        if params.get("action"):
            qs = qs.filter(action=params["action"])
        if params.get("object_type"):
            qs = qs.filter(object_type=params["object_type"])
        if params.get("object_id"):
            qs = qs.filter(object_id=params["object_id"])
        if params.get("actor"):
            qs = qs.filter(actor_id=params["actor"])
        return qs


class AuditEventListView(TenantAuditQuerysetMixin, generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AuditEventSerializer


class AuditEventDetailView(TenantAuditQuerysetMixin, generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AuditEventSerializer
    lookup_field = "id"
