"use client";

import React from "react";
import styles from "../../page.module.css";
import { InvoiceItem } from "../billingTypes";

interface BillingInvoicesProps {
  invoices: InvoiceItem[];
  onStatusChange: (invId: string, status: string) => void;
}

export default function BillingInvoices({ invoices, onStatusChange }: BillingInvoicesProps) {
  return (
    <div className={styles.tableCard}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
          Platform Invoices & Tax Compliance (GST/VAT)
        </h3>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Merchant Store</th>
              <th>Amount</th>
              <th>Tax (GST 18%)</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td style={{ fontWeight: 600, fontSize: "0.85rem", fontFamily: "monospace" }}>
                  {inv.invoiceNumber}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{inv.storeName}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{inv.subdomain}</div>
                </td>
                <td>${inv.amount}</td>
                <td style={{ fontSize: "0.85rem", color: "#6b7280" }}>${inv.taxAmount}</td>
                <td style={{ fontWeight: 700, color: "#111827" }}>${inv.totalAmount}</td>
                <td>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: inv.status === "paid" ? "#dcfce7" : inv.status === "pending" ? "#fef3c7" : "#fee2e2",
                      color: inv.status === "paid" ? "#166534" : inv.status === "pending" ? "#92400e" : "#991b1b"
                    }}
                  >
                    {inv.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                  {new Date(inv.dueDate).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {inv.status !== "paid" && (
                      <button
                        className={styles.btnSecondary}
                        style={{ padding: "4px 8px", fontSize: "0.75rem", color: "#166534" }}
                        onClick={() => onStatusChange(inv._id, "paid")}
                      >
                        Mark Paid
                      </button>
                    )}
                    {inv.status === "paid" && (
                      <button
                        className={styles.btnSecondary}
                        style={{ padding: "4px 8px", fontSize: "0.75rem", color: "#dc2626" }}
                        onClick={() => onStatusChange(inv._id, "refunded")}
                      >
                        Refund
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
