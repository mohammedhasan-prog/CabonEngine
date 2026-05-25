from rest_framework import serializers

from apps.normalization.models import NormalizedRecord

from .models import ReviewAction


class NormalizedRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalizedRecord
        fields = (
            "id",
            "tenant",
            "source_system",
            "raw_record",
            "source_record_id",
            "activity_date",
            "activity_type",
            "amount",
            "unit",
            "normalized_amount",
            "normalized_unit",
            "emission_category",
            "scope",
            "emission_factor_id",
            "status",
            "suspicious_flag",
            "validation_errors",
            "ingestion_timestamp",
            "last_edited_timestamp",
            "edit_source",
            "approval_status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "tenant",
            "source_system",
            "raw_record",
            "ingestion_timestamp",
            "last_edited_timestamp",
            "created_at",
            "updated_at",
        )


class RecordUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalizedRecord
        fields = (
            "activity_date",
            "activity_type",
            "amount",
            "unit",
            "normalized_amount",
            "normalized_unit",
            "emission_category",
            "scope",
            "emission_factor_id",
            "suspicious_flag",
            "validation_errors",
            "status",
        )


class ReviewActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewAction
        fields = ("id", "record", "user", "action", "note", "old_value", "new_value", "created_at")
        read_only_fields = ("id", "record", "user", "action", "created_at")
