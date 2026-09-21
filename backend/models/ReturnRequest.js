import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  orderObjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  reason: { type: String, required: true },
  returnType: { type: String, enum: ['Refund', 'Replacement'], required: true },
  images: [{ type: String }],
  status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
  adminNotes: { type: String, default: "" }
}, { timestamps: true });

const ReturnRequest = mongoose.models.ReturnRequest || mongoose.model("ReturnRequest", returnRequestSchema);

// ─── Indexes ────────────────────────────────────────────────────────────────
// Return lookup by order ObjectId — used in every findOne and $in batch query
returnRequestSchema.index({ orderObjectId: 1 });

// Admin return queue filtered by status (Pending / Approved / Rejected)
returnRequestSchema.index({ status: 1, createdAt: -1 });
// ────────────────────────────────────────────────────────────────────────────

export default ReturnRequest;
