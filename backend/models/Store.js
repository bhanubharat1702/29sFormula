import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
  // ── Core Identity ────────────────────────────────────────────
  name: {
    type: String,
    required: true,
    trim: true
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  customDomain: {
    type: String,
    default: '',
    lowercase: true,
    trim: true,
    index: true
  },

  // ── Business Branding (shown on storefront) ──────────────────
  businessName: {
    type: String,
    default: '',
    trim: true
  },
  businessLogo: {
    type: String,   // URL to uploaded logo image
    default: ''
  },

  // ── Owner Reference ──────────────────────────────────────────
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  // Denormalized for fast lookups without User populate
  ownerName:  { type: String, default: '' },
  ownerEmail: { type: String, default: '', lowercase: true, trim: true },
  ownerPhone: { type: String, default: '' },

  // ── Business Details ─────────────────────────────────────────
  businessType: {
    type: String,
    enum: ['retail', 'fashion', 'food', 'electronics', 'services', 'beauty', 'other'],
    default: 'retail'
  },
  country:  { type: String, default: 'India' },
  currency: { type: String, default: 'INR' },

  // ── Plan & Subscription ──────────────────────────────────────
  plan: {
    type: String,
    enum: ['starter', 'pro', 'enterprise'],
    default: 'starter'
  },
  status: {
    type: String,
    enum: ['trial', 'active', 'suspended', 'cancelled'],
    default: 'trial'
  },
  trialDays:   { type: Number, default: 14 },
  trialEndsAt: { type: Date,   default: null },

  // ── Flags ────────────────────────────────────────────────────
  isActive: {
    type: Boolean,
    default: true
  },

  // ── Provisioning Metadata ────────────────────────────────────
  provisionedBy: {
    type: String,
    enum: ['superadmin', 'self_signup', 'demo_request'],
    default: 'superadmin'
  },
  demoRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DemoRequest',
    default: null
  },
  internalNotes: { type: String, default: '' },

  // ── Theme (legacy) ───────────────────────────────────────────
  themeConfig: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

const Store = mongoose.models.Store || mongoose.model('Store', StoreSchema);
export default Store;
