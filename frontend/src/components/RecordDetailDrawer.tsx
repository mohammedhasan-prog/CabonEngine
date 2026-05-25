import React from "react";

export default function RecordDetailDrawer({ record, onClose, onApprove, onReject }: any) {
  if (!record) return null;
  return (
    <div style={{ position: "fixed", right: 0, top: 0, height: "100%", width: 420, background: "#fff", boxShadow: "-4px 0 12px rgba(0,0,0,0.1)", padding: 16 }}>
      <button onClick={onClose} style={{ float: "right" }}>Close</button>
      <h3>Record {record.id}</h3>
      <p><strong>Source:</strong> {record.source || record.source_system}</p>
      <p><strong>Activity:</strong> {record.activity_type}</p>
      <p><strong>Amount:</strong> {record.amount} {record.unit}</p>
      <p><strong>Normalized:</strong> {record.normalized_amount || "-"} {record.normalized_unit || "-"}</p>
      <p><strong>Status:</strong> {record.status}</p>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => onApprove(record)} style={{ marginRight: 8 }}>Approve</button>
        <button onClick={() => onReject(record)} style={{ background: "#d9534f", color: "#fff" }}>Reject</button>
      </div>
    </div>
  );
}
