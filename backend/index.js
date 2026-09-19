import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

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
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Connect to MongoDB
connectDB();

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
