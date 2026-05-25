from django.contrib import admin

from .models import IngestionJob, SourceSystem


@admin.register(SourceSystem)
class SourceSystemAdmin(admin.ModelAdmin):
    list_display = ("name", "tenant", "type", "connection_mode", "status", "created_at")
    list_filter = ("type", "connection_mode", "status")
    search_fields = ("name", "tenant__name", "tenant__slug")


@admin.register(IngestionJob)
class IngestionJobAdmin(admin.ModelAdmin):
    list_display = ("id", "tenant", "source_system", "status", "started_at", "finished_at", "created_at")
    list_filter = ("status", "source_system__type")
    search_fields = ("id", "tenant__name", "tenant__slug", "source_system__name", "file_name", "api_batch_id")
