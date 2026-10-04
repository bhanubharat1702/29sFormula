'use client';

import React from 'react';
import { useMarket } from '@/context/MarketContext';
import { formatPrice } from '@/utils/priceFormatter';

export interface PriceDisplayProps {
  price: number;
  strikePrice?: number;
  product?: any;
  className?: string;
  strikeClassName?: string;
  showDiscountPercent?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  strikePrice,
  product,
  className = 'font-semibold text-white',
  strikeClassName = 'text-white/40 line-through text-xs ml-2',
  showDiscountPercent = false
}) => {
  const marketContext = useMarket();

  const currentFormatted = formatPrice(price, marketContext, product);
  const strikeFormatted = strikePrice && strikePrice > price ? formatPrice(strikePrice, marketContext, product) : null;

  const discountPercent = strikePrice && strikePrice > price
    ? Math.round(((strikePrice - price) / strikePrice) * 100)
    : 0;

  return (
    <span className="inline-flex items-center gap-1.5 font-sans">
      <span className={className}>{currentFormatted.formatted}</span>
      {strikeFormatted && (
        <span className={strikeClassName}>{strikeFormatted.formatted}</span>
      )}
      {showDiscountPercent && discountPercent > 0 && (
        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
          {discountPercent}% OFF
        </span>
      )}
    </span>
  );
};
