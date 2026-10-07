'use client';

import React, { useState, useEffect } from 'react';

interface StorefrontConnectionErrorProps {
  errorMessage?: string;
  onRetry?: () => void;
  isLoading?: boolean;
  storeName?: string;
  isFullPage?: boolean;
}

export default function StorefrontConnectionError({
  errorMessage = "Unable to reach live server",
  onRetry,
  isLoading = false,
  isFullPage = true
}: StorefrontConnectionErrorProps) {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const handleManualRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div
      style={{
        minHeight: isFullPage ? '100vh' : 'auto',
        backgroundColor: '#ffffff',
        color: '#111827',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isFullPage ? '60px 24px' : '40px 20px',
        textAlign: 'center',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Amazon-style Sad Dog Illustration */}
        <div
          style={{
            width: '190px',
            height: '190px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src="/images/sad_dog.jpg"
            alt="No connection"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '12px'
            }}
          />
        </div>

        {/* Clean, Simple Title */}
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#111827',
            margin: '0 0 10px 0',
            lineHeight: 1.3
          }}
        >
          {!isOnline ? 'Please connect to the internet' : 'Connection failed'}
        </h1>

        {/* Simple & clear 1-liner explanation */}
        <p
          style={{
            fontSize: '0.95rem',
            color: '#4b5563',
            lineHeight: 1.5,
            margin: '0 0 24px 0'
          }}
        >
          {!isOnline
            ? 'Your device appears to be offline. Please check your network connection and try again.'
            : 'We couldn’t reach the server. Please check your internet connection or try again in a moment.'}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={handleManualRetry}
            disabled={isLoading}
            style={{
              padding: '11px 26px',
              backgroundColor: '#111827',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.2s ease',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Retrying...' : 'Try Again'}
          </button>

          <a
            href="/"
            style={{
              padding: '11px 22px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            Home Page
          </a>
        </div>
      </div>
    </div>
  );
}
