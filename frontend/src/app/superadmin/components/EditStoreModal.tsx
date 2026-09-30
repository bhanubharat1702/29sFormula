"use client";

import React from "react";
import styles from "../page.module.css";

interface EditStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editFormError: string;
  editSubmitting: boolean;
  editStoreName: string;
  setEditStoreName: (val: string) => void;
  editSubdomain: string;
  setEditSubdomain: (val: string) => void;
  editBusinessLogo: string;
  setEditBusinessLogo: (val: string) => void;
  editPlan: string;
  setEditPlan: (val: string) => void;
  editCustomDomain: string;
  setEditCustomDomain: (val: string) => void;
  editOwnerName: string;
  setEditOwnerName: (val: string) => void;
  editOwnerEmail: string;
  setEditOwnerEmail: (val: string) => void;
  editOwnerPhone: string;
  setEditOwnerPhone: (val: string) => void;
  editBusinessType: string;
  setEditBusinessType: (val: string) => void;
  editIsActive: boolean;
  setEditIsActive: (val: boolean) => void;
  editInternalNotes: string;
  setEditInternalNotes: (val: string) => void;
}

export default function EditStoreModal({
  isOpen,
  onClose,
  onSubmit,
  editFormError,
  editSubmitting,
  editStoreName,
  setEditStoreName,
  editSubdomain,
  setEditSubdomain,
  editBusinessLogo,
  setEditBusinessLogo,
  editPlan,
  setEditPlan,
  editCustomDomain,
  setEditCustomDomain,
  editOwnerName,
  setEditOwnerName,
  editOwnerEmail,
  setEditOwnerEmail,
  editOwnerPhone,
  setEditOwnerPhone,
  editBusinessType,
  setEditBusinessType,
  editIsActive,
  setEditIsActive,
  editInternalNotes,
  setEditInternalNotes,
}: EditStoreModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox} style={{ maxWidth: "620px" }}>
        <h2 className={styles.modalTitle}>Edit Tenant Account</h2>
        <p className={styles.modalSubtitle}>Update store parameters, owner details, logo, and plan configuration</p>

        {editFormError && <div className={styles.errorBanner}>{editFormError}</div>}

        <form onSubmit={onSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Store Name *</label>
              <input
                type="text"
                required
                value={editStoreName}
                onChange={(e) => setEditStoreName(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Subdomain *</label>
              <input
                type="text"
                required
                value={editSubdomain}
                onChange={(e) => setEditSubdomain(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Merchant Logo URL</label>
            <input
              type="text"
              placeholder="e.g. https://cdn.example.com/logo.png"
              value={editBusinessLogo}
              onChange={(e) => setEditBusinessLogo(e.target.value)}
              className={styles.input}
            />
            {editBusinessLogo && (
              <div style={{ marginTop: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={editBusinessLogo}
                  alt="Logo Preview"
                  style={{ width: "24px", height: "24px", borderRadius: "4px", objectFit: "cover", border: "1px solid #e5e7eb" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>Logo Preview</span>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Subscription Plan</label>
              <select
                value={editPlan}
                onChange={(e) => {
                  setEditPlan(e.target.value);
                  if (e.target.value === "starter") setEditCustomDomain("");
                }}
                className={styles.input}
              >
                <option value="starter">Starter Plan</option>
                <option value="pro">Pro Merchant Plan</option>
                <option value="enterprise">Enterprise Plan</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ opacity: editPlan === "starter" ? 0.6 : 1 }}>
                Custom CNAME Domain {editPlan === "starter" ? "(Pro/Enterprise Only)" : ""}
              </label>
              <input
                type="text"
                placeholder={editPlan === "starter" ? "Requires Pro or Enterprise plan" : "e.g. store.custombrand.com"}
                value={editPlan === "starter" ? "" : editCustomDomain}
                disabled={editPlan === "starter"}
                onChange={(e) => setEditCustomDomain(e.target.value)}
                className={styles.input}
                style={{
                  backgroundColor: editPlan === "starter" ? "#f3f4f6" : "#ffffff",
                  cursor: editPlan === "starter" ? "not-allowed" : "text"
                }}
              />
              {editPlan === "starter" && (
                <span style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "3px", display: "block" }}>
                  🔒 Custom CNAME Domain is available on Pro or Enterprise plans only.
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Owner Full Name</label>
              <input
                type="text"
                value={editOwnerName}
                onChange={(e) => setEditOwnerName(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Owner Email</label>
              <input
                type="email"
                value={editOwnerEmail}
                onChange={(e) => setEditOwnerEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Owner Phone</label>
              <input
                type="text"
                value={editOwnerPhone}
                onChange={(e) => setEditOwnerPhone(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Business Type</label>
              <select
                value={editBusinessType}
                onChange={(e) => setEditBusinessType(e.target.value)}
                className={styles.input}
              >
                <option value="retail">Retail Store</option>
                <option value="fashion">Fashion & Apparel</option>
                <option value="electronics">Electronics & Tech</option>
                <option value="food">Food & Grocery</option>
                <option value="beauty">Beauty & Wellness</option>
                <option value="services">Services</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Account Status</label>
              <select
                value={editIsActive ? "active" : "suspended"}
                onChange={(e) => setEditIsActive(e.target.value === "active")}
                className={styles.input}
              >
                <option value="active">● Active</option>
                <option value="suspended">● Suspended</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Internal Super Admin Notes</label>
            <textarea
              rows={2}
              placeholder="Private notes about this tenant..."
              value={editInternalNotes}
              onChange={(e) => setEditInternalNotes(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={editSubmitting} className={styles.btnPrimary}>
              {editSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
