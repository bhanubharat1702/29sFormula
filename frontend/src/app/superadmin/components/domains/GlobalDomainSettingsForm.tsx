"use client";

import React from "react";
import styles from "../../page.module.css";
import { DomainSettings } from "../domainsTypes";

interface GlobalDomainSettingsFormProps {
  settings: DomainSettings | null;
  setSettings: React.Dispatch<React.SetStateAction<DomainSettings | null>>;
  onSaveSettings: (e: React.FormEvent) => void;
}

export const GlobalDomainSettingsForm: React.FC<GlobalDomainSettingsFormProps> = ({
  settings,
  setSettings,
  onSaveSettings
}) => {
  if (!settings) return null;

  return (
    <form onSubmit={onSaveSettings} style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", maxWidth: "700px" }}>
      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#111827" }}>Global Domain Settings & Limits</h3>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>CNAME Target Host</label>
        <input
          type="text"
          value={settings.cnameTargetHost}
          onChange={(e) => setSettings({ ...settings, cnameTargetHost: e.target.value })}
          className={styles.formInput}
          required
        />
        <span style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", display: "block" }}>Instruct merchants to set CNAME record pointing to this host</span>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>A Record Target IP</label>
        <input
          type="text"
          value={settings.aRecordTargetIp}
          onChange={(e) => setSettings({ ...settings, aRecordTargetIp: e.target.value })}
          className={styles.formInput}
          required
        />
        <span style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", display: "block" }}>Target IPv4 address for apex / root domain (@) routing</span>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Platform Main Domain</label>
        <input
          type="text"
          value={settings.platformOwnDomain}
          onChange={(e) => setSettings({ ...settings, platformOwnDomain: e.target.value })}
          className={styles.formInput}
          required
        />
      </div>

      <hr style={{ margin: "20px 0", border: "0", borderTop: "1px solid #e5e7eb" }} />

      <h4 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#374151" }}>Custom Domain Limits Per Subscription Plan</h4>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Starter Plan Max Domains</label>
          <input
            type="number"
            value={settings.planDomainLimits.starter}
            onChange={(e) => setSettings({ ...settings, planDomainLimits: { ...settings.planDomainLimits, starter: parseInt(e.target.value) || 0 } })}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Growth Plan Max Domains</label>
          <input
            type="number"
            value={settings.planDomainLimits.growth}
            onChange={(e) => setSettings({ ...settings, planDomainLimits: { ...settings.planDomainLimits, growth: parseInt(e.target.value) || 0 } })}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Pro Plan Max Domains</label>
          <input
            type="number"
            value={settings.planDomainLimits.pro}
            onChange={(e) => setSettings({ ...settings, planDomainLimits: { ...settings.planDomainLimits, pro: parseInt(e.target.value) || 0 } })}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Enterprise Plan Max Domains</label>
          <input
            type="number"
            value={settings.planDomainLimits.enterprise}
            onChange={(e) => setSettings({ ...settings, planDomainLimits: { ...settings.planDomainLimits, enterprise: parseInt(e.target.value) || 0 } })}
            className={styles.formInput}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <input
          type="checkbox"
          id="manualApproval"
          checked={settings.manualApprovalRequired}
          onChange={(e) => setSettings({ ...settings, manualApprovalRequired: e.target.checked })}
          style={{ width: "16px", height: "16px" }}
        />
        <label htmlFor="manualApproval" style={{ fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer" }}>
          Require manual Super Admin approval before issuing SSL on new custom domains
        </label>
      </div>

      <button type="submit" className={styles.btnPrimary}>
        Save Global Settings
      </button>
    </form>
  );
};
