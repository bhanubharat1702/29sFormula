"use client";

import React from "react";
import styles from "../../page.module.css";
import { UnsubscribedEmailItem } from "../communicationsTypes";

interface UnsubscribesTabProps {
  unsubscribes: UnsubscribedEmailItem[];
  onAddEmail: (email: string, reason: string) => void;
  onRemoveEmail: (email: string) => void;
}

export default function UnsubscribesTab({
  unsubscribes,
  onAddEmail,
  onRemoveEmail
}: UnsubscribesTabProps) {
  const [email, setEmail] = React.useState("");
  const [reason, setReason] = React.useState("Merchant requested opt-out");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Transactional Exemption Notice Banner */}
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "16px", borderRadius: "8px", display: "flex", gap: "12px", alignItems: "center" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#2563eb" style={{ width: "24px", height: "24px", flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <div style={{ fontSize: "0.85rem", color: "#1e3a8a" }}>
          <strong>Transactional Email Protection:</strong> Transactional emails (e.g. Invoices, Payment Failure alerts, Store Suspension notices, Domain verification) are critical for platform operation and are <strong>always delivered</strong> regardless of marketing opt-out preferences.
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow} style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 className={styles.tableTitle}>Unsubscribe & Opt-Out Management</h3>
            <p className={styles.tableSubtitle}>
              List of merchant email addresses that have opted out of marketing announcements and promotional broadcasts.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="email"
              className={styles.formInput}
              placeholder="Add merchant email to opt-out..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "240px" }}
            />
            <button
              className={styles.btnPrimary}
              onClick={() => {
                if (!email) return;
                onAddEmail(email, reason);
                setEmail("");
              }}
            >
              Add Opt-Out
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Unsubscribed Email</th>
                <th>Reason / Source</th>
                <th>Opt-Out Timestamp</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unsubscribes.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                    No merchant emails currently opted out.
                  </td>
                </tr>
              ) : (
                unsubscribes.map((item) => (
                  <tr key={item.email}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#111827" }}>{item.email}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.85rem", color: "#374151" }}>{item.reason}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {new Date(item.unsubscribedAt).toLocaleString()}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className={styles.btnSecondary}
                        style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                        onClick={() => onRemoveEmail(item.email)}
                      >
                        Remove Opt-Out
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
