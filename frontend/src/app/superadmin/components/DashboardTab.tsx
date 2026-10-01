"use client";

import React from "react";
import styles from "../page.module.css";
import { Stats, StoreItem } from "./types";

interface DashboardTabProps {
  stats: Stats | null;
  stores: StoreItem[];
  setActiveTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  onSelectStore: (store: StoreItem) => void;
}

export default function DashboardTab({
  stats,
  stores,
  setActiveTab,
  onOpenCreateModal,
  onSelectStore,
}: DashboardTabProps) {
  const mrr = stats?.mrr ?? 0;
  const arr = stats?.arr ?? (mrr * 12);
  const totalStores = stats?.totalStores ?? stores.length;
  const activeStores = stats?.activeStores ?? stores.filter((s) => s.isActive !== false).length;
  const totalOrders = stats?.totalOrders ?? 0;
  const totalRevenue = stats?.totalRevenue ?? 0;
  const pendingDemo = stats?.pendingDemoRequests ?? 0;
  const pendingDomains = stats?.pendingDomains ?? 0;
  const recentLogs = stats?.recentLogs ?? [];
  const planCounts = stats?.planCounts ?? { starter: 0, pro: 0, enterprise: 0 };
  const systemHealth = stats?.systemHealth ?? {
    database: "Healthy",
    api: "Operational",
    storage: "Healthy",
    uptimeSeconds: 3600,
  };

  const recentStores = stores
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Action Alerts / Urgent Banners */}
      {(pendingDemo > 0 || pendingDomains > 0) && (
        <div className={styles.settingsSectionCard} style={{ background: "#fefce8", borderColor: "#fde047" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#eab308",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "18px",
                  flexShrink: 0
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#854d0e" }}>
                  Action Required
                </div>
                <div style={{ fontSize: "13px", color: "#a16207", marginTop: "2px" }}>
                  {pendingDemo > 0 && `${pendingDemo} pending sales demo lead(s) awaiting response. `}
                  {pendingDomains > 0 && `${pendingDomains} custom domain DNS setup(s) pending verification.`}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {pendingDemo > 0 && (
                <button
                  onClick={() => setActiveTab("demo-requests")}
                  className={styles.btnPrimary}
                  style={{ background: "#ca8a04", borderColor: "#ca8a04", padding: "7px 14px", fontSize: "12px" }}
                >
                  Review Leads ({pendingDemo})
                </button>
              )}
              {pendingDomains > 0 && (
                <button
                  onClick={() => setActiveTab("domains")}
                  className={styles.btnSecondary}
                  style={{ color: "#854d0e", borderColor: "#fde047", padding: "7px 14px", fontSize: "12px" }}
                >
                  Inspect Domains ({pendingDomains})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Executive KPI Summary Cards */}
      <div className={styles.statsGrid}>
        {/* MRR Card */}
        <div className={styles.settingsSectionCard} style={{ borderColor: "#e0e7ff" }}>
          <div style={{ fontSize: "0.78rem", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Monthly Recurring Revenue (MRR)
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0c0a09", marginTop: "6px", letterSpacing: "-0.02em" }}>
            ${mrr.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#6366f1", marginTop: "4px", fontWeight: 500 }}>
            Annualized (ARR): <strong>${arr.toLocaleString()}</strong>
          </div>
        </div>

        {/* Active Merchants Card */}
        <div className={styles.settingsSectionCard} style={{ borderColor: "#bbf7d0" }}>
          <div style={{ fontSize: "0.78rem", color: "#15803d", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Active Merchants
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0c0a09", marginTop: "6px", letterSpacing: "-0.02em" }}>
            {activeStores}{" "}
            <span style={{ fontSize: "0.88rem", color: "#6b7280", fontWeight: 400 }}>
              / {totalStores} Total
            </span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#16a34a", marginTop: "4px", fontWeight: 500 }}>
            Active Rate: {totalStores > 0 ? Math.round((activeStores / totalStores) * 100) : 100}%
          </div>
        </div>

        {/* Platform Orders Card */}
        <div className={styles.settingsSectionCard} style={{ borderColor: "#bfdbfe" }}>
          <div style={{ fontSize: "0.78rem", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Platform Orders
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0c0a09", marginTop: "6px", letterSpacing: "-0.02em" }}>
            {totalOrders.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#2563eb", marginTop: "4px", fontWeight: 500 }}>
            GMV Volume: <strong>${totalRevenue.toLocaleString()}</strong>
          </div>
        </div>

        {/* System Status Card */}
        <div className={styles.settingsSectionCard}>
          <div className={styles.settingsHeader} style={{ marginBottom: "10px", paddingBottom: "8px" }}>
            <h3 className={styles.settingsTitle} style={{ fontSize: "14px", color: "#7e22ce" }}>
              PLATFORM INFRASTRUCTURE
            </h3>
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#16a34a", marginTop: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }}></span>
            {systemHealth.api}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
            Database: {systemHealth.database} • Storage: {systemHealth.storage}
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className={styles.settingsSectionCard} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", padding: "16px 24px" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "18px", height: "18px", color: "#2563eb" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
          </svg>
          Quick Shortcuts
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button
            onClick={onOpenCreateModal}
            className={styles.btnPrimary}
            style={{ padding: "8px 16px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create New Store
          </button>
          <button
            onClick={() => setActiveTab("communications")}
            className={styles.btnSecondary}
            style={{ padding: "8px 16px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "15px", height: "15px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            Send Broadcast Email
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={styles.btnSecondary}
            style={{ padding: "8px 16px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "15px", height: "15px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25h-15a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            Invoices & Billing
          </button>
          <button
            onClick={() => setActiveTab("audit-log")}
            className={styles.btnSecondary}
            style={{ padding: "8px 16px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "15px", height: "15px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801-1.25c.028-.392.35-.746.78-.746h2.c.43 0 .752.354.78.746m-3.41 1.25c.028-.392.35-.746.78-.746M12 2.25h.008v.008H12V2.25Zm-5.69 2.192C5.18 4.534 4.5 5.519 4.5 6.708v11.835A2.25 2.25 0 0 0 6.75 20.82h10.5a2.25 2.25 0 0 0 2.25-2.25V6.708c0-1.189-.68-2.174-1.81-2.266m-10.74 0A48.581 48.581 0 0 0 3 4.5" />
            </svg>
            Audit Log
          </button>
        </div>
      </div>

      {/* 4. Main Grid: Recent Merchants & Subscriptions vs Audit Feed & Infrastructure */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Left Column: Recent Merchants */}
        <div className={styles.settingsSectionCard} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className={styles.settingsHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "none", paddingBottom: 0 }}>
            <div>
              <h3 className={styles.settingsTitle}>Recent Merchant Stores</h3>
              <p className={styles.settingsSub} style={{ margin: 0 }}>
                Latest active stores registered on platform
              </p>
            </div>
            <button
              onClick={() => setActiveTab("stores")}
              className={styles.btnSecondary}
              style={{ padding: "6px 12px", fontSize: "12px", background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}
            >
              View All Stores ({totalStores}) →
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", textAlign: "left", background: "#f9fafb" }}>
                  <th style={{ padding: "10px 12px", color: "#4b5563", fontWeight: 600 }}>Store</th>
                  <th style={{ padding: "10px 12px", color: "#4b5563", fontWeight: 600 }}>Plan</th>
                  <th style={{ padding: "10px 12px", color: "#4b5563", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "10px 12px", color: "#4b5563", fontWeight: 600, textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentStores.map((store) => (
                  <tr
                    key={store._id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: 600, color: "#111827" }}>{store.name}</div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>{store.subdomain}.localhost:3000</div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          background:
                            store.plan === "enterprise"
                              ? "#faf5ff"
                              : store.plan === "starter"
                              ? "#eff6ff"
                              : "#f0fdf4",
                          color:
                            store.plan === "enterprise"
                              ? "#7e22ce"
                              : store.plan === "starter"
                              ? "#1d4ed8"
                              : "#15803d",
                          border: `1px solid ${
                            store.plan === "enterprise"
                              ? "#e9d5ff"
                              : store.plan === "starter"
                              ? "#bfdbfe"
                              : "#bbf7d0"
                          }`
                        }}
                      >
                        {store.plan || "Pro"}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: store.isActive !== false ? "#f0fdf4" : "#fef2f2",
                          color: store.isActive !== false ? "#16a34a" : "#dc2626",
                          border: `1px solid ${store.isActive !== false ? "#bbf7d0" : "#fecaca"}`
                        }}
                      >
                        {store.isActive !== false ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <button
                        onClick={() => onSelectStore(store)}
                        className={styles.btnSecondary}
                        style={{ padding: "4px 10px", fontSize: "12px" }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Plan Distribution Breakdown */}
          <div
            style={{
              paddingTop: "12px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            <span>Plan Distribution:</span>
            <span style={{ color: "#111827", fontWeight: 500 }}>
              Starter: <strong>{planCounts.starter || 0}</strong> • Pro: <strong>{planCounts.pro || 0}</strong> • Enterprise: <strong>{planCounts.enterprise || 0}</strong>
              {(planCounts.custom ?? 0) > 0 && (
                <> • Custom: <strong>{planCounts.custom}</strong></>
              )}
            </span>
          </div>
        </div>

        {/* Right Column: Live Audit Activity Feed */}
        <div className={styles.settingsSectionCard} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className={styles.settingsHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "none", paddingBottom: 0 }}>
            <div>
              <h3 className={styles.settingsTitle}>Live Security & Audit Feed</h3>
              <p className={styles.settingsSub} style={{ margin: 0 }}>
                Recent administrative compliance activities
              </p>
            </div>
            <button
              onClick={() => setActiveTab("audit-log")}
              className={styles.btnSecondary}
              style={{ padding: "6px 12px", fontSize: "12px", background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}
            >
              Full Log →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentLogs.length > 0 ? (
              recentLogs.map((log, idx) => (
                <div
                  key={log._id || idx}
                  style={{
                    padding: "12px 14px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <span style={{ fontWeight: 600, color: "#111827" }}>
                      {log.adminUser || log.adminEmail || "Super Admin"}
                    </span>
                    <span style={{ color: "#6b7280" }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "Just now"}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#374151" }}>
                    {log.action} {log.target ? `• ${log.target}` : ""}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "24px",
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: "13px",
                  background: "#f9fafb",
                  border: "1px dashed #d1d5db",
                  borderRadius: "8px",
                }}
              >
                No recent audit events logged. Platform operating normally.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
