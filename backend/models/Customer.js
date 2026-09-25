import mongoose from "mongoose";

const addressItemSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  address: { type: String, required: true },
  city: { type: String, required: true },
  stateVal: { type: String, required: true },
  pinCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: true, timestamps: true });

// Define Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  addresses: [addressItemSchema],
  cart: { type: Array, default: [] },
  totalOrders: { type: Number, default: 0 },
  totalSpend: { type: Number, default: 0 }
}, { timestamps: true });

// ─── Indexes ────────────────────────────────────────────────────────────────
// NOTE: { email: 1 } unique index is auto-created from schema unique: true above

// Admin customer listing: new signups sorted by date
customerSchema.index({ createdAt: -1 });

// CRM top-customers view sorted by highest spend first
customerSchema.index({ totalSpend: -1 });

// COD verification / SMS lookup by phone (sparse: not all customers provide phone)
customerSchema.index({ phone: 1 }, { sparse: true });
// ────────────────────────────────────────────────────────────────────────────

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
