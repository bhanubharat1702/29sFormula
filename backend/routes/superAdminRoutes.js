import express from "express";
import authRouter from "./superadmin/auth.js";
import statsRouter from "./superadmin/stats.js";
import storesRouter from "./superadmin/stores.js";
import demoCrmRouter from "./superadmin/demoCrm.js";
import tenantsRouter from "./superadmin/tenants.js";
import billingRouter from "./superadmin/billing.js";
import analyticsRouter from "./superadmin/analytics.js";

const router = express.Router();

// Mount modular superadmin sub-routers
router.use(authRouter);
router.use(statsRouter);
router.use(storesRouter);
router.use(demoCrmRouter);
router.use(tenantsRouter);
router.use(billingRouter);
router.use(analyticsRouter);

export default router;

