import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES, BUSINESS_CATEGORIES, CURRENCIES, TIMEZONES, getCountryFlag } from '../../../constants/storeOptions';
import styles from '../../../page.module.css';
import { getAuthHeaders } from '../../../hooks/useDashboardData';
import DomainIssueModal, { DomainIssueModalConfig } from '../../modals/DomainIssueModal';


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
 * COUNTRY SELECT DROPDOWN COMPONENT WITH FLAGS
 * ========================================== */
export function CountrySelectDropdown({
  value,
  onChange,
  countries
}: {
  value: string;
  onChange: (countryName: string) => void;
  countries: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find(c => c.name.toLowerCase() === (value || 'India').toLowerCase()) || countries[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '42px',
          padding: '0 12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '0.88rem',
          fontWeight: 400,
          color: '#1f2937',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={`https://flagcdn.com/w80/${(selectedCountry?.code || 'in').toLowerCase()}.png`}
            alt={selectedCountry?.name || 'Country'}
            style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 1px 2px rgba(0,0,0,0.15)', flexShrink: 0 }}
          />
          <span style={{ fontWeight: 500, color: '#111827' }}>{selectedCountry?.name || value || 'India'}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#374151" style={{ width: '16px', height: '16px', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Popover Menu matching Screenshot Design */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
          zIndex: 999,
          maxHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '8px'
        }}>
          {/* Search Bar with Magnifying Glass Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '8px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#475569" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.94rem',
                fontWeight: 400,
                color: '#1e293b'
              }}
            />
          </div>

          {/* List of Countries */}
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '2px' }}>
            {filteredCountries.length === 0 ? (
              <div style={{ padding: '16px', fontSize: '0.86rem', color: '#94a3b8', textAlign: 'center' }}>
                No country found
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.name.toLowerCase() === (selectedCountry?.name || '').toLowerCase();
                return (
                  <div
                    key={c.code}
                    onClick={() => {
                      onChange(c.name);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#f1f5f9' : 'transparent',
                      transition: 'background-color 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Left: Circular Country Flag Logo + Country Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={`https://flagcdn.com/w80/${c.code.toLowerCase()}.png`}
                        alt={c.name}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          flexShrink: 0
                        }}
                      />
                      <span style={{ fontSize: '0.94rem', fontWeight: 500, color: '#1e293b' }}>
                        {c.name}
                      </span>
                    </div>

                    {/* Right: Country 2-Letter Code */}
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.04em' }}>
                      {c.code}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
 * GENERIC REUSABLE CUSTOM SELECT DROPDOWN
 * ========================================== */
export interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
  badge?: string;
  symbol?: string;
  iconUrl?: string;
}

export function CustomSelectDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  showSearch = true,
  searchPlaceholder = "Search..."
}: {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.subLabel && o.subLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (o.badge && o.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (o.value && o.value.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '42px',
          padding: '0 12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '0.88rem',
          fontWeight: 400,
          color: '#1f2937',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, marginRight: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            {selectedOption?.iconUrl && (
              <img
                src={selectedOption.iconUrl}
                alt=""
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
            )}
            <span style={{ fontWeight: 500, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedOption?.label || placeholder} {selectedOption?.symbol ? `(${selectedOption.symbol})` : ''} {selectedOption?.subLabel ? `- ${selectedOption.subLabel}` : ''}
            </span>
          </div>
          {selectedOption?.badge && !selectedOption?.symbol && (
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#475569', letterSpacing: '0.02em', flexShrink: 0, marginLeft: '8px' }}>
              {selectedOption.badge}
            </span>
          )}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#374151" style={{ width: '16px', height: '16px', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease', flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
          zIndex: 999,
          maxHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '8px'
        }}>
          {/* Search Bar */}
          {showSearch && options.length > 5 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '8px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#475569" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.94rem',
                  fontWeight: 400,
                  color: '#1e293b'
                }}
              />
            </div>
          )}

          {/* List of Options */}
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '2px' }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '16px', fontSize: '0.86rem', color: '#94a3b8', textAlign: 'center' }}>
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === selectedOption?.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#f1f5f9' : 'transparent',
                      transition: 'background-color 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                      {opt.iconUrl && (
                        <img
                          src={opt.iconUrl}
                          alt=""
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            flexShrink: 0
                          }}
                        />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1e293b' }}>
                          {opt.label}
                        </span>
                        {opt.subLabel && (
                          <span style={{ fontSize: '0.78rem', fontWeight: 400, color: '#64748b' }}>
                            {opt.subLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {opt.symbol ? (
                      <span style={{ fontSize: '0.96rem', fontWeight: 500, color: '#334155', marginLeft: '12px' }}>
                        {opt.symbol}
                      </span>
                    ) : opt.badge ? (
                      <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.04em' }}>
                        {opt.badge}
                      </span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
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
    primaryColor, setPrimaryColor,
    handleSaveSettings
  } = props;

  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handleCountryChange = (countryName: string) => {
    if (setStoreCountry) setStoreCountry(countryName);
    const found = COUNTRIES.find((c: any) => c.name.toLowerCase() === countryName.toLowerCase());
    if (found) {
      if (setStoreCurrency && found.currencyCode) {
        setStoreCurrency(found.currencyCode);
      }
      if (setStoreTimezone && found.timezone) {
        setStoreTimezone(found.timezone);
      }
    }
  };

  const handleAutoFetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || '';
            const houseNumber = addr.house_number || '';
            const fullAddress1 = [houseNumber, road].filter(Boolean).join(' ') || data.display_name?.split(',')[0] || '';

            if (fullAddress1 && setStoreAddress1) setStoreAddress1(fullAddress1);
            const cityName = addr.city || addr.town || addr.village || addr.county || '';
            if (cityName && setStoreCity) setStoreCity(cityName);
            if (addr.state && setStoreState) setStoreState(addr.state);
            if (addr.postcode && setStorePostalCode) setStorePostalCode(addr.postcode);
            if (addr.country) {
              handleCountryChange(addr.country);
            }
          }
        } catch (err) {
          console.error("Failed to fetch address:", err);
          alert("Could not automatically resolve address from your coordinates.");
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Location access denied or unavailable. Please enable browser location permissions.");
        setIsFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const initialRef = useRef({
    storeBusinessName, storeBusinessType, storeCountry, storeCurrency, storeTimezone,
    storeOwnerEmail, storeOwnerPhone, storeSupportEmail, storeSupportPhone,
    storeAddress1, storeAddress2, storeCity, storeState, storePostalCode, storeLanguage,
    brandLogoValue, primaryColor
  });

  const getChanges = (): ChangedField[] => {
    const changes: ChangedField[] = [];
    const init = initialRef.current;
    if (storeBusinessName !== init.storeBusinessName) changes.push({ field: "Store / Brand Name", from: init.storeBusinessName, to: storeBusinessName });
    if (storeBusinessType !== init.storeBusinessType) changes.push({ field: "Business Category", from: init.storeBusinessType, to: storeBusinessType });
    if (primaryColor !== init.primaryColor) changes.push({ field: "Primary Brand Theme Color", from: init.primaryColor, to: primaryColor });
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
      brandLogoValue, primaryColor
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Store Identity Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Store Identity</h3>
        </div>

        {/* Row 1: Store Name & Business Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={labelStyle}>Store Name</label>
              <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500 }}>
                {(storeBusinessName || '').length}/40
              </span>
            </div>
            <input
              type="text"
              maxLength={40}
              value={storeBusinessName || ''}
              onChange={(e) => setStoreBusinessName && setStoreBusinessName(e.target.value)}
              placeholder="e.g. demo1"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ ...labelStyle, marginBottom: '6px' }}>Business Category</label>
            <CustomSelectDropdown
              value={storeBusinessType || 'retail'}
              onChange={(val) => setStoreBusinessType && setStoreBusinessType(val)}
              options={BUSINESS_CATEGORIES.map((cat: any) => ({ value: cat.value, label: cat.label }))}
              searchPlaceholder="Search category..."
            />
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '4px 0' }} />

        {/* Row 2: Primary Brand Theme Color & Store Logo (2-Column Layout) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Left Column: Primary Brand Theme Color */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Primary Brand Theme Color</label>
                <span style={{ color: '#9ca3af', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }} title="Main theme color for your store">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: '15px', height: '15px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                HEX
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '8px 14px',
              backgroundColor: '#ffffff',
              minHeight: '48px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Color Button + Native Picker */}
                <div style={{ position: 'relative', width: '28px', height: '28px', flexShrink: 0 }}>
                  <input
                    type="color"
                    value={primaryColor || "#2563eb"}
                    onChange={(e: any) => setPrimaryColor && setPrimaryColor(e.target.value)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                  />
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: primaryColor || '#2563eb',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }} />
                </div>

                {/* Hex Input Box */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #94a3b8',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  backgroundColor: '#ffffff',
                  height: '32px'
                }}>
                  <span style={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.84rem', marginRight: '4px' }}>#</span>
                  <input
                    type="text"
                    value={(primaryColor || '#2563eb').replace(/^#/, '').toUpperCase()}
                    onChange={(e: any) => {
                      const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                      setPrimaryColor && setPrimaryColor('#' + val);
                    }}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      width: '64px',
                      backgroundColor: 'transparent',
                      letterSpacing: '0.02em'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '1px', height: '22px', backgroundColor: '#e5e7eb' }} />

                {/* Preset Color Swatches */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {[
                    { hex: '#2563eb', label: 'Blue' },
                    { hex: '#4f46e5', label: 'Indigo' },
                    { hex: '#059669', label: 'Emerald' },
                    { hex: '#d97706', label: 'Amber' },
                    { hex: '#0f172a', label: 'Dark' }
                  ].map((swatch) => {
                    const isActive = (primaryColor || '#2563eb').toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.hex}
                        type="button"
                        title={swatch.label}
                        onClick={() => setPrimaryColor && setPrimaryColor(swatch.hex)}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: swatch.hex,
                          border: 'none',
                          outline: isActive ? `2px solid ${swatch.hex}` : 'none',
                          outlineOffset: '2px',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.15s ease'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Store Logo */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Store Logo</label>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#9ca3af' }}>
                PNG, SVG • Max 2MB
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '8px 14px',
              backgroundColor: '#ffffff',
              minHeight: '48px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                {/* Logo Icon / Image Container */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {brandLogoValue && (brandLogoValue.startsWith('http') || brandLogoValue.startsWith('data:')) ? (
                    <img src={brandLogoValue} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" style={{ width: '18px', height: '18px' }}>
                      <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-3 3h3v3h-3v-3zm3 3h3v3h-3v-3z" />
                    </svg>
                  )}
                </div>

                {/* File Name & Size */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1e293b' }}>
                    {brandLogoValue ? "logo-mark.png" : "logo-mark.png"}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 400 }}>
                    (32 KB)
                  </span>
                </div>
              </div>

              {/* Action Buttons: Replace & Delete */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '14px', height: '14px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span>{uploadingLogo ? "Uploading..." : "Replace"}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    onChange={handleBrandLogoUpload}
                    disabled={uploadingLogo}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setBrandLogoValue && setBrandLogoValue('')}
                  title="Remove Logo"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '6px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Address Card */}
      <div style={cardStyle}>
        <div style={{ ...cardHeaderStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={cardTitleStyle}>Store Location</h3>
          </div>
          <button
            type="button"
            onClick={handleAutoFetchLocation}
            disabled={isFetchingLocation}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: isFetchingLocation ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
          >
            {isFetchingLocation ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }}>
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Fetching Location...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: '15px', height: '15px', color: '#2563eb' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>Auto Fetch Location</span>
              </>
            )}
          </button>
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Operating Country</label>
            <CountrySelectDropdown
              value={storeCountry || 'India'}
              onChange={handleCountryChange}
              countries={COUNTRIES}
            />
          </div>
          <div>
            <label style={labelStyle}>Default Currency</label>
            <CustomSelectDropdown
              value={storeCurrency || 'INR'}
              onChange={(val) => setStoreCurrency && setStoreCurrency(val)}
              options={CURRENCIES}
              searchPlaceholder="Search currency..."
            />
          </div>
          <div>
            <label style={labelStyle}>Timezone</label>
            <CustomSelectDropdown
              value={storeTimezone || 'Asia/Kolkata'}
              onChange={(val) => setStoreTimezone && setStoreTimezone(val)}
              options={TIMEZONES.map((tz: any) => ({ value: tz.value, label: tz.label }))}
              searchPlaceholder="Search timezone..."
            />
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

      {/* Account Security / Change Password */}
      <ChangePasswordCard />

      <SettingsSubTabFooter handleSaveSettings={handleSaveAndResetSnapshot} getChanges={getChanges} />
    </div>
  );
}

