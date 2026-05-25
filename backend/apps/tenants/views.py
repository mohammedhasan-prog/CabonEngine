from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import TenantSerializer


class CurrentTenantView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_tenant(self, request):
        return getattr(request.user, "tenant", None)

    def get(self, request):
        tenant = self.get_tenant(request)
        if tenant is None:
            return Response({"detail": "User is not assigned to a tenant."}, status=404)
        return Response(TenantSerializer(tenant).data)

    def patch(self, request):
        tenant = self.get_tenant(request)
        if tenant is None:
            return Response({"detail": "User is not assigned to a tenant."}, status=404)

        serializer = TenantSerializer(tenant, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
