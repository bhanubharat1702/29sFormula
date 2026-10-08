'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getAuthHeaders } from '../../../hooks/useDashboardData';
import { COUNTRIES } from '../../../constants/storeOptions';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

export interface MarketItem {
  _id: string;
  storeId: string;
  countryCode: string;
  currencyCode: string;
  exchangeRate: number;
  shippingRate: number;
  freeShippingThreshold: number | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const COUNTRY_OPTIONS = COUNTRIES.map(c => ({
  code: c.code,
  name: c.name,
  currency: c.currencyCode
}));

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
  boxSizing: "border-box"
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
  boxSizing: "border-box"
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

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "6px"
};

export function MarketsSubTab({ storeCurrency = 'INR' }: { storeCurrency?: string }) {
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<string>(storeCurrency);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal / Form state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingMarketId, setEditingMarketId] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string>('US');
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [exchangeRate, setExchangeRate] = useState<string>('1.0');
  const [shippingRate, setShippingRate] = useState<string>('0');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Live Calculator Preview State
  const [sampleBasePrice, setSampleBasePrice] = useState<string>('10.00');

  const fetchMarkets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resMarkets, resSettings] = await Promise.all([
        fetch(`${API_BASE}/api/markets`, { headers: getAuthHeaders(), cache: 'no-store' }),
        fetch(`${API_BASE}/api/settings`, { headers: getAuthHeaders(), cache: 'no-store' })
      ]);

      const dataMarkets = await resMarkets.json();
      if (!resMarkets.ok) {
        throw new Error(dataMarkets.error || 'Failed to fetch market configurations.');
      }
      setMarkets(Array.isArray(dataMarkets.markets) ? dataMarkets.markets : []);

      if (resSettings.ok) {
        const dataSettings = await resSettings.json();
        const activeCurr = dataSettings.storeDetails?.currency || dataSettings.currency || storeCurrency;
        if (activeCurr) setBaseCurrency(activeCurr);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load markets.');
    } finally {
      setLoading(false);
    }
  }, [storeCurrency]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
    const found = COUNTRY_OPTIONS.find(c => c.code === code);
    if (found) {
      setCurrencyCode(found.currency);
    }
  };

  const openAddModal = () => {
    const existingCountryCodes = new Set(markets.map(m => m.countryCode.toUpperCase()));
    const available = COUNTRY_OPTIONS.filter(c => !existingCountryCodes.has(c.code));

    if (available.length === 0) {
      setNotice({ type: 'error', text: 'All supported target countries have already been configured.' });
      return;
    }

    const initialCountry = available[0];
    setEditingMarketId(null);
    setCountryCode(initialCountry.code);
    setCurrencyCode(initialCountry.currency);
    setExchangeRate('1.0');
    setShippingRate('0');
    setFreeShippingThreshold('');
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (m: MarketItem) => {
    setEditingMarketId(m._id);
    setCountryCode(m.countryCode);
    setCurrencyCode(m.currencyCode);
    setExchangeRate(String(m.exchangeRate));
    setShippingRate(String(m.shippingRate));
    setFreeShippingThreshold(m.freeShippingThreshold !== null ? String(m.freeShippingThreshold) : '');
    setIsActive(m.isActive);
    setShowModal(true);
  };

  const handleSaveMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotice(null);

    const rateNum = Number(exchangeRate);
    if (isNaN(rateNum) || rateNum <= 0) {
      setNotice({ type: 'error', text: 'Exchange rate must be a positive number.' });
      setIsSaving(false);
      return;
    }

    const payload = {
      countryCode,
      currencyCode,
      exchangeRate: rateNum,
      shippingRate: Number(shippingRate) || 0,
      freeShippingThreshold: freeShippingThreshold !== '' ? Number(freeShippingThreshold) : null,
      isActive
    };

    try {
      const url = editingMarketId ? `${API_BASE}/api/markets/${editingMarketId}` : `${API_BASE}/api/markets`;
      const method = editingMarketId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save market configuration.');
      }

      setNotice({ type: 'success', text: editingMarketId ? 'Market updated successfully.' : 'New market added successfully.' });
      setShowModal(false);
      fetchMarkets();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to save market.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMarket = async (id: string, country: string) => {
    if (!window.confirm(`Are you sure you want to remove market configuration for ${country}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/markets/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete market.');
      }
      setNotice({ type: 'success', text: `Market for ${country} removed.` });
      fetchMarkets();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to delete market.' });
    }
  };

  const handleToggleActive = async (m: MarketItem) => {
    try {
      const res = await fetch(`${API_BASE}/api/markets/${m._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ isActive: !m.isActive })
      });
      if (res.ok) {
        fetchMarkets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Preview Math
  const parsedSamplePrice = Number(sampleBasePrice) || 0;
  const parsedRate = Number(exchangeRate) || 1;
  const convertedSamplePrice = (parsedSamplePrice * parsedRate).toFixed(2);
  const parsedShipping = Number(shippingRate) || 0;
  const parsedFreeThreshold = freeShippingThreshold !== '' ? Number(freeShippingThreshold) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0c0a09', margin: 0 }}>
              Global Markets & Internationalization
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#6b7280', margin: '4px 0 0 0' }}>
              Set localized shipping rates, regional exchange rates, and manage active shipping destinations per market.
            </p>
          </div>
          <button
            onClick={openAddModal}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              backgroundColor: '#0c0a09',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            + Add Target Market
          </button>
        </div>
      </div>

      {/* Notice Message */}
      {notice && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            backgroundColor: notice.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: notice.type === 'success' ? '#047857' : '#dc2626',
            border: `1px solid ${notice.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
        </div>
      )}

      {/* Main Markets List */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            Active Target Markets ({markets.length})
          </h4>
          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            Base Currency: <strong style={{ color: '#0c0a09' }}>{baseCurrency}</strong>
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: '#6b7280', fontSize: '0.88rem' }}>
            Loading market configurations...
          </div>
        ) : error ? (
          <div style={{ padding: '20px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '0.85rem' }}>
            {error}
          </div>
        ) : markets.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#374151', fontSize: '0.92rem' }}>No Target Markets Configured</p>
            <p style={{ margin: '6px 0 16px 0', color: '#6b7280', fontSize: '0.82rem' }}>
              Your store currently accepts open traffic in base currency ({baseCurrency}). Click below to restrict or localize pricing for specific countries.
            </p>
            <button
              onClick={openAddModal}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#0c0a09',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              + Add First Market
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {markets.map((m) => {
              const countryInfo = COUNTRY_OPTIONS.find(c => c.code === m.countryCode);
              return (
                <div
                  key={m._id}
                  style={{
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: m.isActive ? '#ffffff' : '#f9fafb',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    opacity: m.isActive ? 1 : 0.7
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#0f172a'
                      }}>
                        {m.countryCode}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0c0a09' }}>
                          {countryInfo?.name || m.countryCode}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                          Currency: <strong style={{ color: '#0c0a09' }}>{m.currencyCode}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleActive(m)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: m.isActive ? '#ecfdf5' : '#f3f4f6',
                        color: m.isActive ? '#047857' : '#6b7280'
                      }}
                    >
                      {m.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>Exchange Rate</span>
                      <strong style={{ color: '#0f172a' }}>1 {baseCurrency} = {m.exchangeRate} {m.currencyCode}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>Shipping Fee</span>
                      <strong style={{ color: '#0f172a' }}>{m.shippingRate} {m.currencyCode}</strong>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: '#64748b', display: 'block' }}>Free Shipping Threshold</span>
                      <strong style={{ color: '#0f172a' }}>
                        {m.freeShippingThreshold !== null ? `${m.freeShippingThreshold} ${m.currencyCode}` : 'None'}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
                    <button
                      onClick={() => openEditModal(m)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#374151',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMarket(m._id, countryInfo?.name || m.countryCode)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #fecaca',
                        backgroundColor: '#fef2f2',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#dc2626',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Market Creation / Editing Modal with Live Calculator Preview */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '12px', maxWidth: '560px', width: '100%',
            padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', gap: '16px',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0c0a09' }}>
                {editingMarketId ? 'Edit Target Market' : 'Add New Target Market'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>

            <form onSubmit={handleSaveMarket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Target Country</label>
                <select
                  value={countryCode}
                  onChange={(e) => handleCountrySelect(e.target.value)}
                  disabled={Boolean(editingMarketId)}
                  style={selectStyle}
                >
                  {COUNTRY_OPTIONS
                    .filter(c => {
                      if (editingMarketId) {
                        return c.code === countryCode || !markets.some(m => m.countryCode === c.code);
                      }
                      return !markets.some(m => m.countryCode === c.code);
                    })
                    .map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code}) - Default: {c.currency}
                      </option>
                    ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Market Currency Code</label>
                  <input
                    type="text"
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Exchange Rate (1 {baseCurrency} = ?)</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Flat Shipping Fee ({currencyCode})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={shippingRate}
                    onChange={(e) => setShippingRate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Free Shipping Threshold ({currencyCode})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Leave empty for none"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isActiveToggle" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  Enable this market immediately
                </label>
              </div>

              {/* Task 3.3: Live Visual Preview Calculator Card */}
              <div style={{
                backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', marginTop: '4px'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  ⚡ Live Shopper Pricing Preview
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Sample Product Price ({baseCurrency}):</span>
                  <input
                    type="number"
                    value={sampleBasePrice}
                    onChange={(e) => setSampleBasePrice(e.target.value)}
                    style={{ width: '90px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div style={{ fontSize: '0.85rem', color: '#0f172a', backgroundColor: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  💡 A <strong>{sampleBasePrice} {baseCurrency}</strong> product will appear as <strong>{convertedSamplePrice} {currencyCode}</strong> to customers in {COUNTRY_OPTIONS.find(c => c.code === countryCode)?.name || countryCode}.
                  <br />
                  <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Shipping: {shippingRate || '0'} {currencyCode} {parsedFreeThreshold ? `(Free on orders over ${parsedFreeThreshold} ${currencyCode})` : ''}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#ffffff',
                    fontSize: '0.85rem', fontWeight: 600, color: '#374151', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '8px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#0c0a09',
                    fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', cursor: 'pointer'
                  }}
                >
                  {isSaving ? 'Saving...' : editingMarketId ? 'Update Market' : 'Save Market'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
