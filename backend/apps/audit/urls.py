from django.urls import path

from .views import AuditEventDetailView, AuditEventEntityView, AuditEventListView

urlpatterns = [
    path("", AuditEventListView.as_view(), name="audit-event-list"),
    path("events/", AuditEventListView.as_view(), name="audit-event-list-legacy"),
    path("events/<uuid:id>/", AuditEventDetailView.as_view(), name="audit-event-detail"),
    path("<str:object_type>/<str:object_id>/", AuditEventEntityView.as_view(), name="audit-event-entity"),
]
