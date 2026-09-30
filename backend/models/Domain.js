import mongoose from 'mongoose';

// Reserved subdomains that cannot be registered by merchants
export const RESERVED_SUBDOMAINS = [
  'admin', 'api', 'app', 'www', 'mail', 'billing', 'assets', 'static', 
  'superadmin', 'status', 'dashboard', 'auth', 'login', 'signup', 
  'store', 'stores', 'portal', 'checkout', 'cdn', 'demo', 'staging', 'dev', 'test'
];

// Single domain item sub-document schema
const domainSchema = new mongoose.Schema({
  domain: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true,
    index: true
  },
  type: { 
    type: String, 
    enum: ['subdomain', 'custom'], 
    default: 'custom' 
  },
  isPrimary: { 
    type: Boolean, 
    default: false 
  },
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
  verificationToken: { 
    type: String, 
    default: '' 
  },
  targetCname: {
    type: String,
    default: 'stores.yourplatform.com'
  },
  targetA: {
    type: String,
    default: '192.0.2.1'
  },
  redirectWwwToRoot: { 
    type: Boolean, 
    default: true 
  },
  redirectSubdomainToCustom: { 
    type: Boolean, 
    default: true 
  },
  requiresManualApproval: { 
    type: Boolean, 
    default: false 
  },
  approvedByAdmin: { 
    type: Boolean, 
    default: true 
  },
  isBlocked: { 
    type: Boolean, 
    default: false 
  },
  blockReason: { 
    type: String, 
    default: '' 
  },
  lastDnsCheckAt: { 
    type: Date, 
    default: null 
  },
  dnsFailureReason: { 
    type: String, 
    default: '' 
  },
  sslIssuedAt: { 
    type: Date, 
    default: null 
  },
  sslExpiresAt: { 
    type: Date, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: true });

// Reserved Subdomain model
const reservedSubdomainSchema = new mongoose.Schema({
  subdomain: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  reason: { 
    type: String, 
    default: 'System reserved' 
  },
  addedBy: { 
    type: String, 
    default: 'Super Admin' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Global Domain Management System Settings model
const domainSettingsSchema = new mongoose.Schema({
  manualApprovalRequired: { 
    type: Boolean, 
    default: false 
  },
  cnameTargetHost: { 
    type: String, 
    default: 'stores.yourplatform.com' 
  },
  aRecordTargetIp: { 
    type: String, 
    default: '192.0.2.1' 
  },
  platformOwnDomain: { 
    type: String, 
    default: 'yourplatform.com' 
  },
  verificationMaxHours: { 
    type: Number, 
    default: 72 
  },
  sslRenewalDaysBeforeExpiry: { 
    type: Number, 
    default: 30 
  },
  planDomainLimits: {
    starter: { type: Number, default: 0 },
    growth: { type: Number, default: 2 },
    pro: { type: Number, default: 5 },
    enterprise: { type: Number, default: 20 }
  }
}, { timestamps: true });

export const DomainItem = mongoose.models.DomainItem || mongoose.model('DomainItem', domainSchema);
export const ReservedSubdomain = mongoose.models.ReservedSubdomain || mongoose.model('ReservedSubdomain', reservedSubdomainSchema);
export const DomainSettings = mongoose.models.DomainSettings || mongoose.model('DomainSettings', domainSettingsSchema);
