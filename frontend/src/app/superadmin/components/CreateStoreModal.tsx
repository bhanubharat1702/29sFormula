"use client";

import React from "react";
import styles from "../page.module.css";

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedDemoId: string | null;
  formError: string;
  submitting: boolean;
  newStoreName: string;
  setNewStoreName: (val: string) => void;
  newSubdomain: string;
  setNewSubdomain: (val: string) => void;
  newPlan: string;
  setNewPlan: (val: string) => void;
  newCustomDomain: string;
  setNewCustomDomain: (val: string) => void;
  newOwnerName: string;
  setNewOwnerName: (val: string) => void;
  newOwnerEmail: string;
  setNewOwnerEmail: (val: string) => void;
  newOwnerPhone: string;
  setNewOwnerPhone: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
}

export default function CreateStoreModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDemoId,
  formError,
  submitting,
  newStoreName,
  setNewStoreName,
  newSubdomain,
  setNewSubdomain,
  newPlan,
  setNewPlan,
  newCustomDomain,
  setNewCustomDomain,
  newOwnerName,
  setNewOwnerName,
  newOwnerEmail,
  setNewOwnerEmail,
  newOwnerPhone,
  setNewOwnerPhone,
  newPassword,
  setNewPassword,
}: CreateStoreModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox} style={{ maxWidth: "560px" }}>
        <h2 className={styles.modalTitle}>Provision Merchant Store</h2>
        <p className={styles.modalSubtitle}>Configure tenant details, owner credentials, and subscription plan</p>

        {selectedDemoId && (
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px", padding: "10px", marginBottom: "16px", fontSize: "0.85rem", color: "#047857" }}>
            ⚡ Pre-filled from Merchant Demo Request
          </div>
        )}

        {formError && <div className={styles.errorBanner}>{formError}</div>}

        <form onSubmit={onSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Store / Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Fashion"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Subdomain *</label>
              <input
                type="text"
                required
                placeholder="e.g. acmefashion"
                value={newSubdomain}
                onChange={(e) => setNewSubdomain(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Subscription Plan *</label>
              <select
                value={newPlan}
                onChange={(e) => {
                  setNewPlan(e.target.value);
                  if (e.target.value === "starter") setNewCustomDomain("");
                }}
                className={styles.input}
              >
                <option value="starter">Starter Plan (₹999/mo)</option>
                <option value="pro">Pro Merchant Plan (₹2,499/mo)</option>
                <option value="enterprise">Enterprise Plan</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ opacity: newPlan === "starter" ? 0.6 : 1 }}>
                Custom CNAME Domain {newPlan === "starter" ? "(Pro/Enterprise Only)" : "(Optional)"}
              </label>
              <input
                type="text"
                placeholder={newPlan === "starter" ? "Requires Pro or Enterprise plan" : "e.g. store.acmefashion.com"}
                value={newPlan === "starter" ? "" : newCustomDomain}
                disabled={newPlan === "starter"}
                onChange={(e) => setNewCustomDomain(e.target.value)}
                className={styles.input}
                style={{
                  backgroundColor: newPlan === "starter" ? "#f3f4f6" : "#ffffff",
                  cursor: newPlan === "starter" ? "not-allowed" : "text"
                }}
              />
              {newPlan === "starter" && (
                <span style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "3px", display: "block" }}>
                  🔒 Custom CNAME Domain is available on Pro or Enterprise plans only.
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Owner Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={newOwnerName}
                onChange={(e) => setNewOwnerName(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Owner Email *</label>
              <input
                type="email"
                required
                placeholder="owner@acmefashion.com"
                value={newOwnerEmail}
                onChange={(e) => setNewOwnerEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Owner Phone</label>
              <input
                type="text"
                placeholder="+91 9876543210"
                value={newOwnerPhone}
                onChange={(e) => setNewOwnerPhone(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Owner Temporary Password *</label>
            <input
              type="password"
              required
              placeholder="Min 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
            />
            <span style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "3px", display: "block" }}>
              🔑 Merchant will be required to change this password upon first login.
            </span>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className={styles.btnPrimary}>
              {submitting ? "Provisioning..." : "Create & Activate Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
