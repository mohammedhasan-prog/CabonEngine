import React from "react";
import AppShell from "../components/AppShell";

export default function ExecutiveDashboardOverview() {
  return (
    <AppShell
      active="dashboard"
      title="Executive Overview"
      subtitle="Real-time carbon telemetry and ingestion health."
      searchPlaceholder="Search..."
    >
      <div className="flex justify-between items-end">
        <div></div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-outline-variant text-on-surface rounded hover:bg-surface-container transition-colors flex items-center gap-2 text-sm font-medium">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-fixed transition-colors flex items-center gap-2 text-sm font-medium">
            <span className="material-symbols-outlined text-sm">add</span>
            New Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-[24px]">
        {["Ingestion Processed", "Scope 1 Emissions", "Scope 2 Emissions", "Pending Audits"].map((label, idx) => (
          <div key={label} className="col-span-12 md:col-span-6 lg:col-span-3 bg-surface-container-low border border-outline-variant rounded-lg p-6">
            <div className="text-label-md text-on-surface-variant uppercase">{label}</div>
            <div className="text-headline-lg text-on-surface mt-[8px]">
              {idx === 0 ? "1.2M" : idx === 1 ? "45.2k" : idx === 2 ? "12.8k" : "34"}
            </div>
          </div>
        ))}

        <div className="col-span-12 lg:col-span-8 bg-surface-container border border-outline-variant rounded-lg p-6">
          <h3 className="text-title-lg text-on-surface mb-[12px]">Emissions by Scope Over Time</h3>
          <div className="h-[240px] flex items-end gap-[8px]">
            {[20, 35, 40, 28, 44, 30].map((v, idx) => (
              <div key={idx} className="flex-1 bg-primary/70 rounded-t" style={{ height: `${v}%` }}></div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-container border border-outline-variant rounded-lg p-6">
          <h3 className="text-title-lg text-on-surface mb-[12px]">Category Breakdown</h3>
          <div className="h-[200px] bg-surface-container-low border border-outline-variant rounded flex items-center justify-center text-on-surface-variant">
            58% Energy
          </div>
        </div>
      </div>
    </AppShell>
  );
}
