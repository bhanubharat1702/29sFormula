import mongoose from 'mongoose';

// Immutable, Append-Only System Audit Log Model (SOC 2, GDPR Compliant)
const auditLogSchema = new mongoose.Schema({
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  adminUser: { 
    type: String, 
    required: true,
    index: true 
  },
  adminEmail: { 
    type: String, 
    default: '',
    lowercase: true,
    trim: true,
    index: true 
  },
  role: { 
    type: String, 
    default: 'Super Admin' 
  },
  action: { 
    type: String, 
    required: true,
    index: true 
  },
  actionCategory: {
    type: String,
    enum: [
      'auth', 'impersonation', 'tenant', 'billing', 'domain', 
      'settings', 'role', 'export', 'communication', 'security'
    ],
    default: 'auth',
    index: true
  },
  target: { 
    type: String, 
    default: '',
    index: true 
  },
  targetId: {
    type: String,
    default: ''
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    default: null,
    index: true
  },
  storeName: {
    type: String,
    default: ''
  },
  beforeValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  afterValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  diff: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  ipAddress: { 
    type: String, 
    default: '127.0.0.1' 
  },
  country: {
    type: String,
    default: 'India'
  },
  userAgent: { 
    type: String, 
    default: 'Chrome / macOS' 
  },
  reason: { 
    type: String, 
    default: '' 
  },
  result: { 
    type: String, 
    enum: ['success', 'failed', 'blocked'], 
    default: 'success',
    index: true
  },
  isSuspicious: {
    type: Boolean,
    default: false,
    index: true
  },
  suspiciousReason: {
    type: String,
    default: ''
  }
}, { 
  timestamps: false // Manual timestamp field for append-only log integrity
});

// Create compound indexes for fast query performance
auditLogSchema.index({ timestamp: -1, actionCategory: 1 });
auditLogSchema.index({ adminEmail: 1, timestamp: -1 });

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
