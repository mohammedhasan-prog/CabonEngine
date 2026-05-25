from django.contrib import admin

from .models import ReviewAction


@admin.register(ReviewAction)
class ReviewActionAdmin(admin.ModelAdmin):
    list_display = ("id", "record", "user", "action", "created_at")
    list_filter = ("action",)
    search_fields = ("id", "record__id", "user__username")
