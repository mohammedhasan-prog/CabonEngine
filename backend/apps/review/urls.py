from django.urls import path

from .views import RecordApproveView, RecordDetailView, RecordListView, RecordRejectView

urlpatterns = [
    path("", RecordListView.as_view(), name="record-list"),
    path("<uuid:id>/", RecordDetailView.as_view(), name="record-detail"),
    path("<uuid:id>/approve/", RecordApproveView.as_view(), name="record-approve"),
    path("<uuid:id>/reject/", RecordRejectView.as_view(), name="record-reject"),
]
