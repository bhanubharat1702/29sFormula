"use client";

import React from "react";
import styles from "../../page.module.css";
import { PlanItem, SubscriptionItem } from "../billingTypes";

interface PlanModalProps {
  isOpen: boolean;
  isEdit: boolean;
  editingPlan: PlanItem | null;
  planForm: any;
  setPlanForm: (val: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PlanModal({
  isOpen,
  isEdit,
  editingPlan,
  planForm,
  setPlanForm,
  onClose,
  onSubmit
}: PlanModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          padding: "24px",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
          {isEdit ? `Edit Plan: ${editingPlan?.name}` : "Create New Subscription Plan"}
        </h3>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Plan Name</label>
            <input
              type="text"
              required
              className={styles.sidebarSearchInput}
              style={{ width: "100%", marginTop: "4px" }}
              value={planForm.name}
              onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
              placeholder="e.g. Starter, Growth, Pro, Enterprise"
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Description</label>
            <input
              type="text"
              className={styles.sidebarSearchInput}
              style={{ width: "100%", marginTop: "4px" }}
              value={planForm.description}
              onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Monthly Price ($)</label>
            <input
              type="number"
              required
              className={styles.sidebarSearchInput}
              style={{ width: "100%", marginTop: "4px" }}
              value={planForm.monthlyPrice}
              onChange={(e) => setPlanForm({ ...planForm, monthlyPrice: Number(e.target.value) })}
            />
          </div>

          <div style={{ marginBottom: "14px", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#f9fafb" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "8px", color: "#111827" }}>
              Plan Features & Entitlements
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.84rem", cursor: "pointer", fontWeight: 600, color: "#0c0a09" }}>
                <input
                  type="checkbox"
                  checked={Boolean(planForm.customDomain)}
                  onChange={(e) => setPlanForm({ ...planForm, customDomain: e.target.checked })}
                  style={{ width: "16px", height: "16px", accentColor: "#0c0a09" }}
                />
                Custom Domain Access: {planForm.customDomain ? "ON (Enabled)" : "OFF (Disabled)"}
              </label>
              <span style={{ fontSize: "0.76rem", color: "#6b7280", marginLeft: "24px" }}>
                Allows merchants on this plan to connect custom domain names (e.g. www.merchantbrand.com).
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Features List (Comma Separated Display Tags)</label>
            <input
              type="text"
              className={styles.sidebarSearchInput}
              style={{ width: "100%", marginTop: "4px" }}
              value={planForm.featureListStr}
              onChange={(e) => setPlanForm({ ...planForm, featureListStr: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px", justifyContent: "flex-end" }}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ManageSubModalProps {
  selectedSub: SubscriptionItem | null;
  subActionType: "change_plan" | "pause" | "cancel" | null;
  setSubActionType: (val: any) => void;
  targetPlanCode: string;
  setTargetPlanCode: (val: string) => void;
  plans: PlanItem[];
  onClose: () => void;
  onSubmit: () => void;
}

export function ManageSubModal({
  selectedSub,
  subActionType,
  setSubActionType,
  targetPlanCode,
  setTargetPlanCode,
  plans,
  onClose,
  onSubmit
}: ManageSubModalProps) {
  if (!selectedSub || !subActionType) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          maxWidth: "450px",
          width: "100%",
          padding: "24px"
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>
          Manage Subscription for {selectedSub.storeName}
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#4b5563", marginBottom: "16px" }}>
          Current Plan: <strong>{selectedSub.plan.toUpperCase()}</strong> (${selectedSub.mrr}/mo)
        </p>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
            Select Action
          </label>
          <select
            className={styles.sidebarSearchInput}
            style={{ width: "100%" }}
            value={subActionType}
            onChange={(e) => setSubActionType(e.target.value as any)}
          >
            <option value="change_plan">Upgrade / Downgrade Plan (Prorated)</option>
            <option value="pause">Pause Subscription</option>
            <option value="cancel">Cancel Subscription</option>
            <option value="reactivate">Reactivate Subscription</option>
          </select>
        </div>

        {subActionType === "change_plan" && (
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              New Plan Tier
            </label>
            <select
              className={styles.sidebarSearchInput}
              style={{ width: "100%" }}
              value={targetPlanCode}
              onChange={(e) => setTargetPlanCode(e.target.value)}
            >
              {plans.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} (${p.monthlyPrice}/mo)
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.btnPrimary} onClick={onSubmit}>
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  );
}

interface CouponModalProps {
  isOpen: boolean;
  couponForm: any;
  setCouponForm: (val: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CouponModal({ isOpen, couponForm, setCouponForm, onClose, onSubmit }: CouponModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          maxWidth: "450px",
          width: "100%",
          padding: "24px"
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
          Create Promo Coupon / Credit
        </h3>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Coupon Code</label>
            <input
              type="text"
              required
              placeholder="e.g. SUMMER50"
              className={styles.sidebarSearchInput}
              style={{ width: "100%", marginTop: "4px" }}
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Description</label>
            <input
              type="text"
              className={styles.sidebarSearchInput}
              style={{ width: "100%", marginTop: "4px" }}
              value={couponForm.description}
              onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Discount Type</label>
              <select
                className={styles.sidebarSearchInput}
                style={{ width: "100%", marginTop: "4px" }}
                value={couponForm.discountType}
                onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Value</label>
              <input
                type="number"
                required
                className={styles.sidebarSearchInput}
                style={{ width: "100%", marginTop: "4px" }}
                value={couponForm.discountValue}
                onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Create Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
