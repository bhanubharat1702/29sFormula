"use client";

import React from "react";
import styles from "../../page.module.css";
import { SubscriptionItem } from "../billingTypes";

interface BillingSubscriptionsProps {
  subscriptions: SubscriptionItem[];
  onManageSub: (sub: SubscriptionItem) => void;
}

export default function BillingSubscriptions({ subscriptions, onManageSub }: BillingSubscriptionsProps) {
  return (
    <div className={styles.tableCard}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
          Tenant Subscription Directory
        </h3>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Merchant / Store</th>
              <th>Owner Email</th>
              <th>Current Plan</th>
              <th>Status</th>
              <th>MRR</th>
              <th>Next Billing</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub._id}>
                <td>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{sub.storeName}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{sub.subdomain}.domain.com</div>
                </td>
                <td style={{ fontSize: "0.85rem" }}>{sub.ownerEmail}</td>
                <td>
                  <span
                    style={{
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "#e0e7ff",
                      color: "#3730a3"
                    }}
                  >
                    {sub.plan}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      sub.status === "active"
                        ? styles.statusActive
                        : sub.status === "trial"
                        ? styles.statusTrial
                        : styles.statusSuspended
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: "#111827" }}>${sub.mrr}/mo</td>
                <td style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                  {new Date(sub.nextBillingDate).toLocaleDateString()}
                </td>
                <td>
                  <button
                    className={styles.btnSecondary}
                    style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    onClick={() => onManageSub(sub)}
                  >
                    Manage Subscription
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
