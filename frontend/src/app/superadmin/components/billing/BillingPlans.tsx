"use client";

import React from "react";
import styles from "../../page.module.css";
import { PlanItem } from "../billingTypes";

interface BillingPlansProps {
  plans: PlanItem[];
  onOpenCreate: () => void;
  onOpenEdit: (plan: PlanItem) => void;
  onDeletePlan: (plan: PlanItem) => void;
}

export default function BillingPlans({ plans, onOpenCreate, onOpenEdit, onDeletePlan }: BillingPlansProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", margin: 0 }}>Platform Plans</h3>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>
            Manage Starter, Growth, Pro, and Enterprise tiers. Modifying prices automatically grandfathers existing subscribers.
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={onOpenCreate}>
          + Create New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", background: "#f9fafb", borderRadius: "12px", border: "1px dashed #d1d5db" }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#4b5563", fontWeight: 500 }}>
            No platform plans found.
          </p>
          <p style={{ margin: "6px 0 16px 0", fontSize: "0.82rem", color: "#6b7280" }}>
            Create custom monthly subscription plans for your SaaS merchants.
          </p>
          <button className={styles.btnPrimary} onClick={onOpenCreate}>
            + Create First Plan
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {plans.map((p) => (
            <div
              key={p._id}
              className={styles.tableCard}
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: p.isPopular ? "2px solid #2563eb" : "1px solid #e5e7eb",
                position: "relative"
              }}
            >
              {p.isPopular && (
                <span
                  style={{
                    position: "absolute",
                    top: "-12px",
                    right: "16px",
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "10px",
                    textTransform: "uppercase"
                  }}
                >
                  Most Popular
                </span>
              )}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", margin: 0 }}>{p.name}</h4>
                  <span style={{ fontSize: "0.75rem", background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
                    {p.code}
                  </span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "6px 0 16px 0", minHeight: "36px" }}>
                  {p.description}
                </p>

                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#111827" }}>${p.monthlyPrice}</span>
                  <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>/ mo</span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "#374151", marginBottom: "16px" }}>
                  <div>
                    <strong>Trial Period:</strong> {p.trialDays} Days
                  </div>
                  <div>
                    <strong>Limits:</strong> {p.limits?.maxProducts} products, {p.limits?.maxStaff} staff
                  </div>
                </div>

                <ul style={{ paddingLeft: "18px", fontSize: "0.8rem", color: "#4b5563", marginBottom: "20px" }}>
                  {(p.featureList || []).map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                <button
                  className={styles.btnSecondary}
                  style={{ flex: 1, textAlign: "center" }}
                  onClick={() => onOpenEdit(p)}
                >
                  Edit Plan
                </button>
                <button
                  style={{
                    color: "#dc2626",
                    borderColor: "#fca5a5",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fca5a5",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => onDeletePlan(p)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
