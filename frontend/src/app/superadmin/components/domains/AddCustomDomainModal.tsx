"use client";

import React from "react";
import styles from "../../page.module.css";
import { StoreItem } from "../types";

interface AddCustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  stores: StoreItem[];
  selectedStoreId: string;
  setSelectedStoreId: (val: string) => void;
  newDomain: string;
  setNewDomain: (val: string) => void;
  redirectWww: boolean;
  setRedirectWww: (val: boolean) => void;
  redirectSubdomain: boolean;
  setRedirectSubdomain: (val: boolean) => void;
  addError: string;
  submittingAdd: boolean;
}

export const AddCustomDomainModal: React.FC<AddCustomDomainModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  stores,
  selectedStoreId,
  setSelectedStoreId,
  newDomain,
  setNewDomain,
  redirectWww,
  setRedirectWww,
  redirectSubdomain,
  setRedirectSubdomain,
  addError,
  submittingAdd
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Connect Custom Domain</h3>
            <p className={styles.modalSubtitle}>Link merchant brand domain or subdomain to store engine</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modalBody}>
            {addError && (
              <div className={styles.errorBanner} style={{ marginBottom: "16px" }}>
                ⚠️ {addError}
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Select Merchant Store *</label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className={styles.formInput}
                required
              >
                <option value="">-- Select Merchant Store --</option>
                {stores.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.subdomain}.yourplatform.com) — {(s.plan || 'starter').toUpperCase()} Plan
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Custom Domain Name *</label>
              <input
                type="text"
                placeholder="e.g. store.merchantbrand.com or www.merchantbrand.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className={styles.formInput}
                required
              />
              <span style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", display: "block" }}>Do not include http:// or https://</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px", padding: "12px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={redirectWww} onChange={(e) => setRedirectWww(e.target.checked)} style={{ width: "16px", height: "16px" }} />
                Automatically redirect www ↔ apex root domain
              </label>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={redirectSubdomain} onChange={(e) => setRedirectSubdomain(e.target.checked)} style={{ width: "16px", height: "16px" }} />
                Redirect default subdomain to this custom domain once live
              </label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={submittingAdd}>
              {submittingAdd ? "Connecting..." : "Add Domain & Show DNS Setup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
