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
    <div className={styles.settingsSectionCard}>
      {/* Breadcrumb Header */}
      <div className={styles.settingsHorizontalHeader}>
        <button className={styles.settingsBreadcrumbBack}>
          <span style={{ color: "#6b7280", fontWeight: 400 }}>Analytics</span>
        </button>
        <span style={{ color: "#9ca3af", margin: "0 2px" }}>&rsaquo;</span>
        <span style={{ color: "#000000", fontWeight: 400 }}>
          {
            (
              {
                "revenue": "Revenue BI (MRR/ARR)",
                "growth": "Growth & Conversions",
                "retention": "Retention & Cohorts",
                "merchant_success": "Merchant GMV",
                "funnel": "Funnel BI",
                "usage": "Usage & Quotas",
                "performance": "Store Performance",
                "geography": "Geography & Map"
              } as Record<string, string>
            )[reportGroup] || "Overview"
          }
        </span>
      </div>

      {/* ── Report Group Sub-Navigation ── */}
      <div className={styles.settingsSubNavContainer} style={{ marginBottom: "16px" }}>
        <div className={styles.settingsHorizontalTabs}>
          {[
            { id: "revenue", label: "Revenue BI (MRR/ARR)" },
            { id: "growth", label: "Growth & Conversions" },
            { id: "retention", label: "Retention & Cohorts" },
            { id: "merchant_success", label: "Merchant GMV" },
            { id: "funnel", label: "Funnel BI" },
            { id: "usage", label: "Usage & Quotas" },
            { id: "performance", label: "Store Performance" },
            { id: "geography", label: "Geography & Map" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportGroup(tab.id)}
              className={`${styles.settingsHorizontalTab} ${reportGroup === tab.id ? styles.settingsHorizontalTabActive : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
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
