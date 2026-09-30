import React from "react";
import styles from "../../page.module.css";
import { CrmAnalytics } from "../types";

interface DemoRequestsCrmHeaderProps {
  analytics: CrmAnalytics | null;
  viewMode: "kanban" | "table";
  setViewMode: (mode: "kanban" | "table") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStageFilter: string;
  setSelectedStageFilter: (stage: string) => void;
  selectedPriorityFilter: string;
  setSelectedPriorityFilter: (priority: string) => void;
  onExportCsv: () => void;
  onOpenCreateLeadModal: () => void;
}

export const DemoRequestsCrmHeader: React.FC<DemoRequestsCrmHeaderProps> = ({
  analytics,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  selectedStageFilter,
  setSelectedStageFilter,
  selectedPriorityFilter,
  setSelectedPriorityFilter,
  onExportCsv,
  onOpenCreateLeadModal
}) => {
  return (
    <div style={{ marginBottom: "20px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0c0a09", margin: 0 }}>
          🚀 Merchant Demo Requests & Pipeline CRM
        </h2>
      </div>

      {/* Metrics Banner */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "16px"
        }}
      >
        <div style={{ background: "#ffffff", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>Total Leads</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#111827", marginTop: "2px" }}>
            {analytics?.totalLeads ?? 0}
          </div>
        </div>

        <div style={{ background: "#ffffff", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>Conversion Rate</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
            {analytics?.conversionRate ?? 0}%
          </div>
        </div>

        <div style={{ background: "#ffffff", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>Avg Time to Convert</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#2563eb", marginTop: "2px" }}>
            {analytics?.avgTimeToConvertDays ?? 0} days
          </div>
        </div>

        <div style={{ background: "#ffffff", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#6b7280", fontWeight: 700 }}>Demo Scheduled</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#8b5cf6", marginTop: "2px" }}>
            {analytics?.demoScheduledCount ?? 0}
          </div>
        </div>

        <div
          style={{
            background: (analytics?.slaBreachesCount ?? 0) > 0 ? "#fef2f2" : "#ffffff",
            padding: "14px 16px",
            borderRadius: "12px",
            border: (analytics?.slaBreachesCount ?? 0) > 0 ? "1px solid #fecaca" : "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}
        >
          <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: (analytics?.slaBreachesCount ?? 0) > 0 ? "#991b1b" : "#6b7280", fontWeight: 700 }}>
            ⚠️ SLA Breaches (&gt;24h)
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: (analytics?.slaBreachesCount ?? 0) > 0 ? "#dc2626" : "#111827", marginTop: "2px" }}>
            {analytics?.slaBreachesCount ?? 0}
          </div>
        </div>
      </div>

      {/* Control & Toolbar Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          background: "#ffffff",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxSizing: "border-box"
        }}
      >
        {/* Left: View Switcher & Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", flex: "1 1 auto" }}>
          {/* View Mode Switcher */}
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "8px", padding: "2px" }}>
            <button
              onClick={() => setViewMode("kanban")}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                background: viewMode === "kanban" ? "#ffffff" : "transparent",
                color: viewMode === "kanban" ? "#0c0a09" : "#6b7280",
                fontWeight: viewMode === "kanban" ? 700 : 500,
                fontSize: "0.82rem",
                cursor: "pointer",
                boxShadow: viewMode === "kanban" ? "0 1px 2px rgba(0,0,0,0.05)" : "none"
              }}
            >
              📊 Kanban Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                background: viewMode === "table" ? "#ffffff" : "transparent",
                color: viewMode === "table" ? "#0c0a09" : "#6b7280",
                fontWeight: viewMode === "table" ? 700 : 500,
                fontSize: "0.82rem",
                cursor: "pointer",
                boxShadow: viewMode === "table" ? "0 1px 2px rgba(0,0,0,0.05)" : "none"
              }}
            >
              📋 Table View
            </button>
          </div>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Search leads, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.input}
            style={{ width: "220px", padding: "6px 12px", fontSize: "0.84rem" }}
          />

          {/* Stage Filter */}
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className={styles.input}
            style={{ padding: "6px 10px", fontSize: "0.84rem" }}
          >
            <option value="all">All Stages</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Demo Scheduled">Demo Scheduled</option>
            <option value="Demo Done">Demo Done</option>
            <option value="Trial Started">Trial Started</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className={styles.input}
            style={{ padding: "6px 10px", fontSize: "0.84rem" }}
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent 🔥</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Right: Export & Add Lead Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <button
            onClick={onExportCsv}
            className={styles.btnAction}
            style={{ background: "#f3f4f6", color: "#374151", fontWeight: 600, padding: "8px 14px" }}
          >
            📥 Export CSV
          </button>
          <button
            onClick={onOpenCreateLeadModal}
            className={styles.btnAction}
            style={{ background: "#0c0a09", color: "#ffffff", fontWeight: 700, padding: "8px 14px" }}
          >
            ➕ Add Lead
          </button>
        </div>
      </div>
    </div>
  );
};
