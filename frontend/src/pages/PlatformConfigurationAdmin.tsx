import React from "react";
import AppShell from "../components/AppShell";

export default function PlatformConfigurationAdmin() {
  return (
    <AppShell
      active="settings"
      title="Administrative Settings"
      subtitle="Configure platform behavior, mapping rules, and access controls."
      searchPlaceholder="Search..."
    >
      <div className="flex justify-between items-end">
        <div></div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded bg-surface-container-high border border-outline-variant text-on-surface text-label-md hover:bg-surface-variant">
            Export Mappings
          </button>
          <button className="px-4 py-2 rounded bg-primary text-on-primary text-label-md">New Rule</button>
        </div>
      </div>

      <div className="flex gap-[24px]">
        <aside className="w-64 bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
          <ul>
            {[
              "Tenant Customization",
              "Source Data Mappings",
              "Unit Conversion Rules",
              "Emission Factor Library",
              "User Access Control",
            ].map((item, idx) => (
              <li key={item}>
                <button className={`w-full px-4 py-3 text-left ${idx === 1 ? "bg-surface-container-highest border-l-2 border-primary text-on-surface" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex-1 space-y-[16px]">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-[16px]">
            <h3 className="text-headline-sm text-on-surface">Source Data Mappings</h3>
            <p className="text-body-sm text-on-surface-variant">Define how inbound fields map to the canonical schema.</p>
            <div className="mt-[12px] flex gap-[8px]">
              <input className="flex-1 bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-on-surface" placeholder="Filter mappings..." />
              <button className="px-3 py-2 bg-primary text-on-primary rounded">Add Mapping</button>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
            <div className="grid grid-cols-[2fr_2fr_1fr] gap-[8px] px-[16px] py-[10px] bg-surface-container-high text-label-sm text-on-surface-variant uppercase">
              <div>Source Field</div>
              <div>Target Field</div>
              <div>Source</div>
            </div>
            <div className="divide-y divide-outline-variant">
              {[
                ["PLANT_ID_CODE", "facility_id", "SAP"],
                ["METER_READ_VAL", "amount", "Utility"],
                ["UOM_CODE_ISO", "unit", "Travel"],
              ].map((row) => (
                <div key={row[0]} className="grid grid-cols-[2fr_2fr_1fr] gap-[8px] px-[16px] py-[12px] text-body-md">
                  <div className="text-on-surface">{row[0]}</div>
                  <div className="text-on-surface-variant">{row[1]}</div>
                  <div className="text-on-surface-variant uppercase">{row[2]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
