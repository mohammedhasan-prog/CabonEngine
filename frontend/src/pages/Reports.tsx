import React, { useEffect, useState } from "react";
import api from "../api/client";
import AppShell from "../components/AppShell";

export default function Reports() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    api
      .get("/reports/summary/")
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(null));
  }, []);

  const byScope = summary?.by_scope || [];
  const bySource = summary?.by_source || [];

  return (
    <AppShell
      active="reports"
      title="Emissions Reports"
      subtitle="Comprehensive breakdown and trend analysis of organizational carbon inventory."
    >
      <div className="bg-surface-container border border-outline-variant rounded p-[12px] flex flex-wrap items-center justify-between gap-[16px]">
        <div className="flex items-center gap-[12px] flex-wrap">
          <div className="flex items-center bg-background border border-outline-variant rounded px-[12px] py-[6px]">
            <span className="material-symbols-outlined text-on-surface-variant mr-[6px] text-[18px]">calendar_month</span>
            <input
              className="bg-transparent border-none text-body-sm text-on-surface focus:outline-none w-[200px]"
              readOnly
              value="Jan 01, 2024 - Dec 31, 2024"
              type="text"
            />
          </div>
          <div className="flex items-center bg-background border border-outline-variant rounded px-[12px] py-[6px]">
            <span className="material-symbols-outlined text-on-surface-variant mr-[6px] text-[18px]">location_on</span>
            <select className="bg-transparent border-none text-body-sm text-on-surface focus:outline-none appearance-none pr-[16px]">
              <option>All Facilities (Global)</option>
              <option>NA Operations</option>
              <option>EMEA Logistics Hub</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-[8px]">
          <button className="flex items-center gap-[6px] px-[12px] py-[6px] rounded border border-outline-variant text-body-sm text-on-surface hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[16px]">download</span>
            CSV
          </button>
          <button className="flex items-center gap-[6px] px-[12px] py-[6px] rounded bg-primary text-on-primary text-body-sm hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-[24px]">
        <div className="col-span-12 md:col-span-4 bg-surface-container border border-outline-variant p-[16px] rounded">
          <div className="flex justify-between items-start mb-[8px]">
            <span className="text-label-md uppercase tracking-widest text-on-surface-variant">Total Emissions</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-label-sm border border-primary/20">Verified</span>
          </div>
          <div className="text-metric-xl text-on-surface">{summary?.totals?.total_amount || "—"}</div>
          <div className="text-label-sm text-on-surface-variant mt-[4px]">MT CO2e</div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-surface-container border border-outline-variant p-[16px] rounded">
          <div className="text-label-md uppercase tracking-widest text-on-surface-variant">Scope 1</div>
          <div className="text-metric-xl text-on-surface">
            {byScope.find((s: any) => s.scope === "scope_1")?.amount || "—"}
          </div>
          <div className="text-label-sm text-on-surface-variant mt-[4px]">MT CO2e</div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-surface-container border border-outline-variant p-[16px] rounded">
          <div className="text-label-md uppercase tracking-widest text-on-surface-variant">Scope 2</div>
          <div className="text-metric-xl text-on-surface">
            {byScope.find((s: any) => s.scope === "scope_2")?.amount || "—"}
          </div>
          <div className="text-label-sm text-on-surface-variant mt-[4px]">MT CO2e</div>
        </div>

        <div className="col-span-12 bg-surface-container border border-outline-variant rounded overflow-hidden">
          <div className="p-[16px] border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-headline-sm text-on-surface">Month-over-Month Variance</h3>
            <div className="flex gap-[12px] text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-[6px]"><span className="w-3 h-3 bg-primary rounded"></span>2024</span>
              <span className="flex items-center gap-[6px]"><span className="w-3 h-3 bg-surface-variant border border-outline-variant rounded"></span>2023 Baseline</span>
            </div>
          </div>
          <div className="p-[16px] h-[260px] flex items-end gap-[8px]">
            {[40, 55, 30, 70, 50, 80].map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-[8px]">
                <div className={`w-full rounded-t bg-primary ${idx % 2 === 0 ? "opacity-60" : ""}`} style={{ height: `${h}%` }}></div>
                <span className="text-label-sm text-on-surface-variant">M{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 bg-surface-container border border-outline-variant rounded p-[16px]">
          <h3 className="font-headline-sm text-on-surface mb-[12px]">Emissions by Source</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
            {bySource.map((item: any) => (
              <div key={item.source_system__type} className="bg-surface-container-low border border-outline-variant rounded p-[12px]">
                <div className="text-label-md text-on-surface-variant uppercase">{item.source_system__type}</div>
                <div className="text-headline-sm text-on-surface">{item.amount || 0}</div>
                <div className="text-label-sm text-on-surface-variant">MT CO2e</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
