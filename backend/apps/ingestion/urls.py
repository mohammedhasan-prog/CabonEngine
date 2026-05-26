from django.urls import path

from .views import (
    IngestionJobDetailView,
    IngestionJobListView,
    IngestionRunView,
    IngestionUploadView,
    SourceSystemListView,
)

urlpatterns = [
    path("", IngestionJobListView.as_view(), name="ingestion-list"),
    path("sources/", SourceSystemListView.as_view(), name="ingestion-source-list"),
    path("<uuid:id>/", IngestionJobDetailView.as_view(), name="ingestion-detail"),
    path("upload/", IngestionUploadView.as_view(), name="ingestion-upload"),
    path("run/", IngestionRunView.as_view(), name="ingestion-run"),
]
