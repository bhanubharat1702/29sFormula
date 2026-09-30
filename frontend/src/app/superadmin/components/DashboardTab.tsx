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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            padding: "16px 20px",
            background: "#fefce8",
            border: "1px solid #fde047",
            borderRadius: "12px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#854d0e" }}>
                Action Required
              </div>
              <div style={{ fontSize: "13px", color: "#a16207" }}>
                {pendingDemo > 0 && `${pendingDemo} pending sales demo lead(s) awaiting response. `}
                {pendingDomains > 0 && `${pendingDomains} custom domain DNS setup(s) pending verification.`}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {pendingDemo > 0 && (
              <button
                onClick={() => setActiveTab("demo-requests")}
                style={{
                  padding: "8px 14px",
                  background: "#ca8a04",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Review Leads ({pendingDemo})
              </button>
            )}
            {pendingDomains > 0 && (
              <button
                onClick={() => setActiveTab("domains")}
                style={{
                  padding: "8px 14px",
                  background: "#ffffff",
                  color: "#854d0e",
                  border: "1px solid #fde047",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Inspect Domains ({pendingDomains})
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Executive KPI Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {/* MRR Card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e0e7ff",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ fontSize: "12px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Monthly Recurring Revenue (MRR)
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginTop: "8px" }}>
            ${mrr.toLocaleString()}
          </div>
          <div style={{ fontSize: "12px", color: "#6366f1", marginTop: "4px", fontWeight: 500 }}>
            Annualized (ARR): <strong>${arr.toLocaleString()}</strong>
          </div>
        </div>

        {/* Active Merchants Card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #bbf7d0",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ fontSize: "12px", color: "#15803d", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Active Merchants
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginTop: "8px" }}>
            {activeStores}{" "}
            <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: 400 }}>
              / {totalStores} Total
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "4px", fontWeight: 500 }}>
            Active Rate: {totalStores > 0 ? Math.round((activeStores / totalStores) * 100) : 100}%
          </div>
        </div>

        {/* Platform Orders Card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ fontSize: "12px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Platform Orders
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginTop: "8px" }}>
            {totalOrders.toLocaleString()}
          </div>
          <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "4px", fontWeight: 500 }}>
            GMV Volume: <strong>${totalRevenue.toLocaleString()}</strong>
          </div>
        </div>

        {/* System Status Card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e9d5ff",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ fontSize: "12px", color: "#7e22ce", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Platform Infrastructure
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#16a34a", marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }}></span>
            {systemHealth.api}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
            Database: {systemHealth.database} • Storage: {systemHealth.storage}
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
          🚀 Quick Shortcuts
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button
            onClick={onOpenCreateModal}
            style={{
              padding: "8px 16px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            + Create New Store
          </button>
          <button
            onClick={() => setActiveTab("communications")}
            style={{
              padding: "8px 16px",
              background: "#f9fafb",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            📢 Send Broadcast Email
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            style={{
              padding: "8px 16px",
              background: "#f9fafb",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            💳 Invoices & Billing
          </button>
          <button
            onClick={() => setActiveTab("audit-log")}
            style={{
              padding: "8px 16px",
              background: "#f9fafb",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            🛡️ Audit Log
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
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>
                Recent Merchant Stores
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Latest active stores registered on platform
              </div>
            </div>
            <button
              onClick={() => setActiveTab("stores")}
              style={{
                padding: "6px 12px",
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View All Stores ({totalStores}) →
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", textAlign: "left", background: "#f9fafb" }}>
                  <th style={{ padding: "10px", color: "#4b5563", fontWeight: 600 }}>Store</th>
                  <th style={{ padding: "10px", color: "#4b5563", fontWeight: 600 }}>Plan</th>
                  <th style={{ padding: "10px", color: "#4b5563", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "10px", color: "#4b5563", fontWeight: 600, textAlign: "right" }}>Action</th>
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
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ fontWeight: 600, color: "#111827" }}>{store.name}</div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>{store.subdomain}.localhost:3000</div>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
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
                    <td style={{ padding: "12px 10px" }}>
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
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      <button
                        onClick={() => onSelectStore(store)}
                        style={{
                          padding: "4px 10px",
                          background: "#f9fafb",
                          color: "#374151",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
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
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>
                Live Security & Audit Feed
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Recent administrative compliance activities
              </div>
            </div>
            <button
              onClick={() => setActiveTab("audit-log")}
              style={{
                padding: "6px 12px",
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
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
