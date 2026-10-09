import dotenv from "dotenv";
dotenv.config();

// Register global Mongoose tenant scoping plugin before model loading
import "./plugins/mongooseTenantPlugin.js";

import express from "express";
import cors from "cors";

import { generalLimiter } from "./middleware/rateLimiter.js";
import { initSentry, captureException } from "./config/sentry.js";
import { startStatsCron } from "./cron/statsCron.js";
import { startReportScheduler } from "./workers/reportWorker.js";

// Initialize cron jobs & background report workers
startStatsCron();
startReportScheduler();

// Import Routers
import uploadRoutes from "./routes/uploadRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import storefrontRoutes from "./routes/storefrontRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import supportAccessRoutes from "./routes/supportAccessRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";
import merchantDomainRoutes from "./routes/merchantDomainRoutes.js";
import taxZoneRoutes from "./routes/taxZoneRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";

import { tenantResolver } from "./middleware/tenantResolver.js";
import { storefrontSuspensionGate } from "./middleware/suspensionGate.js";

const app = express();

// Initialize Sentry error and performance tracking
initSentry(app);

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Resolve Tenant Context (req.storeId & req.store & AsyncLocalStorage) for every incoming request
app.use(tenantResolver);

// Global Storefront Suspension Gate (Blocks public storefront traffic when store is suspended)
app.use(storefrontSuspensionGate);

// Apply general API rate limiting
app.use("/api", generalLimiter);

// Mount Routes
app.use("/", uploadRoutes);
app.use("/", settingsRoutes);
app.use("/", orderRoutes);
app.use("/", customerRoutes);
app.use("/", authRoutes);
app.use("/", storefrontRoutes);
app.use("/", adminRoutes);
app.use("/", supportAccessRoutes);
app.use("/", productRoutes);
app.use("/", reviewRoutes);
app.use("/", discountRoutes);
app.use("/", superAdminRoutes);
app.use("/", platformRoutes);
app.use("/", merchantDomainRoutes);
app.use("/", taxZoneRoutes);
app.use("/", marketRoutes);

// Global Error Handler Middleware with Sentry Exception Capture
app.use((err, req, res, next) => {
  console.error("Unhandled Backend Exception:", err);
  captureException(err, {
    extra: {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    }
  });
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: err.message || "An unexpected server error occurred."
  });
});

export default app;
