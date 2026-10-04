'use client';

import React from 'react';

interface MerchantSuspendedDashboardProps {
  storeName?: string;
  storeSubdomain?: string;
  suspensionReason?: string;
  suspendedAt?: string | null;
  supportEmail?: string;
  onLogout: () => void;
}

export default function MerchantSuspendedDashboard({
  storeName = "Your Merchant Store",
  storeSubdomain = "",
  suspensionReason = "Account suspended by platform administrator.",
  suspendedAt,
  supportEmail = "support@29sformula.com",
  onLogout
}: MerchantSuspendedDashboardProps) {
  const formattedDate = suspendedAt
    ? new Date(suspendedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : null;

  const mailToUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(
    `Store Suspension Appeal - ${storeName} (${storeSubdomain || "ID"})`
  )}&body=${encodeURIComponent(
    `Hello Platform Admin,\n\nOur store "${storeName}" (${storeSubdomain}) is currently suspended.\nReason: ${suspensionReason}\n\nWe would like to request account reactivation. Please let us know the necessary steps.\n\nThank you.`
  )}`;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '620px',
        width: '100%',
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        padding: '40px',
        textAlign: 'center'
      }}>
        {/* Status Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '24px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            display: 'inline-block'
          }}></span>
          Account Suspended
        </div>

        {/* Title & Subtitle */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#ffffff',
          marginBottom: '10px',
          letterSpacing: '-0.02em'
        }}>
          {storeName} is On Hold
        </h1>
        {storeSubdomain && (
          <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
            Domain Host: <code style={{ color: '#60a5fa', backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: '4px' }}>{storeSubdomain}</code>
          </p>
        )}

        {/* Notice Card */}
        <div style={{
          backgroundColor: '#1f2937',
          borderLeft: '4px solid #ef4444',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '28px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>
            Reason for Suspension
          </div>
          <div style={{ fontSize: '15px', color: '#f3f4f6', lineHeight: '1.6', fontWeight: 500 }}>
            "{suspensionReason}"
          </div>
          {formattedDate && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
              Effective Date: {formattedDate}
            </div>
          )}
        </div>

        <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '32px' }}>
          Your storefront and admin capabilities are temporarily locked. Your domain and catalog data remain securely reserved under your account. Please contact platform support to resolve this hold.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={mailToUrl}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.2s ease'
            }}
          >
            ✉️ Contact Super Admin
          </a>
          <button
            onClick={onLogout}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#374151',
              color: '#f3f4f6',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
