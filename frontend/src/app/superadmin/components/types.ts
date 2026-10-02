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
  supportEmail?: string;
  supportPhone?: string;
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

export interface TimelineItem {
  _id?: string;
  action: string;
  details?: string;
  performedBy?: string;
  timestamp: string;
}

export interface NoteItem {
  _id?: string;
  text: string;
  author: string;
  createdAt: string;
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
  currentWebsite?: string;
  monthlyOrders?: "< 50" | "50-500" | "500-2000" | "2000+" | "";
  message?: string;
  preferredTime?: string;
  utmSource?: string;
  status: string;
  pipelineStage: "New" | "Contacted" | "Demo Scheduled" | "Demo Done" | "Trial Started" | "Won" | "Lost";
  leadScore?: number;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  assignedOwner?: {
    id?: string;
    name?: string;
    email?: string;
  };
  scheduledDemo?: {
    date?: string;
    meetingUrl?: string;
    notes?: string;
  };
  lossReason?: string;
  lossNotes?: string;
  isSpam?: boolean;
  isDuplicate?: boolean;
  slaBreached?: boolean;
  followUpReminder?: string;
  notes?: string;
  notesHistory?: NoteItem[];
  timeline?: TimelineItem[];
  convertedStoreId?: string;
  convertedAt?: string;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CrmAnalytics {
  totalLeads: number;
  wonCount: number;
  lostCount: number;
  pendingCount: number;
  demoScheduledCount: number;
  slaBreachesCount: number;
  conversionRate: number;
  avgTimeToConvertDays: number;
  leadsBySource: Record<string, number>;
  lostReasons: Record<string, number>;
  funnelMetrics: Record<string, number>;
}

export interface Stats {
  totalStores: number;
  activeStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalDemoRequests?: number;
  pendingDemoRequests?: number;
  mrr?: number;
  arr?: number;
  planCounts?: { starter: number; pro: number; enterprise: number; custom?: number };
  pendingDomains?: number;
  recentLogs?: any[];
  recentStores?: any[];
  systemHealth?: {
    database: string;
    api: string;
    storage: string;
    uptimeSeconds: number;
  };
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
