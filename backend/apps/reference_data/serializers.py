from rest_framework import serializers

from .models import EmissionFactor, SourceMapping, Unit, UnitConversion


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ("id", "name", "symbol", "dimension", "is_canonical", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class UnitConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitConversion
        fields = ("id", "from_unit", "to_unit", "multiplier", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class EmissionFactorSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmissionFactor
        fields = ("id", "activity_type", "unit", "factor", "scope", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class SourceMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SourceMapping
        fields = ("id", "source_type", "source_field", "normalized_field", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")
