import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { generalLimiter } from "./middleware/rateLimiter.js";
import { initSentry, captureException } from "./config/sentry.js";

// Import Routers
import uploadRoutes from "./routes/uploadRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import storefrontRoutes from "./routes/storefrontRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";

const app = express();

// Initialize Sentry error and performance tracking
initSentry(app);

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

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
app.use("/", productRoutes);
app.use("/", reviewRoutes);
app.use("/", discountRoutes);

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
