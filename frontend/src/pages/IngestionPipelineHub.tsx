import React from "react";
import AppShell from "../components/AppShell";

const queueRows = [
  { id: "#J-823-AX", source: "Fleet Telemetry Q3", time: "10:42:01 UTC", records: "4.2M", progress: 55, status: "processing" },
  { id: "#J-822-BZ", source: "Utility_NYC_HQ_Sep", time: "09:15:33 UTC", records: "18.5K", progress: 100, status: "complete" },
  { id: "#J-821-CX", source: "TravelLogs_EMEA", time: "08:02:11 UTC", records: "942", progress: 12, status: "failed" },
  { id: "#J-824-DY", source: "Waste_Manifest_Auto", time: "--:--:--", records: "~50K", progress: 0, status: "queued" },
];

const statusStyles: Record<string, string> = {
  processing: "bg-primary/10 text-primary border-primary/20",
  complete: "bg-secondary/10 text-secondary border-secondary/20",
  failed: "bg-error/10 text-error border-error/20",
  queued: "bg-surface-variant text-on-surface-variant border-outline-variant",
};

export default function IngestionPipelineHub() {
  return (
    <AppShell
      active="ingestion"
      title="Data Ingestion"
      subtitle="Upload primary facility data or manage active pipeline queues."
      searchPlaceholder="Search resources..."
    >
      <div className="flex justify-between items-end">
        <div></div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded text-label-md text-on-surface hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">sync</span>
            Refresh Sync
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded text-label-md hover:bg-primary-fixed transition-colors shadow-[0_0_10px_rgba(107,216,203,0.2)]">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Pipeline
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-[24px]">
        <section className="col-span-12 lg:col-span-4 space-y-[16px]">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-[16px]">
            <h3 className="text-headline-sm text-on-surface mb-[12px]">Manual Upload</h3>
            <div className="border-2 border-dashed border-outline-variant rounded-lg p-[24px] text-center bg-surface-variant/10">
              <div className="w-12 h-12 rounded-full bg-surface border border-outline-variant flex items-center justify-center mx-auto mb-[12px]">
                <span className="material-symbols-outlined text-primary">cloud_upload</span>
              </div>
              <p className="text-body-md text-on-surface">Drag and drop files here</p>
              <p className="text-body-sm text-on-surface-variant">CSV, XLSX, JSON</p>
            </div>
            <div className="mt-[16px]">
              <label className="text-label-md text-on-surface-variant">Target Schema / Category</label>
              <select className="mt-[6px] w-full bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface">
                <option>Utility Provider Data (Scope 2)</option>
                <option>SAP Fuel Ledger (Scope 1)</option>
                <option>Corporate Travel (Scope 3)</option>
              </select>
            </div>
            <button className="mt-[16px] w-full border border-outline-variant rounded px-3 py-2 text-label-md text-on-surface hover:bg-surface-variant">
              Validate Schema
            </button>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded-lg p-[16px]">
            <div className="flex justify-between items-center mb-[8px]">
              <h4 className="text-label-md text-on-surface-variant uppercase">Ingestion Engine</h4>
              <span className="text-label-sm text-primary">ONLINE</span>
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
              <div>
                <div className="text-label-sm text-on-surface-variant">Queue Load</div>
                <div className="text-headline-sm text-on-surface">24%</div>
              </div>
              <div>
                <div className="text-label-sm text-on-surface-variant">Processing Rate</div>
                <div className="text-headline-sm text-on-surface">1.2M rows/s</div>
              </div>
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-8">
          <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
            <div className="p-[16px] border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-headline-sm text-on-surface">Job Execution Queue</h3>
              <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                <span>All Statuses</span>
                <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-label-sm text-on-surface-variant uppercase">
                  <tr>
                    <th className="py-3 px-4">Job ID</th>
                    <th className="py-3 px-4">Source / Category</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Records</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {queueRows.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-variant/30">
                      <td className="py-3 px-4 font-mono text-on-surface-variant">{row.id}</td>
                      <td className="py-3 px-4 text-on-surface">{row.source}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{row.time}</td>
                      <td className="py-3 px-4 text-right font-mono text-on-surface-variant">{row.records}</td>
                      <td className="py-3 px-4">
                        <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${row.progress}%` }}></div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full border text-label-sm ${statusStyles[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
