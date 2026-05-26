import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import AppShell from "../components/AppShell";

export default function RecordDetail() {
  const { id } = useParams();
  const [record, setRecord] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/records/${id}/`)
      .then((res) => setRecord(res.data))
      .catch(() => setRecord(null));
    api
      .get(`/audit/NormalizedRecord/${id}/`)
      .then((res) => setEvents(res.data.results || res.data || []))
      .catch(() => setEvents([]));
  }, [id]);

  return (
    <AppShell
      active="review"
      title="Record Lineage"
      subtitle="Trace transformations and audit trail history for a single record."
    >
      <div className="flex justify-between items-center">
        <Link className="text-primary text-body-sm flex items-center gap-[6px]" to="/review">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Review Queue
        </Link>
        <div className="flex gap-[8px]">
          <button className="px-3 py-2 border border-outline-variant rounded text-label-md text-on-surface">Export JSON</button>
          <button className="px-3 py-2 bg-primary text-on-primary rounded text-label-md">Acknowledge</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-[24px]">
        <section className="col-span-12 lg:col-span-8 space-y-[24px]">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-[24px]">
            <h3 className="text-headline-sm text-on-surface mb-[12px]">Transformation Pipeline</h3>
            <div className="grid grid-cols-4 gap-[12px]">
              {[
                { label: "Data Origin", value: record?.source_system?.type || "SAP" },
                { label: "Normalization", value: record?.normalized_unit || "—" },
                { label: "Emission Factor", value: record?.emission_factor_id || "—" },
                { label: "Finalized", value: record?.approval_status || "pending" },
              ].map((item) => (
                <div key={item.label} className="bg-surface-container-low border border-outline-variant rounded p-[12px]">
                  <div className="text-label-sm uppercase text-on-surface-variant">{item.label}</div>
                  <div className="text-body-md text-on-surface mt-[4px]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded-lg p-[24px]">
            <h3 className="text-headline-sm text-on-surface mb-[12px]">Audit Timeline</h3>
            <div className="space-y-[12px]">
              {events.length === 0 && (
                <div className="text-on-surface-variant">No audit events yet.</div>
              )}
              {events.map((event) => (
                <div key={event.id} className="border border-outline-variant rounded p-[12px] bg-surface-container-low">
                  <div className="flex justify-between text-label-sm text-on-surface-variant">
                    <span>{event.action}</span>
                    <span>{new Date(event.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-body-sm text-on-surface mt-[6px]">
                    {event.object_type} • {event.object_id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 space-y-[24px]">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-[24px]">
            <h3 className="text-headline-sm text-on-surface mb-[12px]">Record Details</h3>
            <div className="space-y-[8px] text-body-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Activity Type</span>
                <span className="text-on-surface">{record?.activity_type || "—"}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Scope</span>
                <span className="text-on-surface">{record?.scope || "—"}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Amount</span>
                <span className="text-on-surface">{record?.amount || "—"}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Unit</span>
                <span className="text-on-surface">{record?.unit || "—"}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Normalized</span>
                <span className="text-on-surface">{record?.normalized_amount || "—"}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded-lg p-[24px]">
            <h3 className="text-headline-sm text-on-surface mb-[12px]">Raw Payload</h3>
            <pre className="text-body-sm text-on-surface-variant whitespace-pre-wrap break-words">
{JSON.stringify(record?.raw_record?.raw_payload || {}, null, 2)}
            </pre>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
