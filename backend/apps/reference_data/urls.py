from django.urls import path

from .views import (
    EmissionFactorDetailView,
    EmissionFactorListCreateView,
    SourceMappingDetailView,
    SourceMappingListCreateView,
    UnitConversionDetailView,
    UnitConversionListCreateView,
    UnitDetailView,
    UnitListCreateView,
)

urlpatterns = [
    path("units/", UnitListCreateView.as_view(), name="unit-list"),
    path("units/<uuid:id>/", UnitDetailView.as_view(), name="unit-detail"),
    path("unit-conversions/", UnitConversionListCreateView.as_view(), name="unit-conversion-list"),
    path("unit-conversions/<uuid:id>/", UnitConversionDetailView.as_view(), name="unit-conversion-detail"),
    path("emission-factors/", EmissionFactorListCreateView.as_view(), name="emission-factor-list"),
    path("emission-factors/<uuid:id>/", EmissionFactorDetailView.as_view(), name="emission-factor-detail"),
    path("source-mappings/", SourceMappingListCreateView.as_view(), name="source-mapping-list"),
    path("source-mappings/<uuid:id>/", SourceMappingDetailView.as_view(), name="source-mapping-detail"),
]
