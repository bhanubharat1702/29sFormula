/**
 * Production-Grade Scalable Bloom Filter Implementation
 * Used for high-speed fast-path rejection before database queries.
 */

// Simple FNV-1a 32-bit Hash Implementation
function fnv1a(str, seed = 0x811c9dc5) {
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

export class BloomFilter {
  /**
   * @param {number} expectedItems - Estimated number of items (n)
   * @param {number} falsePositiveRate - Desired probability of false positives (p), e.g. 0.01 (1%)
   */
  constructor(expectedItems = 10000, falsePositiveRate = 0.01) {
    this.n = Math.max(10, expectedItems);
    this.p = Math.max(0.0001, Math.min(0.1, falsePositiveRate));

    // m = - (n * ln(p)) / (ln(2))^2
    this.sizeBits = Math.ceil(-1 * (this.n * Math.log(this.p)) / Math.pow(Math.log(2), 2));
    
    // k = (m / n) * ln(2)
    this.numHashes = Math.max(1, Math.round((this.sizeBits / this.n) * Math.log(2)));

    // Allocate Uint8Array bit vector
    const numBytes = Math.ceil(this.sizeBits / 8);
    this.bitArray = new Uint8Array(numBytes);
    this.insertedCount = 0;
  }

  /**
   * Generates k hash bit positions using Kirsch-Mitzenmacher optimization (double hashing):
   * gi(x) = (h1(x) + i * h2(x)) % sizeBits
   */
  _getHashIndices(itemStr) {
    const str = String(itemStr || "").toLowerCase().trim();
    if (!str) return [];

    const h1 = fnv1a(str, 0x811c9dc5);
    const h2 = fnv1a(str, 0x050c5d1f) || 1; // Ensure h2 is non-zero

    const indices = new Array(this.numHashes);
    for (let i = 0; i < this.numHashes; i++) {
      const combined = (h1 + i * h2) >>> 0;
      indices[i] = combined % this.sizeBits;
    }
    return indices;
  }

  /**
   * Add an item to the Bloom Filter
   * @param {string} item 
   */
  add(item) {
    if (item === null || item === undefined) return;
    const itemStr = String(item).toLowerCase().trim();
    if (!itemStr) return;

    const indices = this._getHashIndices(itemStr);
    for (const bitIdx of indices) {
      const byteIdx = Math.floor(bitIdx / 8);
      const bitOffset = bitIdx % 8;
      this.bitArray[byteIdx] |= (1 << bitOffset);
    }
    this.insertedCount++;
  }

  /**
   * Check if an item might exist in the set.
   * @param {string} item 
   * @returns {boolean} false = DEFINITELY NOT IN SET, true = MAYBE IN SET
   */
  mightContain(item) {
    if (item === null || item === undefined) return false;
    const itemStr = String(item).toLowerCase().trim();
    if (!itemStr) return false;

    const indices = this._getHashIndices(itemStr);
    for (const bitIdx of indices) {
      const byteIdx = Math.floor(bitIdx / 8);
      const bitOffset = bitIdx % 8;
      if ((this.bitArray[byteIdx] & (1 << bitOffset)) === 0) {
        return false; // Fast path: definitely not present!
      }
    }
    return true; // Might be present (subject to p false positive rate)
  }

  /**
   * Reset filter bit array
   */
  clear() {
    this.bitArray.fill(0);
    this.insertedCount = 0;
  }

  /**
   * Returns current operational metrics of the filter
   */
  stats() {
    return {
      expectedItems: this.n,
      targetFalsePositiveRate: this.p,
      sizeBits: this.sizeBits,
      sizeBytes: this.bitArray.length,
      numHashes: this.numHashes,
      insertedCount: this.insertedCount,
      estimatedCurrentFpRate: Math.pow(1 - Math.exp(-this.numHashes * this.insertedCount / this.sizeBits), this.numHashes)
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Singleton Bloom Filter Instances for Core Platform Features
// ─────────────────────────────────────────────────────────────────────────────

// 1. Registered Subdomains (Stores)
export const subdomainBloomFilter = new BloomFilter(25000, 0.005);

// 2. Custom Domains (Stores)
export const customDomainBloomFilter = new BloomFilter(25000, 0.005);

// 3. Reserved Subdomains (Static + DB system keywords)
export const reservedSubdomainBloomFilter = new BloomFilter(2000, 0.001);

// 4. Active Discount / Coupon Codes
export const discountCodeBloomFilter = new BloomFilter(10000, 0.005);


/**
 * Hydrates all Bloom Filters from MongoDB database collections.
 * Should be called on application startup or when cache re-sync is needed.
 */
export const initBloomFilters = async () => {
  try {
    // Dynamic import models to avoid circular dependency issues
    const { default: Store } = await import("../models/Store.js");
    const { ReservedSubdomain, RESERVED_SUBDOMAINS } = await import("../models/Domain.js");
    const { default: Discount } = await import("../models/Discount.js");

    // Clear existing states
    subdomainBloomFilter.clear();
    customDomainBloomFilter.clear();
    reservedSubdomainBloomFilter.clear();
    discountCodeBloomFilter.clear();

    // 1. Populate Reserved Subdomains (Static array + DB)
    if (Array.isArray(RESERVED_SUBDOMAINS)) {
      RESERVED_SUBDOMAINS.forEach(sub => reservedSubdomainBloomFilter.add(sub));
    }
    const dbReserved = await ReservedSubdomain.find({}, "subdomain").lean().catch(() => []);
    dbReserved.forEach(r => {
      if (r.subdomain) reservedSubdomainBloomFilter.add(r.subdomain);
    });

    // 2. Populate Registered Subdomains and Custom Domains from Stores
    const stores = await Store.find({}, "subdomain customDomain domains").lean().catch(() => []);
    stores.forEach(store => {
      if (store.subdomain) {
        subdomainBloomFilter.add(store.subdomain);
      }
      if (store.customDomain) {
        customDomainBloomFilter.add(store.customDomain);
      }
      if (Array.isArray(store.domains)) {
        store.domains.forEach(d => {
          if (d.domain) customDomainBloomFilter.add(d.domain);
        });
      }
    });

    // 3. Populate Active Discount / Coupon Codes
    const discounts = await Discount.find({ active: true }, "code").lean().catch(() => []);
    discounts.forEach(d => {
      if (d.code) discountCodeBloomFilter.add(d.code);
    });

    console.log("⚡ [BloomFilters] Successfully initialized bloom filters:", {
      subdomainsCount: subdomainBloomFilter.insertedCount,
      customDomainsCount: customDomainBloomFilter.insertedCount,
      reservedCount: reservedSubdomainBloomFilter.insertedCount,
      discountsCount: discountCodeBloomFilter.insertedCount,
    });
  } catch (err) {
    console.error("⚠️ [BloomFilters] Error initializing bloom filters:", err);
  }
};
