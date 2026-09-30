"use client";

import React from "react";
import styles from "../../page.module.css";
import { DomainRecord } from "../domainsTypes";

interface DnsInstructionsModalProps {
  domainObj: DomainRecord | null;
  onClose: () => void;
}

export const DnsInstructionsModal: React.FC<DnsInstructionsModalProps> = ({ domainObj, onClose }) => {
  if (!domainObj) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} style={{ maxWidth: "620px" }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>DNS Setup Instructions</h3>
            <p className={styles.modalSubtitle}>Domain: <strong style={{ color: "#4f46e5" }}>{domainObj.domain}</strong> ({domainObj.storeName})</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "16px" }}>
            Add the following DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, AWS Route 53, etc.).
          </p>

          <div style={{ backgroundColor: "#f9fafb", padding: "14px", borderRadius: "10px", border: "1px solid #e5e7eb", marginBottom: "12px" }}>
            <div style={{ fontWeight: "700", fontSize: "13px", color: "#111827", marginBottom: "6px" }}>1. CNAME Record (For Subdomains / WWW)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "8px", fontSize: "13px", fontFamily: "monospace", background: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
              <div><strong>Host:</strong> {domainObj.domain.split('.')[0]}</div>
              <div><strong>Type:</strong> CNAME</div>
              <div><strong>Value:</strong> {domainObj.targetCname || "stores.yourplatform.com"}</div>
            </div>
          </div>

          <div style={{ backgroundColor: "#f9fafb", padding: "14px", borderRadius: "10px", border: "1px solid #e5e7eb", marginBottom: "12px" }}>
            <div style={{ fontWeight: "700", fontSize: "13px", color: "#111827", marginBottom: "6px" }}>2. A Record (For Apex / Root Domain)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "8px", fontSize: "13px", fontFamily: "monospace", background: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
              <div><strong>Host:</strong> @</div>
              <div><strong>Type:</strong> A</div>
              <div><strong>Value:</strong> {domainObj.targetA || "192.0.2.1"}</div>
            </div>
          </div>

          <div style={{ backgroundColor: "#eef2ff", padding: "14px", borderRadius: "10px", border: "1px solid #c7d2fe", marginBottom: "16px" }}>
            <div style={{ fontWeight: "700", fontSize: "13px", color: "#3730a3", marginBottom: "6px" }}>3. TXT Ownership Verification Token</div>
            <div style={{ fontSize: "13px", fontFamily: "monospace", background: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #c7d2fe", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span><strong>Host:</strong> _platform-challenge</span>
              <code style={{ background: "#eef2ff", color: "#3730a3", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>
                {domainObj.verificationToken || "verify-cname-token"}
              </code>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "#6b7280", background: "#f3f4f6", padding: "10px", borderRadius: "8px" }}>
            💡 <strong>Automatic Background Job:</strong> The system verifies DNS every few minutes (up to 72h). SSL certificate is automatically issued once DNS propagation completes.
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnPrimary} onClick={onClose}>
            Got It, Close
          </button>
        </div>
      </div>
    </div>
  );
};
