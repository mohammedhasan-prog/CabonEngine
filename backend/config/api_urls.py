"""API URL routing for versioned endpoints."""

from django.urls import include, path

urlpatterns = [
    path("", include("apps.common.urls")),
    path("auth/", include("apps.accounts.urls")),
]
