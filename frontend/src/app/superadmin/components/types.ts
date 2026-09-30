export interface StoreItem {
  _id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  businessLogo?: string;
  ownerId?: { _id?: string; name?: string; email?: string; phone?: string } | string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  businessName?: string;
  businessType?: string;
  country?: string;
  currency?: string;
  timezone?: string;
  productCount?: number;
  orderCount?: number;
  plan?: string;
  status?: string;
  isActive?: boolean;
  internalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  mrr?: number;
  healthScore?: number;
  trialDays?: number;
  trialEndsAt?: string;
  isolationTier?: string;
  provisionedBy?: string;
}

export interface DemoRequestItem {
  _id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  subdomain?: string;
  businessType?: string;
  plan?: string;
  message?: string;
  status: "Pending" | "Contacted" | "Approved" | "Rejected";
  createdAt: string;
}

export interface Stats {
  totalStores: number;
  activeStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalDemoRequests?: number;
  pendingDemoRequests?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  twoFactor: boolean;
}

export interface FeatureFlag {
  key: string;
  name: string;
  enabled: boolean;
  rollout: number;
  plans: string;
}

export interface ConfirmModalData {
  isOpen: boolean;
  title: string;
  message: string;
  actionLabel: string;
  isDanger?: boolean;
  onConfirm: () => void;
}
