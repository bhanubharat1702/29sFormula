import mongoose from "mongoose";

// Define Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  cart: { type: Array, default: [] },
  totalOrders: { type: Number, default: 0 },
  totalSpend: { type: Number, default: 0 }
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
