import mongoose from "mongoose";

const addressItemSchema = new mongoose.Schema({
  label:    { type: String, default: "Home" },
  address:  { type: String, required: true },
  city:     { type: String, required: true },
  stateVal: { type: String, required: true },
  pinCode:  { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: true, timestamps: true });

const userSchema = new mongoose.Schema({
  // ── Store / Tenant Scope ─────────────────────────────────────
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    index: true,
    default: null
  },

  // ── Identity ─────────────────────────────────────────────────
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String },
  phone:    { type: String, default: '' },

  // ── Role ─────────────────────────────────────────────────────
  // user    → regular storefront customer
  // admin   → merchant store staff (limited admin access)
  // owner   → merchant store owner (full admin access for their store)
  role: {
    type: String,
    enum: ["user", "admin", "owner"],
    default: "user"
  },
  isAdmin: { type: Boolean, default: false },  // legacy flag (kept for compat)
  isOwner: { type: Boolean, default: false },  // true if this user is a tenant owner

  // ── Tenant Owner Flags ───────────────────────────────────────
  mustChangePassword:  { type: Boolean, default: false },  // force change on first login
  onboardingComplete:  { type: Boolean, default: false },  // has completed onboarding wizard

  // ── OAuth ────────────────────────────────────────────────────
  googleId:       { type: String },
  isGoogleUser:   { type: Boolean, default: false },
  profilePicture: { type: String },

  // ── Customer Addresses (for storefront users) ─────────────────
  addresses: [addressItemSchema]
}, { timestamps: true });

// ── Indexes ──────────────────────────────────────────────────────────────────
// email unique index is auto-created from schema above
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ storeId: 1, role: 1 });
// ─────────────────────────────────────────────────────────────────────────────

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
