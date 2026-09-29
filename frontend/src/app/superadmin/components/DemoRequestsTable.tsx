import React from "react";
import styles from "../page.module.css";
import { DemoRequestItem } from "./types";

interface DemoRequestsTableProps {
  activeTab: string;
  loading: boolean;
  demoRequests: DemoRequestItem[];
  onProvisionFromDemo: (demo: DemoRequestItem) => void;
}

export const DemoRequestsTable: React.FC<DemoRequestsTableProps> = ({
  activeTab,
  loading,
  demoRequests,
  onProvisionFromDemo
}) => {
  if (activeTab !== "demo-requests") return null;

  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Brand & Owner</th>
            <th>Contact Info</th>
            <th>Requested Subdomain</th>
            <th>Business Category</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                Loading merchant demo requests...
              </td>
            </tr>
          ) : demoRequests.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                No demo requests submitted yet.
              </td>
            </tr>
          ) : (
            demoRequests.map((demo) => (
              <tr key={demo._id}>
                <td>
                  <div className={styles.storeName}>{demo.storeName}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>👤 {demo.ownerName}</div>
                </td>
                <td>
                  <div>📧 {demo.email}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>📞 {demo.phone}</div>
                </td>
                <td>
                  <code style={{ color: "#2563eb" }}>{demo.subdomain || "auto-generate"}</code>
                </td>
                <td>{demo.businessType || "Retail"}</td>
                <td>
                  <span className={`${styles.badge} ${
                    demo.status === "Approved" ? styles.badgeStarter : styles.badgeEnterprise
                  }`}>
                    {demo.status}
                  </span>
                </td>
                <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  {demo.createdAt ? new Date(demo.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td>
                  {demo.status !== "Approved" && (
                    <button
                      onClick={() => onProvisionFromDemo(demo)}
                      className={`${styles.btnAction} ${styles.btnActionAccent}`}
                    >
                      ⚡ Provision Store
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
