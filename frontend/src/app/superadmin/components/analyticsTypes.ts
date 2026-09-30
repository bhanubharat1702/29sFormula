export interface AnalyticsReportGroup {
  group: 'revenue' | 'growth' | 'retention' | 'merchant_success' | 'funnel' | 'usage' | 'performance' | 'geography';
  dateRange: '7d' | '30d' | '90d' | '12m' | 'all';
  plan: string;
  country: string;
  liveSummary?: {
    totalStores: number;
    totalOrders: number;
    totalProducts: number;
    demoRequestsCount: number;
    liveGmv: number;
  };
  data: any;
}

export interface SavedReportItem {
  _id: string;
  name: string;
  description: string;
  reportGroup: string;
  filters: {
    dateRange: string;
    plan: string;
    country: string;
    source?: string;
  };
  createdBy: string;
  isScheduled: boolean;
  scheduleFrequency: 'daily' | 'weekly' | 'monthly';
  emailRecipients: string[];
  createdAt: string;
}
