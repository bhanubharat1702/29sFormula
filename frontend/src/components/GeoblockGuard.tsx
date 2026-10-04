'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useMarket } from '@/context/MarketContext';
import Navbar from '@/components/Navbar/Navbar';

const COUNTRY_NAMES: Record<string, string> = {
  IN: 'India',
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  AE: 'United Arab Emirates',
  SG: 'Singapore',
  JP: 'Japan',
  BR: 'Brazil',
  MX: 'Mexico',
  NL: 'Netherlands',
  ES: 'Spain',
  IT: 'Italy',
  SE: 'Sweden',
  CH: 'Switzerland',
  NZ: 'New Zealand',
  ZA: 'South Africa'
};

const getCountryName = (code: string) => {
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase();
};

export const GeoblockGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isAllowed, isLoading, detectedCountry, storeName } = useMarket();

  // Always bypass geoblocking for merchant admin & superadmin paths
  const isAdminPath = pathname?.startsWith('/admin') || pathname?.startsWith('/superadmin');

  if (isAdminPath) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '3px solid #e5e7eb',
            borderTopColor: '#111827',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>
            Verifying Regional Access...
          </p>
        </div>
      </div>
    );
  }

  // If traffic is allowed in shopper's country, render storefront normally
  if (isAllowed) {
    return <>{children}</>;
  }

  const detectedCountryName = getCountryName(detectedCountry);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Merchant Header / Navigation Bar */}
      <Navbar onCartClick={() => {}} />

      {/* Main Content Area (Clean White Background) */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '560px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Amazon-style Sad Dog Illustration */}
          <div style={{
            width: '180px',
            height: '180px',
            marginBottom: '20px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/images/sad_dog.jpg" 
              alt="Sorry, store not available" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Main Notification Title */}
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 12px 0',
            lineHeight: 1.3,
            letterSpacing: '-0.02em'
          }}>
            Store Currently Unavailable in {detectedCountryName}
          </h1>

          {/* Clean Description */}
          <p style={{
            fontSize: '1.02rem',
            color: '#4b5563',
            lineHeight: 1.6,
            margin: '0 0 16px 0',
            maxWidth: '480px'
          }}>
            We are sorry, <strong>{storeName}</strong> is currently not available for orders originating from <strong>{detectedCountryName}</strong> at this moment.
          </p>

          <p style={{
            fontSize: '0.88rem',
            color: '#9ca3af',
            lineHeight: 1.5,
            margin: 0
          }}>
            Please check back later as we expand our international shipping destinations.
          </p>
        </div>
      </main>
    </div>
  );
};


