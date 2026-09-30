import React from "react";
import styles from "../../page.module.css";

interface TopHeaderProps {
  activeTab: string;
  onOpenCreateModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ activeTab, onOpenCreateModal }) => {
  if (activeTab === "settings") return null;

  return (
    <header className={styles.topHeader}>
      <div className={styles.titleGroup}>
        <h1>
          {activeTab === "dashboard" && "Dashboard Overview"}
          {activeTab === "stores" && "Merchant Stores"}
          {activeTab === "demo-requests" && "Demo Requests"}
          {activeTab === "billing" && "Billing & Subscriptions"}
          {activeTab === "analytics" && "Platform Analytics"}
          {activeTab === "communications" && "Communications"}
          {activeTab === "domains" && "Custom Domains"}
          {activeTab === "audit-log" && "Audit Logs"}
        </h1>
        <p>Manage multi-tenant merchant stores, custom domains, and platform operations</p>
      </div>
      <div className={styles.headerActions}>
        <button className={styles.btnPrimary} onClick={onOpenCreateModal}>
          + Provision New Store
        </button>
      </div>
    </header>
  );
};
