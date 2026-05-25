import React, { useState } from "react";

const prototypes = [
  "login_tenant_selection",
  "main_review_queue",
  "executive_dashboard",
  "executive_dashboard_overview",
  "data_ingestion_hub",
  "emissions_reports",
];

export default function Designs() {
  const [selected, setSelected] = useState(prototypes[0]);

  return (
    <div style={{ padding: 12 }}>
      <h2>UI Prototypes</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Choose prototype:</label>
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {prototypes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div style={{ border: "1px solid #ddd", height: "80vh" }}>
        <iframe
          title="prototype"
          style={{ width: "100%", height: "100%", border: 0 }}
          src={`/ui/${selected}/index.html`}
        />
      </div>
    </div>
  );
}
