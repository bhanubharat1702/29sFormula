import React, { useState } from "react";
import styles from "../../page.module.css";
import { DemoRequestItem } from "../types";

interface DemoRequestsKanbanProps {
  demoRequests: DemoRequestItem[];
  onSelectLead: (demo: DemoRequestItem) => void;
  onUpdateStage: (id: string, stage: string) => void;
  onConvert: (demo: DemoRequestItem) => void;
}

const STAGES = [
  { key: "New", label: "New Leads", color: "#3b82f6", bg: "#eff6ff" },
  { key: "Contacted", label: "Contacted", color: "#8b5cf6", bg: "#f5f3ff" },
  { key: "Demo Scheduled", label: "Demo Scheduled", color: "#0284c7", bg: "#f0f9ff" },
  { key: "Demo Done", label: "Demo Done", color: "#d97706", bg: "#fffbeb" },
  { key: "Trial Started", label: "Trial Started", color: "#059669", bg: "#ecfdf5" },
  { key: "Won", label: "Won (Merchant)", color: "#16a34a", bg: "#f0fdf4" },
  { key: "Lost", label: "Lost / Closed", color: "#dc2626", bg: "#fef2f2" }
];

export const DemoRequestsKanban: React.FC<DemoRequestsKanbanProps> = ({
  demoRequests,
  onSelectLead,
  onUpdateStage,
  onConvert
}) => {
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        paddingBottom: "16px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "14px",
          minWidth: "min-content",
          alignItems: "flex-start"
        }}
      >
        {STAGES.map((stg) => {
          const columnLeads = demoRequests.filter((d) => {
            const currentStage = d.pipelineStage || (d.status === "Approved" ? "Won" : d.status === "Rejected" ? "Lost" : d.status === "Contacted" ? "Contacted" : "New");
            return currentStage === stg.key;
          });

          const isOver = dragOverStage === stg.key;

          return (
            <div
              key={stg.key}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (dragOverStage !== stg.key) {
                  setDragOverStage(stg.key);
                }
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDragOverStage(null);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverStage(null);
                const leadId = e.dataTransfer.getData("text/plain") || draggingLeadId;
                if (leadId) {
                  onUpdateStage(leadId, stg.key);
                }
              }}
              style={{
                width: "270px",
                minWidth: "270px",
                flexShrink: 0,
                backgroundColor: isOver ? "#eff6ff" : "#f9fafb",
                borderRadius: "12px",
                border: isOver ? "2px dashed #2563eb" : "1px solid #e5e7eb",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                minHeight: "480px",
                boxSizing: "border-box",
                transition: "background-color 0.15s ease, border 0.15s ease"
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  paddingBottom: "8px",
                  borderBottom: `2px solid ${stg.color}`
                }}
              >
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>
                  {stg.label}
                </span>
                <span
                  style={{
                    backgroundColor: stg.bg,
                    color: stg.color,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    border: `1px solid ${stg.color}33`
                  }}
                >
                  {columnLeads.length}
                </span>
              </div>

              {/* Lead Cards List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", flex: 1 }}>
                {columnLeads.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "24px 10px",
                      color: isOver ? "#2563eb" : "#9ca3af",
                      fontSize: "0.78rem",
                      border: isOver ? "1px dashed #93c5fd" : "none",
                      borderRadius: "8px"
                    }}
                  >
                    {isOver ? "Drop lead here" : "No leads in this stage"}
                  </div>
                ) : (
                  columnLeads.map((lead) => {
                    const isDraggingThis = draggingLeadId === lead._id;

                    return (
                      <div
                        key={lead._id}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", lead._id);
                          e.dataTransfer.effectAllowed = "move";
                          setDraggingLeadId(lead._id);
                        }}
                        onDragEnd={() => {
                          setDraggingLeadId(null);
                          setDragOverStage(null);
                        }}
                        onClick={() => onSelectLead(lead)}
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                          border: lead.slaBreached ? "1.5px solid #ef4444" : "1px solid #e5e7eb",
                          padding: "12px",
                          boxShadow: isDraggingThis ? "0 8px 16px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.05)",
                          cursor: isDraggingThis ? "grabbing" : "grab",
                          opacity: isDraggingThis ? 0.4 : 1,
                          transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
                          position: "relative"
                        }}
                        onMouseEnter={(e) => {
                          if (!isDraggingThis) e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isDraggingThis) e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        {/* SLA Breach Tag */}
                        {lead.slaBreached && (
                          <div
                            style={{
                              position: "absolute",
                              top: "-8px",
                              right: "8px",
                              background: "#ef4444",
                              color: "#ffffff",
                              fontSize: "0.65rem",
                              fontWeight: 800,
                              padding: "1px 6px",
                              borderRadius: "6px"
                            }}
                          >
                            ⚠️ &gt;24h SLA
                          </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                          <strong
                            style={{
                              fontSize: "0.88rem",
                              color: "#0c0a09",
                              fontWeight: 700,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "180px"
                            }}
                            title={lead.storeName}
                          >
                            {lead.storeName}
                          </strong>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color: (lead.leadScore || 50) >= 80 ? "#b45309" : "#4b5563",
                              flexShrink: 0
                            }}
                          >
                            🔥 {lead.leadScore || 50}
                          </span>
                        </div>

                        <div style={{ fontSize: "0.78rem", color: "#4b5563", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          👤 {lead.ownerName}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.72rem", color: "#6b7280", marginBottom: "8px" }}>
                          <span>📦 {lead.monthlyOrders || "< 50"} /mo</span>
                          <span style={{ textTransform: "capitalize", fontWeight: 600, color: lead.priority === "Urgent" ? "#dc2626" : "#4b5563" }}>
                            ⚡ {lead.priority || "Medium"}
                          </span>
                        </div>

                        {/* Footer Quick Controls */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #f3f4f6" }}>
                          <select
                            value={stg.key}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              onUpdateStage(lead._id, e.target.value);
                            }}
                            style={{
                              fontSize: "0.72rem",
                              padding: "2px 4px",
                              borderRadius: "4px",
                              border: "1px solid #d1d5db",
                              backgroundColor: "#f9fafb",
                              maxWidth: "130px"
                            }}
                          >
                            {STAGES.map((s) => (
                              <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                          </select>

                          {stg.key !== "Won" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onConvert(lead);
                              }}
                              style={{
                                background: "#10b981",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "3px 8px",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              🚀 Convert
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
