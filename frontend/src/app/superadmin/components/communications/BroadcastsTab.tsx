"use client";

import React from "react";
import styles from "../../page.module.css";
import { BroadcastItem } from "../communicationsTypes";

interface BroadcastsTabProps {
  broadcasts: BroadcastItem[];
  onOpenCreate: () => void;
  onSendNow: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function BroadcastsTab({
  broadcasts,
  onOpenCreate,
  onSendNow,
  onDelete
}: BroadcastsTabProps) {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeaderRow} style={{ padding: "16px 20px" }}>
        <div>
          <h3 className={styles.tableTitle}>Broadcast Announcements</h3>
          <p className={styles.tableSubtitle}>
            Send platform news & maintenance alerts targeted by merchant plan, status, or region with open/click tracking.
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={onOpenCreate}>
          + New Broadcast
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title / Announcement</th>
              <th>Target Segment</th>
              <th>Status</th>
              <th>Sent / Delivered</th>
              <th>Open Rate</th>
              <th>Click Rate</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {broadcasts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                  No broadcasts created yet. Click "+ New Broadcast" to send platform announcements.
                </td>
              </tr>
            ) : (
              broadcasts.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{b.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Created: {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <span className={styles.tableBadge} style={{ background: "#f3f4f6", color: "#374151" }}>
                        Plan: {b.targetSegment.plan}
                      </span>
                      <span className={styles.tableBadge} style={{ background: "#f3f4f6", color: "#374151" }}>
                        Status: {b.targetSegment.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={styles.tableBadge}
                      style={{
                        background:
                          b.status === "sent"
                            ? "#dcfce7"
                            : b.status === "scheduled"
                            ? "#fef3c7"
                            : "#f3f4f6",
                        color:
                          b.status === "sent"
                            ? "#166534"
                            : b.status === "scheduled"
                            ? "#92400e"
                            : "#374151"
                      }}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.85rem", color: "#111827", fontWeight: 600 }}>
                      {b.deliveredCount} / {b.sentCount}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {b.sentAt ? `Sent ${new Date(b.sentAt).toLocaleTimeString()}` : "Not sent"}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.85rem", color: "#059669", fontWeight: 600 }}>
                      {b.openRate}%
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: 600 }}>
                      {b.clickRate}%
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      {b.status !== "sent" && (
                        <button
                          className={styles.btnPrimary}
                          style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                          onClick={() => onSendNow(b._id)}
                        >
                          Send Now
                        </button>
                      )}
                      <button
                        className={styles.btnSecondary}
                        style={{ padding: "4px 10px", fontSize: "0.8rem", color: "#dc2626" }}
                        onClick={() => onDelete(b._id)}
                      >
                        Delete
                      </button>
                    </div>
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
