'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import NewtonsCradleLoader from "@/components/NewtonsCradleLoader";

interface Product {
  _id: string;
  name: string;
  price: number;
  strikePrice?: number;
  category: string;
  imageFront: string;
  variants?: any[];
  options?: any[];
}

export default function GiftSetPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<"20 ml" | "50 ml" | "100 ml">("50 ml");
  const [selectedFragrances, setSelectedFragrances] = useState<Product[]>([]);

  // Cart & Checkout Drawer State
  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState<boolean>(false);
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>("");
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);
  const [expandedGiftSets, setExpandedGiftSets] = useState<{ [itemId: string]: boolean }>({});

  const updateQuantity = (index: number, newQty: number) => {
    const updated = [...cartItems];
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const toggleGiftSetDropdown = (itemId: string) => {
    setExpandedGiftSets((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem("cart");
        if (stored) setCartItems(JSON.parse(stored));
        else setCartItems([]);
      } catch (e) {
        setCartItems([]);
      }
    };
    loadCart();
    window.addEventListener("cartUpdated", loadCart);

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const handleSelectSize = (size: "20 ml" | "50 ml" | "100 ml") => {
    setSelectedSize(size);
    // Clear selections if size changes to maintain consistent size bundle
    setSelectedFragrances([]);
  };

  const getProductCountInBox = (productId: string) => {
    return selectedFragrances.filter((p) => p._id === productId).length;
  };

  const handleIncrementFragrance = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (selectedFragrances.length >= 3) return;
    setSelectedFragrances([...selectedFragrances, product]);
  };

  const handleDecrementFragrance = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const idx = selectedFragrances.findIndex((p) => p._id === product._id);
    if (idx > -1) {
      const updated = [...selectedFragrances];
      updated.splice(idx, 1);
      setSelectedFragrances(updated);
    }
  };

  const handleToggleFragrance = (product: Product) => {
    const count = getProductCountInBox(product._id);
    if (count > 0) {
      // Remove all instances of this product
      setSelectedFragrances(selectedFragrances.filter((p) => p._id !== product._id));
    } else {
      if (selectedFragrances.length >= 3) return;
      setSelectedFragrances([...selectedFragrances, product]);
    }
  };

  const handleRemoveSlot = (index: number) => {
    const updated = [...selectedFragrances];
    updated.splice(index, 1);
    setSelectedFragrances(updated);
  };

  const handleAddGiftBoxToCart = () => {
    if (selectedFragrances.length !== 3) return;

    // Calculate bundle total price
    const totalPrice = selectedFragrances.reduce((sum, item) => {
      const variantPrice = (item.options && item.options.find((o: any) => o.size === selectedSize)?.price)
        || (item.variants && item.variants.find((v: any) => v.size === selectedSize)?.price)
        || item.price;
      return sum + variantPrice;
    }, 0);

    const giftSetDetails = selectedFragrances.map((item) => {
      const itemPrice = (item.options && item.options.find((o: any) => o.size === selectedSize)?.price)
        || (item.variants && item.variants.find((v: any) => v.size === selectedSize)?.price)
        || item.price;
      return {
        _id: item._id,
        name: item.name,
        imageFront: item.imageFront,
        price: itemPrice
      };
    });

    const bundleItem = {
      _id: `gift-set-${Date.now()}`,
      name: `Custom Gift Set `,
      price: totalPrice,
      imageFront: "/images/gift_set_builder_bg.jpg",
      size: selectedSize,
      quantity: 1,
      isGiftSet: true,
      giftSetItems: selectedFragrances.map((f) => f.name),
      giftSetDetails: giftSetDetails
    };

    let cart = [];
    try {
      const stored = localStorage.getItem("cart");
      if (stored) cart = JSON.parse(stored);
    } catch (e) { }

    cart.push(bundleItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);
    window.dispatchEvent(new Event("cartUpdated"));
    setShowCartDrawer(true);
  };

  return (
    <div className={styles.page}>
      <Navbar onCartClick={() => setShowCartDrawer(true)} />

      <main className={styles.mainContent}>
        {/* Top Header Banner matching 3rd screenshot */}
        <section className={styles.headerBannerSection}>
          <div className={styles.headerBannerCard}>
            <span className={styles.headerBadge}>CURATE · GIFT · DELIGHT</span>
            <h1 className={styles.headerTitle}>Build Your Gift Set</h1>
            <p className={styles.headerSubtitle}>Pick any 3 fragrances in the same size</p>
          </div>
        </section>

        {/* Builder Container */}
        <section className={styles.builderSection}>
          {/* Step 1: Choose a bottle size */}
          <div className={styles.stepHeaderRow}>
            <div className={styles.stepNumberBadge}>1</div>
            <h2 className={styles.stepTitle}>Choose a bottle size</h2>
          </div>

          <div className={styles.sizeCardsGrid}>
            {[
              { size: "20 ml", tag: "Petite · Travel-friendly" },
              { size: "50 ml", tag: "Classic · Most popular" },
              { size: "100 ml", tag: "Grand · Full experience" }
            ].map(({ size, tag }) => {
              const isSelected = selectedSize === size;
              return (
                <div
                  key={size}
                  onClick={() => handleSelectSize(size as any)}
                  className={`${styles.sizeCard} ${isSelected ? styles.sizeCardActive : ""}`}
                >
                  <div className={styles.bottleIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 2h6v2H9V2zm-1 4h8a1 1 0 0 1 1 1v2.5a2.5 2.5 0 0 0 .73 1.77L19 12.5V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7.5l1.27-1.23A2.5 2.5 0 0 0 7 9.5V7a1 1 0 0 1 1-1z" />
                    </svg>
                  </div>
                  <div className={styles.sizeCardValue}>{size}</div>
                  <div className={styles.sizeCardTag}>{tag}</div>
                </div>
              );
            })}
          </div>

          {/* Slot Selection Tracker Bar (Fixed at bottom of screen, matching screenshot design) */}
          <div className={`${styles.slotTrackerBar} ${selectedFragrances.length > 0 ? styles.slotTrackerBarVisible : ""}`}>
            <div className={styles.slotsList}>
              {[0, 1, 2].map((index) => {
                const item = selectedFragrances[index];
                return (
                  <div key={index} className={`${styles.slotBox} ${item ? styles.slotBoxFilled : ""}`}>
                    {item ? (
                      <>
                        <img src={item.imageFront} alt={item.name} className={styles.slotImg} />
                        <div className={styles.slotInfo}>
                          <p className={styles.slotName}>{item.name}</p>
                          <span className={styles.slotSize}>{selectedSize}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(index)}
                          className={styles.removeSlotBtn}
                          title="Remove fragrance"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <div className={styles.emptySlotContent}>
                        <div className={styles.emptySlotPlaceholderIcon}>?</div>
                        <div className={styles.slotInfo}>
                          <p className={styles.slotName} style={{ color: "#94a3b8" }}>Select Fragrance #{index + 1}</p>
                          <span className={styles.slotSize}>{selectedSize}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {(() => {
              const totalPrice = selectedFragrances.reduce((sum, item) => {
                const variantPrice = (item.options && item.options.find((o: any) => o.size === selectedSize)?.price)
                  || (item.variants && item.variants.find((v: any) => v.size === selectedSize)?.price)
                  || item.price;
                return sum + variantPrice;
              }, 0);

              return (
                <button
                  onClick={handleAddGiftBoxToCart}
                  disabled={selectedFragrances.length !== 3}
                  className={styles.addBundleBtn}
                >
                  {selectedFragrances.length === 3
                    ? `Add Gift Box to Cart · ₹${totalPrice.toLocaleString("en-IN")}`
                    : `Select ${3 - selectedFragrances.length} More`}
                </button>
              );
            })()}
          </div>

          {/* Step 2: Pick 3 fragrances */}
          <div className={styles.stepHeaderRow} style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div className={styles.stepNumberBadge}>2</div>
              <h2 className={styles.stepTitle}>Pick 3 fragrances</h2>
            </div>
            <div className={styles.chosenPill}>
              {selectedFragrances.length} / 3 chosen
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <NewtonsCradleLoader />
            </div>
          ) : (
            <div className={styles.fragranceGrid}>
              {products.map((product) => {
                // Check if product supports the selected size in variants or options
                const hasVariantSize = product.variants && product.variants.some((v: any) => v.size === selectedSize && (v.quantity === undefined || v.quantity > 0));
                const hasOptionSize = product.options && product.options.some((o: any) => o.size === selectedSize);

                // If product has variants or options defined, check size match; otherwise fallback to true if general stock > 0
                const isSizeAvailable = (product.variants && product.variants.length > 0)
                  ? hasVariantSize
                  : (product.options && product.options.length > 0)
                    ? hasOptionSize
                    : true;

                const productCount = getProductCountInBox(product._id);
                const isSelected = productCount > 0;
                const displayPrice = (product.options && product.options.find((o: any) => o.size === selectedSize)?.price)
                  || (product.variants && product.variants.find((v: any) => v.size === selectedSize)?.price)
                  || product.price;

                const categoryLabel = Array.isArray(product.category) ? product.category[0] : (product.category || "Best Seller");

                return (
                  <div
                    key={product._id}
                    onClick={(e) => {
                      if (isSizeAvailable && productCount === 0 && selectedFragrances.length < 3) {
                        handleIncrementFragrance(e, product);
                      }
                    }}
                    className={`${styles.fragranceCard} ${isSelected ? styles.fragranceCardSelected : ""} ${!isSizeAvailable ? styles.fragranceCardDisabled : ""}`}
                    style={{ cursor: isSizeAvailable && productCount === 0 && selectedFragrances.length < 3 ? "pointer" : "default" }}
                  >
                    <div className={styles.cardImgWrapper}>
                      <img src={product.imageFront} alt={product.name} className={styles.cardImg} />
                      {!isSizeAvailable && (
                        <div className={styles.unavailableBadge}>
                          Size Not Available
                        </div>
                      )}
                    </div>
                    <h3 className={styles.cardTitle}>{product.name}</h3>
                    <div className={styles.cardCategory}>{categoryLabel}</div>
                    <div className={styles.cardPrice}>
                      {isSizeAvailable ? `₹${displayPrice.toLocaleString("en-IN")}` : `Unavailable in ${selectedSize}`}
                    </div>

                    {/* Clicking product card toggles selection if no count yet, or increments if available */}
                    {isSizeAvailable && (
                      <div
                        className={styles.cardActionArea}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (productCount === 0 && selectedFragrances.length < 3) {
                            handleIncrementFragrance(e, product);
                          }
                        }}
                        style={{ cursor: productCount === 0 && selectedFragrances.length < 3 ? "pointer" : "default" }}
                      >
                        {productCount > 0 && (
                          <div className={styles.productPageQtyContainer} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleDecrementFragrance(e, product)}
                              className={styles.productPageQtyBtn}
                            >
                              −
                            </button>
                            <span className={styles.productPageQtyVal}>{productCount}</span>
                            <button
                              type="button"
                              onClick={(e) => handleIncrementFragrance(e, product)}
                              disabled={selectedFragrances.length >= 3}
                              className={styles.productPageQtyBtn}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
          setShowCartDrawer(false);
          setShowCheckoutDrawer(true);
        }}
      />

      {/* Checkout Drawer */}
      {showCheckoutDrawer && (
        <CheckoutDrawer
          isOpen={showCheckoutDrawer}
          onClose={() => setShowCheckoutDrawer(false)}
          cartItems={cartItems}
          primaryColor="#57bc74"
          onOrderSuccess={(orderId: string, details?: any) => {
            localStorage.removeItem("cart");
            setCartItems([]);
            window.dispatchEvent(new Event("cartUpdated"));
            setShowCheckoutDrawer(false);
            setCompletedOrderId(orderId);
            setCompletedOrderDetails(details || null);
            setShowSuccessModal(true);
          }}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderId={completedOrderId}
          orderDetails={completedOrderDetails}
          primaryColor="#57bc74"
        />
      )}
    </div>
  );
}
