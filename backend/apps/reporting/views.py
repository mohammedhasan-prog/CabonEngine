from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.normalization.models import NormalizedRecord


class TenantReportingQuerysetMixin:
    def get_tenant(self):
        return self.request.user.tenant

    def get_queryset(self):
        tenant = self.get_tenant()
        if tenant is None:
            return NormalizedRecord.objects.none()
        qs = NormalizedRecord.objects.filter(tenant=tenant)
        params = self.request.query_params
        if params.get("date_from"):
            qs = qs.filter(activity_date__gte=params["date_from"])
        if params.get("date_to"):
            qs = qs.filter(activity_date__lte=params["date_to"])
        if params.get("status"):
            qs = qs.filter(status=params["status"])
        if params.get("scope"):
            qs = qs.filter(scope=params["scope"])
        if params.get("source"):
            qs = qs.filter(source_system__type=params["source"])
        if params.get("emission_category"):
            qs = qs.filter(emission_category=params["emission_category"])
        return qs


class SummaryReportView(TenantReportingQuerysetMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = self.get_queryset()
        totals = qs.aggregate(
            total_count=Count("id"),
            total_amount=Sum("normalized_amount"),
        )
        by_status = list(qs.values("status").annotate(count=Count("id"), amount=Sum("normalized_amount")))
        by_scope = list(qs.values("scope").annotate(count=Count("id"), amount=Sum("normalized_amount")))
        by_source = list(
            qs.values("source_system__type").annotate(count=Count("id"), amount=Sum("normalized_amount"))
        )
        by_month = list(
            qs.annotate(month=TruncMonth("activity_date"))
            .values("month")
            .annotate(count=Count("id"), amount=Sum("normalized_amount"))
            .order_by("month")
        )
        return Response(
            {
                "totals": totals,
                "by_status": by_status,
                "by_scope": by_scope,
                "by_source": by_source,
                "by_month": by_month,
            }
        )


class ByScopeReportView(TenantReportingQuerysetMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = self.get_queryset()
        data = list(qs.values("scope").annotate(count=Count("id"), amount=Sum("normalized_amount")))
        return Response(data)


class BySourceReportView(TenantReportingQuerysetMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = self.get_queryset()
        data = list(
            qs.values("source_system__type").annotate(count=Count("id"), amount=Sum("normalized_amount"))
        )
        return Response(data)
