"use client";

import React from "react";
import styles from "../../page.module.css";

interface AnalyticsControlsProps {
  reportGroup: string;
  setReportGroup: (group: any) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  onExportCsv: () => void;
  onOpenScheduleModal: () => void;
}

export default function AnalyticsControls({
  reportGroup,
  setReportGroup,
  dateRange,
  setDateRange,
  selectedPlan,
  setSelectedPlan,
  selectedCountry,
  setSelectedCountry,
  onExportCsv,
  onOpenScheduleModal
}: AnalyticsControlsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* ── Report Group Sub-Navigation ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "12px",
          overflowX: "auto"
        }}
      >
        {[
          { id: "revenue", label: "💰 Revenue BI (MRR/ARR)" },
          { id: "growth", label: "📈 Growth & Conversions" },
          { id: "retention", label: "🔄 Retention & Cohorts" },
          { id: "merchant_success", label: "🛒 Merchant GMV" },
          { id: "funnel", label: "🔻 Funnel BI" },
          { id: "usage", label: "⚡ Usage & Quotas" },
          { id: "performance", label: "⏱️ Store Performance" },
          { id: "geography", label: "🌍 Geography & Map" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportGroup(tab.id)}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              border: "none",
              backgroundColor: reportGroup === tab.id ? "#111827" : "transparent",
              color: reportGroup === tab.id ? "#ffffff" : "#4b5563",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Filter Bar & Actions ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          background: "#f9fafb",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4b5563", display: "block" }}>Date Range</label>
            <select
              className={styles.sidebarSearchInput}
              style={{ padding: "4px 8px", fontSize: "0.8rem" }}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4b5563", display: "block" }}>Segment Plan</label>
            <select
              className={styles.sidebarSearchInput}
              style={{ padding: "4px 8px", fontSize: "0.8rem" }}
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="all">All Plans</option>
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4b5563", display: "block" }}>Country</label>
            <select
              className={styles.sidebarSearchInput}
              style={{ padding: "4px 8px", fontSize: "0.8rem" }}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="all">All Countries</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={onExportCsv}>
            📥 Export CSV Report
          </button>
          <button className={styles.btnPrimary} style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={onOpenScheduleModal}>
            ⏰ Schedule Email Report
          </button>
        </div>
      </div>
    </div>
  );
}
