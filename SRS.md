# Software Requirements Specification (SRS)

## 1) Product Goal
Build a web application that lets an enterprise tenant ingest emissions/activity data from multiple sources, normalize it into a common schema, review suspicious or failed rows, and approve records so they become audit-ready. The roadmap recommends a modular monolith first approach with clear boundaries, CI, testing, Docker, and deployment hygiene, which fits a Django REST backend and React frontend very well.

## 2) Scope

### In scope
Tenant-aware data ingestion for:
- SAP fuel/procurement data
- Utility electricity data
- Corporate travel data
- Normalization into one common dataset
- Analyst review dashboard
- Row-level approval / rejection / edits
- Source-of-truth tracking
- Audit trail
- Scope 1 / 2 / 3 classification
- Unit normalization
- Basic reporting / summary views

### Out of scope for MVP
- Full production-grade OCR pipeline for every PDF variant
- Complex workflow orchestration / microservices split
- Advanced forecasting or sustainability analytics
- External auditor portal
- Deep ERP integrations beyond one realistic ingestion path per source

## 3) User Roles

### 3.1 Analyst
- Upload or trigger ingestion
- Review imported rows
- Flag suspicious records
- Approve or reject rows
- Edit mapped fields before approval
- View audit trail

### 3.2 Admin
- Manage tenant settings
- Configure source mappings
- Manage users and roles
- Review system logs

### 3.3 Read-only viewer
- See dashboards and finalized reports
- Cannot edit records

## 4) Core Functional Requirements

- **FR1 — Tenant isolation**: The system must separate data by tenant so one client cannot access another client’s records.
- **FR2 — Source ingestion**: The system must ingest three source categories: SAP fuel/procurement, Utility electricity data, Travel data.
- **FR3 — Normalization**: The backend must transform all imported records into a shared normalized structure with common fields (tenant, source type, source record id, activity date, activity type, amount, unit, normalized unit, emission category, scope classification, status).
- **FR4 — Validation**: The system must validate required fields and detect malformed rows, missing mappings, bad dates, unsupported units, and duplicate imports.
- **FR5 — Review dashboard**: The frontend must show imported rows, failed rows, suspicious rows, approved rows, row-level details, source-specific metadata, parser/validation errors.
- **FR6 — Row approval and locking**: Approved rows must become immutable except for admin-controlled correction flows. Rejected rows must remain visible in history.
- **FR7 — Audit trail**: Every create, update, approval, rejection, and mapping change must be logged (actor, timestamp, action, before/after values, reason).
- **FR8 — Scope classification**: Each normalized record must be classified as Scope 1, Scope 2, or Scope 3.
- **FR9 — Source-of-truth tracking**: Each record must store original source system, original file/API payload reference, ingestion timestamp, last edited timestamp, edit source, approval status.
- **FR10 — Unit normalization**: The system must normalize units into canonical units so totals can be computed consistently.
- **FR11 — Summary reporting**: The system must show aggregated totals by tenant, source, scope, date range, status, emission category.
- **FR12 — Search and filters**: The review table must support filtering by source, status, scope, date range, suspicious flag, validation errors.

## 5) Suggested Frontend Pages in React

### 5.1 Login / tenant selection
- Sign in
- Pick tenant if the user belongs to multiple tenants

### 5.2 Dashboard home
- Import counts
- Pending review count
- Approved count
- Failed count
- Scope totals
- Recent activity

### 5.3 Ingestion page
- Upload file
- Trigger source sync
- Show ingestion progress
- Show success/failure summary

### 5.4 Review queue
- Table of normalized rows
- Status chips
- Validation issue indicators
- Suspicious flag indicators
- Row expand drawer
- Bulk approve / reject
- Inline edit for allowed fields

### 5.5 Record detail view
- Raw source payload
- Normalized fields
- Validation history
- Approval history
- Audit log

### 5.6 Reports page
- Totals by scope
- Totals by source
- Date filters
- Export CSV/PDF if needed

### 5.7 Admin settings
- Tenant configuration
- Source mappings
- Unit mapping rules
- Emission factor management
- User management

## 6) Suggested Backend Modules in Django

A clean Django REST structure for this project:
- `accounts` — auth, roles, tenancy membership
- `tenants` — tenant isolation and config
- `ingestion` — file/API intake jobs
- `normalization` — mapping raw records into common schema
- `review` — approve/reject/edit workflow
- `audit` — immutable action log
- `reporting` — aggregates and summaries
- `reference_data` — units, factors, mappings

## 7) Data Entities

- **Tenant**: id, name, settings
- **User**: id, tenant_id, role
- **SourceSystem**: id, tenant_id, type (SAP, UTILITY, TRAVEL), connection_mode (upload, api, manual), status
- **IngestionJob**: id, tenant_id, source_system_id, file_name / api_batch_id, started_at, finished_at, status, error_summary
- **RawRecord**: id, ingestion_job_id, raw_payload, raw_payload_hash, source_row_ref
- **NormalizedRecord**: id, tenant_id, source_system_id, raw_record_id, activity_date, activity_type, amount, unit, normalized_amount, normalized_unit, scope, emission_factor_id, status, suspicious_flag
- **ReviewAction**: id, record_id, user_id, action, note, old_value, new_value, created_at
- **AuditEvent**: id, tenant_id, actor_id, entity_type, entity_id, action, metadata, created_at

## 8) API Requirements

- **Auth**: POST `/api/auth/login`, POST `/api/auth/logout`, GET `/api/auth/me`
- **Tenants**: GET `/api/tenants/current`, PATCH `/api/tenants/current`
- **Ingestion**: POST `/api/ingestions/upload`, POST `/api/ingestions/run`, GET `/api/ingestions`, GET `/api/ingestions/{id}`
- **Records**: GET `/api/records`, GET `/api/records/{id}`, PATCH `/api/records/{id}`, POST `/api/records/{id}/approve`, POST `/api/records/{id}/reject`
- **Audit**: GET `/api/audit`, GET `/api/audit/{entity_type}/{entity_id}`
- **Reporting**: GET `/api/reports/summary`, GET `/api/reports/by-scope`, GET `/api/reports/by-source`

## 9) Non-Functional Requirements

- **Performance**: Review table should load quickly for typical tenant batches, pagination required, background jobs for ingestion/normalization.
- **Security**: Tenant isolation at query level, role-based access control, secure file upload handling, secrets in environment variables.
- **Reliability**: Failed ingestions should not block the rest of the pipeline, job retries should be visible, import history must be retained.
- **Usability**: Non-technical analysts should understand the review screen, clear error messages, strong status labels and color coding.
- **Maintainability**: Modular Django apps, reusable frontend components, unit and integration tests.

## 10) MVP Build Order

- **Phase 1**: Django models, Auth, Tenant isolation, Basic ingestion job tracking
- **Phase 2**: Normalization pipeline, Record table, Validation rules, API endpoints
- **Phase 3**: React dashboard, Review queue, Approve/reject/edit actions
- **Phase 4**: Audit trail, Reporting page, Admin settings

## 11) Acceptance Criteria for MVP
1. A user can log in and only see their tenant’s data.
2. A source file can be uploaded and turned into normalized rows.
3. Failed rows appear with errors.
4. Suspicious rows are flagged.
5. Analyst can approve/reject rows.
6. Approved rows become locked.
7. Audit history is visible.
8. Totals by scope and source are shown.

## 12) Recommended Product Strategy
Keep the frontend focused on one clean flow: Upload → Parse → Review → Approve → Audit-ready.
