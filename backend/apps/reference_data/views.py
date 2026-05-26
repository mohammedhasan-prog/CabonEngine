from rest_framework import generics

from .models import EmissionFactor, SourceMapping, Unit, UnitConversion
from .permissions import IsAdminOrReadOnly
from .serializers import (
    EmissionFactorSerializer,
    SourceMappingSerializer,
    UnitConversionSerializer,
    UnitSerializer,
)


class UnitListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = UnitSerializer
    queryset = Unit.objects.all()


class UnitDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = UnitSerializer
    queryset = Unit.objects.all()
    lookup_field = "id"


class UnitConversionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = UnitConversionSerializer
    queryset = UnitConversion.objects.select_related("from_unit", "to_unit").all()


class UnitConversionDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = UnitConversionSerializer
    queryset = UnitConversion.objects.select_related("from_unit", "to_unit").all()
    lookup_field = "id"


class EmissionFactorListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = EmissionFactorSerializer
    queryset = EmissionFactor.objects.select_related("unit").all()


class EmissionFactorDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = EmissionFactorSerializer
    queryset = EmissionFactor.objects.select_related("unit").all()
    lookup_field = "id"


class SourceMappingListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = SourceMappingSerializer
    queryset = SourceMapping.objects.all()


class SourceMappingDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = SourceMappingSerializer
    queryset = SourceMapping.objects.all()
    lookup_field = "id"
