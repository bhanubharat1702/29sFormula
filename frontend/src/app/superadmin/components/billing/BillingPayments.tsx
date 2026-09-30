"use client";

import React from "react";
import styles from "../../page.module.css";
import { PaymentLogItem } from "../billingTypes";

interface BillingPaymentsProps {
  paymentLogs: PaymentLogItem[];
  onRetryPayment: (logId: string) => void;
}

export default function BillingPayments({ paymentLogs, onRetryPayment }: BillingPaymentsProps) {
  return (
    <div className={styles.tableCard}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
          Gateway Attempts & Dunning Retries (Stripe / Razorpay)
        </h3>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Gateway</th>
              <th>Amount</th>
              <th>Attempt #</th>
              <th>Status</th>
              <th>Failure Reason / Dunning Step</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paymentLogs.map((log) => (
              <tr key={log._id}>
                <td>
                  <span style={{ fontWeight: 600, color: "#111827" }}>{log.gateway}</span>
                </td>
                <td style={{ fontWeight: 700 }}>${log.amount} USD</td>
                <td>Attempt #{log.attemptNumber}</td>
                <td>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: log.status === "success" ? "#dcfce7" : "#fee2e2",
                      color: log.status === "success" ? "#166534" : "#991b1b"
                    }}
                  >
                    {log.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ fontSize: "0.85rem", color: log.status === "failed" ? "#dc2626" : "#4b5563" }}>
                  {log.failureReason || `Dunning Step: ${log.dunningStep}`}
                </td>
                <td>
                  {log.status === "failed" && (
                    <button
                      className={styles.btnPrimary}
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                      onClick={() => onRetryPayment(log._id)}
                    >
                      Retry Charge Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
