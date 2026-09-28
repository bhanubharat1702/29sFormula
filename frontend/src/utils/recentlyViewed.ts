/**
 * Utility for tracking and persisting Recently Viewed Products in localStorage.
 */

export interface RecentlyViewedProduct {
  _id: string;
  name: string;
  price: number;
  strikePrice?: number;
  imageFront?: string;
  images?: string[];
  imageBack?: string;
  category?: string | string[];
  variants?: any[];
  quantity?: number;
  [key: string]: any;
}

const DEFAULT_STORAGE_KEY = "recently_viewed_products";
const MAX_ITEMS = 8;

function getStorageKey(storeId?: string): string {
  if (storeId && typeof storeId === "string" && storeId.trim()) {
    return `recently_viewed_products_${storeId.trim()}`;
  }
  return DEFAULT_STORAGE_KEY;
}

export function saveRecentlyViewed(product: RecentlyViewedProduct, storeId?: string): void {
  if (typeof window === "undefined" || !product || !product._id) return;

  try {
    const key = getStorageKey(storeId);
    const raw = localStorage.getItem(key);
    let items: RecentlyViewedProduct[] = [];

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          items = parsed;
        }
      } catch (e) {
        items = [];
      }
    }

    // Filter out existing occurrence of this product ID to prevent duplicates
    items = items.filter((item) => item && item._id && String(item._id) !== String(product._id));

    // Construct lightweight payload to avoid blowing localStorage quota
    const sanitizedProduct: RecentlyViewedProduct = {
      _id: String(product._id),
      name: product.name || "Product",
      price: Number(product.price) || 0,
      strikePrice: product.strikePrice ? Number(product.strikePrice) : undefined,
      imageFront: product.imageFront || (product.images && product.images[0]) || "",
      images: Array.isArray(product.images) ? product.images : [],
      imageBack: product.imageBack || "",
      category: product.category || [],
      variants: Array.isArray(product.variants) ? product.variants : [],
      quantity: product.quantity !== undefined ? Number(product.quantity) : 10,
    };

    // Prepend to top of list (most recent first)
    items.unshift(sanitizedProduct);

    // Limit to MAX_ITEMS
    if (items.length > MAX_ITEMS) {
      items = items.slice(0, MAX_ITEMS);
    }

    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new Event("recentlyViewedUpdated"));
  } catch (err) {
    console.warn("Failed to save recently viewed product:", err);
  }
}

export function getRecentlyViewed(storeId?: string): RecentlyViewedProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const key = getStorageKey(storeId);
    const raw = localStorage.getItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item && typeof item === "object" && item._id && item.name);
  } catch (err) {
    console.warn("Failed to retrieve recently viewed products:", err);
    return [];
  }
}

export function clearRecentlyViewed(storeId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = getStorageKey(storeId);
    localStorage.removeItem(key);
    window.dispatchEvent(new Event("recentlyViewedUpdated"));
  } catch (err) {
    console.warn("Failed to clear recently viewed products:", err);
  }
}
