"use client";

import React from "react";
import styles from "../../page.module.css";
import { InAppNotificationItem } from "../communicationsTypes";

interface InAppNoticesTabProps {
  notices: InAppNotificationItem[];
  onOpenCreate: () => void;
  onDelete: (id: string) => void;
}

export default function InAppNoticesTab({
  notices,
  onOpenCreate,
  onDelete
}: InAppNoticesTabProps) {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeaderRow} style={{ padding: "16px 20px" }}>
        <div>
          <h3 className={styles.tableTitle}>In-App Notifications & Banners</h3>
          <p className={styles.tableSubtitle}>
            Live notice bell cards & warning banners rendered directly inside merchant admin dashboards with target scoping.
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={onOpenCreate}>
          + Create In-App Notice
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Notice Title & Message</th>
              <th>Severity</th>
              <th>Target Audience</th>
              <th>Status</th>
              <th>Expires At</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                  No active in-app notices created. Click "+ Create In-App Notice" to push alerts to merchant admins.
                </td>
              </tr>
            ) : (
              notices.map((n) => (
                <tr key={n._id}>
                  <td style={{ maxWidth: "320px" }}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{n.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#4b5563" }}>{n.message}</div>
                    {n.actionLabel && (
                      <span style={{ fontSize: "0.75rem", color: "#2563eb", textDecoration: "underline", display: "inline-block", marginTop: "4px" }}>
                        Action: {n.actionLabel} ({n.actionUrl || "#"})
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={styles.tableBadge}
                      style={{
                        background:
                          n.type === "critical"
                            ? "#fee2e2"
                            : n.type === "warning"
                            ? "#fef3c7"
                            : "#e0e7ff",
                        color:
                          n.type === "critical"
                            ? "#991b1b"
                            : n.type === "warning"
                            ? "#92400e"
                            : "#3730a3"
                      }}
                    >
                      {n.type.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={styles.tableBadge} style={{ background: "#f3f4f6", color: "#374151" }}>
                      Plan: {n.targetPlan}
                    </span>
                  </td>
                  <td>
                    <span
                      className={styles.tableBadge}
                      style={{
                        background: n.status === "active" ? "#dcfce7" : "#f3f4f6",
                        color: n.status === "active" ? "#166534" : "#374151"
                      }}
                    >
                      {n.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      {n.expiresAt ? new Date(n.expiresAt).toLocaleDateString() : "Never"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className={styles.btnSecondary}
                      style={{ padding: "4px 10px", fontSize: "0.8rem", color: "#dc2626" }}
                      onClick={() => onDelete(n._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
