import mongoose from 'mongoose';

// ── Billing Plan Schema ──────────────────────────────────────────────────
const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }, // Starter, Growth, Pro, Enterprise
  code: { type: String, required: true, unique: true, lowercase: true, trim: true }, // starter, growth, pro, enterprise
  description: { type: String, default: '' },
  monthlyPrice: { type: Number, required: true, min: 0 },
  yearlyPrice: { type: Number, required: true, min: 0 },
  trialDays: { type: Number, default: 14 },
  transactionFeePercent: { type: Number, default: 0 }, // e.g. 2.0%, 1.0%, 0.5% if gateway skipped
  limits: {
    maxProducts: { type: Number, default: 100 },
    maxOrders: { type: Number, default: 1000 },
    maxStaff: { type: Number, default: 2 },
    maxStorageMB: { type: Number, default: 500 }
  },
  featureList: [{ type: String }],
  isVisible: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

// ── Coupon / Credit Schema ───────────────────────────────────────────────
const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: '' },
  discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
  discountValue: { type: Number, required: true, min: 0 },
  maxRedemptions: { type: Number, default: null },
  timesRedeemed: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ── Invoice Schema ───────────────────────────────────────────────────────
const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  storeName: { type: String, default: '' },
  subdomain: { type: String, default: '' },
  amount: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 }, // e.g., 18% GST / VAT
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['paid', 'pending', 'failed', 'refunded', 'void'], default: 'pending', index: true },
  billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
  description: { type: String, default: '' },
  paidAt: { type: Date, default: null },
  refundedAt: { type: Date, default: null },
  dueDate: { type: Date, default: Date.now },
  pdfUrl: { type: String, default: '' },
  taxDetails: {
    gstin: { type: String, default: '' },
    vatNumber: { type: String, default: '' },
    country: { type: String, default: 'India' }
  }
}, { timestamps: true });

// ── Payment Event / Dunning Retry Log ────────────────────────────────────
const PaymentLogSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'BillingInvoice', default: null },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  gateway: { type: String, enum: ['Stripe', 'Razorpay', 'Manual'], default: 'Stripe' },
  status: { type: String, enum: ['success', 'failed', 'retrying', 'refunded'], required: true },
  failureReason: { type: String, default: '' },
  attemptNumber: { type: Number, default: 1 }, // Retry 1, 3, 5, 7
  nextRetryAt: { type: Date, default: null },
  dunningStep: { type: String, enum: ['initial', 'day_1', 'day_3', 'day_5', 'day_7_suspended', 'resolved'], default: 'initial' }
}, { timestamps: true });

// ── Add-On & Extra Usage Catalog / Tenant Addons ─────────────────────────
const AddonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  unitPrice: { type: Number, required: true },
  unitType: { type: String, enum: ['per_staff', 'sms_pack_1000', 'theme_license', 'extra_storage_10gb'], required: true },
  description: { type: String, default: '' }
}, { timestamps: true });

// ── Platform Tax Rates & Multi-Currency Config ────────────────────────────
const TaxCurrencyConfigSchema = new mongoose.Schema({
  country: { type: String, required: true, unique: true },
  taxName: { type: String, default: 'GST' }, // GST, VAT, Sales Tax
  taxRatePercent: { type: Number, default: 18 },
  currencyCode: { type: String, default: 'USD' },
  exchangeRateToUSD: { type: Number, default: 1.0 }
}, { timestamps: true });

export const Plan = mongoose.models.Plan || mongoose.model('Plan', PlanSchema);
export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
export const BillingInvoice = mongoose.models.BillingInvoice || mongoose.model('BillingInvoice', InvoiceSchema);
export const PaymentLog = mongoose.models.PaymentLog || mongoose.model('PaymentLog', PaymentLogSchema);
export const Addon = mongoose.models.Addon || mongoose.model('Addon', AddonSchema);
export const TaxCurrencyConfig = mongoose.models.TaxCurrencyConfig || mongoose.model('TaxCurrencyConfig', TaxCurrencyConfigSchema);
