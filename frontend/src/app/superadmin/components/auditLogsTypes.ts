export interface AuditLogItem {
  _id: string;
  timestamp: string;
  adminUser: string;
  adminEmail: string;
  role: string;
  action: string;
  actionCategory: 'auth' | 'impersonation' | 'tenant' | 'billing' | 'domain' | 'settings' | 'role' | 'export' | 'communication' | 'security';
  target: string;
  targetId?: string;
  storeId?: string;
  storeName?: string;
  beforeValue?: any;
  afterValue?: any;
  diff?: any;
  ipAddress: string;
  country: string;
  userAgent: string;
  reason?: string;
  result: 'success' | 'failed' | 'blocked';
  isSuspicious: boolean;
  suspiciousReason?: string;
}

export interface AuditLogsResponse {
  logs: AuditLogItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  suspiciousCount: number;
}
