'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface StoreMarketConfig {
  _id?: string;
  countryCode: string;
  currencyCode: string;
  exchangeRate: number;
  shippingRate: number;
  freeShippingThreshold: number | null;
  isActive: boolean;
}

export interface MarketContextType {
  storeName: string;
  baseCurrency: string;
  baseCountry: string;
  detectedCountry: string;
  isAllowed: boolean;
  currentMarket: StoreMarketConfig | null;
  activeMarkets: StoreMarketConfig[];
  isLoading: boolean;
  countryOverride: string | null;
  setCountryOverride: (countryCode: string | null) => void;
  refetchMarketConfig: () => Promise<void>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeName, setStoreName] = useState<string>('Our Store');
  const [baseCurrency, setBaseCurrency] = useState<string>('INR');
  const [baseCountry, setBaseCountry] = useState<string>('IN');
  const [detectedCountry, setDetectedCountry] = useState<string>('IN');
  const [isAllowed, setIsAllowed] = useState<boolean>(true);
  const [currentMarket, setCurrentMarket] = useState<StoreMarketConfig | null>(null);
  const [activeMarkets, setActiveMarkets] = useState<StoreMarketConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [countryOverride, setCountryOverrideState] = useState<string | null>(null);

  const fetchMarketConfig = useCallback(async (overrideCode?: string | null) => {
    setIsLoading(true);
    try {
      let url = `${API_BASE}/api/storefront/markets`;
      const codeToUse = overrideCode !== undefined ? overrideCode : countryOverride;
      if (codeToUse) {
        url += `?country=${encodeURIComponent(codeToUse)}`;
      }

      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStoreName(data.storeName || 'Our Store');
          setBaseCurrency(data.baseCurrency || 'INR');
          setBaseCountry(data.baseCountry || 'IN');
          setDetectedCountry(data.detectedCountry || 'IN');
          setIsAllowed(Boolean(data.isAllowed));
          setCurrentMarket(data.currentMarket || null);
          setActiveMarkets(Array.isArray(data.activeMarkets) ? data.activeMarkets : []);
        }
      }
    } catch (err) {
      console.error('Failed to resolve market configuration:', err);
    } finally {
      setIsLoading(false);
    }
  }, [countryOverride]);

  useEffect(() => {
    // Check URL query string first (e.g. ?country=JP), then localStorage
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCountry = urlParams.get('country');
      if (urlCountry && urlCountry.trim().length === 2) {
        const cleanCode = urlCountry.trim().toUpperCase();
        setCountryOverrideState(cleanCode);
        fetchMarketConfig(cleanCode);
        return;
      }

      const savedOverride = localStorage.getItem('user_market_country');
      if (savedOverride) {
        setCountryOverrideState(savedOverride);
        fetchMarketConfig(savedOverride);
        return;
      }
    }
    fetchMarketConfig();
  }, [fetchMarketConfig]);

  const setCountryOverride = (countryCode: string | null) => {
    setCountryOverrideState(countryCode);
    if (typeof window !== 'undefined') {
      if (countryCode) {
        localStorage.setItem('user_market_country', countryCode);
      } else {
        localStorage.removeItem('user_market_country');
      }
    }
    fetchMarketConfig(countryCode);
  };

  return (
    <MarketContext.Provider
      value={{
        storeName,
        baseCurrency,
        baseCountry,
        detectedCountry,
        isAllowed,
        currentMarket,
        activeMarkets,
        isLoading,
        countryOverride,
        setCountryOverride,
        refetchMarketConfig: fetchMarketConfig
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = (): MarketContextType => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
