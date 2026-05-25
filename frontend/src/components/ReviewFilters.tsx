import React from "react";

export default function ReviewFilters({ filters, setFilters }: any) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
      <select value={filters.source || ""} onChange={(e) => setFilters({ ...filters, source: e.target.value })}>
        <option value="">Source: All</option>
        <option value="sap">SAP</option>
        <option value="utility">Utility</option>
        <option value="travel">Travel</option>
      </select>
      <select value={filters.status || ""} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
        <option value="">Status: All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="failed">Failed</option>
      </select>
      <input placeholder="Search" value={filters.q || ""} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
    </div>
  );
}
