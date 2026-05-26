import React, { useEffect, useState } from "react";
import api from "../api/client";
import AppShell from "../components/AppShell";

export default function ExecutiveDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/reports/summary/")
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(null));
    api
      .get("/audit/")
      .then((res) => setEvents(res.data.results || res.data || []))
      .catch(() => setEvents([]));
  }, []);

  return (
    <AppShell
      active="dashboard"
      title="Executive Dashboard"
      subtitle="Real-time telemetry and ingestion health overview."
      searchPlaceholder="Search resources..."
      rightSlot={
        <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-label-sm font-label-sm font-bold text-primary">
          JS
        </div>
      }
    >
      <div className="flex justify-between items-end">
        <div></div>
        <div className="flex gap-[8px]">
          <button className="px-[12px] py-[8px] rounded border border-outline-variant bg-transparent text-label-md font-label-md hover:bg-surface-variant transition-colors flex items-center">
            <span className="material-symbols-outlined mr-[6px] text-[18px]">download</span>
            Export PDF
          </button>
          <button className="px-[12px] py-[8px] rounded bg-primary text-on-primary text-label-md font-label-md hover:bg-primary/90 transition-colors shadow-[0_0_10px_rgba(107,216,203,0.2)]">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-[24px]">
        <div className="col-span-12 lg:col-span-4 bg-surface-container rounded-lg border border-outline-variant p-[24px]">
          <div className="flex justify-between items-start mb-[12px]">
            <h3 className="text-headline-sm text-on-surface">Ingestion Health</h3>
            <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary text-label-sm border border-primary/30">Live</span>
          </div>
          <div className="grid grid-cols-3 gap-[8px] mb-[12px]">
            <div className="flex flex-col items-center p-[8px] bg-surface-container-low rounded border border-outline-variant/50">
              <span className="text-headline-sm text-on-surface">2.4m</span>
              <span className="text-label-sm text-on-surface-variant mt-1">Processed</span>
            </div>
            <div className="flex flex-col items-center p-[8px] bg-surface-container-low rounded border border-outline-variant/50">
              <span className="text-headline-sm text-amber-400">12k</span>
              <span className="text-label-sm text-on-surface-variant mt-1">Pending</span>
            </div>
            <div className="flex flex-col items-center p-[8px] bg-error-container/20 rounded border border-error/30">
              <span className="text-headline-sm text-error">43</span>
              <span className="text-label-sm text-error/80 mt-1">Failed</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-label-sm text-on-surface-variant mb-[4px]">
              <span>System Load</span>
              <span>78%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[78%] rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-container rounded-lg border border-outline-variant p-[24px]">
          <div className="flex justify-between items-start mb-[8px]">
            <span className="text-label-md uppercase tracking-wider text-on-surface-variant">Total Est. Emissions</span>
            <span className="material-symbols-outlined text-on-surface-variant">co2</span>
          </div>
          <div className="flex items-baseline gap-[8px] mt-[8px]">
            <span className="text-metric-xl text-on-surface">{summary?.totals?.total_amount || "—"}</span>
            <span className="text-body-lg text-on-surface-variant">ktCO2e</span>
          </div>
          <div className="flex items-center mt-[6px]">
            <span className="material-symbols-outlined text-error text-[16px] mr-1">trending_up</span>
            <span className="text-label-sm text-error">+4.2%</span>
            <span className="text-label-sm text-on-surface-variant ml-2">vs last quarter</span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-container rounded-lg border border-outline-variant p-[24px]">
          <h3 className="text-label-md uppercase tracking-wider text-on-surface-variant mb-[12px]">Scope Telemetry</h3>
          <div className="space-y-[8px]">
            {(summary?.by_scope || []).map((scope: any) => (
              <div key={scope.scope} className="flex items-center justify-between">
                <span className="text-body-sm text-on-surface-variant">{scope.scope}</span>
                <span className="text-body-sm text-on-surface">{scope.amount || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 bg-surface-container rounded-lg border border-outline-variant p-[24px]">
          <h3 className="text-headline-sm text-on-surface mb-[12px]">Recent Audit Activity</h3>
          <div className="divide-y divide-outline-variant">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="py-[10px] flex justify-between text-body-sm">
                <span className="text-on-surface">{event.action}</span>
                <span className="text-on-surface-variant">{event.object_type}</span>
                <span className="text-on-surface-variant">{new Date(event.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
