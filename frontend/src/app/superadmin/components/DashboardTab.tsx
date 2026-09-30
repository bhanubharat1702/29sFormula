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
            background: "rgba(234, 179, 8, 0.08)",
            border: "1px solid rgba(234, 179, 8, 0.25)",
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
                color: "#1e1e2d",
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
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#fef08a" }}>
                Action Required
              </div>
              <div style={{ fontSize: "13px", color: "#cbd5e1" }}>
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
                  background: "#eab308",
                  color: "#0f172a",
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
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
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
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(79, 70, 229, 0.05) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "12px", color: "#a5b4fc", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Monthly Recurring Revenue (MRR)
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginTop: "8px" }}>
            ${mrr.toLocaleString()}
          </div>
          <div style={{ fontSize: "12px", color: "#818cf8", marginTop: "4px" }}>
            Annualized (ARR): <strong>${arr.toLocaleString()}</strong>
          </div>
        </div>

        {/* Active Merchants Card */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.05) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Active Merchants
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginTop: "8px" }}>
            {activeStores}{" "}
            <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 400 }}>
              / {totalStores} Total
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#34d399", marginTop: "4px" }}>
            Active Rate: {totalStores > 0 ? Math.round((activeStores / totalStores) * 100) : 100}%
          </div>
        </div>

        {/* Platform Orders Card */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.05) 100%)",
            border: "1px solid rgba(59, 130, 246, 0.25)",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "12px", color: "#93c5fd", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Platform Orders
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginTop: "8px" }}>
            {totalOrders.toLocaleString()}
          </div>
          <div style={{ fontSize: "12px", color: "#60a5fa", marginTop: "4px" }}>
            GMV Volume: <strong>${totalRevenue.toLocaleString()}</strong>
          </div>
        </div>

        {/* System Status Card */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(147, 51, 234, 0.05) 100%)",
            border: "1px solid rgba(168, 85, 247, 0.25)",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "12px", color: "#c084fc", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Platform Infrastructure
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#4ade80", marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>
            {systemHealth.api}
          </div>
          <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "4px" }}>
            Database: {systemHealth.database} • Storage: {systemHealth.storage}
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div
        style={{
          background: "rgba(30, 41, 59, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#f8fafc" }}>
          🚀 Quick Shortcuts
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button
            onClick={onOpenCreateModal}
            style={{
              padding: "8px 16px",
              background: "#6366f1",
              color: "#fff",
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
              background: "rgba(255,255,255,0.06)",
              color: "#e2e8f0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              fontWeight: 500,
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
              background: "rgba(255,255,255,0.06)",
              color: "#e2e8f0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              fontWeight: 500,
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
              background: "rgba(255,255,255,0.06)",
              color: "#e2e8f0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              fontWeight: 500,
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
            background: "rgba(30, 41, 59, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                Recent Merchant Stores
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                Latest active stores registered on platform
              </div>
            </div>
            <button
              onClick={() => setActiveTab("stores")}
              style={{
                padding: "6px 12px",
                background: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.3)",
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
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                  <th style={{ padding: "10px", color: "#94a3b8", fontWeight: 600 }}>Store</th>
                  <th style={{ padding: "10px", color: "#94a3b8", fontWeight: 600 }}>Plan</th>
                  <th style={{ padding: "10px", color: "#94a3b8", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "10px", color: "#94a3b8", fontWeight: 600, textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentStores.map((store) => (
                  <tr
                    key={store._id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ fontWeight: 600, color: "#f8fafc" }}>{store.name}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{store.subdomain}.yourdomain.com</div>
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
                              ? "rgba(168, 85, 247, 0.2)"
                              : store.plan === "starter"
                              ? "rgba(59, 130, 246, 0.2)"
                              : "rgba(99, 102, 241, 0.2)",
                          color:
                            store.plan === "enterprise"
                              ? "#c084fc"
                              : store.plan === "starter"
                              ? "#60a5fa"
                              : "#818cf8",
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
                          background: store.isActive !== false ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: store.isActive !== false ? "#34d399" : "#f87171",
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
                          background: "rgba(255,255,255,0.08)",
                          color: "#cbd5e1",
                          border: "1px solid rgba(255,255,255,0.12)",
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
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#94a3b8",
            }}
          >
            <span>Plan Distribution:</span>
            <span style={{ color: "#e2e8f0" }}>
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
            background: "rgba(30, 41, 59, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                Live Security & Audit Feed
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                Recent administrative compliance activities
              </div>
            </div>
            <button
              onClick={() => setActiveTab("audit-log")}
              style={{
                padding: "6px 12px",
                background: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.3)",
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
                    background: "rgba(15, 23, 42, 0.4)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <span style={{ fontWeight: 600, color: "#f8fafc" }}>
                      {log.adminUser || log.adminEmail || "Super Admin"}
                    </span>
                    <span style={{ color: "#64748b" }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "Just now"}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#cbd5e1" }}>
                    {log.action} {log.target ? `• ${log.target}` : ""}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "24px",
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "13px",
                  background: "rgba(15, 23, 42, 0.3)",
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
