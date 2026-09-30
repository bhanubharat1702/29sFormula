import React from "react";
import styles from "../page.module.css";

interface ActionBarProps {
  activeTab: string;
  storeStatusFilter: string;
  setStoreStatusFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  activeTab,
  storeStatusFilter,
  setStoreStatusFilter,
  searchQuery,
  setSearchQuery
}) => {
  if (activeTab !== "dashboard" && activeTab !== "stores") return null;

  return (
    <div className={styles.actionBar}>
      <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0c0a09" }}>
        Provisioned Merchant Stores
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <select
          value={storeStatusFilter}
          onChange={(e) => setStoreStatusFilter(e.target.value)}
          className={styles.input}
          style={{ width: "auto", padding: "6px 12px", fontSize: "0.84rem" }}
        >
          <option value="all">Status: All</option>
          <option value="active">Active Only</option>
          <option value="suspended">Suspended Only</option>
        </select>

        <input
          type="text"
          placeholder="Search stores by name, subdomain, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};
