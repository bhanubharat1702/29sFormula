"use client";

import React from "react";
import styles from "../../page.module.css";
import { ChannelConfigData } from "../communicationsTypes";

interface ChannelsConfigTabProps {
  config: ChannelConfigData | null;
  onSaveConfig: (updated: Partial<ChannelConfigData>) => void;
  onVerifyDns: () => void;
}

export default function ChannelsConfigTab({
  config,
  onSaveConfig,
  onVerifyDns
}: ChannelsConfigTabProps) {
  const [formData, setFormData] = React.useState<ChannelConfigData | null>(config);

  React.useEffect(() => {
    setFormData(config);
  }, [config]);

  if (!formData) return <div style={{ padding: "24px" }}>Loading channel configuration...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. Email Channel Provider */}
      <div className={styles.tableCard} style={{ padding: "24px" }}>
        <h3 className={styles.tableTitle} style={{ marginBottom: "6px" }}>Email Dispatch Provider</h3>
        <p className={styles.tableSubtitle} style={{ marginBottom: "18px" }}>
          Configure primary transactional email routing via SendGrid, AWS SES, Mailgun, or Custom SMTP server.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label className={styles.formLabel}>Email Service Provider</label>
            <select
              className={styles.formInput}
              value={formData.emailProvider}
              onChange={(e) => setFormData({ ...formData, emailProvider: e.target.value as any })}
            >
              <option value="SendGrid">SendGrid API (Recommended)</option>
              <option value="AWS SES">AWS SES (Simple Email Service)</option>
              <option value="Mailgun">Mailgun REST API</option>
              <option value="SMTP">Custom SMTP Relay</option>
            </select>
          </div>

          <div>
            <label className={styles.formLabel}>Sender Email Address</label>
            <input
              type="email"
              className={styles.formInput}
              value={formData.senderEmail}
              onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
            />
          </div>

          <div>
            <label className={styles.formLabel}>Sender Name Header</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.senderName}
              onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
            />
          </div>

          <div>
            <label className={styles.formLabel}>SendGrid API Key / Token</label>
            <input
              type="password"
              className={styles.formInput}
              value={formData.sendgridApiKey || ""}
              onChange={(e) => setFormData({ ...formData, sendgridApiKey: e.target.value })}
            />
          </div>
        </div>

        {formData.emailProvider === "SMTP" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px", background: "#f9fafb", padding: "16px", borderRadius: "8px" }}>
            <div>
              <label className={styles.formLabel}>SMTP Host</label>
              <input
                type="text"
                className={styles.formInput}
                value={formData.smtpHost}
                onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.formLabel}>SMTP Port</label>
              <input
                type="number"
                className={styles.formInput}
                value={formData.smtpPort}
                onChange={(e) => setFormData({ ...formData, smtpPort: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className={styles.formLabel}>SMTP Username</label>
              <input
                type="text"
                className={styles.formInput}
                value={formData.smtpUser}
                onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Sender Domain & SPF / DKIM / DMARC */}
      <div className={styles.tableCard} style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <h3 className={styles.tableTitle}>Sender Domain Authentication (SPF / DKIM / DMARC)</h3>
            <p className={styles.tableSubtitle}>Ensure 99.8% deliverability and prevent email inbox spam flags.</p>
          </div>
          <button className={styles.btnSecondary} onClick={onVerifyDns}>
            Verify DNS Records
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "14px" }}>
          <div style={{ padding: "14px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Sender Domain</div>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: "#111827", marginTop: "4px" }}>{formData.senderDomain}</div>
          </div>

          <div style={{ padding: "14px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>SPF Record</div>
            <div style={{ marginTop: "4px" }}>
              <span className={styles.tableBadge} style={{ background: "#dcfce7", color: "#166534" }}>
                ✓ {formData.spfStatus.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ padding: "14px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>DKIM Signature</div>
            <div style={{ marginTop: "4px" }}>
              <span className={styles.tableBadge} style={{ background: "#dcfce7", color: "#166534" }}>
                ✓ {formData.dkimStatus.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ padding: "14px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>DMARC Policy</div>
            <div style={{ marginTop: "4px" }}>
              <span className={styles.tableBadge} style={{ background: "#dcfce7", color: "#166534" }}>
                ✓ {formData.dmarcStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Optional SMS & WhatsApp Integration */}
      <div className={styles.tableCard} style={{ padding: "24px" }}>
        <h3 className={styles.tableTitle} style={{ marginBottom: "6px" }}>SMS & WhatsApp Channels (Optional)</h3>
        <p className={styles.tableSubtitle} style={{ marginBottom: "18px" }}>
          Enable Twilio SMS or WhatsApp Business Meta Cloud API for instant merchant alerts.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label className={styles.formLabel}>SMS Provider</label>
            <select
              className={styles.formInput}
              value={formData.smsProvider}
              onChange={(e) => setFormData({ ...formData, smsProvider: e.target.value as any })}
            >
              <option value="Twilio">Twilio SMS</option>
              <option value="None">Disabled</option>
            </select>
          </div>

          <div>
            <label className={styles.formLabel}>WhatsApp Provider</label>
            <select
              className={styles.formInput}
              value={formData.whatsappProvider}
              onChange={(e) => setFormData({ ...formData, whatsappProvider: e.target.value as any })}
            >
              <option value="Meta Cloud API">Meta WhatsApp Cloud API</option>
              <option value="Twilio WhatsApp">Twilio WhatsApp Sandbox</option>
              <option value="None">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className={styles.btnPrimary} style={{ padding: "10px 24px" }} onClick={() => onSaveConfig(formData)}>
          Save Channels Configuration
        </button>
      </div>
    </div>
  );
}
