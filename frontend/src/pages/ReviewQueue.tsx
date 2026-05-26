import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import AppShell from "../components/AppShell";

const statusMeta: Record<string, { label: string; className: string }> = {
  imported: { label: "Imported", className: "bg-secondary/10 border-secondary/20 text-secondary" },
  failed: { label: "Failed", className: "bg-error/10 border-error/20 text-error" },
  suspicious: { label: "Suspicious", className: "bg-tertiary/10 border-tertiary/20 text-tertiary" },
  pending_review: { label: "Pending", className: "bg-primary/10 border-primary/20 text-primary" },
  approved: { label: "Approved", className: "bg-primary/10 border-primary/20 text-primary" },
  rejected: { label: "Rejected", className: "bg-error/10 border-error/20 text-error" },
};

const scopes = [
  { value: "", label: "All" },
  { value: "scope_1", label: "Scope 1" },
  { value: "scope_2", label: "Scope 2" },
  { value: "scope_3", label: "Scope 3" },
];

const statuses = [
  { value: "", label: "All" },
  { value: "pending_review", label: "Pending" },
  { value: "suspicious", label: "Suspicious" },
  { value: "failed", label: "Failed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function ReviewQueue() {
  const [records, setRecords] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [scope, setScope] = useState("");
  const [source, setSource] = useState("");
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (status) params.status = status;
      if (scope) params.scope = scope;
      if (source) params.source = source;
      if (onlyErrors) params.has_errors = "true";
      const res = await api.get("/records/", { params });
      setRecords(res.data.results || res.data || []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [status, scope, source, onlyErrors]);

  const total = records.length;
  const flaggedCount = useMemo(() => records.filter((r) => r.status === "failed").length, [records]);

  return (
    <AppShell
      active="review"
      title="Review Queue"
      subtitle="Records requiring verification prior to ledger commit."
      searchPlaceholder="Search entity, ID, or value..."
      rightSlot={
        <div className="w-8 h-8 rounded-full bg-surface-bright border border-outline-variant flex items-center justify-center text-label-md font-label-md font-bold text-primary">
          JS
        </div>
      }
    >
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-wrap items-center justify-between gap-[16px]">
          <div className="flex items-center gap-[12px]">
            <label className="flex items-center gap-[8px] cursor-pointer text-body-sm text-on-surface-variant bg-surface-container-low px-[12px] py-[6px] rounded border border-outline-variant hover:bg-surface-container transition-colors">
              <input
                className="rounded"
                type="checkbox"
                checked={onlyErrors}
                onChange={(event) => setOnlyErrors(event.target.checked)}
              />
              Show Validation Errors Only
            </label>
            <button className="bg-primary text-on-primary px-[16px] py-[8px] rounded text-label-md font-label-md hover:bg-primary-fixed transition-colors flex items-center gap-[6px]">
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              Commit Selected
            </button>
          </div>
          <div className="text-label-sm text-on-surface-variant uppercase tracking-wider">
            {total} pending
          </div>
        </div>

        <div className="bg-surface-container border border-outline-variant rounded-lg p-[12px] flex flex-wrap gap-[8px] items-center text-body-sm">
          <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
          <select
            className="bg-surface border border-outline-variant rounded px-[10px] py-[4px] text-on-surface"
            value={source}
            onChange={(event) => setSource(event.target.value)}
          >
            <option value="">Source: All</option>
            <option value="sap">SAP</option>
            <option value="utility">Utility</option>
            <option value="travel">Travel</option>
          </select>
          <select
            className="bg-surface border border-outline-variant rounded px-[10px] py-[4px] text-on-surface"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                Status: {item.label}
              </option>
            ))}
          </select>
          <select
            className="bg-surface border border-outline-variant rounded px-[10px] py-[4px] text-on-surface"
            value={scope}
            onChange={(event) => setScope(event.target.value)}
          >
            {scopes.map((item) => (
              <option key={item.value} value={item.value}>
                Scope: {item.label}
              </option>
            ))}
          </select>
          <span className="ml-auto text-label-sm text-on-surface-variant">
            Flagged: <span className="text-error">{flaggedCount}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 bg-surface-container border border-outline-variant rounded-lg overflow-hidden flex flex-col">
        <div className="grid grid-cols-[48px_120px_130px_minmax(160px,_1fr)_minmax(160px,_1fr)_120px_100px_80px] gap-[8px] items-center px-[16px] py-[12px] bg-surface-bright border-b-2 border-primary text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
          <div className="flex justify-center">
            <input type="checkbox" />
          </div>
          <div>Status</div>
          <div>Activity Date</div>
          <div>Source</div>
          <div>Activity Type</div>
          <div className="text-right">Amount</div>
          <div className="text-center">Scope</div>
          <div className="text-center">View</div>
        </div>
        <div className="divide-y divide-outline-variant">
          {loading && (
            <div className="px-[16px] py-[20px] text-on-surface-variant">Loading records...</div>
          )}
          {!loading && records.length === 0 && (
            <div className="px-[16px] py-[20px] text-on-surface-variant">No records found.</div>
          )}
          {records.map((record) => {
            const meta = statusMeta[record.status] || statusMeta.pending_review;
            return (
              <div
                key={record.id}
                className="grid grid-cols-[48px_120px_130px_minmax(160px,_1fr)_minmax(160px,_1fr)_120px_100px_80px] gap-[8px] items-center px-[16px] py-[12px] text-body-md text-on-surface hover:bg-surface-variant/40 transition-colors"
              >
                <div className="flex justify-center">
                  <input type="checkbox" />
                </div>
                <div>
                  <span className={`inline-flex items-center gap-[6px] px-2.5 py-1 rounded-full border text-label-sm ${meta.className}`}>
                    {meta.label}
                  </span>
                </div>
                <div className="text-on-surface-variant">
                  {record.activity_date || "—"}
                </div>
                <div className="text-on-surface-variant">
                  {record.source_system?.type || "—"}
                </div>
                <div>{record.activity_type || "—"}</div>
                <div className="text-right font-mono text-on-surface-variant">
                  {record.amount || "—"}
                </div>
                <div className="text-center text-on-surface-variant">
                  {record.scope || "—"}
                </div>
                <div className="text-center">
                  <Link className="text-primary text-label-sm" to={`/record/${record.id}`}>
                    Open
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
