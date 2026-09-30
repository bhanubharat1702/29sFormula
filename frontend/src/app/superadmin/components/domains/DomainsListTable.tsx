"use client";

import React from "react";
import styles from "../../page.module.css";
import { DomainRecord } from "../domainsTypes";

interface DomainsListTableProps {
  loading: boolean;
  domains: DomainRecord[];
  onViewDns: (domain: DomainRecord) => void;
  onRecheckDns: (domain: DomainRecord) => void;
  onForceSsl: (domain: DomainRecord) => void;
  onSetPrimary: (domain: DomainRecord) => void;
  onBlockDomain: (domain: DomainRecord) => void;
  onRemoveDomain: (domain: DomainRecord) => void;
}

export const DomainsListTable: React.FC<DomainsListTableProps> = ({
  loading,
  domains,
  onViewDns,
  onRecheckDns,
  onForceSsl,
  onSetPrimary,
  onBlockDomain,
  onRemoveDomain
}) => {
  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Domain</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Merchant Store</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Type</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Primary?</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>DNS Status</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>SSL Status</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Added Date</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Last Check</th>
            <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151", textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                Loading domain list...
              </td>
            </tr>
          ) : domains.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                No matching domains found.
              </td>
            </tr>
          ) : (
            domains.map((item) => (
              <tr key={item._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: "600", color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{item.domain}</span>
                    {item.isBlocked && (
                      <span style={{ fontSize: "11px", background: "#fee2e2", color: "#991b1b", padding: "2px 6px", borderRadius: "4px" }}>
                        BLOCKED
                      </span>
                    )}
                  </div>
                  {item.dnsFailureReason && (
                    <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "2px" }}>
                      ⚠️ {item.dnsFailureReason}
                    </div>
                  )}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: "500", color: "#374151" }}>{item.storeName}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{item.subdomain}.yourplatform.com</div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor: item.type === "custom" ? "#e0e7ff" : "#f3f4f6",
                    color: item.type === "custom" ? "#3730a3" : "#374151"
                  }}>
                    {item.type === "custom" ? "Custom Domain" : "Subdomain"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {item.isPrimary ? (
                    <span style={{ padding: "2px 6px", background: "#d1fae5", color: "#065f46", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                      ★ Primary
                    </span>
                  ) : (
                    <button
                      className={styles.btnSecondary}
                      style={{ padding: "2px 8px", fontSize: "11px" }}
                      onClick={() => onSetPrimary(item)}
                    >
                      Set Primary
                    </button>
                  )}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor:
                      item.dnsStatus === "dns_verified" || item.dnsStatus === "active" ? "#d1fae5" :
                      item.dnsStatus === "pending" ? "#fef3c7" : "#fee2e2",
                    color:
                      item.dnsStatus === "dns_verified" || item.dnsStatus === "active" ? "#065f46" :
                      item.dnsStatus === "pending" ? "#92400e" : "#991b1b"
                  }}>
                    {item.dnsStatus === "dns_verified" || item.dnsStatus === "active" ? "✓ Verified" :
                     item.dnsStatus === "pending" ? "⏳ Pending DNS" : "❌ Failed"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor:
                      item.sslStatus === "active" ? "#d1fae5" :
                      item.sslStatus === "pending" || item.sslStatus === "issuing" ? "#fef3c7" : "#fee2e2",
                    color:
                      item.sslStatus === "active" ? "#065f46" :
                      item.sslStatus === "pending" || item.sslStatus === "issuing" ? "#92400e" : "#991b1b"
                  }}>
                    🔒 {item.sslStatus.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "13px" }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "13px" }}>
                  {item.lastDnsCheckAt ? new Date(item.lastDnsCheckAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Never"}
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <button
                      className={styles.btnSecondary}
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                      onClick={() => onViewDns(item)}
                      title="View DNS Instructions & TXT Ownership Token"
                    >
                      DNS Info
                    </button>
                    <button
                      className={styles.btnSecondary}
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                      onClick={() => onRecheckDns(item)}
                      title="Re-check DNS propagation"
                    >
                      🔄 Re-check
                    </button>
                    <button
                      className={styles.btnSecondary}
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                      onClick={() => onForceSsl(item)}
                      title="Force SSL certificate issuance / renewal"
                    >
                      🔒 SSL
                    </button>
                    {!item.isBlocked ? (
                      <button
                        className={styles.btnSecondary}
                        style={{ padding: "4px 8px", fontSize: "12px", color: "#dc2626" }}
                        onClick={() => onBlockDomain(item)}
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        className={styles.btnSecondary}
                        style={{ padding: "4px 8px", fontSize: "12px" }}
                        onClick={() => onRemoveDomain(item)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
