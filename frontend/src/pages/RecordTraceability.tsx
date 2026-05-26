import React from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";

export default function RecordTraceability() {
  return (
    <AppShell
      active="review"
      title="Record Traceability"
      subtitle="Track transformation steps, audit checkpoints, and metadata changes."
    >
      <Link className="text-primary text-body-sm flex items-center gap-[6px]" to="/review">
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back to Review Queue
      </Link>

      <div className="bg-surface-container border border-outline-variant rounded-lg p-[16px]">
        <h3 className="text-title-lg text-on-surface mb-[12px]">Transformation Pipeline</h3>
        <div className="grid grid-cols-4 gap-[12px]">
          {["Data Origin", "Normalization", "Emission Factor", "Finalized"].map((step) => (
            <div key={step} className="bg-surface-container-low border border-outline-variant rounded p-[12px]">
              <div className="text-label-sm text-on-surface-variant uppercase">{step}</div>
              <div className="text-body-md text-on-surface mt-[4px]">Active</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-[24px]">
        <section className="col-span-12 lg:col-span-8 bg-surface-container border border-outline-variant rounded-lg p-[16px]">
          <h3 className="text-title-lg text-on-surface mb-[12px]">Audit Timeline</h3>
          <div className="space-y-[12px]">
            {["Record created", "Metadata updated", "Factor recalculated"].map((item) => (
              <div key={item} className="border border-outline-variant rounded p-[12px] bg-surface-container-low">
                <div className="text-label-sm text-on-surface-variant">{item}</div>
                <div className="text-body-sm text-on-surface">2023-10-27 14:02 UTC</div>
              </div>
            ))}
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 bg-surface-container border border-outline-variant rounded-lg p-[16px]">
          <h3 className="text-title-lg text-on-surface mb-[12px]">Record Details</h3>
          <div className="space-y-[8px] text-body-sm text-on-surface-variant">
            <div className="flex justify-between"><span>Source</span><span className="text-on-surface">SAP ERP</span></div>
            <div className="flex justify-between"><span>Scope</span><span className="text-on-surface">Scope 1</span></div>
            <div className="flex justify-between"><span>Status</span><span className="text-on-surface">Verified</span></div>
            <div className="flex justify-between"><span>Confidence</span><span className="text-on-surface">98.6%</span></div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
