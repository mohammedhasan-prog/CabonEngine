import React from "react";
import AppShell from "../components/AppShell";

export default function ReviewQueueMappingEditor() {
  return (
    <AppShell
      active="review"
      title="Mapping Editor"
      subtitle="Resolve validation errors by mapping source fields to canonical schema."
      searchPlaceholder="Search queue..."
    >
      <div className="grid grid-cols-12 gap-[24px]">
        <section className="col-span-12 lg:col-span-8 bg-surface-container border border-outline-variant rounded-lg p-[16px]">
          <div className="flex justify-between items-center mb-[12px]">
            <h3 className="text-title-lg text-on-surface">Review Queue</h3>
            <button className="bg-primary text-on-primary px-3 py-2 rounded text-label-md">Auto-Resolve</button>
          </div>
          <div className="border border-outline-variant rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-[8px] px-[16px] py-[10px] bg-surface-container-high text-label-sm text-on-surface-variant uppercase">
              <div>Status</div>
              <div>Source</div>
              <div>Issue</div>
            </div>
            {["Missing EF", "Invalid Unit", "Outlier"].map((item, idx) => (
              <div key={item} className="grid grid-cols-[1fr_1fr_1fr] gap-[8px] px-[16px] py-[12px] border-t border-outline-variant">
                <div className="text-error">Flagged</div>
                <div className="text-on-surface-variant">SAP</div>
                <div className="text-on-surface-variant">{item}</div>
              </div>
            ))}
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 bg-surface-container border border-outline-variant rounded-lg p-[16px]">
          <h3 className="text-title-lg text-on-surface mb-[12px]">Resolution</h3>
          <label className="text-label-md text-on-surface-variant">Source Field</label>
          <select className="mt-[6px] w-full bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface">
            <option>UOM_CODE_ISO</option>
            <option>METER_READ_VAL</option>
          </select>
          <label className="mt-[12px] text-label-md text-on-surface-variant">Target Field</label>
          <select className="mt-[6px] w-full bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface">
            <option>unit</option>
            <option>amount</option>
          </select>
          <button className="mt-[16px] w-full bg-primary text-on-primary rounded px-3 py-2">Apply Mapping</button>
        </aside>
      </div>
    </AppShell>
  );
}
