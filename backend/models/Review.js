import mongoose from "mongoose";

// Define Review Schema
const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  author: { type: String, required: true },
  avatar: { type: String },
  avatarBg: { type: String, default: "#f1f5f9" },
  avatarColor: { type: String, default: "#334155" },
  location: { type: String, default: "IN" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  title: { type: String },
  images: { type: [String], default: [] },
  verified: { type: Boolean, default: true },
  helpful: { type: Number, default: 0 }
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

// ─── Indexes ────────────────────────────────────────────────────────────────
// Product review page: all reviews for a product, newest first (ESR)
reviewSchema.index({ productId: 1, createdAt: -1 });

// Rating distribution for the aggregate stats panel
reviewSchema.index({ productId: 1, rating: 1 });

// Admin moderation queue: all reviews sorted newest first
reviewSchema.index({ createdAt: -1 });
// ────────────────────────────────────────────────────────────────────────────

export default Review;
