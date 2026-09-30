"use client";

import React from "react";
import styles from "../../page.module.css";

interface AnalyticsReportsViewProps {
  data: any;
  reportGroup: string;
}

export default function AnalyticsReportsView({ data, reportGroup }: AnalyticsReportsViewProps) {
  if (!data) {
    return (
      <div className={styles.tableCard} style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
        No analytics records found for this criteria.
      </div>
    );
  }

  // 1. REVENUE BI VIEW
  if (reportGroup === "revenue") {
    const { mrrMovement, arpu, ltv, revenueByPlan, revenueByCountry } = data;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>New MRR Added</div>
            <div className={styles.statValue} style={{ color: "#059669" }}>+${mrrMovement?.newMrr || 0}</div>
            <div className={styles.statSubtext}>Expansion: +${mrrMovement?.expansionMrr || 0}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>MRR Churn & Contraction</div>
            <div className={styles.statValue} style={{ color: "#dc2626" }}>-${mrrMovement?.churnMrr || 0}</div>
            <div className={styles.statSubtext}>Contraction: -${mrrMovement?.contractionMrr || 0}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>ARPU (Avg Revenue Per User)</div>
            <div className={styles.statValue}>${arpu || 0}</div>
            <div className={styles.statSubtext}>Monthly per store average</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>LTV (Customer Lifetime Value)</div>
            <div className={styles.statValue} style={{ color: "#2563eb" }}>${ltv || 0}</div>
            <div className={styles.statSubtext}>Estimated lifetime value</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className={styles.tableCard} style={{ padding: "20px" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>Revenue Breakdown by Plan</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Plan Tier</th>
                  <th>Merchants</th>
                  <th>MRR Contribution</th>
                </tr>
              </thead>
              <tbody>
                {(revenueByPlan || []).map((item: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, textTransform: "uppercase" }}>{item.plan}</td>
                    <td>{item.count} Stores</td>
                    <td style={{ fontWeight: 700, color: "#111827" }}>${item.mrr} / mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tableCard} style={{ padding: "20px" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>Revenue by Country</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Revenue</th>
                  <th>Share (%)</th>
                </tr>
              </thead>
              <tbody>
                {(revenueByCountry || []).map((item: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{item.country}</td>
                    <td style={{ fontWeight: 700 }}>${item.revenue}</td>
                    <td>{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 2. GROWTH & CONVERSIONS VIEW
  if (reportGroup === "growth") {
    const { signups, trialToPaidConversionRate, activationRate } = data;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>New Merchant Signups</div>
            <div className={styles.statValue}>{signups || 0}</div>
            <div className={styles.statSubtext}>Trial registrations</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Trial → Paid Conversion Rate</div>
            <div className={styles.statValue} style={{ color: "#059669" }}>{trialToPaidConversionRate || 0}%</div>
            <div className={styles.statSubtext}>Trial end conversion speed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>First Product Added Rate</div>
            <div className={styles.statValue}>{activationRate?.firstProductAddedPercent || 0}%</div>
            <div className={styles.statSubtext}>Store setup completion</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>First Order Received Rate</div>
            <div className={styles.statValue} style={{ color: "#2563eb" }}>{activationRate?.firstOrderReceivedPercent || 0}%</div>
            <div className={styles.statSubtext}>Activated selling merchants</div>
          </div>
        </div>
      </div>
    );
  }

  // 3. RETENTION & COHORTS VIEW
  if (reportGroup === "retention") {
    const { logoChurnRate, revenueChurnRate, cancellationReasons, cohortRetention } = data;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Logo Churn Rate</div>
            <div className={styles.statValue} style={{ color: "#dc2626" }}>{logoChurnRate}%</div>
            <div className={styles.statSubtext}>Canceled merchants / mo</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Net Revenue Churn</div>
            <div className={styles.statValue} style={{ color: "#d97706" }}>{revenueChurnRate}%</div>
            <div className={styles.statSubtext}>Revenue lost from churn</div>
          </div>
        </div>

        <div className={styles.tableCard} style={{ padding: "20px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>Cohort Retention Table (% Stores Retained)</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cohort Month</th>
                <th>Initial Stores</th>
                <th>Month 1</th>
                <th>Month 2</th>
                <th>Month 3</th>
                <th>Month 4</th>
              </tr>
            </thead>
            <tbody>
              {(cohortRetention || []).map((row: any, i: number) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{row.cohort}</td>
                  <td>{row.size} Stores</td>
                  <td><span style={{ padding: "2px 6px", background: "#dcfce7", borderRadius: "4px" }}>{row.m1}%</span></td>
                  <td><span style={{ padding: "2px 6px", background: "#dcfce7", borderRadius: "4px" }}>{row.m2}%</span></td>
                  <td><span style={{ padding: "2px 6px", background: "#e0e7ff", borderRadius: "4px" }}>{row.m3}%</span></td>
                  <td><span style={{ padding: "2px 6px", background: "#e0e7ff", borderRadius: "4px" }}>{row.m4}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 4. MERCHANT SUCCESS & GMV
  if (reportGroup === "merchant_success") {
    const { totalGmv, totalPlatformOrders, avgStoreRevenue, topCategories } = data;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Total Gross Merchandise Value (GMV)</div>
            <div className={styles.statValue} style={{ color: "#059669" }}>${(totalGmv || 0).toLocaleString()}</div>
            <div className={styles.statSubtext}>Platform-wide sales Volume</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Total Platform Orders</div>
            <div className={styles.statValue}>{(totalPlatformOrders || 0).toLocaleString()}</div>
            <div className={styles.statSubtext}>Successful checkouts</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Average Revenue Per Store</div>
            <div className={styles.statValue}>${(avgStoreRevenue || 0).toLocaleString()}</div>
            <div className={styles.statSubtext}>Store GMV average</div>
          </div>
        </div>

        <div className={styles.tableCard} style={{ padding: "20px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>Top Product Categories Across Platform</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Category GMV</th>
                <th>Market Share (%)</th>
              </tr>
            </thead>
            <tbody>
              {(topCategories || []).map((cat: any, i: number) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{cat.category}</td>
                  <td style={{ fontWeight: 700 }}>${cat.gmv.toLocaleString()}</td>
                  <td>{cat.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 5. FUNNEL BI VIEW
  if (reportGroup === "funnel") {
    const { stages } = data;
    return (
      <div className={styles.tableCard} style={{ padding: "20px" }}>
        <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>Platform Conversion Funnel</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {(stages || []).map((stage: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", background: "#f9fafb", padding: "12px 16px", borderRadius: "8px" }}>
              <div style={{ width: "160px", fontWeight: 700, color: "#111827" }}>{stage.stage}</div>
              <div style={{ flex: 1, background: "#e5e7eb", height: "12px", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, stage.conversion * 3)}%`, background: "#2563eb", height: "100%" }} />
              </div>
              <div style={{ fontWeight: 700, minWidth: "100px", textAlign: "right" }}>{stage.count.toLocaleString()} count</div>
              <div style={{ fontSize: "0.85rem", color: "#059669", minWidth: "60px", textAlign: "right" }}>{stage.conversion}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. USAGE & PERFORMANCE & GEOGRAPHY DEFAULT RENDERING
  return (
    <div className={styles.tableCard} style={{ padding: "20px" }}>
      <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px", textTransform: "capitalize" }}>
        {reportGroup.replace("_", " ")} Report Data
      </h4>
      <pre style={{ background: "#f3f4f6", padding: "16px", borderRadius: "6px", fontSize: "0.85rem", overflowX: "auto" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
