'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveCart as syncSaveCart, clearCart as syncClearCart, fetchAndSyncUserCart, getStoredCart } from '@/utils/cartSync';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  strikePrice?: number;
  imageFront?: string;
  size: string;
  quantity: number;
  maxStock?: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  showCartDrawer: boolean;
  setShowCartDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  isCartClosing: boolean;
  cartError: string | null;
  addToCart: (product: any, size?: string, qty?: number) => void;
  updateQuantity: (index: number, newQty: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  closeCartDrawer: () => void;
  showCartError: (message: string) => void;
  totalCartCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [isCartClosing, setIsCartClosing] = useState<boolean>(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const showCartError = useCallback((msg: string) => {
    setCartError(msg);
    setTimeout(() => {
      setCartError(null);
    }, 4000);
  }, []);

  const loadCart = useCallback(() => {
    if (typeof window !== 'undefined') {
      const items = getStoredCart();
      setCartItems(items);
    }
  }, []);

  useEffect(() => {
    loadCart();
    fetchAndSyncUserCart().then(items => {
      if (Array.isArray(items)) {
        setCartItems(items);
      }
    });

    const handleStorageChange = () => loadCart();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, [loadCart]);

  const closeCartDrawer = useCallback(() => {
    setIsCartClosing(true);
    setTimeout(() => {
      setShowCartDrawer(false);
      setIsCartClosing(false);
    }, 300);
  }, []);

  const addToCart = useCallback((product: any, size?: string, qty: number = 1) => {
    if (!product) return;

    const selectedSize =
      size ||
      product?.variants?.find((v: any) => (Number(v.quantity) || 0) > 0)?.size ||
      product?.variants?.[0]?.size ||
      product?.sizes?.[0] ||
      product?.availableSizes?.[0] ||
      'Standard';

    if (typeof window !== 'undefined') {
      const itemsList = getStoredCart();

      const maxStock =
        (product?.variants && product.variants.find((v: any) => v.size === selectedSize)?.quantity) ??
        product.quantity;

      const existingIdx = itemsList.findIndex((item: any) => item._id === product._id && item.size === selectedSize);

      if (existingIdx > -1) {
        if (itemsList[existingIdx].quantity + qty > maxStock) {
          showCartError(`Only ${maxStock} units of ${product.name} (${selectedSize}) are available in stock.`);
          itemsList[existingIdx].quantity = maxStock;
          setShowCartDrawer(true);
        } else {
          itemsList[existingIdx].quantity += qty;
        }
      } else {
        const variantPrice =
          (product.options && product.options.find((o: any) => o.size === selectedSize)?.price) ||
          (product.variants && product.variants.find((v: any) => v.size === selectedSize)?.price) ||
          product.price;

        const variantStrikePrice =
          (product.options && product.options.find((o: any) => o.size === selectedSize)?.strikePrice) ||
          (product.variants && product.variants.find((v: any) => v.size === selectedSize)?.strikePrice) ||
          product.strikePrice;

        let qtyToPush = qty;
        if (qty > maxStock) {
          showCartError(`Only ${maxStock} units of ${product.name} (${selectedSize}) are available in stock.`);
          qtyToPush = maxStock;
          setShowCartDrawer(true);
        }

        if (qtyToPush > 0) {
          itemsList.push({
            _id: product._id,
            name: product.name,
            price: variantPrice,
            strikePrice: variantStrikePrice,
            imageFront: product.imageFront,
            size: selectedSize,
            quantity: qtyToPush,
            maxStock: maxStock
          });
        }
      }

      setCartItems(itemsList);
      syncSaveCart(itemsList);
      setShowCartDrawer(true);
    }
  }, [showCartError]);

  const updateQuantity = useCallback((index: number, newQty: number) => {
    if (newQty <= 0) {
      setCartItems(prev => {
        const updated = prev.filter((_, idx) => idx !== index);
        syncSaveCart(updated);
        return updated;
      });
    } else {
      setCartItems(prev => {
        const item = prev[index];
        if (!item) return prev;

        if (item.maxStock !== undefined && newQty > item.maxStock) {
          showCartError(`Only ${item.maxStock} units of ${item.name} (${item.size}) are available in stock.`);
          const updated = [...prev];
          updated[index].quantity = item.maxStock;
          syncSaveCart(updated);
          setShowCartDrawer(true);
          return updated;
        }

        const updated = [...prev];
        updated[index].quantity = newQty;
        syncSaveCart(updated);
        return updated;
      });
    }
  }, [showCartError]);

  const removeFromCart = useCallback((index: number) => {
    updateQuantity(index, 0);
  }, [updateQuantity]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    syncClearCart();
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        showCartDrawer,
        setShowCartDrawer,
        isCartClosing,
        cartError,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        closeCartDrawer,
        showCartError,
        totalCartCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
