"use client";

import React from "react";
import styles from "../../page.module.css";
import { BillingOverviewData } from "../billingTypes";

interface BillingOverviewProps {
  overview: BillingOverviewData | null;
}

export default function BillingOverview({ overview }: BillingOverviewProps) {
  if (!overview) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Monthly Recurring Revenue (MRR)</div>
          <div className={styles.statValue}>${overview.mrr.toLocaleString()}</div>
          <div className={styles.statSubtext} style={{ color: "#059669" }}>
            ARR: ${(overview.arr).toLocaleString()} / yr
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Net Revenue This Month</div>
          <div className={styles.statValue}>${overview.revenueThisMonth.toLocaleString()}</div>
          <div className={styles.statSubtext}>NRR Retention: {overview.netRevenueRetention}%</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Outstanding Invoices</div>
          <div className={styles.statValue} style={{ color: "#d97706" }}>
            ${overview.outstandingAmount.toLocaleString()}
          </div>
          <div className={styles.statSubtext}>Pending collector payouts</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Failed Payment Retries</div>
          <div className={styles.statValue} style={{ color: "#dc2626" }}>
            {overview.failedPaymentsCount}
          </div>
          <div className={styles.statSubtext}>Dunning auto-retry active</div>
        </div>
      </div>

      <div className={styles.tableCard} style={{ padding: "20px" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px", color: "#111827" }}>
          Subscription Status Breakdown
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
          <div style={{ padding: "16px", background: "#f0fdf4", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#166534" }}>
              {overview.subscriptionStats.active}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#15803d", fontWeight: 600 }}>Active Paid</div>
          </div>

          <div style={{ padding: "16px", background: "#eff6ff", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e40af" }}>
              {overview.subscriptionStats.trialing}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#1d4ed8", fontWeight: 600 }}>Free Trial</div>
          </div>

          <div style={{ padding: "16px", background: "#fffbeb", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#b45309" }}>
              {overview.subscriptionStats.pastDue}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#d97706", fontWeight: 600 }}>Past Due (Grace)</div>
          </div>

          <div style={{ padding: "16px", background: "#fef2f2", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#991b1b" }}>
              {overview.subscriptionStats.suspended}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#dc2626", fontWeight: 600 }}>Suspended</div>
          </div>

          <div style={{ padding: "16px", background: "#f3f4f6", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#4b5563" }}>
              {overview.subscriptionStats.canceled}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 600 }}>Canceled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
