'use client';

import React from 'react';

interface PublicSuspendedStorefrontProps {
  storeName?: string;
  supportEmail?: string;
}

export default function PublicSuspendedStorefront({
  storeName = "Online Store",
  supportEmail = "support@29sformula.com"
}: PublicSuspendedStorefrontProps) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        padding: '40px',
        textAlign: 'center'
      }}>
        {/* Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#ef4444',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          marginBottom: '20px'
        }}>
          🔒
        </div>

        {/* Header */}
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: '12px',
          letterSpacing: '-0.02em'
        }}>
          Store Currently Unavailable
        </h1>

        <p style={{
          fontSize: '15px',
          color: '#64748b',
          lineHeight: '1.6',
          marginBottom: '28px'
        }}>
          The online store <strong>{storeName}</strong> is temporarily offline. If you are the store merchant, please log in to your account dashboard or reach out to platform administrators.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/login"
            style={{
              padding: '11px 22px',
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            🔑 Merchant Login
          </a>
          <a
            href={`mailto:${supportEmail}?subject=${encodeURIComponent(`Store Support Inquiry - ${storeName}`)}`}
            style={{
              padding: '11px 22px',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              color: '#334155',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ✉️ Contact Support
          </a>
        </div>
      </div>

      <div style={{ marginTop: '32px', fontSize: '13px', color: '#94a3b8' }}>
        Powered by 29sFormula Commerce Platform
      </div>
    </div>
  );
}
