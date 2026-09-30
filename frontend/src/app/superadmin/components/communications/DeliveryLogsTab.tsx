"use client";

import React from "react";
import styles from "../../page.module.css";
import { DeliveryLogItem } from "../communicationsTypes";

interface DeliveryLogsTabProps {
  logs: DeliveryLogItem[];
  statusFilter: string;
  setStatusFilter: (st: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onResend: (id: string) => void;
}

export default function DeliveryLogsTab({
  logs,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onResend
}: DeliveryLogsTabProps) {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeaderRow} style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 className={styles.tableTitle}>Communication Delivery Logs</h3>
          <p className={styles.tableSubtitle}>
            Full audit log of every email, in-app alert, broadcast, and automation attempt with delivery status & retry controls.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            className={styles.formInput}
            placeholder="Search email, store, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "240px" }}
          />

          <select
            className={styles.formInput}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "140px" }}
          >
            <option value="all">All Statuses</option>
            <option value="delivered">Delivered</option>
            <option value="sent">Sent</option>
            <option value="bounced">Bounced</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Recipient / Merchant Store</th>
              <th>Category & Channel</th>
              <th>Subject Line</th>
              <th>Delivery Status</th>
              <th>Retries</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                  No delivery logs matching current filter.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id}>
                  <td>
                    <span style={{ fontSize: "0.8rem", color: "#4b5563" }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{log.recipientEmail}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{log.storeName || "Platform"}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <span className={styles.tableBadge} style={{ background: "#e0e7ff", color: "#3730a3" }}>
                        {log.category}
                      </span>
                      <span className={styles.tableBadge} style={{ background: "#f3f4f6", color: "#374151" }}>
                        {log.channel}
                      </span>
                    </div>
                  </td>
                  <td style={{ maxWidth: "260px" }}>
                    <div style={{ fontSize: "0.85rem", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {log.subject}
                    </div>
                    {log.errorMessage && (
                      <div style={{ fontSize: "0.75rem", color: "#dc2626" }}>Error: {log.errorMessage}</div>
                    )}
                  </td>
                  <td>
                    <span
                      className={styles.tableBadge}
                      style={{
                        background:
                          log.status === "delivered" || log.status === "sent"
                            ? "#dcfce7"
                            : log.status === "bounced"
                            ? "#fef3c7"
                            : "#fee2e2",
                        color:
                          log.status === "delivered" || log.status === "sent"
                            ? "#166534"
                            : log.status === "bounced"
                            ? "#92400e"
                            : "#991b1b"
                      }}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.85rem", color: "#374151" }}>{log.retries}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {log.status !== "delivered" && (
                      <button
                        className={styles.btnSecondary}
                        style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                        onClick={() => onResend(log._id)}
                      >
                        Resend
                      </button>
                    )}
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
