/**
 * Currency Symbol mapping for popular ISO currency codes
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'AU$',
  AED: 'AED ',
  SGD: 'SG$',
  JPY: '¥',
  BRL: 'R$',
  MXN: 'MX$',
  SEK: 'kr ',
  CHF: 'CHF ',
  NZD: 'NZ$',
  ZAR: 'R '
};

export interface MarketContextState {
  currentMarket?: {
    currencyCode?: string;
    exchangeRate?: number;
    countryCode?: string;
  } | null;
  baseCurrency?: string;
}

/**
 * Resolves final price and formats it with appropriate currency symbol.
 * Respects Product Hybrid PriceBook overrides if present.
 */
export function formatPrice(
  basePrice: number,
  marketContext?: MarketContextState | null,
  product?: any
): { formatted: string; amount: number; currency: string; symbol: string } {
  const numPrice = Number(basePrice) || 0;
  const targetCurrency = (marketContext?.currentMarket?.currencyCode || marketContext?.baseCurrency || 'INR').toUpperCase();
  const exchangeRate = Number(marketContext?.currentMarket?.exchangeRate) || 1;

  let finalAmount = numPrice * exchangeRate;
  let hasPriceBookOverride = false;

  // Check product-level or variant-level PriceBook overrides (Hybrid Pricing Engine)
  if (product && Array.isArray(product.priceBook)) {
    const override = product.priceBook.find((pb: any) => pb.currency?.toUpperCase() === targetCurrency);
    if (override && override.price !== undefined && override.price !== null) {
      finalAmount = Number(override.price) || 0;
      hasPriceBookOverride = true;
    }
  }

  // Format amount cleanly using Intl.NumberFormat
  let formattedAmount = '';
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: targetCurrency,
      maximumFractionDigits: targetCurrency === 'JPY' ? 0 : 2,
      minimumFractionDigits: targetCurrency === 'JPY' ? 0 : 2
    });
    formattedAmount = formatter.format(finalAmount);
  } catch (err) {
    const symbol = CURRENCY_SYMBOLS[targetCurrency] || `${targetCurrency} `;
    formattedAmount = `${symbol}${finalAmount.toFixed(2)}`;
  }

  const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;

  return {
    formatted: formattedAmount,
    amount: Math.round(finalAmount * 100) / 100,
    currency: targetCurrency,
    symbol
  };
}
