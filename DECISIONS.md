# Decisions

This document lists the key ambiguities and how they were resolved.

## 1) Multi-tenant isolation model
- Decision: Single database with tenant foreign keys on all business tables.
- Why: Simplifies deployment and enables cross-tenant admin tools while still enforcing isolation at the query layer.
- PM question: Do we need strict physical isolation (separate DB per tenant) for compliance?

## 2) Ingestion format
- Decision: CSV upload only for the MVP.
- Why: Keeps the pipeline deterministic and easy to demo without third-party integrations.
- PM question: Which source should be API-first for the next phase (SAP, utility, or travel)?

## 3) Normalized schema shape
- Decision: Use a single canonical `NormalizedRecord` for reporting with a link to raw data.
- Why: Reporting is simpler when data lives in a common schema; raw payloads preserve lineage.
- PM question: Do we need a versioned history table for every edit, or is `ReviewAction` sufficient?

## 4) Scope mapping
- Decision: Scope is taken directly from the source CSV and validated against `scope_1/2/3`.
- Why: Keeps the example clear while still enforcing valid values.
- PM question: Should scope be derived from source type or emission factor instead of the input file?

## 5) Unit normalization
- Decision: Normalize through `Unit` and `UnitConversion` reference tables.
- Why: Centralizes conversion logic and supports expansion to new units.
- PM question: Do we want tenant-specific conversion overrides?

## 6) Audit semantics
- Decision: Use immutable `AuditEvent` entries for system actions and `ReviewAction` for row-level edits.
- Why: Separates system-level events from human review actions while keeping immutability.
- PM question: What regulatory framework should govern audit retention and export formats?

## 7) Subset of each source handled
- SAP CSV: `PostingDate`, `Material`, `Quantity`, `Unit`, `SourceRecordId`, `Category`, `Scope`.
- Utility CSV: `MeterDate`, `ServiceType`, `kWh`, `Unit`, `SourceRecordId`, `Category`, `Scope`.
- Travel CSV: `TripDate`, `Mode`, `Distance`, `Unit`, `SourceRecordId`, `Category`, `Scope`.
- Ignored for MVP: additional vendor metadata, cost centers, addresses, currency/cost, route details, meter IDs, time-of-use breakdowns, and any non-CSV formats.

## 8) Suspicious data handling
- Decision: Flag unusually large values via a fixed threshold in ingestion.
- Why: Provides a clear demo of the review queue without complex anomaly models.
- PM question: What statistical or domain-specific rules should drive suspicion in production?
