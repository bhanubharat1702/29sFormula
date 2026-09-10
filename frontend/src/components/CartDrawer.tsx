'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CartDrawer.module.css';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  strikePrice?: number;
  size: string;
  quantity: number;
  imageFront?: string;
  isGiftSet?: boolean;
  giftSetItems?: string[];
  giftSetDetails?: Array<{
    name: string;
    imageFront?: string;
    price: number;
  }>;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onCheckout: () => void;
  cartError?: string | null;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onCheckout,
  cartError,
}: CartDrawerProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [expandedGiftSets, setExpandedGiftSets] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.stop();
      }

      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        if (typeof window !== 'undefined' && (window as any).lenis) {
          (window as any).lenis.start();
        }
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  const toggleGiftSetDropdown = (id: string) => {
    setExpandedGiftSets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isOpen && !isClosing) return null;

  const totalQuantity = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  return (
    <div
      className={`${styles.cartOverlay} ${isClosing ? styles.cartOverlayClosing : ''}`}
      onClick={handleClose}
      data-lenis-prevent="true"
    >
      <div
        className={`${styles.cartDrawer} ${isClosing ? styles.cartDrawerClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        {/* Header */}
        <div className={styles.cartDrawerHeader}>
          <div className={styles.cartHeaderLeft}>
            <span>CART</span>
            {totalQuantity > 0 && (
              <span className={styles.cartCountBadge}>{totalQuantity}</span>
            )}
          </div>
          <button
            aria-label="Close cart"
            className={styles.closeCartBtn}
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        {/* Error Banner if any */}
        {cartError && (
          <div className={styles.cartErrorBanner}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              style={{ width: '18px', height: '18px' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{cartError}</span>
          </div>
        )}

        {/* Cart Content */}
        {cartItems.length > 0 ? (
          <div className={styles.cartDrawerBody}>
            <div className={styles.cartItemsList} data-lenis-prevent="true">
              {cartItems.map((item, index) => {
                const itemTotal = item.price * (item.quantity || 1);
                const discountPercent =
                  item.strikePrice && item.strikePrice > item.price
                    ? Math.round(((item.strikePrice - item.price) / item.strikePrice) * 100)
                    : 0;

                return (
                  <div key={`${item._id}-${item.size}-${index}`} className={styles.cartItemRow}>
                    <img
                      src={item.imageFront || '/placeholder.png'}
                      alt={item.name}
                      className={styles.cartItemImg}
                      loading="lazy"
                    />

                    <div className={styles.cartItemInfo}>
                      {/* Name and Line Total */}
                      <div className={styles.cartItemHeaderRow}>
                        <h4 className={styles.cartItemName}>{item.name.toUpperCase()}</h4>
                        <div className={styles.cartItemTotalPrice}>
                          ₹ {itemTotal.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Item-specific display */}
                      {item.isGiftSet ? (
                        /* GIFT SET ITEM STYLE (Screenshot 2) */
                        <>
                          {/* Size + Trash Icon Row */}
                          <div className={styles.giftSetSizeRow}>
                            <span className={styles.cartItemSize}>
                              {item.size ? (item.size.includes('x') ? item.size : `${item.size} x ${item.giftSetDetails?.length || item.giftSetItems?.length || 3}`) : '20ml x 3'}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(index, 0)}
                              className={styles.removeCartItemBtn}
                              title="Remove item"
                              aria-label="Remove item"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                style={{ width: 18, height: 18 }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button>
                          </div>

                          <div style={{ marginTop: '2px', marginBottom: '4px' }}>
                            <button
                              type="button"
                              onClick={() => toggleGiftSetDropdown(item._id)}
                              className={styles.giftSetDropdownToggle}
                            >
                              <span>
                                {expandedGiftSets[item._id]
                                  ? 'Hide Items'
                                  : 'View Selected Items'}
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className={`${styles.giftSetChevron} ${
                                  expandedGiftSets[item._id] ? styles.giftSetChevronRotated : ''
                                }`}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            </button>

                            {/* Expanded Fragrances List */}
                            {expandedGiftSets[item._id] && (
                              <div className={styles.giftSetItemsBox}>
                                <span className={styles.giftSetItemsTitle}>
                                  Included Fragrances ({item.size}):
                                </span>
                                {item.giftSetDetails && item.giftSetDetails.length > 0 ? (
                                  item.giftSetDetails.map((subItem: any, subIdx: number) => (
                                    <div key={subIdx} className={styles.giftSetSubItem}>
                                      <div className={styles.giftSetSubItemLeft}>
                                        {subItem.imageFront && (
                                          <img
                                            src={subItem.imageFront}
                                            alt={subItem.name}
                                            className={styles.giftSetSubItemImg}
                                          />
                                        )}
                                        <span>{subItem.name}</span>
                                      </div>
                                      <span className={styles.giftSetSubItemPrice}>
                                        ₹{(subItem.price || 0).toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                  ))
                                ) : item.giftSetItems && item.giftSetItems.length > 0 ? (
                                  item.giftSetItems.map((name: string, subIdx: number) => (
                                    <div key={subIdx} className={styles.giftSetTextItem}>
                                      • {name}
                                    </div>
                                  ))
                                ) : null}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        /* SINGLE PRODUCT ITEM STYLE (Screenshot 1 ZESTY style) */
                        <>
                          <p className={styles.cartItemSize}>{item.size}</p>

                          <div className={styles.singleProductPriceBlock}>
                            {item.strikePrice && item.strikePrice > item.price ? (
                              <>
                                <div className={styles.singleProductPriceRow}>
                                  <span className={styles.discountBadge}>
                                    -{discountPercent}%
                                  </span>
                                  <span className={styles.currentPrice}>
                                    ₹ {item.price.toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <span className={styles.mrpText}>
                                  M.R.P: <span className={styles.mrpStrikethrough}>₹ {item.strikePrice.toLocaleString('en-IN')}</span>
                                </span>
                              </>
                            ) : (
                              <span className={styles.currentPrice}>
                                ₹ {item.price.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {/* Controls Row for Single Products */}
                          <div className={styles.cartItemControlsRow}>
                            <div className={styles.qtyControlBox}>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                                className={styles.qtyBtn}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className={styles.qtyVal}>{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                                className={styles.qtyBtn}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(index, 0)}
                              className={styles.removeCartItemBtn}
                              title="Remove item"
                              aria-label="Remove item"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                style={{ width: 18, height: 18 }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className={styles.cartDrawerFooter}>
              <div className={styles.cartDrawerDivider} />

              <div className={styles.totalContainer}>
                <span className={styles.totalTitle}>Estimated total</span>
                <span className={styles.totalVal}>
                  Rs. {totalPrice.toLocaleString('en-IN')}.00
                </span>
              </div>

              <p className={styles.taxSubtext}>
                Duties and taxes included. Shipping is calculated at checkout.
              </p>

              <button
                type="button"
                className={styles.checkoutBtn}
                onClick={onCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className={styles.cartDrawerEmpty}>
            <h2 className={styles.cartEmptyHeading}>YOUR CART IS EMPTY</h2>
            <p className={styles.cartEmptySubtext}>
              Have an account?{' '}
              <Link href="/login" className={styles.cartLoginLink} onClick={handleClose}>
                Log in
              </Link>{' '}
              to check out faster.
            </p>
            <button
              type="button"
              className={styles.continueBtn}
              onClick={handleClose}
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
