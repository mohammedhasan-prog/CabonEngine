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
  const byMonth = summary?.by_month || [];

  const maxMonthAmount = Math.max(...byMonth.map((m: any) => m.amount || 0), 1);

  const downloadCSV = () => {
    if (!summary) return;
    let csv = "Category,Type,Count,Amount (MT CO2e)\n";
    byScope.forEach((s: any) => { csv += `Scope,${s.scope},${s.count},${s.amount}\n`; });
    bySource.forEach((s: any) => { csv += `Source,${s.source_system__type},${s.count},${s.amount}\n`; });
    byMonth.forEach((m: any) => { csv += `Month,${new Date(m.month).toISOString().slice(0, 7)},${m.count},${m.amount}\n`; });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "emissions_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell
      active="reports"
      title="Emissions Reports"
      subtitle="Comprehensive breakdown and trend analysis of organizational carbon inventory."
    >
      <div className="bg-surface-container border border-outline-variant rounded p-[12px] flex flex-wrap items-center justify-between gap-[16px]">
        <div className="flex items-center gap-[12px] flex-wrap">
          <div 
            className="flex items-center bg-background border border-outline-variant rounded px-[12px] py-[6px] cursor-pointer hover:bg-surface-variant transition-colors"
            onClick={() => alert("Advanced Date and Facility filtering is coming in Phase 5!")}
          >
            <span className="material-symbols-outlined text-on-surface-variant mr-[6px] text-[18px]">calendar_month</span>
            <input
              className="bg-transparent border-none text-body-sm text-on-surface focus:outline-none w-[200px] pointer-events-none"
              readOnly
              value="Jan 01, 2024 - Dec 31, 2024"
              type="text"
            />
          </div>
          <div 
            className="flex items-center bg-background border border-outline-variant rounded px-[12px] py-[6px] cursor-pointer hover:bg-surface-variant transition-colors"
            onClick={() => alert("Advanced Date and Facility filtering is coming in Phase 5!")}
          >
            <span className="material-symbols-outlined text-on-surface-variant mr-[6px] text-[18px]">location_on</span>
            <select className="bg-transparent border-none text-body-sm text-on-surface focus:outline-none appearance-none pr-[16px] pointer-events-none">
              <option>All Facilities (Global)</option>
              <option>NA Operations</option>
              <option>EMEA Logistics Hub</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-[8px]">
          <button onClick={downloadCSV} className="flex items-center gap-[6px] px-[12px] py-[6px] border border-outline-variant rounded text-on-surface text-body-sm hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[16px]">download</span>
            CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-[6px] px-[12px] py-[6px] rounded bg-primary text-on-primary text-body-sm hover:opacity-90 transition-opacity">
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
            {byMonth.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-body-sm">
                No time-series data available yet.
              </div>
            )}
            {byMonth.map((item: any, idx: number) => {
              const heightPct = Math.max(((item.amount || 0) / maxMonthAmount) * 100, 2);
              const dateObj = new Date(item.month);
              const monthLabel = dateObj.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-[8px] h-full justify-end group">
                  <div 
                    className="w-full rounded-t bg-primary opacity-80 group-hover:opacity-100 transition-opacity relative" 
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-on-surface text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      {Number(item.amount).toFixed(1)} MT
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-label-sm text-on-surface-variant whitespace-nowrap">{monthLabel}</span>
                </div>
              );
            })}
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
