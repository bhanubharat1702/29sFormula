"use client";

import React from "react";
import styles from "../../page.module.css";
import { AuditLogItem } from "../auditLogsTypes";

interface AuditLogTableProps {
  loading: boolean;
  logs: AuditLogItem[];
  onViewDiff: (log: AuditLogItem) => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ loading, logs, onViewDiff }) => {
  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Timestamp</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Admin User</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Category</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Action</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Target</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Result</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>IP & Location</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151", textAlign: "right" }}>View Diff</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                Loading immutable audit logs...
              </td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                No matching audit records found.
              </td>
            </tr>
          ) : (
            logs.map((item) => (
              <tr key={item._id} style={{ borderBottom: "1px solid #f3f4f6", backgroundColor: item.isSuspicious ? "#fff1f2" : "transparent" }}>
                <td style={{ padding: "14px 16px", whiteSpace: "nowrap", fontSize: "13px", color: "#6b7280" }}>
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: "600", color: "#111827" }}>{item.adminUser}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{item.adminEmail}</div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor:
                      item.actionCategory === "auth" ? "#e0e7ff" :
                      item.actionCategory === "impersonation" ? "#fef3c7" :
                      item.actionCategory === "security" ? "#fee2e2" : "#f3f4f6",
                    color:
                      item.actionCategory === "auth" ? "#3730a3" :
                      item.actionCategory === "impersonation" ? "#92400e" :
                      item.actionCategory === "security" ? "#991b1b" : "#374151"
                  }}>
                    {item.actionCategory.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: "600", color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}>
                    {item.isSuspicious && <span title="Suspicious Activity Flag">🚨</span>}
                    <span>{item.action}</span>
                  </div>
                  {item.reason && (
                    <div style={{ fontSize: "12px", color: "#6b7280", fontStyle: "italic", marginTop: "2px" }}>
                      Reason: {item.reason}
                    </div>
                  )}
                </td>
                <td style={{ padding: "14px 16px", color: "#374151", fontSize: "13px" }}>
                  {item.target || item.storeName || "-"}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: item.result === "success" ? "#d1fae5" : "#fee2e2",
                    color: item.result === "success" ? "#065f46" : "#991b1b"
                  }}>
                    {item.result === "success" ? "✓ SUCCESS" : "❌ FAILED"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "13px" }}>
                  {item.ipAddress} ({item.country || 'India'})
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <button
                    className={styles.btnSecondary}
                    style={{ padding: "4px 10px", fontSize: "12px" }}
                    onClick={() => onViewDiff(item)}
                  >
                    View Diff
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
