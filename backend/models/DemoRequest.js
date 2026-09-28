import mongoose from "mongoose";

const demoRequestSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subdomain: { type: String },
  businessType: { type: String, default: "Retail" },
  message: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Contacted", "Approved", "Rejected"], default: "Pending" },
  notes: { type: String, default: "" }
}, { timestamps: true });

const DemoRequest = mongoose.models.DemoRequest || mongoose.model("DemoRequest", demoRequestSchema);

export default DemoRequest;
