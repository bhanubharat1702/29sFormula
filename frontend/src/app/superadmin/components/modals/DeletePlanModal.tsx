"use client";

import React, { useState } from "react";
import styles from "../../page.module.css";
import { PlanItem } from "../billingTypes";

interface DeletePlanModalProps {
  plan: PlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function DeletePlanModal({ plan, isOpen, onClose, onConfirm }: DeletePlanModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !plan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your super admin password to confirm deletion.");
      return;
    }
    setError("");
    onConfirm(password);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>Delete Subscription Plan</h2>
        <div style={{ marginBottom: "20px", color: "#374151" }}>
          <p style={{ marginBottom: "10px", fontWeight: 600, color: "#dc2626" }}>
            Are you sure you want to delete the plan "{plan.name}" ({plan.code})?
          </p>
          <p style={{ fontSize: "0.85rem", color: "#4b5563", marginBottom: "8px" }}>
            <strong>Monthly Price:</strong> ${plan.monthlyPrice} / mo
          </p>
          <p style={{ fontSize: "0.82rem", color: "#6b7280", background: "#f3f4f6", padding: "8px 12px", borderRadius: "6px" }}>
            ℹ️ Existing merchants on this plan will remain grandfathered without interruption to their store or entitlements.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Super Admin Password</label>
            <input
              type="password"
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to confirm"
              autoFocus
            />
            {error && <div style={{ color: "red", fontSize: "0.85rem", marginTop: "5px" }}>{error}</div>}
          </div>

          <div className={styles.modalActions} style={{ marginTop: "20px" }}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnActionDanger}>
              Delete Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
