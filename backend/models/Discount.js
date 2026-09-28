import mongoose from "mongoose";

// Define Discount Schema
const discountSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", index: true },
  code: { type: String, required: true },
  type: { type: String, default: "percentage" }, // "percentage" or "fixed"
  value: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Discount = mongoose.models.Discount || mongoose.model("Discount", discountSchema);

// ─── Indexes ────────────────────────────────────────────────────────────────
// NOTE: { code: 1 } unique index auto-created from schema unique: true above

// Checkout hot path: findOne({ code: X, active: true }) on every order
// Compound superset of the unique index — MongoDB picks the most selective one
discountSchema.index({ storeId: 1, code: 1 }, { unique: true });
discountSchema.index({ storeId: 1, code: 1, active: 1 });

// Admin listing: show active codes first
discountSchema.index({ active: 1, createdAt: -1 });
// ────────────────────────────────────────────────────────────────────────────

export default Discount;
