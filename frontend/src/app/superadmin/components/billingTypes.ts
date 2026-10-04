export interface PlanItem {
  _id: string;
  name: string;
  code: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  trialDays: number;
  transactionFeePercent?: number;
  limits: {
    maxProducts: number;
    maxOrders: number;
    maxStaff: number;
    maxStorageMB: number;
  };
  featureFlags?: {
    customDomain?: boolean;
    advancedAnalytics?: boolean;
    aiTools?: boolean;
    loyaltyProgram?: boolean;
    multiCurrency?: boolean;
    [key: string]: any;
  };
  featureList: string[];
  isVisible: boolean;
  isPopular?: boolean;
}

export interface SubscriptionItem {
  _id: string;
  storeName: string;
  subdomain: string;
  ownerEmail: string;
  plan: string;
  status: 'trial' | 'active' | 'past_due' | 'suspended' | 'cancelled';
  mrr: number;
  billingCycle: 'monthly' | 'annual';
  paymentMethod: string;
  nextBillingDate: string;
  createdAt: string;
}

export interface InvoiceItem {
  _id: string;
  invoiceNumber: string;
  storeId: string;
  storeName: string;
  subdomain: string;
  amount: number;
  taxAmount: number;
  taxRate: number;
  totalAmount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded' | 'void';
  billingCycle: string;
  description: string;
  dueDate: string;
  paidAt?: string;
  refundedAt?: string;
  pdfUrl?: string;
  taxDetails?: {
    gstin?: string;
    vatNumber?: string;
    country?: string;
  };
}

export interface PaymentLogItem {
  _id: string;
  storeId: string;
  invoiceId?: string;
  amount: number;
  currency: string;
  gateway: 'Stripe' | 'Razorpay' | 'Manual';
  status: 'success' | 'failed' | 'retrying' | 'refunded';
  failureReason?: string;
  attemptNumber: number;
  nextRetryAt?: string;
  dunningStep: 'initial' | 'day_1' | 'day_3' | 'day_5' | 'day_7_suspended' | 'resolved';
  createdAt: string;
}

export interface CouponItem {
  _id: string;
  code: string;
  description: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  maxRedemptions?: number;
  timesRedeemed: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface TaxCurrencyConfigItem {
  _id: string;
  country: string;
  taxName: string;
  taxRatePercent: number;
  currencyCode: string;
  exchangeRateToUSD: number;
}

export interface BillingOverviewData {
  mrr: number;
  arr: number;
  revenueThisMonth: number;
  outstandingAmount: number;
  refundsAmount: number;
  failedPaymentsCount: number;
  netRevenueRetention: number;
  subscriptionStats: {
    active: number;
    trialing: number;
    pastDue: number;
    suspended: number;
    canceled: number;
    total: number;
  };
}
