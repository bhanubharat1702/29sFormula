import mongoose from "mongoose";

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  profilePicture: { type: String },
  phone: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

// ─── Indexes ────────────────────────────────────────────────────────────────
// NOTE: { email: 1 } unique index auto-created from schema unique: true above

// Google OAuth: findOne({ googleId }) during social login (sparse: only Google users)
userSchema.index({ googleId: 1 }, { sparse: true });
// ────────────────────────────────────────────────────────────────────────────

export default User;
