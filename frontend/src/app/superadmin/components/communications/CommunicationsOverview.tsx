"use client";

import React from "react";
import styles from "../../page.module.css";
import { OverviewStatsData } from "../communicationsTypes";

interface CommunicationsOverviewProps {
  stats: OverviewStatsData | null;
}

export default function CommunicationsOverview({ stats }: CommunicationsOverviewProps) {
  if (!stats) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
      <div className={styles.tableCard} style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 500 }}>Overall Delivery Rate</div>
        <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#059669", marginTop: "4px" }}>
          {stats.deliveryRate}%
        </div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px" }}>
          {stats.totalDeliveredLogs} delivered / {stats.totalFailedLogs} failed
        </div>
      </div>

      <div className={styles.tableCard} style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 500 }}>Email Templates</div>
        <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#4f46e5", marginTop: "4px" }}>
          {stats.templatesCount}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px" }}>
          Categories: Welcome, Trial, Invoices & more
        </div>
      </div>

      <div className={styles.tableCard} style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 500 }}>Active In-App Notices</div>
        <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#d97706", marginTop: "4px" }}>
          {stats.activeNoticesCount}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px" }}>
          Active merchant dashboard alerts
        </div>
      </div>

      <div className={styles.tableCard} style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 500 }}>Automations Active</div>
        <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#2563eb", marginTop: "4px" }}>
          {stats.automationsCount}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px" }}>
          Trial nudge, 7d inactive & payment failure
        </div>
      </div>

      <div className={styles.tableCard} style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 500 }}>Open Support Tickets</div>
        <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#dc2626", marginTop: "4px" }}>
          {stats.openTicketsCount}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px" }}>
          Merchant inbox tickets requiring reply
        </div>
      </div>
    </div>
  );
}
