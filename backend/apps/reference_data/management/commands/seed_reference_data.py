from __future__ import annotations

from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.reference_data.models import EmissionFactor, SourceMapping, Unit, UnitConversion
from apps.ingestion.models import SourceSystem
from apps.tenants.models import Tenant


class Command(BaseCommand):
    help = "Seed reference data: units, conversions, emission factors, and source mappings."

    def handle(self, *args, **options):
        units = [
            ("liter", "L", "volume", True),
            ("gallon", "GAL", "volume", False),
            ("kilowatt_hour", "KWH", "energy", True),
            ("megawatt_hour", "MWH", "energy", False),
            ("kilometer", "KM", "distance", True),
            ("mile", "MI", "distance", False),
            ("kilogram", "KG", "mass", True),
            ("metric_ton", "TON", "mass", False),
        ]
        unit_map: dict[str, Unit] = {}
        for name, symbol, dimension, is_canonical in units:
            unit, _ = Unit.objects.update_or_create(
                symbol=symbol,
                defaults={"name": name, "dimension": dimension, "is_canonical": is_canonical},
            )
            unit_map[symbol] = unit

        conversions = [
            ("GAL", "L", Decimal("3.78541")),
            ("MWH", "KWH", Decimal("1000")),
            ("MI", "KM", Decimal("1.60934")),
            ("TON", "KG", Decimal("1000")),
        ]
        for from_symbol, to_symbol, multiplier in conversions:
            UnitConversion.objects.update_or_create(
                from_unit=unit_map[from_symbol],
                to_unit=unit_map[to_symbol],
                defaults={"multiplier": multiplier},
            )

        factors = [
            ("Diesel", "L", Decimal("2.68"), "scope_1"),
            ("Gasoline", "L", Decimal("2.31"), "scope_1"),
            ("Electricity", "KWH", Decimal("0.0004"), "scope_2"),
            ("AirTravel", "KM", Decimal("0.00012"), "scope_3"),
        ]
        for activity_type, unit_symbol, factor, scope in factors:
            EmissionFactor.objects.update_or_create(
                activity_type=activity_type,
                unit=unit_map[unit_symbol],
                defaults={"factor": factor, "scope": scope},
            )

        mappings = [
            ("sap", "PostingDate", "activity_date"),
            ("sap", "Material", "activity_type"),
            ("sap", "Quantity", "amount"),
            ("sap", "Unit", "unit"),
            ("sap", "SourceRecordId", "source_record_id"),
            ("sap", "Category", "emission_category"),
            ("sap", "Scope", "scope"),
            ("utility", "MeterDate", "activity_date"),
            ("utility", "kWh", "amount"),
            ("utility", "Unit", "unit"),
            ("utility", "ServiceType", "activity_type"),
            ("utility", "SourceRecordId", "source_record_id"),
            ("utility", "Category", "emission_category"),
            ("utility", "Scope", "scope"),
            ("travel", "TripDate", "activity_date"),
            ("travel", "Distance", "amount"),
            ("travel", "Unit", "unit"),
            ("travel", "Mode", "activity_type"),
            ("travel", "SourceRecordId", "source_record_id"),
            ("travel", "Category", "emission_category"),
            ("travel", "Scope", "scope"),
        ]
        for source_type, source_field, normalized_field in mappings:
            SourceMapping.objects.update_or_create(
                source_type=source_type,
                source_field=source_field,
                defaults={"normalized_field": normalized_field},
            )

        sources = [
            ("SAP ERP", "sap", "upload"),
            ("Utility Portal", "utility", "upload"),
            ("Corporate Travel", "travel", "upload"),
        ]
        tenants = Tenant.objects.all()
        for tenant in tenants:
            for name, type_val, connection_mode in sources:
                SourceSystem.objects.update_or_create(
                    tenant=tenant,
                    name=name,
                    defaults={
                        "type": type_val,
                        "connection_mode": connection_mode,
                        "status": "active",
                    }
                )

        self.stdout.write(self.style.SUCCESS("Reference data and source systems seeded."))
