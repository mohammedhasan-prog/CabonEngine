from django.db import models

from apps.common.models import TimeStampedModel, UUIDModel


class Unit(UUIDModel, TimeStampedModel):
    name = models.CharField(max_length=120)
    symbol = models.CharField(max_length=32, unique=True)
    dimension = models.CharField(max_length=64, blank=True)
    is_canonical = models.BooleanField(default=False)

    class Meta:
        ordering = ["symbol"]

    def __str__(self) -> str:
        return self.symbol


class UnitConversion(UUIDModel, TimeStampedModel):
    from_unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="conversions_from")
    to_unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="conversions_to")
    multiplier = models.DecimalField(max_digits=18, decimal_places=8)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["from_unit", "to_unit"], name="unique_unit_conversion"),
        ]
        ordering = ["from_unit__symbol", "to_unit__symbol"]

    def __str__(self) -> str:
        return f"{self.from_unit.symbol}->{self.to_unit.symbol}"


class EmissionFactor(UUIDModel, TimeStampedModel):
    activity_type = models.CharField(max_length=120)
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT, related_name="emission_factors")
    factor = models.DecimalField(max_digits=18, decimal_places=8)
    scope = models.CharField(max_length=20, blank=True)

    class Meta:
        ordering = ["activity_type", "unit__symbol"]

    def __str__(self) -> str:
        return f"{self.activity_type}:{self.unit.symbol}"


class SourceMapping(UUIDModel, TimeStampedModel):
    source_type = models.CharField(max_length=20)
    source_field = models.CharField(max_length=120)
    normalized_field = models.CharField(max_length=120)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["source_type", "source_field"], name="unique_source_mapping"),
        ]
        ordering = ["source_type", "source_field"]

    def __str__(self) -> str:
        return f"{self.source_type}:{self.source_field}->{self.normalized_field}"
