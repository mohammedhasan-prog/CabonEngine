from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.normalization.models import NormalizedRecord

from .models import ReviewAction
from apps.audit.models import AuditEvent
from .permissions import CanModifyRecord
from .serializers import NormalizedRecordSerializer, RecordUpdateSerializer


class TenantRecordQuerysetMixin:
    def get_tenant(self):
        return self.request.user.tenant

    def get_queryset(self):
        tenant = self.get_tenant()
        if tenant is None:
            return NormalizedRecord.objects.none()

        queryset = (
            NormalizedRecord.objects.select_related("tenant", "source_system", "raw_record")
            .filter(tenant=tenant)
            .order_by("-created_at")
        )
        params = self.request.query_params
        if params.get("source"):
            queryset = queryset.filter(source_system__type=params["source"])
        if params.get("status"):
            queryset = queryset.filter(status=params["status"])
        if params.get("scope"):
            queryset = queryset.filter(scope=params["scope"])
        if params.get("suspicious") in {"true", "false"}:
            queryset = queryset.filter(suspicious_flag=(params["suspicious"] == "true"))
        if params.get("has_errors") in {"true", "false"}:
            if params["has_errors"] == "true":
                queryset = queryset.exclude(validation_errors=[])
            else:
                queryset = queryset.filter(validation_errors=[])
        if params.get("date_from"):
            queryset = queryset.filter(activity_date__gte=params["date_from"])
        if params.get("date_to"):
            queryset = queryset.filter(activity_date__lte=params["date_to"])
        return queryset


class RecordListView(TenantRecordQuerysetMixin, generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NormalizedRecordSerializer


class RecordDetailView(TenantRecordQuerysetMixin, generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, CanModifyRecord]
    serializer_class = RecordUpdateSerializer
    lookup_field = "id"

    def get_serializer_class(self):
        if self.request.method == "GET":
            return NormalizedRecordSerializer
        return RecordUpdateSerializer

    def patch(self, request, *args, **kwargs):
        record = self.get_object()
        if record.approval_status == NormalizedRecord.Status.APPROVED and request.user.role != "admin":
            return Response({"detail": "Approved records are locked for non-admin users."}, status=409)

        old_value = {
            "activity_date": str(record.activity_date),
            "activity_type": record.activity_type,
            "amount": str(record.amount),
            "unit": record.unit,
            "normalized_amount": str(record.normalized_amount),
            "normalized_unit": record.normalized_unit,
            "emission_category": record.emission_category,
            "scope": record.scope,
            "emission_factor_id": record.emission_factor_id,
            "suspicious_flag": record.suspicious_flag,
            "validation_errors": record.validation_errors,
            "status": record.status,
        }

        serializer = self.get_serializer(record, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_record = serializer.save(
            edit_source=NormalizedRecord.EditSource.ADMIN if request.user.role == "admin" else NormalizedRecord.EditSource.ANALYST
        )

        ReviewAction.objects.create(
            record=updated_record,
            user=request.user,
            action=ReviewAction.Action.EDIT,
            note=request.data.get("note", ""),
            old_value=old_value,
            new_value=serializer.data,
        )

        AuditEvent.objects.create(
            tenant=updated_record.tenant,
            actor=request.user,
            action=AuditEvent.Action.EDIT,
            object_type="NormalizedRecord",
            object_id=str(updated_record.id),
            payload={"old": old_value, "new": serializer.data, "note": request.data.get("note", "")},
        )

        return Response(NormalizedRecordSerializer(updated_record).data)


class RecordApproveView(TenantRecordQuerysetMixin, APIView):
    permission_classes = [permissions.IsAuthenticated, CanModifyRecord]

    def post(self, request, id):
        record = get_object_or_404(self.get_queryset(), id=id)
        with transaction.atomic():
            previous = {"status": record.status, "approval_status": record.approval_status}
            record.status = NormalizedRecord.Status.APPROVED
            record.approval_status = NormalizedRecord.Status.APPROVED
            record.edit_source = NormalizedRecord.EditSource.ADMIN if request.user.role == "admin" else NormalizedRecord.EditSource.ANALYST
            record.save(update_fields=["status", "approval_status", "edit_source", "updated_at", "last_edited_timestamp"])
            ReviewAction.objects.create(
                record=record,
                user=request.user,
                action=ReviewAction.Action.APPROVE,
                note=request.data.get("note", ""),
                old_value=previous,
                new_value={"status": record.status, "approval_status": record.approval_status},
            )
            AuditEvent.objects.create(
                tenant=record.tenant,
                actor=request.user,
                action=AuditEvent.Action.APPROVE,
                object_type="NormalizedRecord",
                object_id=str(record.id),
                payload={"old": previous, "new": {"status": record.status, "approval_status": record.approval_status}, "note": request.data.get("note", "")},
            )
        return Response(NormalizedRecordSerializer(record).data)


class RecordRejectView(TenantRecordQuerysetMixin, APIView):
    permission_classes = [permissions.IsAuthenticated, CanModifyRecord]

    def post(self, request, id):
        record = get_object_or_404(self.get_queryset(), id=id)
        with transaction.atomic():
            previous = {"status": record.status, "approval_status": record.approval_status}
            record.status = NormalizedRecord.Status.REJECTED
            record.approval_status = NormalizedRecord.Status.REJECTED
            record.edit_source = NormalizedRecord.EditSource.ADMIN if request.user.role == "admin" else NormalizedRecord.EditSource.ANALYST
            record.save(update_fields=["status", "approval_status", "edit_source", "updated_at", "last_edited_timestamp"])
            ReviewAction.objects.create(
                record=record,
                user=request.user,
                action=ReviewAction.Action.REJECT,
                note=request.data.get("note", ""),
                old_value=previous,
                new_value={"status": record.status, "approval_status": record.approval_status},
            )
            AuditEvent.objects.create(
                tenant=record.tenant,
                actor=request.user,
                action=AuditEvent.Action.REJECT,
                object_type="NormalizedRecord",
                object_id=str(record.id),
                payload={"old": previous, "new": {"status": record.status, "approval_status": record.approval_status}, "note": request.data.get("note", "")},
            )
        return Response(NormalizedRecordSerializer(record).data)
