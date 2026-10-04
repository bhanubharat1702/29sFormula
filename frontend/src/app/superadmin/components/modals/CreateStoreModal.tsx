"use client";

import React, { useState, useEffect } from "react";
import styles from "../../page.module.css";
import { PlanItem } from "../billingTypes";

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
  newBusinessLogo: string;
  setNewBusinessLogo: (val: string) => void;
  newBusinessType: string;
  setNewBusinessType: (val: string) => void;
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
  newBusinessLogo,
  setNewBusinessLogo,
  newBusinessType,
  setNewBusinessType,
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
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (result) {
        setNewBusinessLogo(result);
      }
      setUploadingLogo(false);
    };
    reader.onerror = () => {
      setUploadingLogo(false);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isOpen) {
      const token = typeof window !== "undefined" ? localStorage.getItem("superAdminToken") : "";
      fetch("/api/superadmin/billing/plans", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setPlans(data);
            if (!newPlan || !data.some((p: PlanItem) => p.code === newPlan)) {
              setNewPlan(data[0].code);
            }
          }
        })
        .catch((err) => console.error("Error fetching plans for modal:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPlanObj = plans.find((p) => p.code === newPlan);
  const isCustomDomainAllowed = currentPlanObj
    ? Boolean(currentPlanObj.featureFlags?.customDomain)
    : newPlan !== "starter";

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox} style={{ maxWidth: "620px" }}>
        <h2 className={styles.modalTitle}>Provision Merchant Store</h2>
        <p className={styles.modalSubtitle}>Configure tenant details, owner credentials, brand logo, and subscription plan</p>

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
              <label className={styles.label}>Merchant Logo (Optional)</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      background: "#f9fafb",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#374151",
                      cursor: "pointer"
                    }}
                  >
                    📁 Upload from Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileSelect}
                      style={{ display: "none" }}
                    />
                  </label>
                  <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>or paste image URL</span>
                </div>

                <input
                  type="text"
                  placeholder="https://cdn.example.com/logo.png"
                  value={newBusinessLogo}
                  onChange={(e) => setNewBusinessLogo(e.target.value)}
                  className={styles.input}
                />

                {uploadingLogo && <span style={{ fontSize: "0.72rem", color: "#2563eb" }}>Uploading image...</span>}

                {newBusinessLogo && (
                  <div style={{ marginTop: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <img
                      src={newBusinessLogo}
                      alt="Logo Preview"
                      style={{ height: "28px", maxWidth: "100px", borderRadius: "4px", objectFit: "contain", border: "1px solid #e5e7eb", background: "#f9fafb" }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <button
                      type="button"
                      onClick={() => setNewBusinessLogo("")}
                      style={{ border: "none", background: "transparent", color: "#ef4444", fontSize: "0.72rem", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Clear Logo
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Business Category</label>
              <select
                value={newBusinessType}
                onChange={(e) => setNewBusinessType(e.target.value)}
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
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Subscription Plan *</label>
              <select
                value={newPlan}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewPlan(val);
                  const foundPlan = plans.find((p) => p.code === val);
                  if (foundPlan && !foundPlan.featureFlags?.customDomain) {
                    setNewCustomDomain("");
                  }
                }}
                className={styles.input}
              >
                {plans.map((p) => (
                  <option key={p._id} value={p.code}>
                    {p.name} (${p.monthlyPrice}/mo)
                  </option>
                ))}
                {plans.length === 0 && (
                  <>
                    <option value="starter">Starter Plan ($29/mo)</option>
                    <option value="growth">Growth Plan ($49/mo)</option>
                    <option value="pro">Pro Plan ($79/mo)</option>
                    <option value="enterprise">Enterprise Plan ($299/mo)</option>
                  </>
                )}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ opacity: !isCustomDomainAllowed ? 0.6 : 1 }}>
                Custom CNAME Domain {!isCustomDomainAllowed ? "(Requires plan with Custom Domain)" : "(Optional)"}
              </label>
              <input
                type="text"
                placeholder={!isCustomDomainAllowed ? "Custom domain not enabled for this plan" : "e.g. store.acmefashion.com"}
                value={!isCustomDomainAllowed ? "" : newCustomDomain}
                disabled={!isCustomDomainAllowed}
                onChange={(e) => setNewCustomDomain(e.target.value)}
                className={styles.input}
                style={{
                  backgroundColor: !isCustomDomainAllowed ? "#f3f4f6" : "#ffffff",
                  cursor: !isCustomDomainAllowed ? "not-allowed" : "text"
                }}
              />
              {!isCustomDomainAllowed && (
                <span style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "3px", display: "block" }}>
                  🔒 Custom CNAME Domain is not enabled on this subscription plan tier.
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
            <label className={styles.label}>Owner Password *</label>
            <input
              type="password"
              required
              placeholder="Min 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
            />
            <span style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "3px", display: "block" }}>
              🔑 Used for merchant login at /admin/login or storefront.
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
