export interface DomainRecord {
  _id: string;
  storeId: string;
  storeName: string;
  subdomain: string;
  ownerEmail: string;
  ownerName: string;
  plan: string;
  domain: string;
  type: 'subdomain' | 'custom';
  isPrimary: boolean;
  dnsStatus: 'pending' | 'dns_verified' | 'ssl_issued' | 'active' | 'failed';
  sslStatus: 'pending' | 'issuing' | 'active' | 'expiring_soon' | 'expired' | 'failed';
  createdAt: string;
  lastDnsCheckAt?: string;
  verificationToken?: string;
  dnsFailureReason?: string;
  targetCname?: string;
  targetA?: string;
  isBlocked?: boolean;
  blockReason?: string;
  requiresManualApproval?: boolean;
  approvedByAdmin?: boolean;
  redirectWwwToRoot?: boolean;
  redirectSubdomainToCustom?: boolean;
  sslIssuedAt?: string;
  sslExpiresAt?: string;
}

export interface ReservedSubdomainItem {
  _id: string;
  subdomain: string;
  reason: string;
  addedBy: string;
  createdAt: string;
}

export interface DomainSettings {
  manualApprovalRequired: boolean;
  cnameTargetHost: string;
  aRecordTargetIp: string;
  platformOwnDomain: string;
  verificationMaxHours: number;
  sslRenewalDaysBeforeExpiry: number;
  planDomainLimits: {
    starter: number;
    growth: number;
    pro: number;
    enterprise: number;
  };
}

export interface DomainsOverviewData {
  domains: DomainRecord[];
  settings: DomainSettings;
}
