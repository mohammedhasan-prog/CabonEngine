# Data Model

## Overview
The backend models are designed to support multi-tenant ingestion, normalization, review, and audit of emissions data across SAP, utility, and travel sources. The model focuses on traceability: every normalized row points back to a raw payload and an ingestion job, and every state change is captured in review and audit logs.

## Core Entities

### Tenant
- Purpose: hard tenant boundary for all business data.
- Model: `tenants.Tenant`.
- Key fields: `name`, `slug`, `settings`, `is_active`.

### User
- Purpose: role-based access within a tenant.
- Model: `accounts.User`.
- Key fields: `role` (admin, analyst, viewer), `tenant`.

### SourceSystem
- Purpose: represent a specific data feed per tenant.
- Model: `ingestion.SourceSystem`.
- Key fields: `tenant`, `name`, `type` (sap, utility, travel), `connection_mode` (upload/api/manual), `status`.
- Constraint: unique name per tenant.

### IngestionJob
- Purpose: capture each upload/run event and its lifecycle.
- Model: `ingestion.IngestionJob`.
- Key fields: `tenant`, `source_system`, `initiated_by`, `upload`, `file_name`, `api_batch_id`, `status`, `started_at`, `finished_at`, `error_summary`.

### RawRecord
- Purpose: immutable raw payload storage for source-of-truth tracking.
- Model: `normalization.RawRecord`.
- Key fields: `ingestion_job`, `raw_payload`, `raw_payload_hash`, `source_row_ref`.
- Constraint: raw payload hash unique within an ingestion job.

### NormalizedRecord
- Purpose: canonical record used for review and reporting.
- Model: `normalization.NormalizedRecord`.
- Key fields: `tenant`, `source_system`, `raw_record`, `source_record_id`, `activity_date`, `activity_type`, `amount`, `unit`, `normalized_amount`, `normalized_unit`, `emission_category`, `scope`, `emission_factor_id`, `status`, `suspicious_flag`, `validation_errors`, `ingestion_timestamp`, `last_edited_timestamp`, `edit_source`, `approval_status`.
- Statuses: imported, failed, suspicious, pending_review, approved, rejected.

### ReviewAction
- Purpose: record human review actions and edits.
- Model: `review.ReviewAction`.
- Key fields: `record`, `user`, `action` (edit, approve, reject), `note`, `old_value`, `new_value`.

### AuditEvent
- Purpose: immutable system-level audit trail.
- Model: `audit.AuditEvent`.
- Key fields: `tenant`, `actor`, `action`, `object_type`, `object_id`, `payload`.
- Immutability: `save` and `delete` are blocked for updates/deletes.

### Unit, UnitConversion, EmissionFactor, SourceMapping
- Purpose: reference data for unit normalization, emission factors, and field mapping.
- Models: `reference_data.Unit`, `reference_data.UnitConversion`, `reference_data.EmissionFactor`, `reference_data.SourceMapping`.
- Key fields: unit symbols/names, conversion multipliers, emission factor per activity/unit, source field mappings.

## Requirement Coverage

### Multi-tenancy
- Every business record is tied to a tenant (`Tenant` FK on `SourceSystem`, `IngestionJob`, `NormalizedRecord`, `AuditEvent`).
- Users belong to a tenant and only act within that tenant.

### Scope 1/2/3 categorization
- `NormalizedRecord.scope` is required and stored as `scope_1`, `scope_2`, or `scope_3`.
- The ingestion mapping pulls the source scope field and validates it during normalization.

### Source-of-truth tracking
- Raw payloads are stored in `RawRecord.raw_payload` along with `raw_payload_hash`.
- Each normalized row points to a `RawRecord` and the parent `IngestionJob`.
- Source lineage is kept in `source_record_id` and `source_row_ref`.
- Timestamps: `ingestion_timestamp` and `last_edited_timestamp` on `NormalizedRecord`.
- `edit_source` captures whether edits were ingestion, analyst, or admin.

### Unit normalization
- Reference data: `Unit` and `UnitConversion` define canonical units and multipliers.
- `NormalizedRecord.normalized_amount` and `normalized_unit` store converted values.
- Conversion failures are recorded in `validation_errors`.

### Audit trail
- Row-level actions are captured via `ReviewAction` (edit/approve/reject, with before/after values).
- System events are captured in immutable `AuditEvent` entries (ingest, approve, reject, edit, etc.).

## Why This Model
- Aligns with the ingestion -> normalization -> review -> audit flow.
- Keeps raw and normalized data separate for traceability and reprocessing.
- Uses tenant scoping at the data layer for strict isolation.
- Enables reporting from a single canonical table (`NormalizedRecord`) while retaining source context.
