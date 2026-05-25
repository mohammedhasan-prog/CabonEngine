from django.contrib import admin

from .models import NormalizedRecord, RawRecord


@admin.register(RawRecord)
class RawRecordAdmin(admin.ModelAdmin):
    list_display = ("id", "ingestion_job", "source_row_ref", "created_at")
    search_fields = ("id", "source_row_ref", "ingestion_job__id")


@admin.register(NormalizedRecord)
class NormalizedRecordAdmin(admin.ModelAdmin):
    list_display = ("id", "tenant", "source_system", "activity_date", "scope", "status", "suspicious_flag")
    list_filter = ("scope", "status", "suspicious_flag", "source_system__type")
    search_fields = ("id", "activity_type", "source_record_id", "tenant__slug", "source_system__name")
