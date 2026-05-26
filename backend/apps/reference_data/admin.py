from django.contrib import admin

from .models import EmissionFactor, SourceMapping, Unit, UnitConversion


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ("symbol", "name", "dimension", "is_canonical")
    search_fields = ("symbol", "name")
    list_filter = ("dimension", "is_canonical")


@admin.register(UnitConversion)
class UnitConversionAdmin(admin.ModelAdmin):
    list_display = ("from_unit", "to_unit", "multiplier")
    search_fields = ("from_unit__symbol", "to_unit__symbol")


@admin.register(EmissionFactor)
class EmissionFactorAdmin(admin.ModelAdmin):
    list_display = ("activity_type", "unit", "factor", "scope")
    search_fields = ("activity_type", "unit__symbol")
    list_filter = ("scope",)


@admin.register(SourceMapping)
class SourceMappingAdmin(admin.ModelAdmin):
    list_display = ("source_type", "source_field", "normalized_field")
    search_fields = ("source_type", "source_field", "normalized_field")
