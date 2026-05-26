import React from "react";
import AppShell from "../components/AppShell";

export default function EmissionsReportingSuite() {
  return (
    <AppShell
      active="reports"
      title="Emissions Reporting"
      subtitle="Facility-level totals, variance analysis, and category breakdowns."
      searchPlaceholder="Search reports..."
    >
      <div className="bg-surface-container-low border border-outline-variant rounded p-[16px] flex flex-wrap items-center justify-between gap-[16px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex items-center bg-surface border border-outline-variant rounded px-[12px] py-[6px]">
            <span className="material-symbols-outlined text-on-surface-variant mr-[6px]">calendar_today</span>
            <input className="bg-transparent border-none text-body-sm text-on-surface focus:outline-none w-[200px]" readOnly value="Q3 2023 - Q4 2023" />
          </div>
          <div className="flex items-center bg-surface border border-outline-variant rounded px-[12px] py-[6px]">
            <span className="material-symbols-outlined text-on-surface-variant mr-[6px]">business</span>
            <select className="bg-transparent border-none text-body-sm text-on-surface focus:outline-none appearance-none pr-[16px]">
              <option>All Facilities (Global)</option>
              <option>North America Ops</option>
              <option>European Hubs</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-[8px]">
          <button className="flex items-center gap-[6px] px-[12px] py-[6px] border border-outline-variant rounded text-label-md text-on-surface">CSV</button>
          <button className="flex items-center gap-[6px] px-[12px] py-[6px] border border-outline-variant rounded text-label-md text-on-surface">PDF</button>
          <button className="flex items-center gap-[6px] px-[12px] py-[6px] bg-primary text-on-primary rounded text-label-md">Generate</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-[24px]">
        <div className="col-span-12 lg:col-span-4 bg-surface-container border border-outline-variant rounded p-[16px]">
          <h3 className="text-title-lg text-on-surface mb-[8px]">Total Emissions</h3>
          <div className="text-display-lg text-primary">12,450</div>
          <div className="text-body-sm text-on-surface-variant">MT CO2e total</div>
        </div>
        <div className="col-span-12 lg:col-span-8 bg-surface-container border border-outline-variant rounded p-[16px]">
          <h3 className="text-title-lg text-on-surface mb-[12px]">Variance Analysis (YoY)</h3>
          <div className="h-[220px] flex items-end gap-[8px]">
            {[30, 50, 40, 60, 55, 70, 48].map((v, idx) => (
              <div key={idx} className="flex-1 bg-primary/80 rounded-t" style={{ height: `${v}%` }}></div>
            ))}
          </div>
        </div>
        <div className="col-span-12 bg-surface-container border border-outline-variant rounded p-[16px]">
          <h3 className="text-title-lg text-on-surface mb-[12px]">Emissions by Category & Scope</h3>
          <table className="w-full text-left">
            <thead className="text-label-sm text-on-surface-variant uppercase">
              <tr>
                <th className="py-2">Category</th>
                <th className="py-2">Scope 1</th>
                <th className="py-2">Scope 2</th>
                <th className="py-2">Scope 3</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {[
                ["Mobile Combustion", "1,250", "—", "340", "1,590", "Verified"],
                ["Stationary Combustion", "1,869", "—", "—", "1,869", "Verified"],
                ["Purchased Electricity", "—", "4,850", "—", "4,850", "Pending"],
                ["Business Travel", "—", "—", "4,139", "4,139", "Review"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, idx) => (
                    <td key={idx} className="py-3 text-on-surface-variant">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
