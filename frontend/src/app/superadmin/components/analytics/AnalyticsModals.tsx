"use client";

import React, { useState } from "react";
import styles from "../../page.module.css";
import { SavedReportItem } from "../analyticsTypes";

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  reportGroup: string;
}

export function ScheduleReportModal({ isOpen, onClose, onSubmit, reportGroup }: ScheduleReportModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [emailsStr, setEmailsStr] = useState("admin@platform.com, execs@platform.com");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      reportGroup,
      scheduleFrequency: frequency,
      emailRecipients: emailsStr.split(",").map((s) => s.trim()).filter(Boolean),
      isScheduled: true
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          maxWidth: "480px",
          width: "100%",
          padding: "24px"
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
          Schedule Automated Email Report
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Report Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Weekly Executive Revenue Summary"
              className={styles.sidebarSearchInput}
              style={{ width: "100%", marginTop: "4px" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Frequency</label>
            <select
              className={styles.sidebarSearchInput}
              style={{ width: "100%", marginTop: "4px" }}
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly (Monday 8:00 AM)</option>
              <option value="monthly">Monthly (1st of Month)</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Email Recipients (Comma Separated)</label>
            <input
              type="text"
              required
              className={styles.sidebarSearchInput}
              style={{ width: "100%", marginTop: "4px" }}
              value={emailsStr}
              onChange={(e) => setEmailsStr(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Save & Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface SavedReportsListProps {
  reports: SavedReportItem[];
}

export function SavedReportsList({ reports }: SavedReportsListProps) {
  if (reports.length === 0) return null;

  return (
    <div className={styles.tableCard} style={{ marginTop: "20px", padding: "20px" }}>
      <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "12px" }}>Saved & Scheduled Email Reports</h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Group</th>
            <th>Frequency</th>
            <th>Recipients</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id}>
              <td style={{ fontWeight: 600 }}>{r.name}</td>
              <td style={{ textTransform: "uppercase", fontSize: "0.75rem" }}>{r.reportGroup}</td>
              <td><span style={{ textTransform: "capitalize", background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>{r.scheduleFrequency}</span></td>
              <td style={{ fontSize: "0.85rem", color: "#4b5563" }}>{(r.emailRecipients || []).join(", ")}</td>
              <td><span style={{ color: "#166534", fontWeight: 700, fontSize: "0.75rem" }}>ACTIVE SCHEDULE</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
