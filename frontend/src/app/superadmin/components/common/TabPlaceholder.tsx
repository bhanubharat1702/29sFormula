"use client";

import React from "react";
import styles from "../../page.module.css";

interface TabPlaceholderProps {
  activeTab: string;
}

export default function TabPlaceholder({ activeTab }: TabPlaceholderProps) {



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
