import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import {
  getBillingOverview,
  getPlans,
  createPlan,
  updatePlan,
  getSubscriptions,
  handleSubscriptionAction,
  getInvoices,
  updateInvoiceStatus,
  getPayments,
  retryPayment,
  getCoupons,
  createCoupon,
  getTaxCurrencyConfigs,
  updateTaxCurrencyConfig,
  seedBillingDemoData
} from "../../controllers/superadmin/billingController.js";

const router = express.Router();

export { seedBillingDemoData };

router.get("/api/superadmin/billing/overview", verifySuperAdminToken, getBillingOverview);

router.get("/api/superadmin/billing/plans", verifySuperAdminToken, getPlans);
router.post("/api/superadmin/billing/plans", verifySuperAdminToken, createPlan);
router.put("/api/superadmin/billing/plans/:id", verifySuperAdminToken, updatePlan);

router.get("/api/superadmin/billing/subscriptions", verifySuperAdminToken, getSubscriptions);
router.put("/api/superadmin/billing/subscriptions/:id/action", verifySuperAdminToken, handleSubscriptionAction);

router.get("/api/superadmin/billing/invoices", verifySuperAdminToken, getInvoices);
router.put("/api/superadmin/billing/invoices/:id/status", verifySuperAdminToken, updateInvoiceStatus);

router.get("/api/superadmin/billing/payments", verifySuperAdminToken, getPayments);
router.post("/api/superadmin/billing/payments/retry", verifySuperAdminToken, retryPayment);

router.get("/api/superadmin/billing/coupons", verifySuperAdminToken, getCoupons);
router.post("/api/superadmin/billing/coupons", verifySuperAdminToken, createCoupon);

router.get("/api/superadmin/billing/tax-currency", verifySuperAdminToken, getTaxCurrencyConfigs);
router.put("/api/superadmin/billing/tax-currency/:id", verifySuperAdminToken, updateTaxCurrencyConfig);

export default router;
