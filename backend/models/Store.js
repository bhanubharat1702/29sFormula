import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['paid', 'pending', 'failed', 'refunded'], default: 'paid' },
  downloadUrl: { type: String, default: '' }
}, { _id: true });

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: 'Super Admin' },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const auditTrailSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, default: 'Super Admin' },
  details: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const impersonationLogSchema = new mongoose.Schema({
  superAdminEmail: { type: String, required: true },
  reason: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
}, { _id: true });

const domainItemSchema = new mongoose.Schema({
  domain: { type: String, required: true, lowercase: true, trim: true },
  type: { type: String, enum: ['subdomain', 'custom'], default: 'custom' },
  isPrimary: { type: Boolean, default: false },
  dnsStatus: {
    type: String,
    enum: ['pending', 'dns_verified', 'ssl_issued', 'active', 'failed'],
    default: 'pending'
  },
  sslStatus: {
    type: String,
    enum: ['pending', 'issuing', 'active', 'expiring_soon', 'expired', 'failed'],
    default: 'pending'
  },
  verificationToken: { type: String, default: '' },
  targetCname: { type: String, default: 'stores.yourplatform.com' },
  targetA: { type: String, default: '192.0.2.1' },
  redirectWwwToRoot: { type: Boolean, default: true },
  redirectSubdomainToCustom: { type: Boolean, default: true },
  requiresManualApproval: { type: Boolean, default: false },
  approvedByAdmin: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  blockReason: { type: String, default: '' },
  lastDnsCheckAt: { type: Date, default: null },
  dnsFailureReason: { type: String, default: '' },
  sslIssuedAt: { type: Date, default: null },
  sslExpiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

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
  ownerName: { type: String, default: '' },
  ownerEmail: { type: String, default: '', lowercase: true, trim: true },
  ownerEmailVerified: { type: Boolean, default: false },
  ownerPhone: { type: String, default: '' },
  supportEmail: { type: String, default: '', lowercase: true, trim: true },
  supportEmailVerified: { type: Boolean, default: false },
  supportPhone: { type: String, default: '' },

  // ── Business Details ─────────────────────────────────────────
  businessType: {
    type: String,
    enum: [
      'retail', 'fashion', 'beauty', 'electronics', 'food', 'health',
      'home', 'jewelry', 'sports', 'kids', 'automotive', 'books',
      'art', 'services', 'digital', 'other'
    ],
    default: 'retail'
  },
  country: { type: String, default: 'India' },
  currency: { type: String, default: 'INR' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  address1: { type: String, default: '' },
  address2: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  postalCode: { type: String, default: '' },

  // ── Plan & Subscription ──────────────────────────────────────
  plan: {
    type: String,
    default: 'starter',
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['trial', 'active', 'past_due', 'suspended', 'cancelled', 'scheduled_for_deletion'],
    default: 'trial'
  },
  suspensionReason: { type: String, default: '' },
  suspendedAt: { type: Date, default: null },
  scheduledDeletionAt: { type: Date, default: null },
  trialDays: { type: Number, default: 14 },
  trialEndsAt: { type: Date, default: null },
  mrr: { type: Number, default: 0 },
  healthScore: { type: Number, default: 95 },
  lastActiveAt: { type: Date, default: Date.now },


  // ── Billing Sub-document ─────────────────────────────────────
  billing: {
    subscriptionId: { type: String, default: '' },
    billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
    paymentMethod: { type: String, default: 'Credit Card **** 4242' },
    credits: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    invoices: [invoiceSchema]
  },

  // ── Limit Overrides (Custom Quotas) ──────────────────────────
  limitOverrides: {
    maxProducts: { type: Number, default: null },
    maxOrders: { type: Number, default: null },
    maxStaff: { type: Number, default: null },
    maxStorageMB: { type: Number, default: null }
  },

  // ── Feature Flags Overrides ──────────────────────────────────
  featureFlags: {
    customDomain: { type: Boolean, default: null },
    advancedAnalytics: { type: Boolean, default: null },
    aiTools: { type: Boolean, default: null },
    loyaltyProgram: { type: Boolean, default: false },
    multiCurrency: { type: Boolean, default: false },
    betaCheckout: { type: Boolean, default: false }
  },

  // ── Domains list ─────────────────────────────────────────────
  domains: [domainItemSchema],

  // ── Notes & Audit Log ────────────────────────────────────────
  internalNotes: { type: String, default: '' },
  notes: [noteSchema],
  auditTrail: [auditTrailSchema],
  impersonationLogs: [impersonationLogSchema],

  // ── Flags & Infrastructure ───────────────────────────────────
  isActive: {
    type: Boolean,
    default: true
  },
  isolationTier: {
    type: String,
    enum: ['shared', 'dedicated_db', 'enterprise_cluster'],
    default: 'shared'
  },
  provisionedBy: {
    type: String,
    default: 'superadmin'
  },

  demoRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DemoRequest',
    default: null
  },

  // ── Soft Delete Grace Period ─────────────────────────────────
  deletedAt: { type: Date, default: null },
  deletedReason: { type: String, default: '' },

  // ── Theme (legacy) ───────────────────────────────────────────
  themeConfig: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

StoreSchema.index({ "domains.domain": 1 }, { unique: true, sparse: true });

const Store = mongoose.models.Store || mongoose.model('Store', StoreSchema);
export default Store;

