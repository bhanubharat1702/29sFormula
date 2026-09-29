"use client";

import React from "react";
import styles from "../page.module.css";
import { AdminUser, FeatureFlag } from "./types";

interface SettingsTabProps {
  setActiveTab: (tab: string) => void;
  activeSettingsSection: string;
  setActiveSettingsSection: (section: any) => void;
  navTabsRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabs: (dir: "left" | "right") => void;
  checkTabScroll: () => void;
  triggerToast: (msg: string) => void;

  // General
  platformName: string;
  setPlatformName: (val: string) => void;
  platformLogo: string;
  setPlatformLogo: (val: string) => void;
  supportEmail: string;
  setSupportEmail: (val: string) => void;
  baseDomain: string;
  setBaseDomain: (val: string) => void;
  timezone: string;
  setTimezone: (val: string) => void;
  currency: string;
  setCurrency: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;

  // Admins
  admins: AdminUser[];
  setAdmins: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  setIsInviteAdminOpen: (val: boolean) => void;

  // Security
  enforce2FA: boolean;
  setEnforce2FA: (val: boolean) => void;
  minPasswordLength: number;
  setMinPasswordLength: (val: number) => void;
  passwordExpiryDays: number;
  setPasswordExpiryDays: (val: number) => void;
  sessionTimeoutMins: string;
  setSessionTimeoutMins: (val: string) => void;
  loginAlertEmail: boolean;
  setLoginAlertEmail: (val: boolean) => void;
  loginAlertSlack: boolean;
  setLoginAlertSlack: (val: boolean) => void;
  ipAllowlist: string;
  setIpAllowlist: (val: string) => void;

  // Tenant Defaults
  trialLengthDays: number;
  setTrialLengthDays: (val: number) => void;
  defaultTheme: string;
  setDefaultTheme: (val: string) => void;
  reservedSubdomains: string;
  setReservedSubdomains: (val: string) => void;
  autoProvisionSampleData: boolean;
  setAutoProvisionSampleData: (val: boolean) => void;
  selfServeSignup: boolean;
  setSelfServeSignup: (val: boolean) => void;

  // Feature Flags
  featureFlags: FeatureFlag[];
  setFeatureFlags: (val: FeatureFlag[]) => void;

  // Integrations
  stripePublishableKey: string;
  setStripePublishableKey: (val: string) => void;
  stripeSecretKey: string;
  setStripeSecretKey: (val: string) => void;
  razorpayKeyId: string;
  setRazorpayKeyId: (val: string) => void;
  razorpayKeySecret: string;
  setRazorpayKeySecret: (val: string) => void;
  s3Bucket: string;
  setS3Bucket: (val: string) => void;
  s3Region: string;
  setS3Region: (val: string) => void;
  s3AccessKey: string;
  setS3AccessKey: (val: string) => void;
  s3SecretKey: string;
  setS3SecretKey: (val: string) => void;
  showSecrets: Record<string, boolean>;
  toggleSecret: (key: string) => void;
  emailProvider: string;
  setEmailProvider: (val: string) => void;
  senderEmail: string;
  setSenderEmail: (val: string) => void;

  // Legal
  termsVersion: string;
  setTermsVersion: (val: string) => void;
  privacyVersion: string;
  setPrivacyVersion: (val: string) => void;
  gdprExportHours: number;
  setGdprExportHours: (val: number) => void;
  gdprDeleteGraceDays: number;
  setGdprDeleteGraceDays: (val: number) => void;
  auditLogRetentionDays: number;
  setAuditLogRetentionDays: (val: number) => void;
  financialRetentionYears: number;
  setFinancialRetentionYears: (val: number) => void;

  // Maintenance
  maintenanceMode: boolean;
  setMaintenanceMode: (val: boolean) => void;
  maintenanceMessage: string;
  setMaintenanceMessage: (val: string) => void;
  backupSchedule: string;
  lastBackupTime: string;

  // API Keys & Webhooks
  apiKeys: any[];
  setApiKeys: (val: any[]) => void;
  starterLimit: number;
  setStarterLimit: (val: number) => void;
  proLimit: number;
  setProLimit: (val: number) => void;
  enterpriseLimit: number;
  setEnterpriseLimit: (val: number) => void;

