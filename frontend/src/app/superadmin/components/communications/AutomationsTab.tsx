"use client";

import React from "react";
import styles from "../../page.module.css";
import { AutomationRuleItem } from "../communicationsTypes";

interface AutomationsTabProps {
  automations: AutomationRuleItem[];
  onToggleEnabled: (key: string) => void;
  onTriggerTest: (key: string) => void;
}

export default function AutomationsTab({
  automations,
  onToggleEnabled,
  onTriggerTest
}: AutomationsTabProps) {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeaderRow} style={{ padding: "16px 20px" }}>
        <div>
          <h3 className={styles.tableTitle}>Automated Trigger Workflows</h3>
          <p className={styles.tableSubtitle}>
            Trigger → Action automated workflows (e.g. trial ends in 3 days → send email; 7 days inactive → nudge alert)
          </p>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Automation Rule</th>
              <th>Trigger Event</th>
              <th>Configured Action</th>
              <th>Channel</th>
              <th>Triggered Count</th>
              <th>State</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {automations.map((a) => (
              <tr key={a.key}>
                <td>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{a.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>key: {a.key}</div>
                </td>
                <td>
                  <span className={styles.tableBadge} style={{ background: "#fef3c7", color: "#92400e" }}>
                    ⚡ {a.trigger}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: "0.85rem", color: "#374151" }}>{a.action}</span>
                </td>
                <td>
                  <span className={styles.tableBadge} style={{ background: "#e0e7ff", color: "#3730a3" }}>
                    {a.channel.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: "#059669", fontSize: "0.9rem" }}>
                    {a.totalTriggered} times
                  </div>
                </td>
                <td>
                  <span
                    className={styles.tableBadge}
                    style={{
                      background: a.enabled ? "#dcfce7" : "#fee2e2",
                      color: a.enabled ? "#166534" : "#991b1b"
                    }}
                  >
                    {a.enabled ? "ACTIVE" : "DISABLED"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button
                      className={styles.btnSecondary}
                      style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                      onClick={() => onTriggerTest(a.key)}
                    >
                      Run Test Trigger
                    </button>
                    <button
                      className={styles.btnSecondary}
                      style={{
                        padding: "4px 10px",
                        fontSize: "0.8rem",
                        color: a.enabled ? "#dc2626" : "#059669"
                      }}
                      onClick={() => onToggleEnabled(a.key)}
                    >
                      {a.enabled ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
