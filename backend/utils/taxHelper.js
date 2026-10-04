import TaxZone from "../models/TaxZone.js";
import Settings from "../models/Settings.js";

/**
 * Resolves the matching TaxZone for a given store and shipping address.
 * Priority rules:
 * 1. Matches storeId + active=true + country (or "*")
 * 2. Highest priority number first
 * 3. Specific state match before wildcard "*"
 * 4. Postal code match (if specified in zone)
 * 5. Fallback to Store Settings default taxRate if no TaxZone matches.
 */
export async function resolveTaxZone({ storeId, country, state, postalCode }) {
  if (!storeId) {
    return { taxRate: 0, taxName: "Tax", isInclusive: false, zoneName: "Default Zero" };
  }

  const cleanCountry = country ? country.toString().toUpperCase().trim() : "*";
  const cleanState = state ? state.toString().toUpperCase().trim() : "*";
  const cleanPostal = postalCode ? postalCode.toString().trim() : "";

  // Query active zones for this store matching country or wildcard "*"
  const zones = await TaxZone.find({
    storeId,
    active: true,
    country: { $in: [cleanCountry, "*"] }
  })
    .sort({ priority: -1, createdAt: -1 })
    .lean();

  if (zones && zones.length > 0) {
    // 1. Try exact postal code match or wildcard match
    if (cleanPostal) {
      for (const zone of zones) {
        if (zone.postalCodes && zone.postalCodes.length > 0) {
          const matchPostal = zone.postalCodes.some(p => {
            const pattern = p.trim();
            if (pattern.endsWith("*")) {
              return cleanPostal.startsWith(pattern.slice(0, -1));
            }
            return cleanPostal === pattern;
          });
          if (matchPostal) {
            return {
              taxRate: zone.taxRate || 0,
              taxName: zone.taxName || "Tax",
              isInclusive: Boolean(zone.isInclusive),
              zoneName: zone.name,
              taxZoneId: zone._id
            };
          }
        }
      }
    }

    // 2. Try state/region match
    for (const zone of zones) {
      const regions = zone.regions || [];
      const hasWildcardRegion = regions.includes("*") || regions.length === 0;
      const matchesState = cleanState !== "*" && regions.some(r => r.toUpperCase().trim() === cleanState);

      if (matchesState || (hasWildcardRegion && (zone.country === cleanCountry || zone.country === "*"))) {
        return {
          taxRate: zone.taxRate || 0,
          taxName: zone.taxName || "Tax",
          isInclusive: Boolean(zone.isInclusive),
          zoneName: zone.name,
          taxZoneId: zone._id
        };
      }
    }
  }

  // 3. Fallback to Store Settings global tax default if configured
  try {
    const settings = await Settings.findOne({ storeId }).lean();
    if (settings && (settings.taxRate > 0 || settings.taxInclusive)) {
      return {
        taxRate: settings.taxRate || 0,
        taxName: "Sales Tax",
        isInclusive: Boolean(settings.taxInclusive),
        zoneName: "Store Default Settings",
        taxZoneId: null
      };
    }
  } catch (err) {
    console.error("Error reading store settings for fallback tax:", err);
  }

  // 4. Default zero tax
  return {
    taxRate: 0,
    taxName: "Tax",
    isInclusive: false,
    zoneName: "Default Zero",
    taxZoneId: null
  };
}

/**
 * Calculates tax for a line item or order amount.
 * Handles both Tax Inclusive (VAT/GST) and Tax Exclusive (US Sales Tax).
 */
export function calculateTaxAmount(amount, taxRate, isInclusive) {
  const numAmount = Math.max(0, Number(amount) || 0);
  const numRate = Math.max(0, Number(taxRate) || 0);

  if (numRate === 0 || numAmount === 0) {
    return { taxAmount: 0, amountExclTax: numAmount, amountInclTax: numAmount };
  }

  if (isInclusive) {
    // Price includes tax: Tax = Amount - (Amount / (1 + Rate / 100))
    const taxAmount = Math.round((numAmount - numAmount / (1 + numRate / 100)) * 100) / 100;
    const amountExclTax = Math.round((numAmount - taxAmount) * 100) / 100;
    return {
      taxAmount,
      amountExclTax,
      amountInclTax: numAmount
    };
  } else {
    // Price excludes tax: Tax = Amount * (Rate / 100)
    const taxAmount = Math.round(((numAmount * numRate) / 100) * 100) / 100;
    const amountInclTax = Math.round((numAmount + taxAmount) * 100) / 100;
    return {
      taxAmount,
      amountExclTax: numAmount,
      amountInclTax
    };
  }
}
