import mongoose from 'mongoose';

// ── Analytics Snapshot / Materialized View Schema ───────────────────────────
const AnalyticsSnapshotSchema = new mongoose.Schema({
  snapshotDate: { type: Date, required: true, default: Date.now, index: true },
  group: { 
    type: String, 
    enum: ['revenue', 'growth', 'retention', 'merchant_success', 'funnel', 'usage', 'performance', 'geography'],
    required: true,
    index: true 
  },
  period: { type: String, enum: ['7d', '30d', '90d', '12m', 'all'], default: '30d' },
  metrics: { type: mongoose.Schema.Types.Mixed, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// ── Saved Reports Schema ───────────────────────────────────────────────────
const SavedReportSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  reportGroup: { type: String, required: true },
  filters: {
    dateRange: { type: String, default: '30d' },
    plan: { type: String, default: 'all' },
    country: { type: String, default: 'all' },
    source: { type: String, default: 'all' }
  },
  createdBy: { type: String, default: 'Super Admin' },
  isScheduled: { type: Boolean, default: false },
  scheduleFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
  emailRecipients: [{ type: String }]
}, { timestamps: true });

export const AnalyticsSnapshot = mongoose.models.AnalyticsSnapshot || mongoose.model('AnalyticsSnapshot', AnalyticsSnapshotSchema);
export const SavedReport = mongoose.models.SavedReport || mongoose.model('SavedReport', SavedReportSchema);
