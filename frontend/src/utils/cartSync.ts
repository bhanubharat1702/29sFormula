'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

export const getStoredCart = (): any[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const saveCart = (cartItems: any[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));

    // If user is logged in, sync cart with MongoDB backend
    const session = localStorage.getItem('userSession');
    if (session) {
      const user = JSON.parse(session);
      if (user && user.email) {
        fetch(`${API_BASE}/api/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, cart: cartItems })
        }).catch(err => console.error('Failed to sync cart with backend:', err));
      }
    }
  } catch (e) {
    console.error('Error saving cart:', e);
  }
};

export const fetchAndSyncUserCart = async (): Promise<any[]> => {
  if (typeof window === 'undefined') return [];
  try {
    const session = localStorage.getItem('userSession');
    if (!session) return getStoredCart();

    const user = JSON.parse(session);
    if (!user || !user.email) return getStoredCart();

    const res = await fetch(`${API_BASE}/api/cart?email=${encodeURIComponent(user.email)}`, { cache: 'no-store' });
    if (!res.ok) return getStoredCart();

    const data = await res.json();
    const serverCart = Array.isArray(data.cart) ? data.cart : [];
    const localCart = getStoredCart();

    // If server has cart items or local has cart items, merge them
    if (serverCart.length === 0 && localCart.length > 0) {
      // User added items before logging in — push local items to server
      saveCart(localCart);
      return localCart;
    }

    if (serverCart.length > 0) {
      // Merge local items with server items (prevent duplicates by _id and size)
      const mergedMap = new Map();
      
      serverCart.forEach((item: any) => {
        const key = `${item._id || item.productId}_${item.size || 'default'}`;
        mergedMap.set(key, item);
      });

      localCart.forEach((item: any) => {
        const key = `${item._id || item.productId}_${item.size || 'default'}`;
        if (mergedMap.has(key)) {
          // Keep max quantity if present in both
          const existing = mergedMap.get(key);
          mergedMap.set(key, { ...existing, quantity: Math.max(existing.quantity || 1, item.quantity || 1) });
        } else {
          mergedMap.set(key, item);
        }
      });

      const mergedCart = Array.from(mergedMap.values());
      localStorage.setItem('cart', JSON.stringify(mergedCart));
      window.dispatchEvent(new Event('cartUpdated'));

      // Also ensure backend has the full merged cart
      fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cart: mergedCart })
      }).catch(err => console.error('Failed to sync merged cart:', err));

      return mergedCart;
    }

    return localCart;
  } catch (e) {
    console.error('Failed to fetch user cart:', e);
    return getStoredCart();
  }
};

export const clearCart = () => {
  saveCart([]);
  removeAppliedCoupon();
};

export const getAppliedCoupon = (): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('appliedCoupon');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

export const setAppliedCoupon = (coupon: { code: string; type: string; value: number }) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    window.dispatchEvent(new Event('couponUpdated'));
  } catch (e) {
    console.error('Error saving coupon:', e);
  }
};

export const removeAppliedCoupon = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('appliedCoupon');
    window.dispatchEvent(new Event('couponUpdated'));
  } catch (e) {
    console.error('Error removing coupon:', e);
  }
};

