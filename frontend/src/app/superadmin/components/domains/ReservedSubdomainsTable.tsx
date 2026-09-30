"use client";

import React from "react";
import styles from "../../page.module.css";
import { ReservedSubdomainItem } from "../domainsTypes";

interface ReservedSubdomainsTableProps {
  reservedList: ReservedSubdomainItem[];
  onOpenAddModal: () => void;
  onRemoveReserved: (id: string) => void;
}

export const ReservedSubdomainsTable: React.FC<ReservedSubdomainsTableProps> = ({
  reservedList,
  onOpenAddModal,
  onRemoveReserved
}) => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>Reserved System Subdomains</h3>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>These subdomains cannot be registered by any merchant store on self-signup.</p>
        </div>
        <button className={styles.btnPrimary} onClick={onOpenAddModal}>
          + Reserve New Subdomain
        </button>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>Reserved Subdomain</th>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>Reason</th>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>Added By</th>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>Added Date</th>
              <th style={{ padding: "12px 16px", fontWeight: "600", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservedList.map((item) => (
              <tr key={item._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 16px", fontWeight: "600", color: "#4f46e5" }}>
                  {item.subdomain}.yourplatform.com
                </td>
                <td style={{ padding: "12px 16px", color: "#374151" }}>{item.reason}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{item.addedBy}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button
                    className={styles.btnSecondary}
                    style={{ color: "#dc2626", padding: "4px 8px", fontSize: "12px" }}
                    onClick={() => onRemoveReserved(item._id)}
                  >
                    Unreserve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
