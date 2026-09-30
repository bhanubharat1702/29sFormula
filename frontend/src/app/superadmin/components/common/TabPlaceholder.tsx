"use client";

import React from "react";
import styles from "../../page.module.css";

interface TabPlaceholderProps {
  activeTab: string;
}

export default function TabPlaceholder({ activeTab }: TabPlaceholderProps) {
  if (activeTab === "analytics") {
    return (
      <div className={styles.tableCard} style={{ padding: "48px 24px", textAlign: "center", color: "#6b7280" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto", color: "#9ca3af", display: "block" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
        <div style={{ fontWeight: 600, fontSize: "1rem", color: "#111827", marginBottom: "4px" }}>Platform Analytics</div>
        <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Analytics data will appear here.</div>
      </div>
    );
  }

  if (activeTab === "communications") {
    return (
      <div className={styles.tableCard} style={{ padding: "48px 24px", textAlign: "center", color: "#6b7280" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto", color: "#9ca3af", display: "block" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        <div style={{ fontWeight: 600, fontSize: "1rem", color: "#111827", marginBottom: "4px" }}>Merchant Communications</div>
        <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>No broadcast messages sent yet.</div>
      </div>
    );
  }

  if (activeTab === "domains") {
    return (
      <div className={styles.tableCard} style={{ padding: "48px 24px", textAlign: "center", color: "#6b7280" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto", color: "#9ca3af", display: "block" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m-18.432 0A8.959 8.959 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
        </svg>
        <div style={{ fontWeight: 600, fontSize: "1rem", color: "#111827", marginBottom: "4px" }}>Custom Domains & DNS</div>
        <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>No custom domains configured.</div>
      </div>
    );
  }

  if (activeTab === "audit-log") {
    return (
      <div className={styles.tableCard} style={{ padding: "48px 24px", textAlign: "center", color: "#6b7280" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto", color: "#9ca3af", display: "block" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801-1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746m-3.41 1.25c.028-.392.35-.746.78-.746M12 2.25h.008v.008H12V2.25Zm-5.69 2.192C5.18 4.534 4.5 5.519 4.5 6.708v11.835A2.25 2.25 0 0 0 6.75 20.82h10.5a2.25 2.25 0 0 0 2.25-2.25V6.708c0-1.189-.68-2.174-1.81-2.266m-10.74 0A48.581 48.581 0 0 0 3 4.5" />
        </svg>
        <div style={{ fontWeight: 600, fontSize: "1rem", color: "#111827", marginBottom: "4px" }}>System Audit Logs</div>
        <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Audit logging is active.</div>
      </div>
    );
  }

  return null;
}
