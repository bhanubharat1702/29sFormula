import React, { useState } from 'react';
import styles from '../../page.module.css';

interface MarketingTabProps {
  activeTab: any;
  customizeSubTab?: any;
  setSuccessMessage: any;
  hasUnsavedChanges: boolean;
}

export default function MarketingTab({
  activeTab,
  customizeSubTab,
}: MarketingTabProps) {
  return (
    <>
      {activeTab === "online-store" && customizeSubTab === "marketing" && (
        <div className={styles.viewContainer}>
          <div style={{ marginBottom: "20px" }}>
            <h1 className={styles.pageHeading} style={{ margin: 0 }}>Marketing Campaigns & Promos</h1>
          </div>
          <div className={styles.dashboardCard} style={{ padding: "20px", color: "#6b7280" }}>
            <p style={{ margin: 0 }}>Marketing section and promotional campaign controls.</p>
          </div>
        </div>
      )}
    </>
  );
}
