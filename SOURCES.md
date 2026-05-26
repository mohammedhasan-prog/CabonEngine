# Sources

This document summarizes the real-world formats considered and how the sample data was shaped for the MVP.

## SAP fuel / procurement
- Real-world format researched: common SAP exports from FI/MM modules that typically include posting date, material description, quantity, unit, and a reference ID.
- What I learned: SAP exports are usually wide and include cost center, GL account, vendor, and plant, but the core activity signals are date, material, amount, and unit.
- Sample data: `sample_sap_data.csv` with `PostingDate`, `Material`, `Quantity`, `Unit`, `SourceRecordId`, `Category`, `Scope`. This is the smallest subset needed to drive normalization and scope classification.
- What would break in production: complex unit codes, multi-line items, currency-based emissions inputs, and missing consistent material naming conventions.

## Utility electricity
- Real-world format researched: utility bill exports or energy provider CSVs that report meter dates, service type, and kWh usage.
- What I learned: utilities often provide multiple meters per account and time-of-use breakdowns instead of a single monthly total.
- Sample data: `sample_utility_data.csv` with `MeterDate`, `ServiceType`, `kWh`, `Unit`, `SourceRecordId`, `Category`, `Scope`.
- What would break in production: multiple meters per site, demand charges, and non-kWh units (MWh, GJ) without a complete conversion table.

## Corporate travel
- Real-world format researched: travel management exports (air travel) with trip date, mode, distance, and units.
- What I learned: real exports often include origin/destination, cabin class, and carrier which can affect emission factors.
- Sample data: `sample_travel_data.csv` with `TripDate`, `Mode`, `Distance`, `Unit`, `SourceRecordId`, `Category`, `Scope`.
- What would break in production: missing distance, mixed modes in a single report, and emissions factors that depend on cabin class or routing.
