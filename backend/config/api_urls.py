"""API URL routing for versioned endpoints."""

from django.urls import include, path

urlpatterns = [
    path("", include("apps.common.urls")),
    path("auth/", include("apps.accounts.urls")),
    path("tenants/", include("apps.tenants.urls")),
    path("ingestions/", include("apps.ingestion.urls")),
    path("records/", include("apps.review.urls")),
    path("audit/", include("apps.audit.urls")),
    path("reports/", include("apps.reporting.urls")),
    path("reference-data/", include("apps.reference_data.urls")),
]
