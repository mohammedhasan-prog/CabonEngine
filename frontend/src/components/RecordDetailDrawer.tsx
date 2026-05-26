import React, { useState, useEffect } from "react";
import api from "../api/client";

export default function RecordDetailDrawer({ record, onClose, onApprove, onReject, onUpdate }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({
        activity_type: record.activity_type || "",
        amount: record.amount || "",
        unit: record.unit || "",
      });
      setNote("");
      setIsEditing(false);
    }
  }, [record]);

  if (!record) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch(`/records/${record.id}/`, {
        ...formData,
        note: note || "Manual edit via Review Queue",
      });
      onUpdate(res.data);
      setIsEditing(false);
      setNote("");
    } catch (err) {
      console.error("Failed to save record", err);
    } finally {
      setSaving(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending_review: "bg-primary-container/20 text-primary border-primary/30",
    suspicious: "bg-tertiary-container/20 text-tertiary border-tertiary/30",
    failed: "bg-error-container/20 text-error border-error/30",
    approved: "bg-primary-container/20 text-primary border-primary/30",
    rejected: "bg-error-container/20 text-error border-error/30",
  };

  const statusClass = statusColors[record.status] || statusColors.pending_review;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="fixed right-0 top-0 h-full w-[420px] bg-surface border-l border-outline-variant z-50 flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-[24px] border-b border-outline-variant bg-surface-container-low shrink-0">
          <div>
            <h2 className="text-headline-sm font-headline-sm text-on-surface flex items-center gap-2">
              Record Details
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${statusClass}`}>
                {record.status.replace("_", " ")}
              </span>
            </h2>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-1 font-mono">
              ID: {record.id.substring(0, 8)}...
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-on-surface-variant hover:bg-surface-variant p-1 rounded transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-[24px] flex flex-col gap-[24px]">
          
          {/* Validation Errors */}
          {record.validation_errors && record.validation_errors.length > 0 && (
            <div className="bg-error-container/10 border border-error/30 rounded p-3">
              <h4 className="text-label-md font-label-md text-error flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                Validation Errors
              </h4>
              <ul className="list-disc list-inside text-body-sm text-error/90 pl-1">
                {record.validation_errors.map((err: string, i: number) => (
                  <li key={i}>{err.replace("_", " ")}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                Extracted Data
              </h3>
              {!isEditing && record.status !== "approved" && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="text-primary text-label-sm flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  Edit
                </button>
              )}
            </div>

            <div className="flex flex-col gap-[4px]">
              <label className="text-label-sm text-on-surface-variant">Activity Type</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.activity_type} 
                  onChange={e => setFormData({...formData, activity_type: e.target.value})}
                  className="bg-surface-container-low border border-outline-variant rounded px-3 py-1.5 text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              ) : (
                <div className="text-body-md text-on-surface">{record.activity_type || "—"}</div>
              )}
            </div>

            <div className="flex gap-[16px]">
              <div className="flex flex-col gap-[4px] flex-1">
                <label className="text-label-sm text-on-surface-variant">Amount</label>
                {isEditing ? (
                  <input 
                    type="number" 
                    value={formData.amount} 
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="bg-surface-container-low border border-outline-variant rounded px-3 py-1.5 text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                ) : (
                  <div className="text-body-md text-on-surface font-mono">{record.amount || "—"}</div>
                )}
              </div>
              <div className="flex flex-col gap-[4px] w-1/3">
                <label className="text-label-sm text-on-surface-variant">Unit</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.unit} 
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="bg-surface-container-low border border-outline-variant rounded px-3 py-1.5 text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                ) : (
                  <div className="text-body-md text-on-surface">{record.unit || "—"}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col gap-[4px] mt-2">
                <label className="text-label-sm text-on-surface-variant">Reason for edit</label>
                <textarea 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="E.g. Corrected missing unit based on source."
                  className="bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[60px]"
                />
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-primary text-on-primary px-3 py-1.5 rounded text-label-md font-bold hover:bg-primary/90 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Edits"}
                  </button>
                  <button 
                    onClick={() => { setIsEditing(false); setNote(""); }} 
                    className="text-on-surface-variant px-3 py-1.5 hover:bg-surface-variant rounded text-label-md font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <hr className="border-outline-variant/50" />

          {/* Reference Data */}
          <div className="flex flex-col gap-[12px]">
            <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
              System Context
            </h3>
            <div className="grid grid-cols-2 gap-[16px]">
              <div>
                <label className="text-label-sm text-on-surface-variant">Source System</label>
                <div className="text-body-sm text-on-surface mt-1">{record.source_system?.name || "—"}</div>
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant">Activity Date</label>
                <div className="text-body-sm text-on-surface font-mono mt-1">{record.activity_date || "—"}</div>
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant">Assigned Scope</label>
                <div className="text-body-sm text-on-surface mt-1">{record.scope || "—"}</div>
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant">Emission Factor ID</label>
                <div className="text-body-sm text-on-surface mt-1 font-mono">{record.emission_factor_id ? record.emission_factor_id.substring(0,8) : "None"}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        {!isEditing && record.status !== "approved" && (
          <div className="p-[24px] border-t border-outline-variant bg-surface-container shrink-0 flex flex-col gap-3">
            <textarea 
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Optional note for approval/rejection"
              className="bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none min-h-[60px]"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => onApprove(record, note)}
                className="flex-1 bg-primary text-on-primary py-2 rounded text-label-md font-bold hover:bg-primary/90 flex items-center justify-center gap-1 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Approve
              </button>
              <button 
                onClick={() => onReject(record, note)}
                className="flex-1 bg-transparent border border-error text-error py-2 rounded text-label-md font-bold hover:bg-error/10 flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
