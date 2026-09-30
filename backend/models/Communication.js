import mongoose from "mongoose";

// ── Email Template Schema ──────────────────────────────────────
const emailTemplateSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['welcome', 'trial ending', 'payment failed', 'invoice', 'suspension', 'domain verified', 'demo confirmation'],
    required: true 
  },
  subject: { type: String, required: true },
  htmlContent: { type: String, required: true },
  textContent: { type: String, default: "" },
  variables: [{ type: String }],
  isTransactional: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

// ── Broadcast Announcement Schema ─────────────────────────────
const broadcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetSegment: {
    plan: { type: String, default: "all" }, // all | starter | pro | enterprise
    status: { type: String, default: "all" }, // all | active | trial | suspended
    country: { type: String, default: "all" }
  },
  scheduledAt: { type: Date },
  sentAt: { type: Date },
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'sending', 'sent', 'cancelled'], 
    default: 'draft' 
  },
  sentCount: { type: Number, default: 0 },
  deliveredCount: { type: Number, default: 0 },
  openRate: { type: Number, default: 0 },
  clickRate: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// ── In-App Notification Schema ─────────────────────────────────
const inAppNotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['info', 'warning', 'critical'], 
    default: 'info' 
  },
  targetStoreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
  targetPlan: { type: String, default: 'all' },
  actionUrl: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  startDate: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  isDismissible: { type: Boolean, default: true },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'draft'], 
    default: 'active' 
  },
  dismissedByStores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
  createdAt: { type: Date, default: Date.now }
});

// ── Automation Rule Schema ────────────────────────────────────
const automationRuleSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  trigger: { type: String, required: true },
  action: { type: String, required: true },
  emailTemplateKey: { type: String, required: true },
  channel: { 
    type: String, 
    enum: ['email', 'in_app', 'both'], 
    default: 'email' 
  },
  enabled: { type: Boolean, default: true },
  triggerDelayDays: { type: Number, default: 0 },
  totalTriggered: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

// ── Delivery Log Schema ────────────────────────────────────────
const deliveryLogSchema = new mongoose.Schema({
  recipientEmail: { type: String, required: true, index: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
  storeName: { type: String, default: '' },
  channel: { 
    type: String, 
    enum: ['email', 'in_app', 'sms', 'whatsapp'], 
    default: 'email' 
  },
  category: { type: String, default: 'general' },
  subject: { type: String, required: true },
  messageBody: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'bounced', 'failed'], 
    default: 'delivered' 
  },
  retries: { type: Number, default: 0 },
  errorMessage: { type: String, default: '' },
  isTransactional: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// ── Channel Configuration Schema ──────────────────────────────
const channelConfigSchema = new mongoose.Schema({
  emailProvider: { 
    type: String, 
    enum: ['SMTP', 'SendGrid', 'AWS SES', 'Mailgun'], 
    default: 'SendGrid' 
  },
  smtpHost: { type: String, default: 'smtp.sendgrid.net' },
  smtpPort: { type: Number, default: 587 },
  smtpUser: { type: String, default: 'apikey' },
  smtpPassword: { type: String, default: 'SG.sample_key_99812' },
  sendgridApiKey: { type: String, default: 'SG.v89123891723891723' },
  senderEmail: { type: String, default: 'notifications@ecommerce.com' },
  senderName: { type: String, default: 'Platform Notifications' },
  smsProvider: { 
    type: String, 
    enum: ['Twilio', 'None'], 
    default: 'Twilio' 
  },
  twilioSid: { type: String, default: 'AC_sample_twilio_sid_9981' },
  twilioToken: { type: String, default: 'token_sample_123891' },
  whatsappProvider: { 
    type: String, 
    enum: ['Meta Cloud API', 'Twilio WhatsApp', 'None'], 
    default: 'Meta Cloud API' 
  },
  senderDomain: { type: String, default: 'ecommerce.com' },
  spfStatus: { 
    type: String, 
    enum: ['verified', 'pending', 'failed'], 
    default: 'verified' 
  },
  dkimStatus: { 
    type: String, 
    enum: ['verified', 'pending', 'failed'], 
    default: 'verified' 
  },
  dmarcStatus: { 
    type: String, 
    enum: ['verified', 'pending', 'failed'], 
    default: 'verified' 
  },
  updatedAt: { type: Date, default: Date.now }
});

// ── Support Ticket Schema ──────────────────────────────────────
const supportTicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
  storeName: { type: String, default: '' },
  ownerEmail: { type: String, required: true },
  subject: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['billing', 'technical', 'domain', 'onboarding', 'general'], 
    default: 'general' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['open', 'pending', 'resolved', 'closed'], 
    default: 'open' 
  },
  replies: [{
    sender: { type: String, required: true },
    message: { type: String, required: true },
    isInternal: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ── Unsubscribed Emails Schema ─────────────────────────────────
const unsubscribedEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  reason: { type: String, default: 'User requested opt-out' },
  unsubscribedAt: { type: Date, default: Date.now }
});

// ── Support Integrations Schema ────────────────────────────────
const supportIntegrationSchema = new mongoose.Schema({
  provider: { 
    type: String, 
    enum: ['native', 'zendesk', 'freshdesk'], 
    default: 'native' 
  },
  zendeskDomain: { type: String, default: '' },
  zendeskApiKey: { type: String, default: '' },
  freshdeskDomain: { type: String, default: '' },
  freshdeskApiKey: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

export const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);
export const Broadcast = mongoose.model("Broadcast", broadcastSchema);
export const InAppNotification = mongoose.model("InAppNotification", inAppNotificationSchema);
export const AutomationRule = mongoose.model("AutomationRule", automationRuleSchema);
export const DeliveryLog = mongoose.model("DeliveryLog", deliveryLogSchema);
export const ChannelConfig = mongoose.model("ChannelConfig", channelConfigSchema);
export const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);
export const UnsubscribedEmail = mongoose.model("UnsubscribedEmail", unsubscribedEmailSchema);
export const SupportIntegrationConfig = mongoose.model("SupportIntegrationConfig", supportIntegrationSchema);
