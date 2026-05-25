import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function AuditViewer() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    api
      .get("/audit/events/")
      .then((r) => setEvents(r.data.results || []))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div>
      <h2>Audit Events</h2>
      <ul>
        {events.map((e) => (
          <li key={e.id}>{e.action} — {e.object_type} — {e.created_at}</li>
        ))}
      </ul>
    </div>
  );
}
