import React from "react";

export default function ReviewTable({ records, onSelect }: any) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
          <th style={{ padding: 8 }}>#</th>
          <th style={{ padding: 8 }}>Status</th>
          <th style={{ padding: 8 }}>Activity Date</th>
          <th style={{ padding: 8 }}>Source</th>
          <th style={{ padding: 8 }}>Activity</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r: any, idx: number) => (
          <tr key={r.id} style={{ borderBottom: "1px solid #f3f3f3", cursor: "pointer" }} onClick={() => onSelect(r)}>
            <td style={{ padding: 8 }}>{idx + 1}</td>
            <td style={{ padding: 8 }}><StatusBadge status={r.status} /></td>
            <td style={{ padding: 8 }}>{r.activity_date || r.activity_date_string || "-"}</td>
            <td style={{ padding: 8 }}>{r.source || r.source_system || "-"}</td>
            <td style={{ padding: 8 }}>{r.activity_type || r.activity || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = status === "approved" ? "#1aa179" : status === "rejected" ? "#d9534f" : status === "failed" ? "#d19a2b" : "#5aa0d8";
  return <span style={{ background: color, color: "#fff", padding: "4px 8px", borderRadius: 6 }}>{status}</span>;
}
