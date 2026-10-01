"use client";

import React, { useState, useEffect } from "react";
import styles from "../page.module.css";
import {
  BillingOverviewData,
  PlanItem,
  SubscriptionItem,
  InvoiceItem,
  PaymentLogItem,
  CouponItem,
  TaxCurrencyConfigItem
} from "./billingTypes";

import BillingOverview from "./billing/BillingOverview";
import BillingPlans from "./billing/BillingPlans";
import BillingSubscriptions from "./billing/BillingSubscriptions";
import BillingInvoices from "./billing/BillingInvoices";
import BillingPayments from "./billing/BillingPayments";
import BillingCoupons from "./billing/BillingCoupons";
import BillingTaxCurrency from "./billing/BillingTaxCurrency";
import { PlanModal, ManageSubModal, CouponModal } from "./billing/BillingModals";

interface BillingTabProps {
  token: string;
  onShowToast: (msg: string) => void;
  onUnauthorized?: () => void;
}

export default function BillingTab({ token, onShowToast, onUnauthorized }: BillingTabProps) {
  const [subTab, setSubTab] = useState<
    "overview" | "plans" | "subscriptions" | "invoices" | "payments" | "coupons" | "tax-currency"
  >("overview");

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<BillingOverviewData | null>(null);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [paymentLogs, setPaymentLogs] = useState<PaymentLogItem[]>([]);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [taxConfigs, setTaxConfigs] = useState<TaxCurrencyConfigItem[]>([]);

  // Modals state
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);

  const [planForm, setPlanForm] = useState({
    name: "",
    code: "",
    description: "",
    monthlyPrice: 49,
    yearlyPrice: 490,
    trialDays: 14,
    transactionFeePercent: 1.5,
    maxProducts: 500,
    maxOrders: 5000,
    maxStaff: 5,
    maxStorageMB: 2000,
    featureListStr: "Custom Domain, Cart Recovery, 24/7 Support",
    isVisible: true,
    isPopular: false
  });

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    discountType: "percent",
    discountValue: 20,
    maxRedemptions: 100
  });

  // Action Modals for Subscriptions
  const [selectedSub, setSelectedSub] = useState<SubscriptionItem | null>(null);
  const [subActionType, setSubActionType] = useState<"change_plan" | "pause" | "cancel" | null>(null);
  const [targetPlanCode, setTargetPlanCode] = useState("pro");

  const getAuthHeaders = () => {
    const effectiveToken = token || (typeof window !== "undefined" ? localStorage.getItem("superAdminToken") : "") || "";
    return {
      Authorization: `Bearer ${effectiveToken}`,
      "Content-Type": "application/json"
    };
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch("/api/superadmin/billing/overview", { headers: getAuthHeaders() });
      if (res.status === 401 || res.status === 403) {
        onUnauthorized?.();
        return;
      }
      if (res.ok) setOverview(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/superadmin/billing/plans", { headers: getAuthHeaders() });
      if (res.ok) setPlans(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/superadmin/billing/subscriptions", { headers: getAuthHeaders() });
      if (res.ok) setSubscriptions(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/superadmin/billing/invoices", { headers: getAuthHeaders() });
      if (res.ok) setInvoices(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/superadmin/billing/payments", { headers: getAuthHeaders() });
      if (res.ok) setPaymentLogs(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/superadmin/billing/coupons", { headers: getAuthHeaders() });
      if (res.ok) setCoupons(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTaxConfigs = async () => {
    try {
      const res = await fetch("/api/superadmin/billing/tax-currency", { headers: getAuthHeaders() });
      if (res.ok) setTaxConfigs(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchOverview(),
      fetchPlans(),
      fetchSubscriptions(),
      fetchInvoices(),
      fetchPayments(),
      fetchCoupons(),
      fetchTaxConfigs()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Plan Handlers
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: planForm.name,
        code: planForm.code,
        description: planForm.description,
        monthlyPrice: Number(planForm.monthlyPrice),
        yearlyPrice: Number(planForm.yearlyPrice),
        trialDays: Number(planForm.trialDays),
        transactionFeePercent: Number(planForm.transactionFeePercent),
        limits: {
          maxProducts: Number(planForm.maxProducts),
          maxOrders: Number(planForm.maxOrders),
          maxStaff: Number(planForm.maxStaff),
          maxStorageMB: Number(planForm.maxStorageMB)
        },
        featureList: planForm.featureListStr.split(",").map((s) => s.trim()).filter(Boolean),
        isVisible: planForm.isVisible,
        isPopular: planForm.isPopular
      };

      const res = await fetch("/api/superadmin/billing/plans", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create plan");

      onShowToast(`Plan "${payload.name}" created successfully!`);
      setIsCreatePlanModalOpen(false);
      fetchPlans();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditPlanOpen = (p: PlanItem) => {
    setEditingPlan(p);
    setPlanForm({
      name: p.name,
      code: p.code,
      description: p.description || "",
      monthlyPrice: p.monthlyPrice,
      yearlyPrice: p.yearlyPrice,
      trialDays: p.trialDays,
      transactionFeePercent: p.transactionFeePercent || 0,
      maxProducts: p.limits?.maxProducts || 500,
      maxOrders: p.limits?.maxOrders || 5000,
      maxStaff: p.limits?.maxStaff || 5,
      maxStorageMB: p.limits?.maxStorageMB || 2000,
      featureListStr: (p.featureList || []).join(", "),
      isVisible: p.isVisible,
      isPopular: !!p.isPopular
    });
    setIsEditPlanModalOpen(true);
  };

  const handleSaveEditedPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      const payload = {
        name: planForm.name,
        description: planForm.description,
        monthlyPrice: Number(planForm.monthlyPrice),
        yearlyPrice: Number(planForm.yearlyPrice),
        trialDays: Number(planForm.trialDays),
        transactionFeePercent: Number(planForm.transactionFeePercent),
        limits: {
          maxProducts: Number(planForm.maxProducts),
          maxOrders: Number(planForm.maxOrders),
          maxStaff: Number(planForm.maxStaff),
          maxStorageMB: Number(planForm.maxStorageMB)
        },
        featureList: planForm.featureListStr.split(",").map((s) => s.trim()).filter(Boolean),
        isVisible: planForm.isVisible,
        isPopular: planForm.isPopular
      };

      const res = await fetch(`/api/superadmin/billing/plans/${editingPlan._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to edit plan");

      onShowToast(`Plan "${payload.name}" updated! (Existing subscribers remain grandfathered).`);
      setIsEditPlanModalOpen(false);
      fetchPlans();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Subscription Actions
  const handleSubscriptionAction = async () => {
    if (!selectedSub || !subActionType) return;
    try {
      const res = await fetch(`/api/superadmin/billing/subscriptions/${selectedSub._id}/action`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: subActionType,
          newPlan: targetPlanCode
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      onShowToast(`Subscription updated for ${selectedSub.storeName}`);
      setSelectedSub(null);
      setSubActionType(null);
      fetchSubscriptions();
      fetchOverview();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Invoice Status Action
  const handleInvoiceStatus = async (invId: string, status: string) => {
    try {
      const res = await fetch(`/api/superadmin/billing/invoices/${invId}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onShowToast(`Invoice marked as ${status}`);
        fetchInvoices();
        fetchOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Payment Retry Action
  const handleRetryPayment = async (logId: string) => {
    try {
      const res = await fetch(`/api/superadmin/billing/payments/retry`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ paymentLogId: logId })
      });
      const data = await res.json();
      if (res.ok) {
        onShowToast(data.message);
        fetchPayments();
        fetchOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/superadmin/billing/coupons", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(couponForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create coupon");

      onShowToast(`Coupon code ${couponForm.code} created!`);
      setIsCouponModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update Tax Config
  const handleUpdateTaxRate = async (id: string, taxRatePercent: number) => {
    try {
      const res = await fetch(`/api/superadmin/billing/tax-currency/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ taxRatePercent })
      });
      if (res.ok) {
        onShowToast("Tax rule updated successfully");
        fetchTaxConfigs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !overview) {
    return (
      <div className={styles.tableCard} style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
        Loading platform financial dashboard...
      </div>
    );
  }

  return (
    <div className={styles.settingsSectionCard}>
      {/* Breadcrumb Header */}
      <div className={styles.settingsHorizontalHeader}>
        <button className={styles.settingsBreadcrumbBack}>
          <span style={{ color: "#6b7280", fontWeight: 400 }}>Billing & Subscriptions</span>
        </button>
        <span style={{ color: "#9ca3af", margin: "0 2px" }}>&rsaquo;</span>
        <span style={{ color: "#000000", fontWeight: 400 }}>
          {
            (
              {
                "overview": "Overview",
                "plans": "Plans & Pricing",
                "subscriptions": "Subscriptions",
                "invoices": "Invoices & GST",
                "payments": "Payments & Dunning",
                "coupons": "Coupons & Credits",
                "tax-currency": "Tax & Multi-Currency"
              } as Record<string, string>
            )[subTab]
          }
        </span>
      </div>

      {/* Horizontal Sub-Nav Tabs */}
      <div className={styles.settingsSubNavContainer} style={{ marginBottom: "20px" }}>
        <div className={styles.settingsHorizontalTabs}>
          {[
            { id: "overview", label: "Overview" },
            { id: "plans", label: "Plans & Pricing" },
            { id: "subscriptions", label: "Subscriptions" },
            { id: "invoices", label: "Invoices & GST" },
            { id: "payments", label: "Payments & Dunning" },
            { id: "coupons", label: "Coupons & Credits" },
            { id: "tax-currency", label: "Tax & Multi-Currency" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`${styles.settingsHorizontalTab} ${subTab === tab.id ? styles.settingsHorizontalTabActive : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {subTab === "overview" && <BillingOverview overview={overview} />}

      {subTab === "plans" && (
        <BillingPlans
          plans={plans}
          onOpenCreate={() => {
            setPlanForm({
              name: "",
              code: "",
              description: "",
              monthlyPrice: 49,
              yearlyPrice: 490,
              trialDays: 14,
              transactionFeePercent: 1.5,
              maxProducts: 500,
              maxOrders: 5000,
              maxStaff: 5,
              maxStorageMB: 2000,
              featureListStr: "Custom Domain, Cart Recovery, 24/7 Support",
              isVisible: true,
              isPopular: false
            });
            setIsCreatePlanModalOpen(true);
          }}
          onOpenEdit={handleEditPlanOpen}
        />
      )}

      {subTab === "subscriptions" && (
        <BillingSubscriptions
          subscriptions={subscriptions}
          onManageSub={(sub) => {
            setSelectedSub(sub);
            setSubActionType("change_plan");
          }}
        />
      )}

      {subTab === "invoices" && (
        <BillingInvoices invoices={invoices} onStatusChange={handleInvoiceStatus} />
      )}

      {subTab === "payments" && (
        <BillingPayments paymentLogs={paymentLogs} onRetryPayment={handleRetryPayment} />
      )}

      {subTab === "coupons" && (
        <BillingCoupons coupons={coupons} onOpenCreateCoupon={() => setIsCouponModalOpen(true)} />
      )}

      {subTab === "tax-currency" && (
        <BillingTaxCurrency taxConfigs={taxConfigs} onUpdateTaxRate={handleUpdateTaxRate} />
      )}

      {/* Modals */}
      <PlanModal
        isOpen={isCreatePlanModalOpen || isEditPlanModalOpen}
        isEdit={isEditPlanModalOpen}
        editingPlan={editingPlan}
        planForm={planForm}
        setPlanForm={setPlanForm}
        onClose={() => {
          setIsCreatePlanModalOpen(false);
          setIsEditPlanModalOpen(false);
        }}
        onSubmit={isEditPlanModalOpen ? handleSaveEditedPlan : handleCreatePlan}
      />

      <ManageSubModal
        selectedSub={selectedSub}
        subActionType={subActionType}
        setSubActionType={setSubActionType}
        targetPlanCode={targetPlanCode}
        setTargetPlanCode={setTargetPlanCode}
        plans={plans}
        onClose={() => {
          setSelectedSub(null);
          setSubActionType(null);
        }}
        onSubmit={handleSubscriptionAction}
      />

      <CouponModal
        isOpen={isCouponModalOpen}
        couponForm={couponForm}
        setCouponForm={setCouponForm}
        onClose={() => setIsCouponModalOpen(false)}
        onSubmit={handleCreateCoupon}
      />
    </div>
  );
}
