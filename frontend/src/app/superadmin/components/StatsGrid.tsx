import React from "react";
import styles from "../page.module.css";
import { Stats } from "./types";

interface StatsGridProps {
  stats: Stats | null;
  activeTab: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, activeTab }) => {
  if (activeTab !== "dashboard") return null;

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statLabel}>Total Merchant Stores</span>
          <span className={styles.statIcon}>🏪</span>
        </div>
        <div className={styles.statValue}>{stats?.totalStores ?? 0}</div>
        <div className={styles.statSubtext}>Across all tenants</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statLabel}>Active Provisioned Stores</span>
          <span className={styles.statIcon}>✅</span>
        </div>
        <div className={styles.statValue} style={{ color: "#059669" }}>
          {stats?.activeStores ?? 0}
        </div>
        <div className={styles.statSubtext}>Live on platform</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statLabel}>Merchant Demo Requests</span>
          <span className={styles.statIcon}>📩</span>
        </div>
        <div className={styles.statValue} style={{ color: "#7c3aed" }}>
          {stats?.totalDemoRequests ?? 0}
        </div>
        {stats?.pendingDemoRequests ? (
          <div className={styles.statSubtext} style={{ color: "#d97706" }}>
            ● {stats.pendingDemoRequests} Pending Action
          </div>
        ) : null}
      </div>

      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statLabel}>Total Platform Products</span>
          <span className={styles.statIcon}>🛍️</span>
        </div>
        <div className={styles.statValue}>{stats?.totalProducts ?? 0}</div>
        <div className={styles.statSubtext}>Catalog items</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statLabel}>Global Platform GMV</span>
          <span className={styles.statIcon}>💰</span>
        </div>
        <div className={styles.statValue} style={{ color: "#2563eb" }}>
          ₹{stats?.totalRevenue != null ? stats.totalRevenue.toLocaleString() : 0}
        </div>
        <div className={styles.statSubtext}>Total order revenue</div>
      </div>
    </div>
  );
};
