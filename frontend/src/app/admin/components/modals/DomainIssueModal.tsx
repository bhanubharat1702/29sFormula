import React, { useState } from 'react';
import styles from '../../page.module.css';

export interface DomainIssueModalConfig {
  type:
    | 'dns_failed'
    | 'reserved_domain'
    | 'domain_conflict'
    | 'plan_upgrade'
    | 'domain_blocked'
    | 'invalid_format'
    | 'remove_confirm'
    | 'subdomain_change_confirm';
  domain?: string;
  subdomain?: string;
  errorMessage?: string;
  dnsDetails?: {
    cnameHost?: string;
    cnameValue?: string;
    txtHost?: string;
    txtValue?: string;
    aHost?: string;
    aValue?: string;
  };
  onConfirm?: () => void;
  onRecheck?: () => void;
  onUpgrade?: () => void;
}

interface DomainIssueModalProps {
  config: DomainIssueModalConfig | null;
  onClose: () => void;
}

export default function DomainIssueModal({ config, onClose }: DomainIssueModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!config) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const { type, domain, subdomain, errorMessage, dnsDetails, onConfirm, onRecheck, onUpgrade } = config;

  return (
    <div className={styles.modalOverlay} style={{ zIndex: 100010 }}>
      <div
        className={styles.modalBox}
        style={{
          maxWidth: '560px',
          padding: '24px 28px',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e4e4e7',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          {type === 'dns_failed' && (
            <div style={iconContainerStyle('#fffbe6', '#d97706', '#fde68a')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          )}
          {type === 'reserved_domain' && (
            <div style={iconContainerStyle('#fef2f2', '#dc2626', '#fecaca')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
            </div>
          )}
          {type === 'domain_conflict' && (
            <div style={iconContainerStyle('#fff7ed', '#ea580c', '#fed7aa')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          )}
          {type === 'plan_upgrade' && (
            <div style={iconContainerStyle('#f5f3ff', '#7c3aed', '#ddd6fe')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
          )}
          {type === 'domain_blocked' && (
            <div style={iconContainerStyle('#fef2f2', '#b91c1c', '#fca5a5')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          )}
          {type === 'invalid_format' && (
            <div style={iconContainerStyle('#eff6ff', '#2563eb', '#bfdbfe')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
          )}
          {type === 'remove_confirm' && (
            <div style={iconContainerStyle('#fef2f2', '#dc2626', '#fecaca')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
          )}
          {type === 'subdomain_change_confirm' && (
            <div style={iconContainerStyle('#f0f9ff', '#0284c7', '#bae6fd')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#09090b', letterSpacing: '-0.02em' }}>
              {type === 'dns_failed' && 'DNS Verification Required'}
              {type === 'reserved_domain' && 'Reserved or System Domain'}
              {type === 'domain_conflict' && 'Domain Already Registered'}
              {type === 'plan_upgrade' && 'Custom Domain Plan Required'}
              {type === 'domain_blocked' && 'Domain Restricted by Admin'}
              {type === 'invalid_format' && 'Invalid Domain Format'}
              {type === 'remove_confirm' && 'Disconnect Custom Domain?'}
              {type === 'subdomain_change_confirm' && 'Change Store Subdomain?'}
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
              {type === 'dns_failed' && `DNS records for ${domain || 'your domain'} were not found yet.`}
              {type === 'reserved_domain' && `The domain or handle specified cannot be assigned.`}
              {type === 'domain_conflict' && `${domain || 'This domain'} is attached to another store.`}
              {type === 'plan_upgrade' && `Unlock custom domains by upgrading your platform subscription.`}
              {type === 'domain_blocked' && `${domain || 'This domain'} has administrative restrictions.`}
              {type === 'invalid_format' && `Please enter a clean, valid domain address.`}
              {type === 'remove_confirm' && `Store custom domain will be unlinked.`}
              {type === 'subdomain_change_confirm' && `Your free store URL will be updated.`}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content Details Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* 1. DNS Failed */}
          {type === 'dns_failed' && (
            <>
              <div style={alertBoxStyle('#fffbe6', '#fef3c7', '#92400e')}>
                <strong>Why isn't it active yet?</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.81rem' }}>
                  DNS updates take 5 minutes to 24 hours to spread across global internet servers. Make sure you added these records at your registrar (GoDaddy, Namecheap, Cloudflare, etc.).
                </p>
              </div>

              {dnsDetails && (
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    Required DNS Records for <code>{domain}</code>:
                  </div>

                  {dnsDetails.cnameValue && (
                    <div style={dnsRowStyle}>
                      <span style={badgeTypeStyle}>CNAME</span>
                      <div style={{ flex: 1, minWidth: 0, fontSize: '0.8rem', color: '#1e293b', fontFamily: 'monospace' }}>
                        {dnsDetails.cnameHost || domain} &rarr; {dnsDetails.cnameValue}
                      </div>
                      <button
                        onClick={() => handleCopy(`${dnsDetails.cnameHost || domain} CNAME ${dnsDetails.cnameValue}`, 'cname')}
                        style={copyBtnStyle}
                      >
                        {copiedField === 'cname' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {dnsDetails.txtValue && (
                    <div style={dnsRowStyle}>
                      <span style={{ ...badgeTypeStyle, backgroundColor: '#fef3c7', color: '#92400e' }}>TXT</span>
                      <div style={{ flex: 1, minWidth: 0, fontSize: '0.8rem', color: '#1e293b', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {dnsDetails.txtHost} &rarr; {dnsDetails.txtValue}
                      </div>
                      <button
                        onClick={() => handleCopy(`${dnsDetails.txtHost} TXT ${dnsDetails.txtValue}`, 'txt')}
                        style={copyBtnStyle}
                      >
                        {copiedField === 'txt' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* 2. Reserved Domain */}
          {type === 'reserved_domain' && (
            <div style={alertBoxStyle('#fef2f2', '#fecaca', '#991b1b')}>
              <strong>System Keyword Protection</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.81rem' }}>
                {errorMessage || `Domain or handle '${domain || subdomain}' is reserved by platform infrastructure or belongs to the main platform. Please choose a custom domain that you own (e.g., shop.yourbrand.com) or a unique subdomain.`}
              </p>
            </div>
          )}

          {/* 3. Domain Conflict */}
          {type === 'domain_conflict' && (
            <>
              <div style={alertBoxStyle('#fff7ed', '#fed7aa', '#9a3412')}>
                <strong>Domain Ownership Conflict</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.81rem' }}>
                  {errorMessage || `'${domain}' is currently assigned to another merchant account on our platform.`}
                </p>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                💡 <strong>Do you own this domain?</strong> Add the unique TXT verification token at your domain registrar so our system can automatically confirm your ownership and transfer it to your account.
              </div>
            </>
          )}

          {/* 4. Plan Upgrade */}
          {type === 'plan_upgrade' && (
            <div style={{ background: '#fcf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#6b21a8' }}>
                👑 Unlock Custom Brand Domains
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#7e22ce', lineHeight: 1.45 }}>
                {errorMessage || 'Connecting custom domains requires a Pro or Enterprise subscription plan. Upgrade your store plan to connect your own domain, get automatic SSL certificates, and build customer trust.'}
              </p>
            </div>
          )}

          {/* 5. Domain Blocked */}
          {type === 'domain_blocked' && (
            <div style={alertBoxStyle('#fef2f2', '#fecaca', '#991b1b')}>
              <strong>Administrative Restriction</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.81rem' }}>
                {errorMessage || `The domain '${domain}' has been restricted by platform administration. Please reach out to customer support to review this domain.`}
              </p>
            </div>
          )}

          {/* 6. Invalid Format */}
          {type === 'invalid_format' && (
            <div style={alertBoxStyle('#eff6ff', '#bfdbfe', '#1e40af')}>
              <strong>Formatting Guidelines</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.81rem' }}>
                {errorMessage || 'Please remove http://, https://, or slashes. Enter clean domains like shop.mybrand.com or mybrand.com.'}
              </p>
            </div>
          )}

          {/* 7. Remove Confirm */}
          {type === 'remove_confirm' && (
            <div style={alertBoxStyle('#fef2f2', '#fecaca', '#991b1b')}>
              <strong>Store URL Disconnection Warning</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.81rem' }}>
                Disconnecting <strong>{domain}</strong> will unbind it from your store. Visitors trying to access {domain} will no longer reach your shop. Your store will fall back to your free platform subdomain.
              </p>
            </div>
          )}

          {/* 8. Subdomain Change Confirm */}
          {type === 'subdomain_change_confirm' && (
            <div style={alertBoxStyle('#f0f9ff', '#bae6fd', '#0369a1')}>
              <strong>Public Link Update Notice</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.81rem' }}>
                Changing your platform subdomain to <strong>{subdomain}</strong> will update your free store web address. Previous customer bookmarks pointing to your old subdomain will stop working.
              </p>
            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          {type === 'dns_failed' && (
            <>
              <button onClick={onClose} style={btnSecondaryStyle}>Dismiss</button>
              {onRecheck && (
                <button
                  onClick={() => { onClose(); onRecheck(); }}
                  style={btnPrimaryStyle('#0284c7', '#0369a1')}
                >
                  ⚡ Re-check DNS Now
                </button>
              )}
            </>
          )}

          {(type === 'reserved_domain' || type === 'invalid_format') && (
            <button onClick={onClose} style={btnPrimaryStyle('#2563eb', '#1d4ed8')}>
              Got It
            </button>
          )}

          {type === 'domain_conflict' && (
            <>
              <button onClick={onClose} style={btnSecondaryStyle}>Cancel</button>
              {onRecheck && (
                <button
                  onClick={() => { onClose(); onRecheck(); }}
                  style={btnPrimaryStyle('#ea580c', '#c2410c')}
                >
                  Verify Ownership
                </button>
              )}
            </>
          )}

          {type === 'plan_upgrade' && (
            <>
              <button onClick={onClose} style={btnSecondaryStyle}>Maybe Later</button>
              <button
                onClick={() => { onClose(); if (onUpgrade) onUpgrade(); }}
                style={btnPrimaryStyle('#7c3aed', '#6d28d9')}
              >
                👑 Upgrade Plan
              </button>
            </>
          )}

          {type === 'domain_blocked' && (
            <button onClick={onClose} style={btnSecondaryStyle}>Close</button>
          )}

          {type === 'remove_confirm' && (
            <>
              <button onClick={onClose} style={btnSecondaryStyle}>Keep Domain</button>
              <button
                onClick={() => { onClose(); if (onConfirm) onConfirm(); }}
                style={btnPrimaryStyle('#dc2626', '#b91c1c')}
              >
                Disconnect Domain
              </button>
            </>
          )}

          {type === 'subdomain_change_confirm' && (
            <>
              <button onClick={onClose} style={btnSecondaryStyle}>Cancel</button>
              <button
                onClick={() => { onClose(); if (onConfirm) onConfirm(); }}
                style={btnPrimaryStyle('#0284c7', '#0369a1')}
              >
                Confirm & Change
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helpers for inline dynamic styling
const iconContainerStyle = (bg: string, fg: string, border: string): React.CSSProperties => ({
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  backgroundColor: bg,
  color: fg,
  border: `1px solid ${border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
});

const alertBoxStyle = (bg: string, border: string, fg: string): React.CSSProperties => ({
  backgroundColor: bg,
  border: `1px solid ${border}`,
  color: fg,
  padding: '12px 14px',
  borderRadius: '10px',
  fontSize: '0.84rem'
});

const dnsRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#ffffff',
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1'
};

const badgeTypeStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  backgroundColor: '#e0f2fe',
  color: '#0369a1',
  padding: '2px 6px',
  borderRadius: '4px',
  textTransform: 'uppercase'
};

const copyBtnStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  border: '1px solid #cbd5e1',
  borderRadius: '5px',
  padding: '3px 8px',
  fontSize: '0.74rem',
  fontWeight: 600,
  color: '#334155',
  cursor: 'pointer'
};

const btnSecondaryStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '0.84rem',
  fontWeight: 600,
  color: '#475569',
  cursor: 'pointer'
};

const btnPrimaryStyle = (bg: string, hoverBg: string): React.CSSProperties => ({
  backgroundColor: bg,
  border: 'none',
  borderRadius: '8px',
  padding: '8px 18px',
  fontSize: '0.84rem',
  fontWeight: 600,
  color: '#ffffff',
  cursor: 'pointer',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
});
