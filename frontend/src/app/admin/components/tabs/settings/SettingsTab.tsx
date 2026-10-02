import React, { useState, useRef } from 'react';
import { COUNTRIES, BUSINESS_CATEGORIES, CURRENCIES, TIMEZONES } from '../../../constants/storeOptions';
import styles from '../../../page.module.css';

export interface ChangedField {
  field: string;
  from: string;
  to: string;
}

interface SettingsSubTabFooterProps {
  handleSaveSettings: (e?: any) => void;
  getChanges: () => ChangedField[];
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "0.88rem",
  fontWeight: 400,
  color: "#1f2937",
  outline: "none",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
  transition: "all 0.15s ease"
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 34px 9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "0.88rem",
  fontWeight: 400,
  color: "#1f2937",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  backgroundColor: "#ffffff",
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  boxSizing: "border-box",
  transition: "all 0.15s ease"
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "0.88rem",
  fontWeight: 400,
  color: "#1f2937",
  outline: "none",
  backgroundColor: "#ffffff",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "all 0.15s ease"
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: "20px 24px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  display: "flex",
  flexDirection: "column",
  gap: "16px"
};

const cardHeaderStyle = {
  marginBottom: "4px"
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1.02rem",
  fontWeight: 700,
  color: "#0c0a09",
  margin: 0
};

const cardSubTitleStyle: React.CSSProperties = {
  fontSize: "0.82rem",
  color: "#6b7280",
  margin: "4px 0 0 0",
  fontWeight: 400
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "6px"
};

/* ==========================================
 * 1. SETTINGS FOOTER & CONFIRMATION MODAL
 * ========================================== */
