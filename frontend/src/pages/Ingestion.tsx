import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/client";
import AppShell from "../components/AppShell";

const statusStyles: Record<string, string> = {
  completed: "bg-primary/10 border-primary/20 text-primary",
  running: "bg-tertiary/10 border-tertiary/20 text-tertiary",
  failed: "bg-error/10 border-error/20 text-error",
  pending: "bg-secondary/10 border-secondary/20 text-secondary",
};

const statusLabels: Record<string, string> = {
  completed: "Completed",
  running: "Processing",
  failed: "Failed",
  pending: "Pending",
};

type SourceSystem = {
  id: string;
  name: string;
  type: string;
  connection_mode: string;
  status: string;
};

type IngestionJob = {
  id: string;
  source_system: SourceSystem;
  file_name: string;
  status: string;
  started_at?: string | null;
  finished_at?: string | null;
  created_at?: string | null;
  error_summary?: string;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const dt = new Date(value);
  return dt.toLocaleString();
}

export default function Ingestion() {
  const [sources, setSources] = useState<SourceSystem[]>([]);
  const [jobs, setJobs] = useState<IngestionJob[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedSource = useMemo(
    () => sources.find((source) => source.id === selectedSourceId),
    [sources, selectedSourceId]
  );

  const loadSources = async () => {
    try {
      const res = await api.get("/ingestions/sources/");
      setSources(res.data.results || res.data || []);
      if (!selectedSourceId && (res.data.results || res.data || []).length > 0) {
        setSelectedSourceId((res.data.results || res.data)[0].id);
      }
    } catch {
      setSources([]);
    }
  };

  const loadJobs = async () => {
    setRefreshing(true);
    try {
      const res = await api.get("/ingestions/");
      setJobs(res.data.results || res.data || []);
    } catch {
      setJobs([]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSources();
    loadJobs();
  }, []);

  const startIngestion = async () => {
    if (!file || !selectedSourceId) {
      setError("Select a source and attach a file first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("source_system_id", selectedSourceId);
      formData.append("file", file);
      const uploadResp = await api.post("/ingestions/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const jobId = uploadResp.data?.id;
      if (jobId) {
        await api.post("/ingestions/run/", { ingestion_job_id: jobId });
      }
      setFile(null);
      await loadJobs();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <AppShell
      active="ingestion"
      title="Data Ingestion & Pipeline"
      subtitle="Upload raw inventory files and monitor ETL job execution status."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] flex-grow">
        <section className="lg:col-span-4 flex flex-col gap-[16px]">
          <div className="bg-surface-container border border-outline-variant rounded-xl p-[24px] flex flex-col h-full gap-[24px] shadow-sm">
            <div className="flex flex-col gap-[8px] border-b border-outline-variant pb-[16px]">
              <h3 className="text-headline-sm font-headline-sm text-on-surface flex items-center gap-2 font-['Space_Grotesk']">
                <span className="material-symbols-outlined text-primary">cloud_upload</span>
                New Ingestion Job
              </h3>
            </div>

            <div className="flex flex-col gap-[4px]">
              <label className="text-label-md font-label-md text-on-surface-variant">Source Category</label>
              <div className="relative">
                <select
                  className="w-full bg-background border border-outline-variant text-body-md font-body-md text-on-surface rounded-lg py-3 pl-3 pr-10 appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={selectedSourceId}
                  onChange={(event) => setSelectedSourceId(event.target.value)}
                >
                  {sources.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <div
              className="flex-grow border-2 border-dashed border-outline-variant rounded-xl bg-surface-variant/10 hover:bg-surface-variant/30 transition-colors flex flex-col items-center justify-center p-[24px] gap-[16px] cursor-pointer group"
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-16 w-16 rounded-full bg-surface border border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-3xl text-primary">note_add</span>
              </div>
              <div className="text-center">
                <p className="text-body-lg font-body-lg text-on-surface mb-1">{file ? file.name : "Drag and drop files here"}</p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Supported formats: CSV, XLSX, JSON (Max 500MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </div>

            {selectedSource && (
              <div className="text-body-sm text-on-surface-variant">
                Active source: <span className="text-on-surface">{selectedSource.name}</span>
              </div>
            )}

            {error && <div className="text-error text-body-sm">{error}</div>}

            <button
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={startIngestion}
              disabled={loading || !file || !selectedSourceId}
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              {loading ? "Starting..." : "Start Ingestion"}
            </button>
          </div>
        </section>

        <section className="lg:col-span-8 flex flex-col h-full">
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
            <div className="p-[24px] border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="text-headline-sm font-headline-sm text-on-surface flex items-center gap-2 font-['Space_Grotesk']">
                <span className="material-symbols-outlined text-primary">toc</span>
                Job Execution Queue
              </h3>
              <div className="flex gap-2">
                <button
                  className="p-2 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-variant transition-colors flex items-center justify-center"
                  onClick={loadJobs}
                  disabled={refreshing}
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider">
                    <th className="py-4 px-6 border-b-2 border-primary w-[140px]">Job ID</th>
                    <th className="py-4 px-6 border-b-2 border-primary">Source</th>
                    <th className="py-4 px-6 border-b-2 border-primary">Timestamp</th>
                    <th className="py-4 px-6 border-b-2 border-primary text-right">File</th>
                    <th className="py-4 px-6 border-b-2 border-primary text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-body-md font-body-md text-on-surface divide-y divide-outline-variant">
                  {jobs.length === 0 && (
                    <tr>
                      <td className="py-6 px-6 text-on-surface-variant" colSpan={5}>
                        No ingestion jobs yet. Upload a file to begin.
                      </td>
                    </tr>
                  )}
                  {jobs.map((job) => {
                    const statusKey = job.status || "pending";
                    const statusClass = statusStyles[statusKey] || statusStyles.pending;
                    const statusLabel = statusLabels[statusKey] || statusKey;
                    return (
                      <tr key={job.id} className="hover:bg-surface-variant/30 transition-colors">
                        <td className="py-4 px-6 font-mono text-on-surface-variant">{job.id.slice(0, 8)}...</td>
                        <td className="py-4 px-6">{job.source_system?.name || "Unknown"}</td>
                        <td className="py-4 px-6 text-on-surface-variant">{formatDate(job.started_at || job.created_at)}</td>
                        <td className="py-4 px-6 text-right font-mono text-on-surface-variant">{job.file_name || "—"}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-label-sm font-label-sm ${statusClass}`}>
                            {statusKey === "running" && (
                              <span className="material-symbols-outlined text-[12px] animate-spin">sync</span>
                            )}
                            {statusKey === "failed" && (
                              <span className="material-symbols-outlined text-[12px]">warning</span>
                            )}
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
