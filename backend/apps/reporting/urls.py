from django.urls import path

from .views import ByScopeReportView, BySourceReportView, SummaryReportView

urlpatterns = [
    path("summary/", SummaryReportView.as_view(), name="report-summary"),
    path("by-scope/", ByScopeReportView.as_view(), name="report-by-scope"),
    path("by-source/", BySourceReportView.as_view(), name="report-by-source"),
]
