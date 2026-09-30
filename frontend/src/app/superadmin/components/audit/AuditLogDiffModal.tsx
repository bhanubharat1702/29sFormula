"use client";

import React from "react";
import styles from "../../page.module.css";
import { AuditLogItem } from "../auditLogsTypes";

interface AuditLogDiffModalProps {
  log: AuditLogItem | null;
  onClose: () => void;
}

export const AuditLogDiffModal: React.FC<AuditLogDiffModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Audit Event Details & Diff</h3>
            <p className={styles.modalSubtitle}>Action: <strong style={{ color: "#4f46e5" }}>{log.action}</strong> by {log.adminUser}</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", background: "#f9fafb", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
            <div><strong>Timestamp:</strong><br />{new Date(log.timestamp).toLocaleString()}</div>
            <div><strong>IP Address:</strong><br />{log.ipAddress} ({log.country || 'India'})</div>
            <div><strong>Result:</strong><br />
              <span style={{ fontWeight: 600, color: log.result === 'success' ? '#10b981' : '#ef4444' }}>
                {log.result.toUpperCase()}
              </span>
            </div>
          </div>

          {log.reason && (
            <div style={{ background: "#fef3c7", border: "1px solid #fde68a", color: "#92400e", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
              <strong>Reason logged:</strong> {log.reason}
            </div>
          )}

          {log.isSuspicious && (
            <div className={styles.errorBanner} style={{ marginBottom: "16px" }}>
              🚨 <strong>Suspicious Flagged:</strong> {log.suspiciousReason || "Unusual activity detected"}
            </div>
          )}

          <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px", color: "#374151" }}>Before vs After State Diff</h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px" }}>
              <div style={{ fontWeight: "700", color: "#991b1b", fontSize: "12px", marginBottom: "6px" }}>BEFORE VALUE</div>
              <pre style={{ margin: 0, fontSize: "12px", fontFamily: "monospace", whiteSpace: "pre-wrap", color: "#7f1d1d" }}>
                {log.beforeValue ? JSON.stringify(log.beforeValue, null, 2) : "None / Created"}
              </pre>
            </div>
            <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px", padding: "12px" }}>
              <div style={{ fontWeight: "700", color: "#065f46", fontSize: "12px", marginBottom: "6px" }}>AFTER VALUE</div>
              <pre style={{ margin: 0, fontSize: "12px", fontFamily: "monospace", whiteSpace: "pre-wrap", color: "#064e3b" }}>
                {log.afterValue ? JSON.stringify(log.afterValue, null, 2) : "None / Deleted"}
              </pre>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnPrimary} onClick={onClose}>Close View</button>
        </div>
      </div>
    </div>
  );
};
