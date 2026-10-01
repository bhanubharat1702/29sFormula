"use client";

import React, { useState, useEffect } from "react";
import styles from "../page.module.css";
import { AnalyticsReportGroup, SavedReportItem } from "./analyticsTypes";
import AnalyticsControls from "./analytics/AnalyticsControls";
import AnalyticsReportsView from "./analytics/AnalyticsReportsView";
import { ScheduleReportModal, SavedReportsList } from "./analytics/AnalyticsModals";

interface AnalyticsTabProps {
  token: string;
  onShowToast: (msg: string) => void;
  onUnauthorized?: () => void;
}

export default function AnalyticsTab({ token, onShowToast, onUnauthorized }: AnalyticsTabProps) {
  const [reportGroup, setReportGroup] = useState<
    "revenue" | "growth" | "retention" | "merchant_success" | "funnel" | "usage" | "performance" | "geography"
  >("revenue");

  const [dateRange, setDateRange] = useState("30d");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");

  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsReportGroup | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReportItem[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const getAuthHeaders = () => {
    const effectiveToken = token || (typeof window !== "undefined" ? localStorage.getItem("superAdminToken") : "") || "";
    return {
      Authorization: `Bearer ${effectiveToken}`,
      "Content-Type": "application/json"
    };
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const path = `/api/superadmin/analytics?group=${reportGroup}&dateRange=${dateRange}&plan=${selectedPlan}&country=${selectedCountry}`;
      let res = await fetch(path, { headers: getAuthHeaders() });
      if (res.status === 401 || res.status === 403) {
        onUnauthorized?.();
        return;
      }
      if (!res.ok) {
        res = await fetch(`http://localhost:5001${path}`, { headers: getAuthHeaders() });
      }
      if (res.status === 401 || res.status === 403) {
        onUnauthorized?.();
        return;
      }
      if (res.ok) {
        setAnalyticsData(await res.json());
      }
    } catch (e) {
      console.error("Fetch Analytics Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedReports = async () => {
    try {
      let res = await fetch("/api/superadmin/analytics/reports", { headers: getAuthHeaders() });
      if (res.status === 401 || res.status === 403) {
        onUnauthorized?.();
        return;
      }
      if (!res.ok) {
        res = await fetch("http://localhost:5001/api/superadmin/analytics/reports", { headers: getAuthHeaders() });
      }
      if (res.status === 401 || res.status === 403) {
        onUnauthorized?.();
        return;
      }
      if (res.ok) setSavedReports(await res.json());
    } catch (e) {
      console.error("Fetch Saved Reports Error:", e);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [reportGroup, dateRange, selectedPlan, selectedCountry]);

  useEffect(() => {
    fetchSavedReports();
  }, []);

  const handleExportCsv = async () => {
    try {
      const path = `/api/superadmin/analytics/export?group=${reportGroup}&dateRange=${dateRange}&plan=${selectedPlan}&country=${selectedCountry}`;
      let res = await fetch(path, { headers: getAuthHeaders() });
      if (!res.ok) {
        res = await fetch(`http://localhost:5001${path}`, { headers: getAuthHeaders() });
      }
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics_${reportGroup}_${dateRange}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        onShowToast("CSV Report exported successfully!");
        return;
      }
    } catch (e) {
      console.error("Export CSV Error:", e);
    }

    // Fallback client-side CSV generator if backend fetch fails
    if (!analyticsData || !analyticsData.data) {
      alert("No data available to export.");
      return;
    }
    const rows = [["Metric / Category", "Value", "Details"]];
    const flattenObj = (obj: any, prefix = "") => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          flattenObj(obj[key], `${prefix}${key}.`);
        } else {
          rows.push([`"${prefix}${key}"`, `"${obj[key]}"`, ""]);
        }
      }
    };
    flattenObj(analyticsData.data);
    const csvContent = "\uFEFF" + rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${reportGroup}_${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast("CSV Report exported successfully!");
  };

  const handleCreateSchedule = async (payload: any) => {
    try {
      let res = await fetch("/api/superadmin/analytics/reports", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        res = await fetch("http://localhost:5001/api/superadmin/analytics/reports", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
      }
      if (res.ok) {
        onShowToast("Email report schedule created successfully!");
        setIsScheduleModalOpen(false);
        fetchSavedReports();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <AnalyticsControls
        reportGroup={reportGroup}
        setReportGroup={setReportGroup}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        onExportCsv={handleExportCsv}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
      />

      {loading ? (
        <div className={styles.tableCard} style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
          Computing Business Intelligence analytics...
        </div>
      ) : (
        <AnalyticsReportsView data={analyticsData?.data} reportGroup={reportGroup} />
      )}

      <SavedReportsList reports={savedReports} />

      <ScheduleReportModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSubmit={handleCreateSchedule}
        reportGroup={reportGroup}
      />
    </div>
  );
}
