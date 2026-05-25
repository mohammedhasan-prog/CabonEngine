import React, { useEffect, useState } from "react";
import api from "../api/client";
import ReviewFilters from "../components/ReviewFilters";
import ReviewTable from "../components/ReviewTable";
import RecordDetailDrawer from "../components/RecordDetailDrawer";

export default function Records() {
  const [records, setRecords] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any>(null);

  const fetchRecords = () => {
    const params: any = { page };
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.q) params.q = filters.q;
    api
      .get("/records/", { params })
      .then((r) => setRecords(r.data.results || r.data || []))
      .catch(() => setRecords([]));
  };

  useEffect(() => {
    fetchRecords();
  }, [page, filters]);

  const open = (r: any) => setSelected(r);
  const close = () => setSelected(null);

  const approve = async (r: any) => {
    if (!confirm("Approve this record?")) return;
    try {
      await api.patch(`/records/${r.id}/`, { status: "approved" });
      fetchRecords();
      close();
    } catch (e) {
      alert("Approve failed");
    }
  };

  const reject = async (r: any) => {
    if (!confirm("Reject this record?")) return;
    try {
      await api.patch(`/records/${r.id}/`, { status: "rejected" });
      fetchRecords();
      close();
    } catch (e) {
      alert("Reject failed");
    }
  };

  return (
    <div>
      <h2>Review Queue</h2>
      <ReviewFilters filters={filters} setFilters={setFilters} />
      <ReviewTable records={records} onSelect={open} />
      <div style={{ marginTop: 12 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span style={{ margin: "0 8px" }}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
      <RecordDetailDrawer record={selected} onClose={close} onApprove={approve} onReject={reject} />
    </div>
  );
}
