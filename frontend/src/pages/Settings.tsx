import React, { useEffect, useState } from "react";
import api from "../api/client";
import AppShell from "../components/AppShell";

export default function Settings() {
  const [mappings, setMappings] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .get("/reference-data/source-mappings/")
      .then((res) => setMappings(res.data.results || res.data || []))
      .catch(() => setMappings([]));
  }, []);

  const filtered = mappings.filter((item) => {
    if (!query) return true;
    const text = `${item.source_type} ${item.source_field} ${item.normalized_field}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <AppShell
      active="settings"
      title="System Settings"
      subtitle="Configure tenant preferences, data mappings, and access controls."
      searchPlaceholder="Search settings..."
      rightSlot={
        <button className="px-3 py-2 bg-primary text-on-primary rounded text-label-md font-label-md shadow-[0_0_8px_rgba(107,216,203,0.3)]">
          Save Changes
        </button>
      }
    >
      <div className="grid grid-cols-12 gap-[24px]">
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden sticky top-[96px]">
            <div className="p-4 border-b border-outline-variant bg-surface-container-high">
              <h3 className="text-label-md uppercase tracking-wider text-on-surface-variant">Configuration Modules</h3>
            </div>
            <ul className="flex flex-col">
              {[
                "Tenant Customization",
                "Source Data Mappings",
                "Unit Conversion Rules",
                "Emission Factor Library",
                "User Access Control",
              ].map((item, idx) => (
                <li key={item}>
                  <button
                    className={`w-full flex items-center px-4 py-3 gap-3 text-left border-l-2 text-body-sm ${
                      idx === 1
                        ? "border-primary bg-primary-container/10 text-primary font-medium"
                        : "border-transparent text-on-surface-variant hover:bg-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{idx === 1 ? "schema" : "tune"}</span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-9 space-y-[24px]">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-[24px]">
            <div className="flex justify-between items-start mb-[16px]">
              <div>
                <h3 className="text-headline-sm text-on-surface">Source Data Mappings</h3>
                <p className="text-body-sm text-on-surface-variant">Map source payload fields into the Carbon.OS canonical model.</p>
              </div>
              <button className="px-3 py-2 border border-outline-variant rounded text-label-md text-on-surface hover:bg-surface-variant">
                Import Mapping
              </button>
            </div>

            <div className="flex items-center gap-[12px] mb-[12px]">
              <div className="flex items-center bg-surface-container-low border border-outline-variant rounded px-3 py-2 flex-1">
                <span className="material-symbols-outlined text-on-surface-variant mr-2">filter_list</span>
                <input
                  className="bg-transparent border-none text-body-sm text-on-surface w-full focus:outline-none"
                  placeholder="Filter fields..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <button className="px-3 py-2 bg-primary text-on-primary rounded text-label-md">Add Mapping</button>
            </div>

            <div className="border border-outline-variant rounded-lg overflow-hidden">
              <div className="grid grid-cols-[2fr_2fr_1fr] gap-[8px] px-[16px] py-[10px] bg-surface-container-high text-label-sm text-on-surface-variant uppercase tracking-wider">
                <div>Source Field</div>
                <div>Target Field</div>
                <div>Source</div>
              </div>
              <div className="divide-y divide-outline-variant">
                {filtered.length === 0 && (
                  <div className="px-[16px] py-[12px] text-on-surface-variant">No mappings found.</div>
                )}
                {filtered.map((mapping) => (
                  <div key={mapping.id} className="grid grid-cols-[2fr_2fr_1fr] gap-[8px] px-[16px] py-[12px] text-body-md">
                    <div className="text-on-surface">{mapping.source_field}</div>
                    <div className="text-on-surface-variant">{mapping.normalized_field}</div>
                    <div className="text-on-surface-variant uppercase">{mapping.source_type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
