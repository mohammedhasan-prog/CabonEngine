from __future__ import annotations

import csv
import hashlib
import json
from datetime import datetime
from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.utils import timezone

from apps.audit.models import AuditEvent
from apps.normalization.models import NormalizedRecord, RawRecord
from apps.reference_data.models import EmissionFactor, SourceMapping, UnitConversion


DATE_FORMATS = ("%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y")
SUSPICIOUS_AMOUNT_THRESHOLD = Decimal("1000000")


def _parse_date(value: str) -> datetime.date | None:
    value = (value or "").strip()
    if not value:
        return None
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(value).date()
    except ValueError:
        return None


def _parse_decimal(value: str) -> Decimal | None:
    try:
        return Decimal(str(value).strip())
    except (InvalidOperation, TypeError, ValueError):
        return None


def _normalize_unit(amount: Decimal, unit: str) -> tuple[Decimal, str, list[str]]:
    errors: list[str] = []
    normalized_amount = amount
    normalized_unit = unit

    conversion = UnitConversion.objects.select_related("from_unit", "to_unit").filter(
        from_unit__symbol__iexact=unit
    ).first()
    if conversion is None:
        conversion = UnitConversion.objects.select_related("from_unit", "to_unit").filter(
            from_unit__name__iexact=unit
        ).first()

    if conversion:
        normalized_amount = amount * conversion.multiplier
        normalized_unit = conversion.to_unit.symbol
    else:
        errors.append("missing_unit_mapping")

    return normalized_amount, normalized_unit, errors


def _map_row(row: dict[str, str], source_type: str, custom_mappings: dict[str, str]) -> dict[str, str]:
    normalized = {k.strip(): (v.strip() if isinstance(v, str) else v) for k, v in row.items()}
    mappings = {
        "sap": {
            "PostingDate": "activity_date",
            "Material": "activity_type",
            "Quantity": "amount",
            "Unit": "unit",
            "SourceRecordId": "source_record_id",
            "Category": "emission_category",
            "Scope": "scope",
        },
        "utility": {
            "MeterDate": "activity_date",
            "kWh": "amount",
            "Unit": "unit",
            "ServiceType": "activity_type",
            "SourceRecordId": "source_record_id",
            "Category": "emission_category",
            "Scope": "scope",
        },
        "travel": {
            "TripDate": "activity_date",
            "Distance": "amount",
            "Unit": "unit",
            "Mode": "activity_type",
            "SourceRecordId": "source_record_id",
            "Category": "emission_category",
            "Scope": "scope",
        },
    }

    for source_key, target_key in mappings.get(source_type, {}).items():
        if source_key in normalized and target_key not in normalized:
            normalized[target_key] = normalized[source_key]

    for source_field, normalized_field in custom_mappings.items():
        if source_field in normalized and normalized_field not in normalized:
            normalized[normalized_field] = normalized[source_field]

    return normalized


def process_ingestion_job(job, actor):
    if not job.upload:
        job.status = job.Status.FAILED
        job.error_summary = "No upload attached."
        job.finished_at = timezone.now()
        job.save(update_fields=["status", "error_summary", "finished_at", "updated_at"])
        return job

    errors: list[str] = []
    created_count = 0
    failed_count = 0

    job.status = job.Status.RUNNING
    job.started_at = job.started_at or timezone.now()
    job.error_summary = ""
    job.save(update_fields=["status", "started_at", "error_summary", "updated_at"])

    job.upload.seek(0)
    try:
        content = job.upload.read().decode("utf-8-sig")
    except UnicodeDecodeError:
        job.status = job.Status.FAILED
        job.error_summary = "Unable to decode upload as UTF-8."
        job.finished_at = timezone.now()
        job.save(update_fields=["status", "error_summary", "finished_at", "updated_at"])
        return job

    reader = csv.DictReader(content.splitlines())
    custom_mappings = {
        mapping.source_field: mapping.normalized_field
        for mapping in SourceMapping.objects.filter(source_type=job.source_system.type)
    }

    with transaction.atomic():
        for row in reader:
            raw_payload = row
            payload_hash = hashlib.sha256(json.dumps(raw_payload, sort_keys=True).encode("utf-8")).hexdigest()
            mapped = _map_row(row, job.source_system.type, custom_mappings)

            validation_errors: list[str] = []
            activity_date = _parse_date(mapped.get("activity_date", ""))
            if activity_date is None:
                validation_errors.append("invalid_activity_date")

            activity_type = mapped.get("activity_type") or ""
            if not activity_type:
                validation_errors.append("missing_activity_type")

            amount = _parse_decimal(mapped.get("amount", ""))
            if amount is None:
                validation_errors.append("invalid_amount")

            unit = (mapped.get("unit") or "").strip()
            if not unit:
                validation_errors.append("missing_unit")

            scope = (mapped.get("scope") or "").strip().lower()
            if scope not in {"scope_1", "scope_2", "scope_3"}:
                validation_errors.append("invalid_scope")
                scope = NormalizedRecord.Scope.SCOPE_3

            normalized_amount = Decimal("0")
            normalized_unit = unit
            if amount is not None and unit:
                normalized_amount, normalized_unit, unit_errors = _normalize_unit(amount, unit)
                validation_errors.extend(unit_errors)

            suspicious_flag = amount is not None and amount >= SUSPICIOUS_AMOUNT_THRESHOLD

            status_value = NormalizedRecord.Status.PENDING_REVIEW
            if validation_errors:
                status_value = NormalizedRecord.Status.FAILED
                failed_count += 1
            elif suspicious_flag:
                status_value = NormalizedRecord.Status.SUSPICIOUS

            emission_factor_id = mapped.get("emission_factor_id", "")
            if not emission_factor_id and activity_type and unit:
                factor = EmissionFactor.objects.filter(activity_type=activity_type, unit__symbol__iexact=unit).first()
                if factor:
                    emission_factor_id = str(factor.id)

            raw_record = RawRecord.objects.create(
                ingestion_job=job,
                raw_payload=raw_payload,
                raw_payload_hash=payload_hash,
                source_row_ref=mapped.get("source_record_id", ""),
            )

            NormalizedRecord.objects.create(
                tenant=job.tenant,
                source_system=job.source_system,
                raw_record=raw_record,
                source_record_id=mapped.get("source_record_id", ""),
                activity_date=activity_date or timezone.now().date(),
                activity_type=activity_type or "unknown",
                amount=amount or Decimal("0"),
                unit=unit or "unknown",
                normalized_amount=normalized_amount,
                normalized_unit=normalized_unit,
                emission_category=mapped.get("emission_category", ""),
                scope=scope,
                emission_factor_id=emission_factor_id,
                status=status_value,
                suspicious_flag=suspicious_flag,
                validation_errors=validation_errors,
                approval_status=status_value,
            )
            created_count += 1

    job.status = job.Status.COMPLETED
    job.finished_at = timezone.now()
    job.error_summary = "" if failed_count == 0 else f"{failed_count} rows failed validation."
    job.save(update_fields=["status", "finished_at", "error_summary", "updated_at"])

    AuditEvent.objects.create(
        tenant=job.tenant,
        actor=actor,
        action=AuditEvent.Action.INGEST,
        object_type="IngestionJob",
        object_id=str(job.id),
        payload={"created": created_count, "failed": failed_count},
    )

    return job