  // Branding
  landingTitle: string;
  setLandingTitle: (val: string) => void;
  landingSubtitle: string;
  setLandingSubtitle: (val: string) => void;
  emailHeaderLogo: string;
  setEmailHeaderLogo: (val: string) => void;
  emailFooterText: string;
  setEmailFooterText: (val: string) => void;
}

export default function SettingsTab({
  setActiveTab,
  activeSettingsSection,
  setActiveSettingsSection,
  navTabsRef,
  canScrollLeft,
  canScrollRight,
  scrollTabs,
  checkTabScroll,
  triggerToast,
  platformName,
  setPlatformName,
  platformLogo,
  setPlatformLogo,
  supportEmail,
  setSupportEmail,
  baseDomain,
  setBaseDomain,
  timezone,
  setTimezone,
  currency,
  setCurrency,
  language,
  setLanguage,
  admins,
  setAdmins,
  setIsInviteAdminOpen,
  enforce2FA,
  setEnforce2FA,
  minPasswordLength,
  setMinPasswordLength,
  passwordExpiryDays,
  setPasswordExpiryDays,
  sessionTimeoutMins,
  setSessionTimeoutMins,
  loginAlertEmail,
  setLoginAlertEmail,
  loginAlertSlack,
  setLoginAlertSlack,
  ipAllowlist,
  setIpAllowlist,
  trialLengthDays,
  setTrialLengthDays,
  defaultTheme,
  setDefaultTheme,
  reservedSubdomains,
  setReservedSubdomains,
  autoProvisionSampleData,
  setAutoProvisionSampleData,
  selfServeSignup,
  setSelfServeSignup,
  featureFlags,
  setFeatureFlags,
  stripePublishableKey,
  setStripePublishableKey,
  stripeSecretKey,
  setStripeSecretKey,
  razorpayKeyId,
  setRazorpayKeyId,
  razorpayKeySecret,
  setRazorpayKeySecret,
  s3Bucket,
  setS3Bucket,
  s3Region,
  setS3Region,
  s3AccessKey,
  setS3AccessKey,
  s3SecretKey,
  setS3SecretKey,
  showSecrets,
  toggleSecret,
  emailProvider,
  setEmailProvider,
  senderEmail,
  setSenderEmail,
  termsVersion,
  setTermsVersion,
  privacyVersion,
  setPrivacyVersion,
  gdprExportHours,
  setGdprExportHours,
  gdprDeleteGraceDays,
  setGdprDeleteGraceDays,
  auditLogRetentionDays,
  setAuditLogRetentionDays,
  financialRetentionYears,
  setFinancialRetentionYears,
  maintenanceMode,
  setMaintenanceMode,
  maintenanceMessage,
  setMaintenanceMessage,
  backupSchedule,
  lastBackupTime,
  apiKeys,
  setApiKeys,
  starterLimit,
  setStarterLimit,
  proLimit,
  setProLimit,
  enterpriseLimit,
  setEnterpriseLimit,
  landingTitle,
  setLandingTitle,
  landingSubtitle,
  setLandingSubtitle,
  emailHeaderLogo,
  setEmailHeaderLogo,
  emailFooterText,
  setEmailFooterText,
}: SettingsTabProps) {
  return (
    <div className={styles.settingsSectionCard}>
      {/* Breadcrumb Header */}
      <div className={styles.settingsHorizontalHeader}>
        <button className={styles.settingsBreadcrumbBack} onClick={() => setActiveTab("dashboard")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "16px", height: "16px", color: "#6b7280" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <span style={{ color: "#6b7280", fontWeight: 400 }}>Settings</span>
        </button>
        <span style={{ color: "#9ca3af", margin: "0 2px" }}>&rsaquo;</span>
        <span style={{ color: "#000000", fontWeight: 400 }}>
          {
            (
              {
                "general": "General",
                "admin-users": "Admin Users",
                "security": "Security",
                "tenant-defaults": "Tenant Defaults",
                "feature-flags": "Feature Flags",
                "integrations": "Integrations",
                "legal": "Legal & Compliance",
                "maintenance": "Maintenance",
                "api-webhooks": "API & Webhooks",
                "branding": "Branding",
              } as Record<string, string>
            )[activeSettingsSection]
          }
        </span>
      </div>

      {/* Horizontal Sub-Nav Tabs with << and >> controls */}
      <div className={styles.settingsSubNavContainer}>
        {canScrollLeft && (
          <button
            type="button"
            className={`${styles.tabScrollArrow} ${styles.tabScrollArrowLeft}`}
            onClick={() => scrollTabs("left")}
            title="Scroll Left"
          >
            &laquo;
          </button>
        )}

        <div
          ref={navTabsRef}
          className={styles.settingsHorizontalTabs}
          onScroll={checkTabScroll}
        >
          {[
            { id: "general", label: "General" },
            { id: "admin-users", label: "Admin Users" },
            { id: "security", label: "Security" },
            { id: "tenant-defaults", label: "Tenant Defaults" },
            { id: "feature-flags", label: "Feature Flags" },
            { id: "integrations", label: "Integrations" },
            { id: "legal", label: "Legal & Compliance" },
            { id: "maintenance", label: "Maintenance" },
            { id: "api-webhooks", label: "API & Webhooks" },
            { id: "branding", label: "Branding" },
          ].map((item) => (
            <button
              key={item.id}
              className={`${styles.settingsHorizontalTab} ${activeSettingsSection === item.id ? styles.settingsHorizontalTabActive : ""}`}
              onClick={() => setActiveSettingsSection(item.id as any)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            className={`${styles.tabScrollArrow} ${styles.tabScrollArrowRight}`}
            onClick={() => scrollTabs("right")}
            title="Scroll Right"
          >
            &raquo;
          </button>
        )}
      </div>

      {/* Content Area */}
      <div>
        {/* 1. General */}
        {activeSettingsSection === "general" && (
          <div>
            <div className={styles.settingsHeader}>
              <h3 className={styles.settingsTitle}>General Settings</h3>
              <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                Save Changes
              </button>
            </div>
            <div className={styles.settingsGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Platform Name</label>
                <input type="text" className={styles.input} value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Logo URL</label>
                <input type="text" className={styles.input} value={platformLogo} onChange={(e) => setPlatformLogo(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Support Email</label>
                <input type="email" className={styles.input} value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Base Domain</label>
                <input type="text" className={styles.input} value={baseDomain} onChange={(e) => setBaseDomain(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Timezone</label>
                <select className={styles.input} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30)</option>
                  <option value="UTC (UTC+00:00)">UTC (UTC+00:00)</option>
                  <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Currency</label>
                <select className={styles.input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>
              <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                <label className={styles.label}>Language</label>
                <select className={styles.input} value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="English (US)">English (US)</option>
                  <option value="Spanish (ES)">Spanish (ES)</option>
                  <option value="Hindi (IN)">Hindi (IN)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 2. Admin Users */}
        {activeSettingsSection === "admin-users" && (
          <div>
            <div className={styles.settingsHeader}>
              <h3 className={styles.settingsTitle}>Admin Users & Roles</h3>
              <button className={styles.btnPrimary} onClick={() => setIsInviteAdminOpen(true)}>
                + Invite Admin
              </button>
            </div>
            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>2FA</th>
                    <th>Last Active</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{admin.name}</div>
                        <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>{admin.email}</div>
                      </td>
                      <td>{admin.role}</td>
                      <td>{admin.twoFactor ? "Enforced" : "Pending"}</td>
                      <td style={{ fontSize: "0.82rem", color: "#6b7280" }}>{admin.lastLogin}</td>
                      <td>
                        <span className={admin.status === "Active" ? styles.statusActive : styles.statusSuspended}>
                          {admin.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className={admin.status === "Active" ? styles.btnActionDanger : styles.btnAction}
                          onClick={() => {
                            setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" } : a));
                            triggerToast(`Updated ${admin.name}`);
                          }}
                        >
                          {admin.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Security */}
        {activeSettingsSection === "security" && (
          <div>
            <div className={styles.settingsHeader}>
              <h3 className={styles.settingsTitle}>Security Rules</h3>
              <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                Save Changes
              </button>
            </div>
            <div className={styles.toggleRow}>
              <div className={styles.toggleLabel}>Mandatory 2-Factor Authentication (2FA)</div>
              <input type="checkbox" checked={enforce2FA} onChange={(e) => setEnforce2FA(e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </div>
            <div className={styles.settingsGrid} style={{ marginTop: "16px" }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Min Password Length</label>
                <input type="number" className={styles.input} value={minPasswordLength} onChange={(e) => setMinPasswordLength(Number(e.target.value))} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Password Expiry (Days)</label>
                <input type="number" className={styles.input} value={passwordExpiryDays} onChange={(e) => setPasswordExpiryDays(Number(e.target.value))} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Session Timeout</label>
                <select className={styles.input} value={sessionTimeoutMins} onChange={(e) => setSessionTimeoutMins(e.target.value)}>
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Login Alerts</label>
                <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
                  <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <input type="checkbox" checked={loginAlertEmail} onChange={(e) => setLoginAlertEmail(e.target.checked)} /> Email
                  </label>
                  <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <input type="checkbox" checked={loginAlertSlack} onChange={(e) => setLoginAlertSlack(e.target.checked)} /> Slack
                  </label>
                </div>
              </div>
              <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                <label className={styles.label}>IP Allowlist</label>
                <textarea className={styles.input} rows={2} value={ipAllowlist} onChange={(e) => setIpAllowlist(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* 4. Tenant Defaults */}
        {activeSettingsSection === "tenant-defaults" && (
          <div>
            <div className={styles.settingsHeader}>
              <h3 className={styles.settingsTitle}>Tenant Defaults</h3>
              <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                Save Changes
              </button>
            </div>
            <div className={styles.settingsGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Trial Length (Days)</label>
                <input type="number" className={styles.input} value={trialLengthDays} onChange={(e) => setTrialLengthDays(Number(e.target.value))} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Default Theme</label>
                <select className={styles.input} value={defaultTheme} onChange={(e) => setDefaultTheme(e.target.value)}>
                  <option value="Modern Minimalist">Modern Minimalist</option>
                  <option value="Boutique Luxury">Boutique Luxury</option>
                </select>
              </div>
              <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                <label className={styles.label}>Reserved Subdomains</label>
                <textarea className={styles.input} rows={2} value={reservedSubdomains} onChange={(e) => setReservedSubdomains(e.target.value)} />
              </div>
            </div>
            <div className={styles.toggleRow}>
              <div className={styles.toggleLabel}>Auto-provision Sample Data</div>
              <input type="checkbox" checked={autoProvisionSampleData} onChange={(e) => setAutoProvisionSampleData(e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </div>
            <div className={styles.toggleRow}>
              <div className={styles.toggleLabel}>Enable Open Signups</div>
              <input type="checkbox" checked={selfServeSignup} onChange={(e) => setSelfServeSignup(e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </div>
          </div>
        )}

        {/* 5. Feature Flags */}
        {activeSettingsSection === "feature-flags" && (
          <div>
            <div className={styles.settingsHeader}>
              <h3 className={styles.settingsTitle}>Feature Flags</h3>
              <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                Save Changes
              </button>
            </div>
            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Enabled</th>
                    <th>Rollout %</th>
                    <th>Plans</th>
                  </tr>
                </thead>
                <tbody>
                  {featureFlags.map((flag, idx) => (
                    <tr key={flag.key}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{flag.name}</div>
                        <div className={styles.subdomain}>{flag.key}</div>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={flag.enabled}
                          onChange={(e) => {
                            const updated = [...featureFlags];
                            updated[idx].enabled = e.target.checked;
                            setFeatureFlags(updated);
                          }}
                          style={{ width: "18px", height: "18px" }}
                        />
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={flag.rollout}
                            onChange={(e) => {
                              const updated = [...featureFlags];
                              updated[idx].rollout = Number(e.target.value);
                              setFeatureFlags(updated);
                            }}
                            style={{ width: "80px" }}
                          />
                          <span style={{ fontSize: "0.82rem" }}>{flag.rollout}%</span>
                        </div>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "#6b7280" }}>{flag.plans}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Integrations */}
        {activeSettingsSection === "integrations" && (
          <div>
            <div className={styles.settingsHeader}>
              <h3 className={styles.settingsTitle}>Integrations</h3>
              <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                Save Changes
              </button>
            </div>

            <div className={styles.settingsGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Stripe Publishable Key</label>
                <input type="text" className={styles.input} value={stripePublishableKey} onChange={(e) => setStripePublishableKey(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Stripe Secret Key</label>
                <div className={styles.secretInputGroup}>
                  <input type={showSecrets["stripeSecret"] ? "text" : "password"} className={styles.input} value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} />
                  <button className={styles.btnSecondary} onClick={() => toggleSecret("stripeSecret")}>
                    {showSecrets["stripeSecret"] ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Razorpay Key ID</label>
                <input type="text" className={styles.input} value={razorpayKeyId} onChange={(e) => setRazorpayKeyId(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Razorpay Secret Key</label>
                <div className={styles.secretInputGroup}>
                  <input type={showSecrets["razorpaySecret"] ? "text" : "password"} className={styles.input} value={razorpayKeySecret} onChange={(e) => setRazorpayKeySecret(e.target.value)} />
                  <button className={styles.btnSecondary} onClick={() => toggleSecret("razorpaySecret")}>
                    {showSecrets["razorpaySecret"] ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>S3 Bucket</label>
                <input type="text" className={styles.input} value={s3Bucket} onChange={(e) => setS3Bucket(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>AWS Region</label>
                <input type="text" className={styles.input} value={s3Region} onChange={(e) => setS3Region(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>S3 Access Key</label>
                <input type="text" className={styles.input} value={s3AccessKey} onChange={(e) => setS3AccessKey(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>S3 Secret Key</label>
                <div className={styles.secretInputGroup}>
                  <input type={showSecrets["s3Secret"] ? "text" : "password"} className={styles.input} value={s3SecretKey} onChange={(e) => setS3SecretKey(e.target.value)} />
                  <button className={styles.btnSecondary} onClick={() => toggleSecret("s3Secret")}>
                    {showSecrets["s3Secret"] ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Provider</label>
                <select className={styles.input} value={emailProvider} onChange={(e) => setEmailProvider(e.target.value)}>
                  <option value="SendGrid API">SendGrid</option>
                  <option value="Amazon SES">Amazon SES</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Sender Email</label>
                <input type="email" className={styles.input} value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* 7. Legal & Compliance */}
        {activeSettingsSection === "legal" && (
          <div>
            <div className={styles.settingsHeader}>
              <h3 className={styles.settingsTitle}>Legal & Compliance</h3>
              <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                Save Changes
              </button>
            </div>
            <div className={styles.settingsGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Terms Version</label>
                <input type="text" className={styles.input} value={termsVersion} onChange={(e) => setTermsVersion(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Privacy Version</label>
                <input type="text" className={styles.input} value={privacyVersion} onChange={(e) => setPrivacyVersion(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>GDPR Export SLA (Hours)</label>
                <input type="number" className={styles.input} value={gdprExportHours} onChange={(e) => setGdprExportHours(Number(e.target.value))} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>GDPR Delete Grace Period (Days)</label>
                <input type="number" className={styles.input} value={gdprDeleteGraceDays} onChange={(e) => setGdprDeleteGraceDays(Number(e.target.value))} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Audit Retention (Days)</label>
                <input type="number" className={styles.input} value={auditLogRetentionDays} onChange={(e) => setAuditLogRetentionDays(Number(e.target.value))} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Financial Log Retention (Years)</label>
                <input type="number" className={styles.input} value={financialRetentionYears} onChange={(e) => setFinancialRetentionYears(Number(e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {/* 8. Maintenance */}
        {activeSettingsSection === "maintenance" && (
          <div>
            <div className={styles.settingsHeader}>
              <h3 className={styles.settingsTitle}>Maintenance</h3>
            </div>
            <div className={styles.toggleRow}>
              <div className={styles.toggleLabel}>Maintenance Mode</div>
              <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </div>
            {maintenanceMode && (
              <div className={styles.formGroup} style={{ marginTop: "12px" }}>
                <label className={styles.label}>Banner Message</label>
                <input type="text" className={styles.input} value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} />
              </div>
            )}

            <div className={styles.statsGrid} style={{ marginTop: "20px", marginBottom: "20px" }}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Backup Schedule</div>
                <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: "4px" }}>{backupSchedule}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Last Backup</div>
                <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: "4px" }}>{lastBackupTime}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button className={styles.btnSecondary} onClick={() => triggerToast("Migrations executed.")}>
                Run Migrations
              </button>
              <button className={styles.btnSecondary} onClick={() => triggerToast("Cache cleared.")}>
                Clear Cache
              </button>
              <button className={styles.btnPrimary} onClick={() => triggerToast("Backup triggered.")}>
                Run Backup
              </button>
            </div>
          </div>
        )}

        {/* 9. API & Webhooks */}
        {activeSettingsSection === "api-webhooks" && (
          <div>
            <div className={styles.settingsHeader}>
              <h3 className={styles.settingsTitle}>API & Webhooks</h3>
              <button
                className={styles.btnPrimary}
                onClick={() => {
                  const newKey = {
                    id: String(Date.now()),
                    name: `API Key ${apiKeys.length + 1}`,
                    key: `pk_live_${Math.random().toString(36).substring(2, 10)}`,
                    createdAt: new Date().toISOString().split("T")[0],
                    status: "Active"
                  };
                  setApiKeys([...apiKeys, newKey]);
                  triggerToast("Key generated");
                }}
              >
                + Generate Key
              </button>
            </div>

            <div className={styles.tableCard} style={{ marginBottom: "20px" }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Key</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((k) => (
                    <tr key={k.id}>
                      <td style={{ fontWeight: 600 }}>{k.name}</td>
                      <td className={styles.subdomain}>{k.key}</td>
                      <td style={{ fontSize: "0.82rem", color: "#6b7280" }}>{k.createdAt}</td>
                      <td><span className={styles.statusActive}>{k.status}</span></td>
                      <td style={{ textAlign: "right" }}>
                        <button className={styles.btnActionDanger} onClick={() => { setApiKeys(apiKeys.filter((x) => x.id !== k.id)); triggerToast("Revoked"); }}>
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.settingsGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Starter Rate Limit (Req/min)</label>
                <input type="number" className={styles.input} value={starterLimit} onChange={(e) => setStarterLimit(Number(e.target.value))} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pro Rate Limit (Req/min)</label>
                <input type="number" className={styles.input} value={proLimit} onChange={(e) => setProLimit(Number(e.target.value))} />
              </div>
              <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                <label className={styles.label}>Enterprise Rate Limit (Req/min)</label>
                <input type="number" className={styles.input} value={enterpriseLimit} onChange={(e) => setEnterpriseLimit(Number(e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {/* 10. Branding */}
        {activeSettingsSection === "branding" && (
          <div>
            <div className={styles.settingsHeader}>
              <h3 className={styles.settingsTitle}>Branding</h3>
              <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                Save Changes
              </button>
            </div>
            <div className={styles.settingsGrid}>
              <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                <label className={styles.label}>Landing Page Title</label>
                <input type="text" className={styles.input} value={landingTitle} onChange={(e) => setLandingTitle(e.target.value)} />
              </div>
              <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                <label className={styles.label}>Landing Page Subtitle</label>
                <textarea className={styles.input} rows={2} value={landingSubtitle} onChange={(e) => setLandingSubtitle(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Logo URL</label>
                <input type="text" className={styles.input} value={emailHeaderLogo} onChange={(e) => setEmailHeaderLogo(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Footer Text</label>
                <input type="text" className={styles.input} value={emailFooterText} onChange={(e) => setEmailFooterText(e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
