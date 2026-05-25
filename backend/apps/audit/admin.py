from django.contrib import admin

from .models import AuditEvent


@admin.register(AuditEvent)
class AuditEventAdmin(admin.ModelAdmin):
    list_display = ("id", "tenant", "actor", "action", "object_type", "object_id", "created_at")
    readonly_fields = list_display
    search_fields = ("object_type", "object_id", "actor__username")
    ordering = ("-created_at",)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
