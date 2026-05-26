# Tradeoffs

1) No background job runner
- Reason: Keeps the deployment simple. Ingestion runs synchronously for the demo.
- Impact: Large files or complex transformations could block requests and time out in production.

2) Minimal mapping UI
- Reason: Source mappings are seeded and applied in code, not managed via an admin UX.
- Impact: Non-technical users cannot update mappings without developer help.

3) Limited validation and anomaly logic
- Reason: Validation focuses on required fields and simple unit conversions only.
- Impact: Real-world data quality issues (duplicates, outliers, inconsistent naming) will slip through.