/* ==========================================
 * SHARED CHANGE PASSWORD CARD
 * ========================================== */
export function ChangePasswordCard() {
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
      const authHeaders = getAuthHeaders();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
      const res = await fetch(`${apiUrl}/api/admin/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders
        },
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
  );
}

/* ==========================================
 * TAB 3: DOMAIN SUBTAB
 * ========================================== */
/* Shared button / badge styles for the domain manager */
const primaryBtn: React.CSSProperties = {
  padding: '9px 16px', fontSize: '0.83rem', fontWeight: 600, borderRadius: '8px',
  border: '1px solid #0c0a09', backgroundColor: '#0c0a09', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap'
};
const secondaryBtn: React.CSSProperties = {
  padding: '7px 12px', fontSize: '0.78rem', fontWeight: 600, borderRadius: '6px',
  border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap'
};
const badgeBase: React.CSSProperties = {
  fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', whiteSpace: 'nowrap'
};

const planLabel = (p?: string) => {
  const map: Record<string, string> = { starter: 'Starter', growth: 'Growth', pro: 'Pro', enterprise: 'Enterprise' };
  return map[(p || 'starter').toLowerCase()] || (p || 'Starter');
};

const dnsStatusMeta = (status: string) => {
  const map: Record<string, { label: string; color: string; bg: string; border: string }> = {
    pending: { label: 'Pending DNS', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    dns_verified: { label: 'DNS Verified', color: '#0369a1', bg: '#eff6ff', border: '#bfdbfe' },
    ssl_issued: { label: 'SSL Issued', color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' },
    active: { label: 'Active', color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
    failed: { label: 'Failed', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' }
  };
  return map[status] || map.pending;
};

const sslStatusMeta = (status: string) => {
  const map: Record<string, { label: string; color: string; bg: string; border: string }> = {
    pending: { label: 'Pending', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    issuing: { label: 'Issuing', color: '#0369a1', bg: '#eff6ff', border: '#bfdbfe' },
    active: { label: 'Active', color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
    expiring_soon: { label: 'Expiring Soon', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    expired: { label: 'Expired', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
    failed: { label: 'Failed', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' }
  };
  return map[status] || map.pending;
};

function DnsRecordRow({ label, type, host, value }: { label: string; type: string; host: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }).catch(() => { });
    }
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 70px 1fr auto', gap: '10px', alignItems: 'center', padding: '9px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
      <span style={{ fontWeight: 600, color: '#475569' }}>{label}</span>
      <span style={{ fontWeight: 700, color: '#0f172a' }}>{type}</span>
      <span style={{ color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`${host} → ${value}`}>
        {host} <span style={{ color: '#94a3b8' }}>→</span> {value}
      </span>
      <button type="button" onClick={copy} style={secondaryBtn}>{copied ? 'Copied' : 'Copy'}</button>
    </div>
  );
}

export function DomainSubTab() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

  interface DomainItem {
    id: string;
    domain: string;
    type: string;
    isPrimary: boolean;
    dnsStatus: string;
    sslStatus: string;
    verificationToken: string;
    targetCname: string;
    targetA: string;
    dnsFailureReason?: string;
    isBlocked?: boolean;
    blockReason?: string;
    sslExpiresAt?: string | null;
    createdAt?: string | null;
  }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [platformSubdomain, setPlatformSubdomain] = useState<{ label: string; fullDomain: string; status: string } | null>(null);
  const [customDomains, setCustomDomains] = useState<DomainItem[]>([]);
  const [entitlement, setEntitlement] = useState<any>(null);
  const [settings, setSettings] = useState<any>({ platformOwnDomain: '29sformula.com', cnameTargetHost: 'store.29sformula.com' });
  const [newDomain, setNewDomain] = useState('');
  const [addPending, setAddPending] = useState(false);
  const [rechecking, setRechecking] = useState<string | null>(null);
  const [dnsInstructions, setDnsInstructions] = useState<any>(null);
  const [editingSubdomain, setEditingSubdomain] = useState(false);
  const [subdomainDraft, setSubdomainDraft] = useState('');
  const [subdomainCheck, setSubdomainCheck] = useState<any>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [savingSubdomain, setSavingSubdomain] = useState(false);
  const [modalConfig, setModalConfig] = useState<DomainIssueModalConfig | null>(null);

  const loadDomains = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/merchant/domains`, { headers: getAuthHeaders(), cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed to load domains (HTTP ${res.status})`);
      setPlatformSubdomain(data.platformSubdomain || null);
      setCustomDomains(Array.isArray(data.customDomains) ? data.customDomains : []);
      setEntitlement(data.entitlement || null);
      if (data.settings) setSettings(data.settings);
      setSubdomainDraft(
        (data.platformSubdomain && (data.platformSubdomain.label || data.platformSubdomain.suggestedSubdomain)) || ''
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load domain settings.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { loadDomains(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const buildLocalDns = (d: DomainItem) => ({
    domain: d.domain,
    cnameRecord: { host: d.domain, type: 'CNAME', value: d.targetCname },
    aRecord: { host: '@', type: 'A', value: d.targetA },
    txtRecord: { host: `_platform-challenge.${d.domain}`, type: 'TXT', value: d.verificationToken || '(generated on add)' }
  });

  const triggerDomainIssueModal = (errMessage: string, domainName?: string, targetDomainItem?: DomainItem) => {
    const msg = (errMessage || '').toLowerCase();

    if (msg.includes('plan') || msg.includes('upgrade') || msg.includes('limit reached')) {
      setModalConfig({
        type: 'plan_upgrade',
        domain: domainName,
        errorMessage: errMessage,
        onUpgrade: () => {
          setNotice({ type: 'success', text: 'Please contact support or super admin to upgrade your store plan.' });
        }
      });
    } else if (msg.includes('reserved') || msg.includes('platform') || msg.includes('system keyword')) {
      setModalConfig({
        type: 'reserved_domain',
        domain: domainName,
        errorMessage: errMessage
      });
    } else if (msg.includes('already connected') || msg.includes('already assigned') || msg.includes('already registered')) {
      setModalConfig({
        type: 'domain_conflict',
        domain: domainName,
        errorMessage: errMessage,
        onRecheck: domainName ? () => handleRecheck(domainName) : undefined
      });
    } else if (msg.includes('blocked') || msg.includes('restricted')) {
      setModalConfig({
        type: 'domain_blocked',
        domain: domainName,
        errorMessage: errMessage
      });
    } else if (msg.includes('valid domain') || msg.includes('format') || msg.includes('invalid') || msg.includes('remove http')) {
      setModalConfig({
        type: 'invalid_format',
        domain: domainName,
        errorMessage: errMessage
      });
    } else {
      setModalConfig({
        type: 'dns_failed',
        domain: domainName,
        errorMessage: errMessage,
        dnsDetails: targetDomainItem ? {
          cnameHost: targetDomainItem.domain,
          cnameValue: targetDomainItem.targetCname,
          txtHost: `_platform-challenge.${targetDomainItem.domain}`,
          txtValue: targetDomainItem.verificationToken
        } : undefined,
        onRecheck: domainName ? () => handleRecheck(domainName) : undefined
      });
    }
  };

  const handleAddDomain = async () => {
    const domain = newDomain.trim();
    if (!domain) return;

    if (domain.includes('http://') || domain.includes('https://') || domain.includes('/') || domain.includes(' ')) {
      triggerDomainIssueModal('Please remove http://, https://, spaces, or slashes from your domain name.', domain);
      return;
    }

    setAddPending(true);
    setNotice(null);
    try {
      const res = await fetch(`${API_BASE}/api/merchant/domains`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ domain })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        triggerDomainIssueModal(data.error || 'Failed to add domain.', domain);
        return;
      }
      setNewDomain('');
      setDnsInstructions(data.dnsInstructions || null);
      setNotice({ type: 'success', text: data.message || 'Domain added. Configure DNS to verify.' });
      await loadDomains();
    } catch (err: any) {
      triggerDomainIssueModal(err.message || 'Failed to add domain.', domain);
    } finally {
      setAddPending(false);
    }
  };

  const handleRecheck = async (domain: string) => {
    setRechecking(domain);
    setNotice(null);
    const target = customDomains.find(d => d.domain === domain);
    try {
      const res = await fetch(`${API_BASE}/api/merchant/domains/recheck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ domain })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || (!data.verified && !data.awaitingApproval)) {
        const localDns = target ? {
          cnameHost: target.domain,
          cnameValue: target.targetCname,
          txtHost: `_platform-challenge.${target.domain}`,
          txtValue: target.verificationToken
        } : undefined;

        setModalConfig({
          type: 'dns_failed',
          domain,
          errorMessage: data.message || data.error || 'DNS records not detected yet.',
          dnsDetails: localDns,
          onRecheck: () => handleRecheck(domain)
        });
      } else {
        setNotice({ type: 'success', text: data.message });
      }
      if (data.dnsInstructions) setDnsInstructions(data.dnsInstructions);
      await loadDomains();
    } catch (err: any) {
      triggerDomainIssueModal(err.message || 'Failed to recheck domain.', domain, target);
    } finally {
      setRechecking(null);
    }
  };

  const handleSetPrimary = async (domain: string) => {
    setNotice(null);
    try {
      const res = await fetch(`${API_BASE}/api/merchant/domains/set-primary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ domain })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        triggerDomainIssueModal(data.error || 'Failed to set primary domain.', domain);
        return;
      }
      setNotice({ type: 'success', text: data.message });
      await loadDomains();
    } catch (err: any) {
      triggerDomainIssueModal(err.message || 'Failed to set primary domain.', domain);
    }
  };

  const performRemove = async (domain: string) => {
    setNotice(null);
    try {
      const res = await fetch(`${API_BASE}/api/merchant/domains`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ domain })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        triggerDomainIssueModal(data.error || 'Failed to remove domain.', domain);
        return;
      }
      setDnsInstructions(null);
      setNotice({ type: 'success', text: data.message });
      await loadDomains();
    } catch (err: any) {
      triggerDomainIssueModal(err.message || 'Failed to remove domain.', domain);
    }
  };

  const handleRemove = (domain: string) => {
    setModalConfig({
      type: 'remove_confirm',
      domain,
      onConfirm: () => performRemove(domain)
    });
  };

  const handleCheckSubdomain = async () => {
    const label = subdomainDraft.trim();
    if (!label) return;
    setCheckingSubdomain(true);
    try {
      const res = await fetch(`${API_BASE}/api/merchant/domains/availability?subdomain=${encodeURIComponent(label)}`, { headers: getAuthHeaders() });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to check availability.');
      setSubdomainCheck(data);
    } catch (err: any) {
      setSubdomainCheck({ available: false, reason: err.message });
    } finally {
      setCheckingSubdomain(false);
    }
  };

  const performSaveSubdomain = async (label: string) => {
    setSavingSubdomain(true);
    setNotice(null);
    try {
      const res = await fetch(`${API_BASE}/api/merchant/domains/subdomain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ subdomain: label })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        triggerDomainIssueModal(data.error || 'Failed to update subdomain.', undefined);
        return;
      }
      setNotice({ type: 'success', text: data.message });
      setEditingSubdomain(false);
      setSubdomainCheck(null);
      await loadDomains();
    } catch (err: any) {
      triggerDomainIssueModal(err.message || 'Failed to update subdomain.', undefined);
    } finally {
      setSavingSubdomain(false);
    }
  };

  const handleSaveSubdomain = () => {
    const label = subdomainDraft.trim();
    if (!label) return;
    setModalConfig({
      type: 'subdomain_change_confirm',
      subdomain: label,
      onConfirm: () => performSaveSubdomain(label)
    });
  };

  const platformDomain = settings?.platformOwnDomain || '29sformula.com';
  const fullSubdomain = platformSubdomain?.fullDomain
    || (platformSubdomain?.label ? `${platformSubdomain.label}.${platformDomain}` : '');
  const subdomainStatus = platformSubdomain?.status || 'active';
  const subdomainStatusMeta = subdomainStatus === 'active'
    ? { label: 'ACTIVE', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0' }
    : { label: 'NOT SET', color: '#b45309', background: '#fffbeb', border: '1px solid #fcd34d' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <DomainIssueModal config={modalConfig} onClose={() => setModalConfig(null)} />

      {notice && (
        <div style={{
          padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem',
          border: `1px solid ${notice.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          backgroundColor: notice.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: notice.type === 'success' ? '#065f46' : '#991b1b'
        }}>
          {notice.text}
        </div>
      )}

      {loading ? (
        <div style={{ ...cardStyle, alignItems: 'center', color: '#6b7280', fontSize: '0.85rem' }}>Loading domain settings…</div>
      ) : error ? (
        <div style={{ ...cardStyle, borderColor: '#fecaca' }}>
          <span style={{ color: '#b91c1c', fontSize: '0.85rem' }}>{error}</span>
          <button onClick={loadDomains} style={{ ...secondaryBtn, alignSelf: 'flex-start' }}>Retry</button>
        </div>
      ) : (
        <>
          {/* Free Platform Subdomain */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Store Domain & Subdomain</h3>
              <p style={cardSubTitleStyle}>Your storefront public web address configurations.</p>
            </div>

            <div>
              <label style={labelStyle}>Free Platform Subdomain</label>
              {!editingSubdomain ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="text" disabled value={fullSubdomain} placeholder="Not assigned yet" style={{ ...inputStyle, backgroundColor: '#f3f4f6', color: '#6b7280' }} />
                  <span style={{ ...badgeBase, ...subdomainStatusMeta, padding: '6px 12px', borderRadius: '6px' }}>{subdomainStatusMeta.label}</span>
                  <button onClick={() => setEditingSubdomain(true)} style={secondaryBtn}>Change</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'stretch', flex: '1 1 260px' }}>
                      <input
                        value={subdomainDraft}
                        onChange={(e) => { setSubdomainDraft(e.target.value); setSubdomainCheck(null); }}
                        placeholder="your-brand"
                        style={{ ...inputStyle, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      />
                      <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', border: '1px solid #d1d5db', borderLeft: 'none', borderRadius: '0 8px 8px 0', backgroundColor: '#f9fafb', fontSize: '0.84rem', color: '#374151', whiteSpace: 'nowrap' }}>
                        .{platformDomain}
                      </span>
                    </div>
                    <button onClick={handleCheckSubdomain} disabled={checkingSubdomain || !subdomainDraft.trim()} style={secondaryBtn}>
                      {checkingSubdomain ? 'Checking…' : 'Check availability'}
                    </button>
                    <button onClick={handleSaveSubdomain} disabled={savingSubdomain || !subdomainDraft.trim()} style={primaryBtn}>
                      {savingSubdomain ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => { setEditingSubdomain(false); setSubdomainDraft(platformSubdomain?.label || ''); setSubdomainCheck(null); }} style={secondaryBtn}>
                      Cancel
                    </button>
                  </div>
                  {subdomainCheck && (
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: subdomainCheck.available ? '#047857' : '#b91c1c' }}>
                      {subdomainCheck.available
                        ? `✓ '${subdomainCheck.subdomain}' is available.`
                        : `✕ ${subdomainCheck.reason || 'This subdomain is not available.'}`}
                    </span>
                  )}
                </div>
              )}
              <span style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '6px', display: 'block' }}>
                Auto-derived from your brand name. Availability is verified against all existing stores and reserved keywords before assignment.
              </span>
            </div>
          </div>

          {/* Custom Brand Domain */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Custom Brand Domain</h3>
              <p style={cardSubTitleStyle}>Connect your own registered domain to your storefront.</p>
            </div>

            {entitlement && (entitlement.entitled ? (
              <div style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #a7f3d0', backgroundColor: '#ecfdf5', fontSize: '0.82rem', color: '#065f46' }}>
                <strong>{planLabel(entitlement.plan)} plan</strong> includes custom brand domains — {entitlement.used} of {entitlement.limit} used ({entitlement.remaining} remaining).
              </div>
            ) : (
              <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 600 }}>🔒 Custom Brand Domain is a paid feature</span>
                <span style={{ fontSize: '0.8rem', color: '#b91c1c' }}>
                  Your {planLabel(entitlement.plan)} plan does not include a custom brand domain. Upgrade to the {planLabel(entitlement.minPlanWithCustomDomain)} plan to connect your own domain.
                </span>
                <button
                  onClick={() => setModalConfig({ type: 'plan_upgrade', errorMessage: `Your ${planLabel(entitlement.plan)} plan does not include custom brand domains. Upgrade to ${planLabel(entitlement.minPlanWithCustomDomain)} or higher.` })}
                  style={{ ...primaryBtn, alignSelf: 'flex-start' }}
                >
                  Upgrade Plan
                </button>
              </div>
            ))}

            {entitlement?.entitled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={labelStyle}>Connect a Custom Domain</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="e.g. shop.mybrand.com"
                    style={{ ...inputStyle, flex: '1 1 260px' }}
                    disabled={!entitlement.canAdd}
                  />
                  <button
                    onClick={handleAddDomain}
                    disabled={addPending || !entitlement.canAdd || !newDomain.trim()}
                    style={{ ...primaryBtn, opacity: (addPending || !entitlement.canAdd || !newDomain.trim()) ? 0.55 : 1 }}
                  >
                    {addPending ? 'Adding…' : 'Connect Domain'}
                  </button>
                </div>
                {!entitlement.canAdd && (
                  <span style={{ fontSize: '0.76rem', color: '#b45309' }}>Plan limit reached. Remove a domain or upgrade your plan to add more.</span>
                )}
              </div>
            )}

            {/* DNS instructions panel */}
            {dnsInstructions && (
              <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#0c4a6e' }}>DNS Setup for {dnsInstructions.domain}</strong>
                  <button onClick={() => setDnsInstructions(null)} style={secondaryBtn}>Dismiss</button>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#075985' }}>
                  Add the following records at your domain registrar, then click “Re-check DNS” after propagation (usually 5–60 minutes).
                </span>
                <DnsRecordRow label="CNAME" type="CNAME" host={dnsInstructions.cnameRecord.host} value={dnsInstructions.cnameRecord.value} />
                <DnsRecordRow label="A Record (apex)" type="A" host={dnsInstructions.aRecord.host} value={dnsInstructions.aRecord.value} />
                <DnsRecordRow label="Ownership TXT" type="TXT" host={dnsInstructions.txtRecord.host} value={dnsInstructions.txtRecord.value} />
              </div>
            )}

            {/* Connected domains list */}
            {customDomains.length === 0 ? (
              <div style={{ padding: '18px', borderRadius: '8px', border: '1px dashed #d1d5db', textAlign: 'center', color: '#9ca3af', fontSize: '0.82rem' }}>
                No custom domains connected yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {customDomains.map((d) => {
                  const dm = dnsStatusMeta(d.dnsStatus);
                  const sm = sslStatusMeta(d.sslStatus);
                  const isLegacy = typeof d.id === 'string' && d.id.endsWith('_legacy');
                  return (
                    <div key={d.id} style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{d.domain}</span>
                          {d.isPrimary && (
                            <span style={{ ...badgeBase, color: '#6d28d9', backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe' }}>Primary</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ ...badgeBase, color: dm.color, backgroundColor: dm.bg, border: `1px solid ${dm.border}` }}>{dm.label}</span>
                          <span style={{ ...badgeBase, color: sm.color, backgroundColor: sm.bg, border: `1px solid ${sm.border}` }}>SSL: {sm.label}</span>
                        </div>
                      </div>
                      {d.isBlocked ? (
                        <span style={{ fontSize: '0.76rem', color: '#b91c1c' }}>Blocked: {d.blockReason || 'Please contact support.'}</span>
                      ) : d.dnsFailureReason ? (
                        <span style={{ fontSize: '0.76rem', color: '#b45309' }}>{d.dnsFailureReason}</span>
                      ) : null}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => handleRecheck(d.domain)} disabled={rechecking === d.domain || isLegacy} title={isLegacy ? 'Legacy domain — re-add it to enable live DNS checks.' : undefined} style={{ ...secondaryBtn, opacity: isLegacy ? 0.55 : 1 }}>
                          {rechecking === d.domain ? 'Checking…' : 'Re-check DNS'}
                        </button>
                        <button onClick={() => setDnsInstructions(buildLocalDns(d))} style={secondaryBtn}>View DNS Records</button>
                        {!d.isPrimary && !isLegacy && <button onClick={() => handleSetPrimary(d.domain)} style={secondaryBtn}>Make Primary</button>}
                        <button onClick={() => handleRemove(d.domain)} style={{ ...secondaryBtn, color: '#b91c1c', borderColor: '#fecaca' }}>Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
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
      const authHeaders = getAuthHeaders();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings/payment/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
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
              <CustomSelectDropdown
                value={razorpayMode || 'test'}
                onChange={(val) => setRazorpayMode && setRazorpayMode(val)}
                options={[
                  { value: 'test', label: 'Test / Sandbox Mode' },
                  { value: 'live', label: 'Live / Production Mode' }
                ]}
                showSearch={false}
              />
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
              <CustomSelectDropdown
                value={stripeMode || 'test'}
                onChange={(val) => setStripeMode && setStripeMode(val)}
                options={[
                  { value: 'test', label: 'Test / Sandbox Mode' },
                  { value: 'live', label: 'Live / Production Mode' }
                ]}
                showSearch={false}
              />
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
              <CustomSelectDropdown
                value={paypalMode || 'sandbox'}
                onChange={(val) => setPaypalMode && setPaypalMode(val)}
                options={[
                  { value: 'sandbox', label: 'Sandbox / Testing Mode' },
                  { value: 'live', label: 'Live / Production Mode' }
                ]}
                showSearch={false}
              />
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
 * MAIN SETTINGS TAB WRAPPER COMPONENT
 * ========================================== */
interface SettingsTabProps {
  settingsSubTab: string;
  setSettingsSubTab: (tab: string) => void;
  handleSaveSettings: (e?: any) => void;
  [key: string]: any;
}

import { MarketsSubTab } from './MarketsSubTab';

export default function SettingsTab(props: SettingsTabProps) {
  const { settingsSubTab = "general", storeSubdomain, storeCustomDomain } = props;
  const [copied, setCopied] = useState(false);

  // Subnav Title Map
  const SUBTAB_TITLES: Record<string, string> = {
    general: "General",
    domain: "Domain & Subdomain",
    payments: "Payments & Checkout",
    shipping: "Shipping & Delivery",
    markets: "Global Markets",
    notifications: "Notifications & Email",
    policies: "Policies & Legal",
    integrations: "Social & Integrations"
  };

  const currentHeading = SUBTAB_TITLES[settingsSubTab] || "General";

  // Formulate exact domain link with localhost:3000 support
  const rawSubdomain = storeSubdomain || storeCustomDomain || "demo1";
  let displayDomain = rawSubdomain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (!displayDomain.includes('.') && !displayDomain.includes(':')) {
    displayDomain = `${displayDomain}.localhost:3000`;
  }

  const previewUrl = displayDomain.startsWith("http://") || displayDomain.startsWith("https://")
    ? displayDomain
    : `http://${displayDomain}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Section Header with Breadcrumb, Title & Storefront Preview Link */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#4b5563', fontWeight: 500 }}>
            <span>Settings</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#9ca3af" style={{ width: '14px', height: '14px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span style={{ color: '#111827', fontWeight: 600 }}>{currentHeading}</span>
          </div>

          {/* Preview Link & Copy Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: '#6b7280' }}>

            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#2563eb',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              <span>{displayDomain}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '14px', height: '14px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              title={copied ? "Copied!" : "Copy preview URL"}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: copied ? '#16a34a' : '#6b7280',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: '15px', height: '15px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v2.25A2.25 2.25 0 0 1 13.5 21.75h-9a2.25 2.25 0 0 1-2.25-2.25v-9A2.25 2.25 0 0 1 4.5 8.25H6.75m3-3.75h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9A2.25 2.25 0 0 1 9.75 4.5Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Page Main Heading (Sub-nav tab name like "General") */}
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
          {currentHeading}
        </h1>
      </div>

      <div>
        {settingsSubTab === "general" && <GeneralSubTab {...props} />}
        {settingsSubTab === "domain" && <DomainSubTab />}
        {settingsSubTab === "payments" && <PaymentsSubTab {...props} />}
        {settingsSubTab === "shipping" && <ShippingSubTab {...props} />}
        {settingsSubTab === "markets" && <MarketsSubTab storeCurrency={props.storeCurrency || 'INR'} />}
        {settingsSubTab === "notifications" && <NotificationsSubTab {...props} />}
        {settingsSubTab === "integrations" && <IntegrationsSubTab {...props} />}
        {settingsSubTab === "policies" && <PoliciesSubTab {...props} />}
      </div>
    </div>
  );
}
