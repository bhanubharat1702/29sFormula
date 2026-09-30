import React from "react";
import styles from "../page.module.css";
import { DemoRequestItem } from "./types";

interface DemoRequestsTableProps {
  activeTab: string;
  loading: boolean;
  demoRequests: DemoRequestItem[];
  onSelectLead: (demo: DemoRequestItem) => void;
  onProvisionFromDemo: (demo: DemoRequestItem) => void;
  onUpdateStage: (id: string, stage: string) => void;
  onDeleteLead?: (id: string) => void;
}

export const DemoRequestsTable: React.FC<DemoRequestsTableProps> = ({
  activeTab,
  loading,
  demoRequests,
  onSelectLead,
  onProvisionFromDemo,
  onUpdateStage,
  onDeleteLead
}) => {
  if (activeTab !== "demo-requests") return null;

  return (
    <div className={styles.tableCard}>
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table className={styles.table} style={{ minWidth: "900px" }}>
        <thead>
          <tr>
            <th>Brand & Prospect</th>
            <th>Contact Info</th>
            <th>Monthly Volume & Website</th>
            <th>Score & Priority</th>
            <th>Pipeline Stage</th>
            <th>SLA Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                Loading merchant demo requests...
              </td>
            </tr>
          ) : demoRequests.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                No demo requests match your search criteria.
              </td>
            </tr>
          ) : (
            demoRequests.map((demo) => {
              const currentStage = demo.pipelineStage || (demo.status === "Approved" ? "Won" : demo.status === "Rejected" ? "Lost" : demo.status === "Contacted" ? "Contacted" : "New");

              return (
                <tr
                  key={demo._id}
                  onClick={() => onSelectLead(demo)}
                  style={{ cursor: "pointer" }}
                  title="Click anywhere on this row to open Lead Details card"
                >
                  <td>
                    <div className={styles.storeName}>{demo.storeName}</div>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>👤 {demo.ownerName}</div>
                    <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px" }}>
                      Category: {demo.businessType || "Retail"}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.84rem" }}>📧 {demo.email}</div>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>📞 {demo.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "#2563eb" }}>
                      📦 {demo.monthlyOrders || "< 50"} orders/mo
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                      {demo.currentWebsite ? (
                        <a
                          href={demo.currentWebsite.startsWith("http") ? demo.currentWebsite : `https://${demo.currentWebsite}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: "#2563eb", textDecoration: "underline" }}
                        >
                          🌐 {demo.currentWebsite}
                        </a>
                      ) : (
                        "No website"
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                      <span
                        style={{
                          background: (demo.leadScore || 50) >= 80 ? "#fef3c7" : "#f3f4f6",
                          color: (demo.leadScore || 50) >= 80 ? "#b45309" : "#374151",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontWeight: 700,
                          fontSize: "0.75rem"
                        }}
                      >
                        🔥 {demo.leadScore || 50}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: demo.priority === "Urgent" ? "#dc2626" : demo.priority === "High" ? "#c2410c" : "#4b5563"
                        }}
                      >
                        ⚡ {demo.priority || "Medium"}
                      </span>
                    </div>
                    {demo.isDuplicate && (
                      <span style={{ fontSize: "0.7rem", color: "#4338ca", display: "block", marginTop: "2px" }}>
                        👥 Duplicate Lead
                      </span>
                    )}
                  </td>
                  <td>
                    <select
                      value={currentStage}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        onUpdateStage(demo._id, e.target.value);
                      }}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        backgroundColor: currentStage === "Won" ? "#dcfce7" : currentStage === "Lost" ? "#fee2e2" : "#ffffff",
                        color: currentStage === "Won" ? "#166534" : currentStage === "Lost" ? "#991b1b" : "#111827"
                      }}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Demo Scheduled">Demo Scheduled</option>
                      <option value="Demo Done">Demo Done</option>
                      <option value="Trial Started">Trial Started</option>
                      <option value="Won">Won (Approved)</option>
                      <option value="Lost">Lost (Rejected)</option>
                    </select>
                  </td>
                  <td>
                    {demo.slaBreached ? (
                      <span style={{ background: "#fee2e2", color: "#991b1b", padding: "4px 8px", borderRadius: "10px", fontWeight: 700, fontSize: "0.75rem" }}>
                        ⚠️ SLA Breach (&gt;24h)
                      </span>
                    ) : (
                      <span style={{ color: "#10b981", fontWeight: 600, fontSize: "0.78rem" }}>
                        ✓ Within SLA
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(demo);
                        }}
                        className={styles.btnAction}
                        style={{ background: "#f3f4f6", color: "#374151" }}
                      >
                        Details
                      </button>
                      {currentStage !== "Won" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onProvisionFromDemo(demo);
                          }}
                          className={`${styles.btnAction} ${styles.btnActionAccent}`}
                        >
                          ⚡ Convert
                        </button>
                      )}
                      {onDeleteLead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLead(demo._id);
                          }}
                          className={`${styles.btnAction} ${styles.btnActionDanger}`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};