export function SettingsSubTabFooter({ handleSaveSettings, getChanges }: SettingsSubTabFooterProps) {
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const changes = getChanges();
  const isDirty = changes.length > 0;

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      await handleSaveSettings();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div style={{
        marginTop: '16px',
        padding: '14px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }}>
        <div>
          <span style={{ fontSize: '0.83rem', color: isDirty ? '#0c0a09' : '#6b7280', fontWeight: isDirty ? 600 : 400 }}>
            {isDirty ? `⚠️ Unsaved changes detected (${changes.length} field${changes.length > 1 ? 's' : ''} modified)` : 'All changes saved.'}
          </span>
        </div>
        <button
          type="button"
          disabled={!isDirty}
          onClick={() => setShowModal(true)}
          style={{
            padding: '8px 20px',
            borderRadius: '6px',
            backgroundColor: isDirty ? '#0c0a09' : '#e5e7eb',
            color: isDirty ? '#ffffff' : '#9ca3af',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: 'none',
            cursor: isDirty ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease'
          }}
        >
          Save Changes
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className={styles.modalBox}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className={styles.confirmIconBadge}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '22px', height: '22px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles.modalTitle}>Review & Confirm Changes</h3>
                  <p className={styles.modalSubtitle}>Review the modified store settings before applying.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Modified Fields ({changes.length})
              </span>
            </div>

            <div className={styles.confirmChangesBox}>
              {changes.map((ch, idx) => {
                const formatVal = (field: string, val: string) => {
                  if (!val) return '(empty)';
                  if (field.toLowerCase().includes('secret') || field.toLowerCase().includes('key') || field.toLowerCase().includes('token')) {
                    if (val.includes('••••')) return val;
                    if (val.length > 8) return val.slice(0, 4) + '••••' + val.slice(-4);
                    return '••••••••';
                  }
                  return val;
                };

                return (
                  <div key={idx} className={styles.confirmChangeItem}>
                    <div style={{ fontWeight: 600, color: '#09090b', marginBottom: '6px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#09090b', display: 'inline-block' }}></span>
                      {ch.field}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className={styles.fromValBadge}>{formatVal(ch.field, ch.from)}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#a1a1aa" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                      <span className={styles.toValBadge}>{formatVal(ch.field, ch.to)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnAction}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.btnActionAccent}
                onClick={handleConfirmSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }}>
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Applying...</span>
                  </>
                ) : (
                  'Confirm & Apply'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ==========================================
 * TAB 1: GENERAL SUBTAB
 * ========================================== */
export function GeneralSubTab(props: any) {
  const {
    storeBusinessName, setStoreBusinessName,
    storeBusinessType, setStoreBusinessType,
    storeCountry, setStoreCountry,
    storeCurrency, setStoreCurrency,
    storeTimezone, setStoreTimezone,
    storeOwnerEmail, setStoreOwnerEmail,
    storeOwnerPhone, setStoreOwnerPhone,
    storeSupportEmail, setStoreSupportEmail,
    storeSupportPhone, setStoreSupportPhone,
    storeAddress1, setStoreAddress1,
    storeAddress2, setStoreAddress2,
    storeCity, setStoreCity,
    storeState, setStoreState,
    storePostalCode, setStorePostalCode,
    storeLanguage, setStoreLanguage,
    brandLogoType, setBrandLogoType,
    brandLogoValue, setBrandLogoValue,
    uploadingLogo, handleBrandLogoUpload,
    handleSaveSettings
  } = props;

  const initialRef = useRef({
    storeBusinessName, storeBusinessType, storeCountry, storeCurrency, storeTimezone,
    storeOwnerEmail, storeOwnerPhone, storeSupportEmail, storeSupportPhone,
    storeAddress1, storeAddress2, storeCity, storeState, storePostalCode, storeLanguage,
    brandLogoValue
  });

  const getChanges = (): ChangedField[] => {
    const changes: ChangedField[] = [];
    const init = initialRef.current;
    if (storeBusinessName !== init.storeBusinessName) changes.push({ field: "Store / Brand Name", from: init.storeBusinessName, to: storeBusinessName });
    if (storeBusinessType !== init.storeBusinessType) changes.push({ field: "Business Category", from: init.storeBusinessType, to: storeBusinessType });
    if (storeCountry !== init.storeCountry) changes.push({ field: "Country", from: init.storeCountry, to: storeCountry });
    if (storeCurrency !== init.storeCurrency) changes.push({ field: "Currency", from: init.storeCurrency, to: storeCurrency });
    if (storeTimezone !== init.storeTimezone) changes.push({ field: "Timezone", from: init.storeTimezone, to: storeTimezone });
    if (storeOwnerEmail !== init.storeOwnerEmail) changes.push({ field: "Owner Email", from: init.storeOwnerEmail, to: storeOwnerEmail });
    if (storeOwnerPhone !== init.storeOwnerPhone) changes.push({ field: "Owner Phone", from: init.storeOwnerPhone, to: storeOwnerPhone });
    if (storeSupportEmail !== init.storeSupportEmail) changes.push({ field: "Support Email", from: init.storeSupportEmail, to: storeSupportEmail });
    if (storeSupportPhone !== init.storeSupportPhone) changes.push({ field: "Support Phone", from: init.storeSupportPhone, to: storeSupportPhone });
    if (storeAddress1 !== init.storeAddress1) changes.push({ field: "Address Line 1", from: init.storeAddress1, to: storeAddress1 });
    if (storeAddress2 !== init.storeAddress2) changes.push({ field: "Address Line 2", from: init.storeAddress2, to: storeAddress2 });
    if (storeCity !== init.storeCity) changes.push({ field: "City", from: init.storeCity, to: storeCity });
    if (storeState !== init.storeState) changes.push({ field: "State", from: init.storeState, to: storeState });
    if (storePostalCode !== init.storePostalCode) changes.push({ field: "Postal Code", from: init.storePostalCode, to: storePostalCode });
    if (brandLogoValue !== init.brandLogoValue) changes.push({ field: "Brand Logo", from: init.brandLogoValue, to: brandLogoValue });
    return changes;
  };

  const handleSaveAndResetSnapshot = async () => {
    await handleSaveSettings();
    initialRef.current = {
      storeBusinessName, storeBusinessType, storeCountry, storeCurrency, storeTimezone,
      storeOwnerEmail, storeOwnerPhone, storeSupportEmail, storeSupportPhone,
      storeAddress1, storeAddress2, storeCity, storeState, storePostalCode, storeLanguage,
      brandLogoValue
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Store Identity Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Store Identity & Branding</h3>
          <p style={cardSubTitleStyle}>Define your brand name, logo, and store classification.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Store / Brand Name</label>
            <input type="text" value={storeBusinessName || ''} onChange={(e) => setStoreBusinessName && setStoreBusinessName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Business Category</label>
            <select value={storeBusinessType || 'retail'} onChange={(e) => setStoreBusinessType && setStoreBusinessType(e.target.value)} style={selectStyle}>
              {BUSINESS_CATEGORIES.map((cat: any) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Brand Logo</label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="file" accept="image/*" onChange={handleBrandLogoUpload} style={{ fontSize: '0.82rem' }} />
            {uploadingLogo && <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Uploading...</span>}
            {brandLogoValue && brandLogoValue.startsWith('http') && (
              <img src={brandLogoValue} alt="Store Logo" style={{ height: '36px', maxWidth: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #e5e7eb' }} />
            )}
          </div>
        </div>
      </div>

      {/* Store Address Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Physical Location & Address</h3>
          <p style={cardSubTitleStyle}>Your official store operating address shown on invoices and checkout.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Address Line 1</label>
            <input type="text" value={storeAddress1 || ''} onChange={(e) => setStoreAddress1 && setStoreAddress1(e.target.value)} placeholder="Building, Street Name, Plot No." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Address Line 2 (Optional)</label>
            <input type="text" value={storeAddress2 || ''} onChange={(e) => setStoreAddress2 && setStoreAddress2(e.target.value)} placeholder="Suite, Landmark, Floor" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>City</label>
            <input type="text" value={storeCity || ''} onChange={(e) => setStoreCity && setStoreCity(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>State / Province</label>
            <input type="text" value={storeState || ''} onChange={(e) => setStoreState && setStoreState(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>ZIP / Postal Code</label>
            <input type="text" value={storePostalCode || ''} onChange={(e) => setStorePostalCode && setStorePostalCode(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Regional Standards Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Regional Standards & Currency</h3>
          <p style={cardSubTitleStyle}>Locale preferences, primary operating currency, and time zone.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Operating Country</label>
            <select value={storeCountry || 'India'} onChange={(e) => setStoreCountry && setStoreCountry(e.target.value)} style={selectStyle}>
              {COUNTRIES.map((c: any) => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Default Currency</label>
            <select value={storeCurrency || 'INR'} onChange={(e) => setStoreCurrency && setStoreCurrency(e.target.value)} style={selectStyle}>
              {CURRENCIES.map((curr: any) => (
                <option key={curr.value} value={curr.value}>{curr.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Timezone</label>
            <select value={storeTimezone || 'Asia/Kolkata'} onChange={(e) => setStoreTimezone && setStoreTimezone(e.target.value)} style={selectStyle}>
              {TIMEZONES.map((tz: any) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Contact Information</h3>
          <p style={cardSubTitleStyle}>Owner contacts and customer support details.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Owner Email</label>
            <input type="email" value={storeOwnerEmail || ''} onChange={(e) => setStoreOwnerEmail && setStoreOwnerEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Owner Phone</label>
            <input type="text" value={storeOwnerPhone || ''} onChange={(e) => setStoreOwnerPhone && setStoreOwnerPhone(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Support Email (Public)</label>
            <input type="email" value={storeSupportEmail || ''} onChange={(e) => setStoreSupportEmail && setStoreSupportEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Support Phone (Public)</label>
            <input type="text" value={storeSupportPhone || ''} onChange={(e) => setStoreSupportPhone && setStoreSupportPhone(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      <SettingsSubTabFooter handleSaveSettings={handleSaveAndResetSnapshot} getChanges={getChanges} />
    </div>
  );
}

/* ==========================================
 * TAB 2: ACCOUNT & SECURITY SUBTAB
 * ========================================== */
export function AccountSecuritySubTab(props: any) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change password.");
      }
      setPasswordMsg({ type: 'success', text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || "Failed to update password." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Change Password Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Change Account Password</h3>
          <p style={cardSubTitleStyle}>Update your administrator password for security.</p>
        </div>

        {passwordMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '0.83rem',
            backgroundColor: passwordMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: passwordMsg.type === 'success' ? '#047857' : '#dc2626',
            border: `1px solid ${passwordMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
          }}>
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px' }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '6px' }}>
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className={styles.btnActionAccent}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Active Sessions Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Active Sessions & Security</h3>
          <p style={cardSubTitleStyle}>Manage device access and session status.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', display: 'block' }}>Current Session</span>
            <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Active Web Browser (Admin Panel)</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>ONLINE</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
 * TAB 3: DOMAIN SUBTAB
 * ========================================== */
export function DomainSubTab(props: any) {
  const { storeSubdomain, storeCustomDomain, setStoreCustomDomain, handleSaveSettings } = props;
  const initialRef = useRef({ storeCustomDomain });

  const getChanges = (): ChangedField[] => {
    const changes: ChangedField[] = [];
    if (storeCustomDomain !== initialRef.current.storeCustomDomain) {
      changes.push({ field: "Custom Domain", from: initialRef.current.storeCustomDomain || "(none)", to: storeCustomDomain || "(none)" });
    }
    return changes;
  };

  const handleSaveAndResetSnapshot = async () => {
    await handleSaveSettings();
    initialRef.current = { storeCustomDomain };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Store Domain & Subdomain</h3>
          <p style={cardSubTitleStyle}>Your storefront public web address configurations.</p>
        </div>

        <div>
          <label style={labelStyle}>Free Platform Subdomain</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="text" disabled value={`${storeSubdomain || 'yourstore'}.29sformula.com`} style={{ ...inputStyle, backgroundColor: '#f3f4f6', color: '#6b7280' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '6px 12px', borderRadius: '6px', border: '1px solid #a7f3d0', whiteSpace: 'nowrap' }}>ACTIVE</span>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Custom Brand Domain</label>
          <input type="text" value={storeCustomDomain || ''} onChange={(e) => setStoreCustomDomain && setStoreCustomDomain(e.target.value)} placeholder="e.g. www.mybrand.com" style={inputStyle} />
          <span style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>Enter your registered domain. Point your CNAME record to <code>store.29sformula.com</code>.</span>
        </div>
      </div>

      <SettingsSubTabFooter handleSaveSettings={handleSaveAndResetSnapshot} getChanges={getChanges} />
    </div>
  );
}

const GATEWAY_GUIDE_DATA: Record<string, {
  title: string;
  portalUrl: string;
  portalName: string;
  skeletons: { label: string; example: string }[];
  steps: string[];
}> = {
  razorpay: {
    title: "Razorpay Merchant Setup & Credential Guide",
    portalUrl: "https://dashboard.razorpay.com/signup",
    portalName: "Razorpay Dashboard",
    skeletons: [
      { label: "Key ID (Test Mode)", example: "rzp_test_1234567890abcd" },
      { label: "Key ID (Live Mode)", example: "rzp_live_1234567890abcd" },
      { label: "Key Secret", example: "a1b2c3d4e5f6g7h8i9j0k1l2 (24 alphanumeric chars)" }
    ],
    steps: [
      "Create a Razorpay Account: Register at dashboard.razorpay.com/signup.",
      "Complete Account Verification: Submit your business profile and KYC documents for Live payments.",
      "Navigate to API Keys: In Razorpay Dashboard, go to Account & Settings -> API Keys (under Payment Methods).",
      "Generate Keys: Click 'Generate Test Key' for testing or 'Generate Live Key' for real payments.",
      "Copy Credentials: Copy your Key ID and Key Secret into the fields above and click '⚡ Test Connection'."
    ]
  },
  stripe: {
    title: "Stripe Merchant Setup & Credential Guide",
    portalUrl: "https://dashboard.stripe.com/register",
    portalName: "Stripe Dashboard",
    skeletons: [
      { label: "Publishable Key (Test)", example: "pk_test_51...XXXXXXXXXXXXXXXXXXXXXXXX" },
      { label: "Publishable Key (Live)", example: "pk_live_51...XXXXXXXXXXXXXXXXXXXXXXXX" },
      { label: "Secret Key (Test)", example: "sk_test_51...XXXXXXXXXXXXXXXXXXXXXXXX" }
    ],
    steps: [
      "Register Stripe Account: Sign up for a business account at dashboard.stripe.com/register.",
      "Activate Account: Complete tax registration and add your bank payout account.",
      "Access API Keys: Turn on 'Developers' mode (top-right) and navigate to Developers -> API Keys.",
      "Copy Keys: Copy your Publishable Key (pk_test_... or pk_live_...) and click 'Reveal secret key' to copy Secret Key.",
      "Paste & Verify: Paste both keys above and test the API connection."
    ]
  },
  paypal: {
    title: "PayPal Express Merchant Setup & Credential Guide",
    portalUrl: "https://developer.paypal.com/dashboard/applications",
    portalName: "PayPal Developer Portal",
    skeletons: [
      { label: "Client ID Format", example: "AXYz1234567890_ABCDEFGHIJKLMNOPQRSTUVWXYZ12345" },
      { label: "Client Secret Format", example: "EKLm9876543210_ZYXWVUTSRQPONMLKJIHGFEDCBA54321" }
    ],
    steps: [
      "Create PayPal Business Account: Register or upgrade your account at paypal.com/bizsignup.",
      "Log into Developer Portal: Open developer.paypal.com and log in with your business credentials.",
      "Create REST API App: Go to Dashboard -> Apps & Credentials -> Toggle Sandbox or Live -> Click 'Create App'.",
      "Copy Client Credentials: Copy the Client ID and click 'Show' to view and copy the Client Secret.",
      "Save Credentials: Enter credentials into the fields above and verify connection."
    ]
  },
  phonepe: {
    title: "PhonePe PG Merchant Setup & Credential Guide",
    portalUrl: "https://business.phonepe.com",
    portalName: "PhonePe Business Portal",
    skeletons: [
      { label: "Merchant ID (MID - Test)", example: "PGTESTPAYUAT" },
      { label: "Merchant ID (MID - Live)", example: "M123456789012345" },
      { label: "Salt Key Format", example: "099eb0cd-02fe-4e5b-b052-1234567890ab" },
      { label: "Salt Index", example: "1" }
    ],
    steps: [
      "Register PhonePe Business: Onboard your business account at business.phonepe.com.",
      "Submit Verification Docs: Upload GSTIN, PAN, and Bank Account details for PhonePe PG setup.",
      "Retrieve API Credentials: Go to PhonePe Dashboard -> Developer Settings -> API Credentials.",
      "Copy MID & Salt Key: Note your Merchant ID (MID), Salt Key, and Salt Index (usually '1').",
      "Configure Store: Select UAT or Production mode above, enter credentials, and test connection."
    ]
  },
  paytm: {
    title: "PayTM Business Gateway Setup & Credential Guide",
    portalUrl: "https://dashboard.paytm.com/next/apikeys",
    portalName: "Paytm Business Dashboard",
    skeletons: [
      { label: "Merchant ID (MID)", example: "DIY123456789012 (15 characters)" },
      { label: "Merchant Key Format", example: "mK1234567890!@#$" },
      { label: "Website Name (Test / Live)", example: "WEBSTAGING (Staging) / DEFAULT (Production)" }
    ],
    steps: [
      "Sign Up for Paytm Business: Create your merchant account at dashboard.paytm.com.",
      "Complete Merchant KYC: Upload business identity documents to activate online payments.",
      "Access API Keys: Navigate to Developer Settings -> API Keys in Paytm Dashboard.",
      "Copy MID & Merchant Key: Copy your Staging MID & Key for testing or Production MID & Key for live sales.",
      "Save Credentials: Input MID, Merchant Key, and Website name above and click Test Connection."
    ]
  }
};

function GatewayGuideCard({ gateway }: { gateway: string }) {
  const guide = GATEWAY_GUIDE_DATA[gateway];
  if (!guide) return null;

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      padding: '16px 20px',
      marginTop: '12px',
      fontSize: '0.85rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📖</span> {guide.title}
        </h4>
        <a
          href={guide.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#2563eb',
            textDecoration: 'none',
            backgroundColor: '#eff6ff',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid #bfdbfe'
          }}
        >
          Open {guide.portalName} ↗
        </a>
      </div>

      {/* Expected Credential Format Skeletons */}
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', display: 'block', marginBottom: '6px' }}>
          Expected Credential Skeletons & Formats:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
          {guide.skeletons.map((sk, idx) => (
            <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>{sk.label}</div>
              <code style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 600, fontFamily: 'monospace', display: 'block', marginTop: '2px', wordBreak: 'break-all' }}>
                {sk.example}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', display: 'block', marginBottom: '6px' }}>
          Step-by-Step Account & Credentials Setup:
        </span>
        <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', color: '#334155', lineHeight: '1.45' }}>
          {guide.steps.map((step, idx) => (
            <li key={idx} style={{ fontSize: '0.82rem' }}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ==========================================
 * TAB 4: PAYMENTS & CHECKOUT SUBTAB
 * ========================================== */
export function PaymentsSubTab(props: any) {
  const {
    activePaymentGateway = 'razorpay', setActivePaymentGateway,
    razorpayKeyId, setRazorpayKeyId,
    razorpayKeySecret, setRazorpayKeySecret,
    razorpayMode = 'test', setRazorpayMode,
    stripePublishableKey, setStripePublishableKey,
    stripeSecretKey, setStripeSecretKey,
    stripeMode = 'test', setStripeMode,
    paypalClientId, setPaypalClientId,
    paypalClientSecret, setPaypalClientSecret,
    paypalMode = 'sandbox', setPaypalMode,
    phonepeMerchantId, setPhonepeMerchantId,
    phonepeSaltKey, setPhonepeSaltKey,
    phonepeSaltIndex = '1', setPhonepeSaltIndex,
    phonepeMode = 'uat', setPhonepeMode,
    paytmMerchantId, setPaytmMerchantId,
    paytmMerchantKey, setPaytmMerchantKey,
    paytmWebsite = 'WEBSTAGING', setPaytmWebsite,
    paytmMode = 'staging', setPaytmMode,
    codEnabled, setCodEnabled,
    codExtraFee, setCodExtraFee,
    minOrderAmount, setMinOrderAmount,
    maxItemQuantity, setMaxItemQuantity,
    customerAccounts, setCustomerAccounts,
    taxInclusive, setTaxInclusive,
    taxRate, setTaxRate,
    taxNumber, setTaxNumber,
    deliverySubtext, setDeliverySubtext,
    handleSaveSettings
  } = props;

  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [showPaypalSecret, setShowPaypalSecret] = useState(false);
  const [showPhonepeSecret, setShowPhonepeSecret] = useState(false);
  const [showPaytmSecret, setShowPaytmSecret] = useState(false);

  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [testingGateway, setTestingGateway] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ gateway: string; success: boolean; message: string } | null>(null);

  const initialRef = useRef({
    activePaymentGateway, razorpayKeyId, razorpayKeySecret, razorpayMode,
    stripePublishableKey, stripeSecretKey, stripeMode,
    paypalClientId, paypalClientSecret, paypalMode,
    phonepeMerchantId, phonepeSaltKey, phonepeSaltIndex, phonepeMode,
    paytmMerchantId, paytmMerchantKey, paytmWebsite, paytmMode,
    codEnabled, codExtraFee, minOrderAmount, maxItemQuantity, customerAccounts, taxInclusive, taxRate, taxNumber, deliverySubtext
  });

  const selectedGateway = activePaymentGateway || 'razorpay';

  const getChanges = (): ChangedField[] => {
    const changes: ChangedField[] = [];
    const init = initialRef.current;
    if (activePaymentGateway !== init.activePaymentGateway) changes.push({ field: "Active Payment Gateway", from: init.activePaymentGateway, to: activePaymentGateway });
    if (razorpayKeyId !== init.razorpayKeyId) changes.push({ field: "Razorpay Key ID", from: init.razorpayKeyId, to: razorpayKeyId });
    if (razorpayKeySecret !== init.razorpayKeySecret) changes.push({ field: "Razorpay Key Secret", from: "********", to: "********" });
    if (razorpayMode !== init.razorpayMode) changes.push({ field: "Razorpay Mode", from: init.razorpayMode, to: razorpayMode });
    if (stripePublishableKey !== init.stripePublishableKey) changes.push({ field: "Stripe Publishable Key", from: init.stripePublishableKey, to: stripePublishableKey });
    if (stripeSecretKey !== init.stripeSecretKey) changes.push({ field: "Stripe Secret Key", from: "********", to: "********" });
    if (paypalClientId !== init.paypalClientId) changes.push({ field: "PayPal Client ID", from: init.paypalClientId, to: paypalClientId });
    if (paypalClientSecret !== init.paypalClientSecret) changes.push({ field: "PayPal Client Secret", from: "********", to: "********" });
    if (phonepeMerchantId !== init.phonepeMerchantId) changes.push({ field: "PhonePe Merchant ID", from: init.phonepeMerchantId, to: phonepeMerchantId });
    if (paytmMerchantId !== init.paytmMerchantId) changes.push({ field: "PayTM Merchant ID", from: init.paytmMerchantId, to: paytmMerchantId });
    if (codEnabled !== init.codEnabled) changes.push({ field: "COD Enabled", from: String(init.codEnabled), to: String(codEnabled) });
    if (codExtraFee !== init.codExtraFee) changes.push({ field: "COD Extra Fee", from: String(init.codExtraFee), to: String(codExtraFee) });
    if (minOrderAmount !== init.minOrderAmount) changes.push({ field: "Min Order Amount", from: String(init.minOrderAmount), to: String(minOrderAmount) });
    if (taxRate !== init.taxRate) changes.push({ field: "Tax Rate (%)", from: String(init.taxRate), to: String(taxRate) });
    if (taxNumber !== init.taxNumber) changes.push({ field: "GSTIN / Tax ID", from: init.taxNumber, to: taxNumber });
    return changes;
  };

  const handleTestConnection = async (gatewayName: string) => {
    setTestingGateway(gatewayName);
    setTestResult(null);

    let credentials: any = {};
    let mode = 'test';

    if (gatewayName === 'razorpay') {
      credentials = { keyId: razorpayKeyId, keySecret: razorpayKeySecret };
      mode = razorpayMode;
    } else if (gatewayName === 'stripe') {
      credentials = { publishableKey: stripePublishableKey, secretKey: stripeSecretKey };
      mode = stripeMode;
    } else if (gatewayName === 'paypal') {
      credentials = { clientId: paypalClientId, clientSecret: paypalClientSecret };
      mode = paypalMode;
    } else if (gatewayName === 'phonepe') {
      credentials = { merchantId: phonepeMerchantId, saltKey: phonepeSaltKey, saltIndex: phonepeSaltIndex };
      mode = phonepeMode;
    } else if (gatewayName === 'paytm') {
      credentials = { merchantId: paytmMerchantId, merchantKey: paytmMerchantKey, website: paytmWebsite };
      mode = paytmMode;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings/payment/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateway: gatewayName, credentials, mode })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to verify gateway connection');
      }

      setTestResult({
        gateway: gatewayName,
        success: true,
        message: data.message || `${gatewayName.toUpperCase()} Connection Successful!`
      });
    } catch (err: any) {
      setTestResult({
        gateway: gatewayName,
        success: false,
        message: err.message || 'Connection test failed. Please check credentials.'
      });
    } finally {
      setTestingGateway(null);
    }
  };

  const handleSaveAndResetSnapshot = async () => {
    await handleSaveSettings();
    initialRef.current = {
      activePaymentGateway, razorpayKeyId, razorpayKeySecret, razorpayMode,
      stripePublishableKey, stripeSecretKey, stripeMode,
      paypalClientId, paypalClientSecret, paypalMode,
      phonepeMerchantId, phonepeSaltKey, phonepeSaltIndex, phonepeMode,
      paytmMerchantId, paytmMerchantKey, paytmWebsite, paytmMode,
      codEnabled, codExtraFee, minOrderAmount, maxItemQuantity, customerAccounts, taxInclusive, taxRate, taxNumber, deliverySubtext
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Encryption & Security Notice Header */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#0c0a09',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0
        }}>
          🔐
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
            Multi-Gateway Enterprise Encryption Enabled
          </h4>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
            All payment gateway secret keys and salt keys are encrypted at rest using high-grade AES-256-GCM hardware encryption. Your store customers will automatically use the active gateway selected below.
          </p>
        </div>
      </div>

      {/* Select Active Primary Payment Gateway */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Primary Online Payment Gateway</h3>
          <p style={cardSubTitleStyle}>Choose which payment provider your customers will use at checkout.</p>
        </div>

        <div>
          <label style={labelStyle}>Active Payment Gateway Method</label>
          <select
            value={selectedGateway}
            onChange={(e) => setActivePaymentGateway && setActivePaymentGateway(e.target.value)}
            style={{ ...selectStyle, fontWeight: 600, fontSize: '0.92rem' }}
          >
            <option value="razorpay">Razorpay (India & Global UPI, Credit/Debit Cards, Netbanking)</option>
            <option value="stripe">Stripe (Global Credit/Debit Cards, Apple Pay & Google Pay)</option>
            <option value="paypal">PayPal (Global Express Checkout & International Accounts)</option>
            <option value="phonepe">PhonePe (Direct UPI, QR & Cards - India)</option>
            <option value="paytm">PayTM (PayTM Wallet, UPI & Netbanking - India)</option>
          </select>
        </div>
      </div>

      {/* Gateway Connection Details Card */}
      {selectedGateway === 'razorpay' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={cardTitleStyle}>Razorpay Credentials</h3>
              <p style={cardSubTitleStyle}>Configure UPI, Cards, and Netbanking credentials.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setOpenGuide(openGuide === 'razorpay' ? null : 'razorpay')}
                className={styles.btnAction}
                style={{ padding: '8px 12px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: openGuide === 'razorpay' ? '#eff6ff' : undefined, color: openGuide === 'razorpay' ? '#1d4ed8' : undefined }}
              >
                {openGuide === 'razorpay' ? '📖 Hide Guide' : '📖 Setup Guide & Skeletons'}
              </button>
              <button
                type="button"
                onClick={() => handleTestConnection('razorpay')}
                disabled={testingGateway === 'razorpay'}
                className={styles.btnAction}
                style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {testingGateway === 'razorpay' ? 'Testing API...' : '⚡ Test Connection'}
              </button>
            </div>
          </div>

          {openGuide === 'razorpay' && <GatewayGuideCard gateway="razorpay" />}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Gateway Environment Mode</label>
              <select value={razorpayMode || 'test'} onChange={(e) => setRazorpayMode && setRazorpayMode(e.target.value)} style={selectStyle}>
                <option value="test">Test / Sandbox Mode</option>
                <option value="live">Live / Production Mode</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Razorpay Key ID</label>
              <input type="text" value={razorpayKeyId || ''} onChange={(e) => setRazorpayKeyId && setRazorpayKeyId(e.target.value)} placeholder="rzp_test_..." style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Razorpay Key Secret</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type={showRazorpaySecret ? "text" : "password"} value={razorpayKeySecret || ''} onChange={(e) => setRazorpayKeySecret && setRazorpayKeySecret(e.target.value)} style={inputStyle} />
                <button type="button" className={styles.btnAction} onClick={() => setShowRazorpaySecret(!showRazorpaySecret)} style={{ whiteSpace: 'nowrap' }}>
                  {showRazorpaySecret ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedGateway === 'stripe' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={cardTitleStyle}>Stripe Credentials</h3>
              <p style={cardSubTitleStyle}>Configure Global Credit/Debit Card payments via Stripe.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setOpenGuide(openGuide === 'stripe' ? null : 'stripe')}
                className={styles.btnAction}
                style={{ padding: '8px 12px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: openGuide === 'stripe' ? '#eff6ff' : undefined, color: openGuide === 'stripe' ? '#1d4ed8' : undefined }}
              >
                {openGuide === 'stripe' ? '📖 Hide Guide' : '📖 Setup Guide & Skeletons'}
              </button>
              <button
                type="button"
                onClick={() => handleTestConnection('stripe')}
                disabled={testingGateway === 'stripe'}
                className={styles.btnAction}
                style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {testingGateway === 'stripe' ? 'Testing API...' : '⚡ Test Connection'}
              </button>
            </div>
          </div>

          {openGuide === 'stripe' && <GatewayGuideCard gateway="stripe" />}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Environment Mode</label>
              <select value={stripeMode || 'test'} onChange={(e) => setStripeMode && setStripeMode(e.target.value)} style={selectStyle}>
                <option value="test">Test / Sandbox Mode</option>
                <option value="live">Live / Production Mode</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Stripe Publishable Key</label>
              <input type="text" value={stripePublishableKey || ''} onChange={(e) => setStripePublishableKey && setStripePublishableKey(e.target.value)} placeholder="pk_test_..." style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Stripe Secret Key</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type={showStripeSecret ? "text" : "password"} value={stripeSecretKey || ''} onChange={(e) => setStripeSecretKey && setStripeSecretKey(e.target.value)} placeholder="sk_test_..." style={inputStyle} />
                <button type="button" className={styles.btnAction} onClick={() => setShowStripeSecret(!showStripeSecret)} style={{ whiteSpace: 'nowrap' }}>
                  {showStripeSecret ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedGateway === 'paypal' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={cardTitleStyle}>PayPal Credentials</h3>
              <p style={cardSubTitleStyle}>Configure PayPal Express Checkout & International Payments.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setOpenGuide(openGuide === 'paypal' ? null : 'paypal')}
                className={styles.btnAction}
                style={{ padding: '8px 12px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: openGuide === 'paypal' ? '#eff6ff' : undefined, color: openGuide === 'paypal' ? '#1d4ed8' : undefined }}
              >
                {openGuide === 'paypal' ? '📖 Hide Guide' : '📖 Setup Guide & Skeletons'}
              </button>
              <button
                type="button"
                onClick={() => handleTestConnection('paypal')}
                disabled={testingGateway === 'paypal'}
                className={styles.btnAction}
                style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {testingGateway === 'paypal' ? 'Testing API...' : '⚡ Test Connection'}
              </button>
            </div>
          </div>

          {openGuide === 'paypal' && <GatewayGuideCard gateway="paypal" />}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>PayPal Environment Mode</label>
              <select value={paypalMode || 'sandbox'} onChange={(e) => setPaypalMode && setPaypalMode(e.target.value)} style={selectStyle}>
                <option value="sandbox">Sandbox / Testing Mode</option>
                <option value="live">Live / Production Mode</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>PayPal Client ID</label>
              <input type="text" value={paypalClientId || ''} onChange={(e) => setPaypalClientId && setPaypalClientId(e.target.value)} placeholder="AYS..." style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>PayPal Client Secret</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type={showPaypalSecret ? "text" : "password"} value={paypalClientSecret || ''} onChange={(e) => setPaypalClientSecret && setPaypalClientSecret(e.target.value)} style={inputStyle} />
                <button type="button" className={styles.btnAction} onClick={() => setShowPaypalSecret(!showPaypalSecret)} style={{ whiteSpace: 'nowrap' }}>
                  {showPaypalSecret ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedGateway === 'phonepe' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={cardTitleStyle}>PhonePe Gateway Credentials</h3>
              <p style={cardSubTitleStyle}>Configure Direct UPI, QR, and Card checkout via PhonePe PG.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setOpenGuide(openGuide === 'phonepe' ? null : 'phonepe')}
                className={styles.btnAction}
                style={{ padding: '8px 12px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: openGuide === 'phonepe' ? '#eff6ff' : undefined, color: openGuide === 'phonepe' ? '#1d4ed8' : undefined }}
              >
                {openGuide === 'phonepe' ? '📖 Hide Guide' : '📖 Setup Guide & Skeletons'}
              </button>
              <button
                type="button"
                onClick={() => handleTestConnection('phonepe')}
                disabled={testingGateway === 'phonepe'}
                className={styles.btnAction}
                style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {testingGateway === 'phonepe' ? 'Testing API...' : '⚡ Test Connection'}
              </button>
            </div>
          </div>

          {openGuide === 'phonepe' && <GatewayGuideCard gateway="phonepe" />}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>PhonePe Environment</label>
              <select value={phonepeMode || 'uat'} onChange={(e) => setPhonepeMode && setPhonepeMode(e.target.value)} style={selectStyle}>
                <option value="uat">UAT / Sandbox Testing</option>
                <option value="production">Production Live</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>PhonePe Merchant ID</label>
              <input type="text" value={phonepeMerchantId || ''} onChange={(e) => setPhonepeMerchantId && setPhonepeMerchantId(e.target.value)} placeholder="PGTESTPAYUAT" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>PhonePe Salt Key</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type={showPhonepeSecret ? "text" : "password"} value={phonepeSaltKey || ''} onChange={(e) => setPhonepeSaltKey && setPhonepeSaltKey(e.target.value)} style={inputStyle} />
                <button type="button" className={styles.btnAction} onClick={() => setShowPhonepeSecret(!showPhonepeSecret)} style={{ whiteSpace: 'nowrap' }}>
                  {showPhonepeSecret ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Salt Index</label>
              <input type="text" value={phonepeSaltIndex || '1'} onChange={(e) => setPhonepeSaltIndex && setPhonepeSaltIndex(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      )}

      {selectedGateway === 'paytm' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={cardTitleStyle}>PayTM Gateway Credentials</h3>
              <p style={cardSubTitleStyle}>Configure PayTM Wallet, UPI, and Netbanking integrations.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setOpenGuide(openGuide === 'paytm' ? null : 'paytm')}
                className={styles.btnAction}
                style={{ padding: '8px 12px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: openGuide === 'paytm' ? '#eff6ff' : undefined, color: openGuide === 'paytm' ? '#1d4ed8' : undefined }}
              >
                {openGuide === 'paytm' ? '📖 Hide Guide' : '📖 Setup Guide & Skeletons'}
              </button>
              <button
                type="button"
                onClick={() => handleTestConnection('paytm')}
                disabled={testingGateway === 'paytm'}
                className={styles.btnAction}
                style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {testingGateway === 'paytm' ? 'Testing API...' : '⚡ Test Connection'}
              </button>
            </div>
          </div>

          {openGuide === 'paytm' && <GatewayGuideCard gateway="paytm" />}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>PayTM Environment</label>
              <select value={paytmMode || 'staging'} onChange={(e) => setPaytmMode && setPaytmMode(e.target.value)} style={selectStyle}>
                <option value="staging">Staging / Test Mode</option>
                <option value="production">Production Live Mode</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>PayTM Merchant ID (MID)</label>
              <input type="text" value={paytmMerchantId || ''} onChange={(e) => setPaytmMerchantId && setPaytmMerchantId(e.target.value)} placeholder="DIY1234..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>PayTM Merchant Key</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type={showPaytmSecret ? "text" : "password"} value={paytmMerchantKey || ''} onChange={(e) => setPaytmMerchantKey && setPaytmMerchantKey(e.target.value)} style={inputStyle} />
                <button type="button" className={styles.btnAction} onClick={() => setShowPaytmSecret(!showPaytmSecret)} style={{ whiteSpace: 'nowrap' }}>
                  {showPaytmSecret ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>PayTM Website Name</label>
              <input type="text" value={paytmWebsite || 'WEBSTAGING'} onChange={(e) => setPaytmWebsite && setPaytmWebsite(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      )}

      {/* Test Connection Result Banner */}
      {testResult && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: testResult.success ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${testResult.success ? '#bbf7d0' : '#fecaca'}`,
          color: testResult.success ? '#15803d' : '#b91c1c',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>{testResult.success ? '✓' : '⚠️'}</span>
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Cash on Delivery & Order Limits */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Cash on Delivery (COD) & Limits</h3>
          <p style={cardSubTitleStyle}>Enable offline payments and set order value limits.</p>
        </div>

        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Enable Cash on Delivery (COD)</span>
          <input type="checkbox" checked={codEnabled !== false} onChange={(e) => setCodEnabled && setCodEnabled(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '8px' }}>
          <div>
            <label style={labelStyle}>COD Flat Extra Charge (₹)</label>
            <input type="number" value={codExtraFee || 0} onChange={(e) => setCodExtraFee && setCodExtraFee(Number(e.target.value))} min={0} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Minimum Order Amount (₹)</label>
            <input type="number" value={minOrderAmount || 0} onChange={(e) => setMinOrderAmount && setMinOrderAmount(Number(e.target.value))} min={0} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Max Item Qty per Order</label>
            <input type="number" value={maxItemQuantity || 0} onChange={(e) => setMaxItemQuantity && setMaxItemQuantity(Number(e.target.value))} min={0} placeholder="0 = Unlimited" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Taxes & Checkout Notice */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Taxes & GST / VAT Configuration</h3>
          <p style={cardSubTitleStyle}>Set tax rates and tax inclusion preferences for checkout.</p>
        </div>

        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Prices include taxes (Tax-Inclusive Pricing)</span>
          <input type="checkbox" checked={taxInclusive || false} onChange={(e) => setTaxInclusive && setTaxInclusive(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
          <div>
            <label style={labelStyle}>Tax Rate (%)</label>
            <input type="number" value={taxRate || 0} onChange={(e) => setTaxRate && setTaxRate(Number(e.target.value))} min={0} step="0.1" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>GSTIN / Tax ID Number</label>
            <input type="text" value={taxNumber || ''} onChange={(e) => setTaxNumber && setTaxNumber(e.target.value)} placeholder="22AAAAA0000A1Z5" style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Checkout Subtext Notice</label>
            <input type="text" value={deliverySubtext || ''} onChange={(e) => setDeliverySubtext && setDeliverySubtext(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      <SettingsSubTabFooter handleSaveSettings={handleSaveAndResetSnapshot} getChanges={getChanges} />
    </div>
  );
}

/* ==========================================
 * TAB 5: SHIPPING & DELIVERY SUBTAB
 * ========================================== */
export function ShippingSubTab(props: any) {
  const {
    freeShippingThreshold, setFreeShippingThreshold,
    standardShippingRate, setStandardShippingRate,
    expressShippingRate, setExpressShippingRate,
    estimatedDelivery, setEstimatedDelivery,
    processingTime, setProcessingTime,
    shippingPolicyText, setShippingPolicyText,
    handleSaveSettings
  } = props;

  const initialRef = useRef({
    freeShippingThreshold, standardShippingRate, expressShippingRate,
    estimatedDelivery, processingTime, shippingPolicyText
  });

  const getChanges = (): ChangedField[] => {
    const changes: ChangedField[] = [];
    const init = initialRef.current;
    if (freeShippingThreshold !== init.freeShippingThreshold) changes.push({ field: "Free Shipping Min Order", from: String(init.freeShippingThreshold), to: String(freeShippingThreshold) });
    if (standardShippingRate !== init.standardShippingRate) changes.push({ field: "Standard Shipping Flat Rate", from: String(init.standardShippingRate), to: String(standardShippingRate) });
    if (estimatedDelivery !== init.estimatedDelivery) changes.push({ field: "Estimated Delivery Window", from: init.estimatedDelivery, to: estimatedDelivery });
    return changes;
  };

  const handleSaveAndResetSnapshot = async () => {
    await handleSaveSettings();
    initialRef.current = {
      freeShippingThreshold, standardShippingRate, expressShippingRate,
      estimatedDelivery, processingTime, shippingPolicyText
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Shipping Rates & Delivery Windows</h3>
          <p style={cardSubTitleStyle}>Free shipping thresholds and delivery timelines.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Free Shipping Threshold (₹)</label>
            <input type="number" value={freeShippingThreshold || 0} onChange={(e) => setFreeShippingThreshold && setFreeShippingThreshold(Number(e.target.value))} min={0} placeholder="0 = No Free Shipping" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Standard Flat Shipping Fee (₹)</label>
            <input type="number" value={standardShippingRate || 0} onChange={(e) => setStandardShippingRate && setStandardShippingRate(Number(e.target.value))} min={0} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Express Shipping Fee (₹)</label>
            <input type="number" value={expressShippingRate || 0} onChange={(e) => setExpressShippingRate && setExpressShippingRate(Number(e.target.value))} min={0} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Estimated Delivery Timeline</label>
            <input type="text" value={estimatedDelivery || '4-7 business days'} onChange={(e) => setEstimatedDelivery && setEstimatedDelivery(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Order Processing Lead Time</label>
            <input type="text" value={processingTime || '1-2 business days'} onChange={(e) => setProcessingTime && setProcessingTime(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Shipping Policy Details</label>
          <textarea rows={4} value={shippingPolicyText || ''} onChange={(e) => setShippingPolicyText && setShippingPolicyText(e.target.value)} style={textareaStyle} />
        </div>
      </div>

      <SettingsSubTabFooter handleSaveSettings={handleSaveAndResetSnapshot} getChanges={getChanges} />
    </div>
  );
}

/* ==========================================
 * TAB 6: NOTIFICATIONS & EMAIL SUBTAB
 * ========================================== */
export function NotificationsSubTab(props: any) {
  const {
    brevoApiKey, setBrevoApiKey,
    senderEmail, setSenderEmail,
    senderName, setSenderName,
    adminNotifyEmail, setAdminNotifyEmail,
    notifyOrderConfirm, setNotifyOrderConfirm,
    notifyOrderShipped, setNotifyOrderShipped,
    notifyOrderDelivered, setNotifyOrderDelivered,
    notifyOrderRefund, setNotifyOrderRefund,
    handleSaveSettings
  } = props;

  const [showBrevoKey, setShowBrevoKey] = useState(false);

  const initialRef = useRef({
    brevoApiKey, senderEmail, senderName, adminNotifyEmail,
    notifyOrderConfirm, notifyOrderShipped, notifyOrderDelivered, notifyOrderRefund
  });

  const getChanges = (): ChangedField[] => {
    const changes: ChangedField[] = [];
    const init = initialRef.current;
    if (brevoApiKey !== init.brevoApiKey) changes.push({ field: "Brevo API Key", from: "********", to: "********" });
    if (senderEmail !== init.senderEmail) changes.push({ field: "Sender Email", from: init.senderEmail, to: senderEmail });
    if (adminNotifyEmail !== init.adminNotifyEmail) changes.push({ field: "Admin Alert Email", from: init.adminNotifyEmail, to: adminNotifyEmail });
    return changes;
  };

  const handleSaveAndResetSnapshot = async () => {
    await handleSaveSettings();
    initialRef.current = {
      brevoApiKey, senderEmail, senderName, adminNotifyEmail,
      notifyOrderConfirm, notifyOrderShipped, notifyOrderDelivered, notifyOrderRefund
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Email Service Credentials */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Email Service (Brevo / SMTP API)</h3>
          <p style={cardSubTitleStyle}>Provide your Brevo transactional email credentials to send emails from your own domain.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Brevo API Key</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type={showBrevoKey ? "text" : "password"} value={brevoApiKey || ''} onChange={(e) => setBrevoApiKey && setBrevoApiKey(e.target.value)} placeholder="xkeysib-..." style={inputStyle} />
              <button type="button" className={styles.btnAction} onClick={() => setShowBrevoKey(!showBrevoKey)} style={{ whiteSpace: 'nowrap' }}>
                {showBrevoKey ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Sender Email Address</label>
            <input type="email" value={senderEmail || ''} onChange={(e) => setSenderEmail && setSenderEmail(e.target.value)} placeholder="orders@yourstore.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Sender Display Name</label>
            <input type="text" value={senderName || ''} onChange={(e) => setSenderName && setSenderName(e.target.value)} placeholder="My Brand Store" style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Admin Order Notification Email</label>
            <input type="email" value={adminNotifyEmail || ''} onChange={(e) => setAdminNotifyEmail && setAdminNotifyEmail(e.target.value)} placeholder="admin@yourstore.com" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Trigger Toggles */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Customer Order Email Notifications</h3>
          <p style={cardSubTitleStyle}>Choose which automated email updates customers receive.</p>
        </div>

        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Order Confirmation Email</span>
          <input type="checkbox" checked={notifyOrderConfirm !== false} onChange={(e) => setNotifyOrderConfirm && setNotifyOrderConfirm(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        </div>
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Shipping & Tracking Update Email</span>
          <input type="checkbox" checked={notifyOrderShipped !== false} onChange={(e) => setNotifyOrderShipped && setNotifyOrderShipped(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        </div>
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Order Delivered Email</span>
          <input type="checkbox" checked={notifyOrderDelivered !== false} onChange={(e) => setNotifyOrderDelivered && setNotifyOrderDelivered(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        </div>
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Refund & Return Updates Email</span>
          <input type="checkbox" checked={notifyOrderRefund !== false} onChange={(e) => setNotifyOrderRefund && setNotifyOrderRefund(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        </div>
      </div>

      <SettingsSubTabFooter handleSaveSettings={handleSaveAndResetSnapshot} getChanges={getChanges} />
    </div>
  );
}

/* ==========================================
 * TAB 7: INTEGRATIONS SUBTAB
 * ========================================== */
export function IntegrationsSubTab(props: any) {
  const {
    googleClientId, setGoogleClientId,
    googleClientSecret, setGoogleClientSecret,
    cloudinaryCloudName, setCloudinaryCloudName,
    cloudinaryApiKey, setCloudinaryApiKey,
    cloudinaryApiSecret, setCloudinaryApiSecret,
    metaTitle, setMetaTitle,
    metaDescription, setMetaDescription,
    googleAnalyticsId, setGoogleAnalyticsId,
    facebookPixelId, setFacebookPixelId,
    instagramLink, setInstagramLink,
    facebookLink, setFacebookLink,
    twitterLink, setTwitterLink,
    youtubeLink, setYoutubeLink,
    contactLink, setContactLink,
    handleSaveSettings
  } = props;

  const [showCloudinarySecret, setShowCloudinarySecret] = useState(false);
  const [showGoogleSecret, setShowGoogleSecret] = useState(false);

  const initialRef = useRef({
    googleClientId, googleClientSecret, cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret,
    metaTitle, metaDescription, googleAnalyticsId, facebookPixelId, instagramLink, facebookLink, twitterLink, youtubeLink, contactLink
  });

  const getChanges = (): ChangedField[] => {
    const changes: ChangedField[] = [];
    const init = initialRef.current;
    if (googleClientId !== init.googleClientId) changes.push({ field: "Google OAuth Client ID", from: init.googleClientId, to: googleClientId });
    if (cloudinaryCloudName !== init.cloudinaryCloudName) changes.push({ field: "Cloudinary Cloud Name", from: init.cloudinaryCloudName, to: cloudinaryCloudName });
    if (metaTitle !== init.metaTitle) changes.push({ field: "SEO Meta Title", from: init.metaTitle, to: metaTitle });
    if (instagramLink !== init.instagramLink) changes.push({ field: "Instagram Link", from: init.instagramLink, to: instagramLink });
    return changes;
  };

  const handleSaveAndResetSnapshot = async () => {
    await handleSaveSettings();
    initialRef.current = {
      googleClientId, googleClientSecret, cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret,
      metaTitle, metaDescription, googleAnalyticsId, facebookPixelId, instagramLink, facebookLink, twitterLink, youtubeLink, contactLink
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Cloudinary Media Credentials */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Cloudinary Media Credentials</h3>
          <p style={cardSubTitleStyle}>Connect your custom Cloudinary account for store product images and video uploads.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Cloud Name</label>
            <input type="text" value={cloudinaryCloudName || ''} onChange={(e) => setCloudinaryCloudName && setCloudinaryCloudName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>API Key</label>
            <input type="text" value={cloudinaryApiKey || ''} onChange={(e) => setCloudinaryApiKey && setCloudinaryApiKey(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>API Secret</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type={showCloudinarySecret ? "text" : "password"} value={cloudinaryApiSecret || ''} onChange={(e) => setCloudinaryApiSecret && setCloudinaryApiSecret(e.target.value)} style={inputStyle} />
              <button type="button" className={styles.btnAction} onClick={() => setShowCloudinarySecret(!showCloudinarySecret)} style={{ whiteSpace: 'nowrap' }}>
                {showCloudinarySecret ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Google OAuth Login Credentials */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Google OAuth (Customer 1-Click Login)</h3>
          <p style={cardSubTitleStyle}>Manage Google Sign-In credentials for customer storefront authentication.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Google Client ID</label>
            <input type="text" value={googleClientId || ''} onChange={(e) => setGoogleClientId && setGoogleClientId(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Google Client Secret</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type={showGoogleSecret ? "text" : "password"} value={googleClientSecret || ''} onChange={(e) => setGoogleClientSecret && setGoogleClientSecret(e.target.value)} style={inputStyle} />
              <button type="button" className={styles.btnAction} onClick={() => setShowGoogleSecret(!showGoogleSecret)} style={{ whiteSpace: 'nowrap' }}>
                {showGoogleSecret ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEO & Analytics */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>SEO & Analytics Integrations</h3>
          <p style={cardSubTitleStyle}>Google Analytics 4, Meta Pixel, and Search Engine optimization meta tags.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Google Analytics ID (GA4)</label>
            <input type="text" value={googleAnalyticsId || ''} onChange={(e) => setGoogleAnalyticsId && setGoogleAnalyticsId(e.target.value)} placeholder="G-XXXXXXXXXX" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Facebook / Meta Pixel ID</label>
            <input type="text" value={facebookPixelId || ''} onChange={(e) => setFacebookPixelId && setFacebookPixelId(e.target.value)} placeholder="1234567890" style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Store Meta Title (Homepage)</label>
            <input type="text" value={metaTitle || ''} onChange={(e) => setMetaTitle && setMetaTitle(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Store Meta Description</label>
            <textarea rows={3} value={metaDescription || ''} onChange={(e) => setMetaDescription && setMetaDescription(e.target.value)} style={textareaStyle} />
          </div>
        </div>
      </div>

      {/* Social Handles */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Social Media Handles</h3>
          <p style={cardSubTitleStyle}>Public social media profiles shown in storefront footer.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Instagram Profile URL</label>
            <input type="text" value={instagramLink || ''} onChange={(e) => setInstagramLink && setInstagramLink(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Facebook Page URL</label>
            <input type="text" value={facebookLink || ''} onChange={(e) => setFacebookLink && setFacebookLink(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>WhatsApp Support Chat Link</label>
            <input type="text" value={contactLink || ''} onChange={(e) => setContactLink && setContactLink(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Twitter / X Profile URL</label>
            <input type="text" value={twitterLink || ''} onChange={(e) => setTwitterLink && setTwitterLink(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      <SettingsSubTabFooter handleSaveSettings={handleSaveAndResetSnapshot} getChanges={getChanges} />
    </div>
  );
}

/* ==========================================
 * TAB 8: POLICIES SUBTAB
 * ========================================== */
export function PoliciesSubTab(props: any) {
  const {
    returnPolicyText, setReturnPolicyText,
    shippingPolicyText, setShippingPolicyText,
    contactUsText, setContactUsText,
    privacyPolicyText, setPrivacyPolicyText,
    termsOfServiceText, setTermsOfServiceText,
    aboutUsText, setAboutUsText,
    careersText, setCareersText,
    tradeEnquiryText, setTradeEnquiryText,
    handleSaveSettings
  } = props;

  const initialRef = useRef({
    returnPolicyText, shippingPolicyText, contactUsText, privacyPolicyText, termsOfServiceText, aboutUsText, careersText, tradeEnquiryText
  });

  const getChanges = (): ChangedField[] => {
    const changes: ChangedField[] = [];
    const init = initialRef.current;
    if (returnPolicyText !== init.returnPolicyText) changes.push({ field: "Return Policy", from: "(previous)", to: "(updated)" });
    if (privacyPolicyText !== init.privacyPolicyText) changes.push({ field: "Privacy Policy", from: "(previous)", to: "(updated)" });
    if (termsOfServiceText !== init.termsOfServiceText) changes.push({ field: "Terms of Service", from: "(previous)", to: "(updated)" });
    return changes;
  };

  const handleSaveAndResetSnapshot = async () => {
    await handleSaveSettings();
    initialRef.current = {
      returnPolicyText, shippingPolicyText, contactUsText, privacyPolicyText, termsOfServiceText, aboutUsText, careersText, tradeEnquiryText
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Storefront Legal Policies & Content</h3>
          <p style={cardSubTitleStyle}>Text content shown on footer popups and policy links.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Return & Refund Policy</label>
            <textarea rows={4} value={returnPolicyText || ''} onChange={(e) => setReturnPolicyText && setReturnPolicyText(e.target.value)} style={textareaStyle} />
          </div>
          <div>
            <label style={labelStyle}>Privacy Policy</label>
            <textarea rows={4} value={privacyPolicyText || ''} onChange={(e) => setPrivacyPolicyText && setPrivacyPolicyText(e.target.value)} style={textareaStyle} />
          </div>
          <div>
            <label style={labelStyle}>Terms of Service</label>
            <textarea rows={4} value={termsOfServiceText || ''} onChange={(e) => setTermsOfServiceText && setTermsOfServiceText(e.target.value)} style={textareaStyle} />
          </div>
          <div>
            <label style={labelStyle}>About Us Story</label>
            <textarea rows={3} value={aboutUsText || ''} onChange={(e) => setAboutUsText && setAboutUsText(e.target.value)} style={textareaStyle} />
          </div>
        </div>
      </div>

      <SettingsSubTabFooter handleSaveSettings={handleSaveAndResetSnapshot} getChanges={getChanges} />
    </div>
  );
}

/* ==========================================
 * TAB 9: TRUST SUBTAB
 * ========================================== */
export function TrustSubTab(props: any) {
  const {
    showTrustMarquee, setShowTrustMarquee,
    trustMarqueeDirection, setTrustMarqueeDirection,
    trustMarqueeSpeed, setTrustMarqueeSpeed,
    trustMarqueeItems = [], setTrustMarqueeItems,
    handleSaveSettings
  } = props;

  const initialRef = useRef({
    showTrustMarquee,
    trustMarqueeDirection,
    trustMarqueeSpeed,
    trustMarqueeItemsStr: JSON.stringify(trustMarqueeItems)
  });

  const getChanges = (): ChangedField[] => {
    const changes: ChangedField[] = [];
    const init = initialRef.current;
    if (showTrustMarquee !== init.showTrustMarquee) changes.push({ field: "Show Trust Marquee", from: String(init.showTrustMarquee), to: String(showTrustMarquee) });
    if (trustMarqueeDirection !== init.trustMarqueeDirection) changes.push({ field: "Scroll Direction", from: init.trustMarqueeDirection, to: trustMarqueeDirection });
    if (trustMarqueeSpeed !== init.trustMarqueeSpeed) changes.push({ field: "Scroll Speed", from: String(init.trustMarqueeSpeed), to: String(trustMarqueeSpeed) });
    if (JSON.stringify(trustMarqueeItems) !== init.trustMarqueeItemsStr) changes.push({ field: "Trust Badges List", from: "(previous)", to: "(updated)" });
    return changes;
  };

  const handleSaveAndResetSnapshot = async () => {
    await handleSaveSettings();
    initialRef.current = {
      showTrustMarquee,
      trustMarqueeDirection,
      trustMarqueeSpeed,
      trustMarqueeItemsStr: JSON.stringify(trustMarqueeItems)
    };
  };

  const handleUpdateItem = (index: number, key: string, value: string) => {
    const updated = [...trustMarqueeItems];
    updated[index] = { ...updated[index], [key]: value };
    setTrustMarqueeItems(updated);
  };

  const handleAddItem = () => {
    const newItem = { id: "badge-" + Date.now(), title: "NEW TRUST BADGE", subtitle: "Custom Guarantee", icon: "shipping" };
    setTrustMarqueeItems([...trustMarqueeItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = trustMarqueeItems.filter((_: any, i: number) => i !== index);
    setTrustMarqueeItems(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Storefront Trust Marquee</h3>
          <p style={cardSubTitleStyle}>Infinite scrolling trust seals on your homepage.</p>
        </div>

        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Show Trust Marquee on Storefront</span>
          <input type="checkbox" checked={showTrustMarquee} onChange={(e) => setShowTrustMarquee(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        </div>

        {showTrustMarquee && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
            <div>
              <label style={labelStyle}>Scroll Direction</label>
              <select value={trustMarqueeDirection} onChange={(e) => setTrustMarqueeDirection(e.target.value)} style={selectStyle}>
                <option value="left">Left ← Right</option>
                <option value="right">Right → Left</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Scroll Speed (Seconds)</label>
              <input type="number" value={trustMarqueeSpeed} onChange={(e) => setTrustMarqueeSpeed(Number(e.target.value))} min={10} max={120} style={inputStyle} />
            </div>
          </div>
        )}
      </div>

      {showTrustMarquee && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={cardTitleStyle}>Trust Badges & Seals</h3>
              <p style={cardSubTitleStyle}>Add or edit badges displayed in the scrolling banner.</p>
            </div>
            <button type="button" onClick={handleAddItem} className={styles.btnActionAccent} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
              + Add Badge
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {trustMarqueeItems.map((item: any, index: number) => (
              <div key={item.id || index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 40px', gap: '10px', alignItems: 'center', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <input type="text" value={item.title || ''} onChange={(e) => handleUpdateItem(index, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <input type="text" value={item.subtitle || ''} onChange={(e) => handleUpdateItem(index, 'subtitle', e.target.value)} placeholder="Subtitle" style={inputStyle} />
                <select value={item.icon || 'shipping'} onChange={(e) => handleUpdateItem(index, 'icon', e.target.value)} style={selectStyle}>
                  <option value="shipping">Shipping</option>
                  <option value="security">Security</option>
                  <option value="authenticity">Authenticity</option>
                  <option value="returns">Returns</option>
                  <option value="support">Support</option>
                </select>
                <button type="button" onClick={() => handleRemoveItem(index)} className={`${styles.btnAction} ${styles.btnActionDanger}`} style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <SettingsSubTabFooter handleSaveSettings={handleSaveAndResetSnapshot} getChanges={getChanges} />
    </div>
  );
}

/* ==========================================
 * MAIN SETTINGS TAB WRAPPER COMPONENT
 * ========================================== */
interface SettingsTabProps {
  settingsSubTab: string;
  setSettingsSubTab: (tab: string) => void;
  handleSaveSettings: (e?: any) => void;
  [key: string]: any;
}

export default function SettingsTab(props: SettingsTabProps) {
  const { settingsSubTab = "general" } = props;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        {settingsSubTab === "general" && <GeneralSubTab {...props} />}
        {settingsSubTab === "account" && <AccountSecuritySubTab {...props} />}
        {settingsSubTab === "domain" && <DomainSubTab {...props} />}
        {settingsSubTab === "payments" && <PaymentsSubTab {...props} />}
        {settingsSubTab === "shipping" && <ShippingSubTab {...props} />}
        {settingsSubTab === "notifications" && <NotificationsSubTab {...props} />}
        {settingsSubTab === "integrations" && <IntegrationsSubTab {...props} />}
        {settingsSubTab === "policies" && <PoliciesSubTab {...props} />}
        {settingsSubTab === "trust" && <TrustSubTab {...props} />}
      </div>
    </div>
  );
}
