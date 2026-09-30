export interface EmailTemplateItem {
  _id?: string;
  key: string;
  name: string;
  category: "welcome" | "trial ending" | "payment failed" | "invoice" | "suspension" | "domain verified" | "demo confirmation";
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
  isTransactional: boolean;
  updatedAt?: string;
}

export interface BroadcastItem {
  _id: string;
  title: string;
  content: string;
  targetSegment: {
    plan: string;
    status: string;
    country: string;
  };
  scheduledAt?: string;
  sentAt?: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "cancelled";
  sentCount: number;
  deliveredCount: number;
  openRate: number;
  clickRate: number;
  createdAt: string;
}

export interface InAppNotificationItem {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical";
  targetStoreId?: any;
  targetPlan: string;
  actionUrl?: string;
  actionLabel?: string;
  startDate?: string;
  expiresAt?: string;
  isDismissible: boolean;
  status: "active" | "expired" | "draft";
  createdAt: string;
}

export interface AutomationRuleItem {
  _id?: string;
  key: string;
  name: string;
  trigger: string;
  action: string;
  emailTemplateKey: string;
  channel: "email" | "in_app" | "both";
  enabled: boolean;
  triggerDelayDays: number;
  totalTriggered: number;
  updatedAt?: string;
}

export interface DeliveryLogItem {
  _id: string;
  recipientEmail: string;
  storeId?: string;
  storeName?: string;
  channel: "email" | "in_app" | "sms" | "whatsapp";
  category: string;
  subject: string;
  messageBody?: string;
  status: "sent" | "delivered" | "bounced" | "failed";
  retries: number;
  errorMessage?: string;
  isTransactional: boolean;
  createdAt: string;
}

export interface ChannelConfigData {
  _id?: string;
  emailProvider: "SMTP" | "SendGrid" | "AWS SES" | "Mailgun";
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword?: string;
  sendgridApiKey?: string;
  senderEmail: string;
  senderName: string;
  smsProvider: "Twilio" | "None";
  twilioSid?: string;
  twilioToken?: string;
  whatsappProvider: "Meta Cloud API" | "Twilio WhatsApp" | "None";
  senderDomain: string;
  spfStatus: "verified" | "pending" | "failed";
  dkimStatus: "verified" | "pending" | "failed";
  dmarcStatus: "verified" | "pending" | "failed";
}

export interface SupportTicketItem {
  _id: string;
  ticketNumber: string;
  storeId?: string;
  storeName: string;
  ownerEmail: string;
  subject: string;
  category: "billing" | "technical" | "domain" | "onboarding" | "general";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "pending" | "resolved" | "closed";
  replies: Array<{
    sender: string;
    message: string;
    isInternal: boolean;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UnsubscribedEmailItem {
  _id?: string;
  email: string;
  reason: string;
  unsubscribedAt: string;
}

export interface SupportConfigData {
  _id?: string;
  provider: "native" | "zendesk" | "freshdesk";
  zendeskDomain?: string;
  zendeskApiKey?: string;
  freshdeskDomain?: string;
  freshdeskApiKey?: string;
}

export interface OverviewStatsData {
  templatesCount: number;
  broadcastsCount: number;
  activeNoticesCount: number;
  automationsCount: number;
  totalDeliveredLogs: number;
  totalFailedLogs: number;
  deliveryRate: number;
  openTicketsCount: number;
}
