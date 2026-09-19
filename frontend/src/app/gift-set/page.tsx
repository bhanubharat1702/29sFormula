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
import { saveCart, clearCart, fetchAndSyncUserCart } from "@/utils/cartSync";

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
  const [selectedSize, setSelectedSize] = useState<string>("50 ml");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>(null);

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
    saveCart(updated);
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
    fetchAndSyncUserCart();
    window.addEventListener("cartUpdated", loadCart);

    // Fetch site settings for gift set customization
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSettings(data);
          if (data.giftSetDefaultSize) {
            setSelectedSize(data.giftSetDefaultSize);
          }
        }
      })
      .catch((err) => console.error("Error fetching settings:", err));

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

  const maxProducts = settings?.giftSetMaxFragrances || 3;
  const configuredSizes = settings?.giftSetSizes?.length > 0 ? settings.giftSetSizes : [
    { size: "Pack of 3", label: "Starter Set", description: "3 Curated Items" },
    { size: "Pack of 5", label: "Classic Box", description: "5 Selected Items" },
    { size: "Pack of 10", label: "Ultimate Bundle", description: "Full Experience" }
  ];

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    // Clear selections if size changes to maintain consistent size bundle
    setSelectedProducts([]);
  };

  const getProductCountInBox = (productId: string) => {
    return selectedProducts.filter((p) => p._id === productId).length;
  };

  const handleIncrementProduct = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (selectedProducts.length >= maxProducts) return;
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleDecrementProduct = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const idx = selectedProducts.findIndex((p) => p._id === product._id);
    if (idx > -1) {
      const updated = [...selectedProducts];
      updated.splice(idx, 1);
      setSelectedProducts(updated);
    }
  };

  const handleRemoveSlot = (index: number) => {
    const updated = [...selectedProducts];
    updated.splice(index, 1);
    setSelectedProducts(updated);
  };

  const handleAddGiftBoxToCart = () => {
    if (selectedProducts.length !== maxProducts) return;

    // Calculate bundle total price
    const totalPrice = selectedProducts.reduce((sum, item) => {
      const variantPrice = (item.options && item.options.find((o: any) => o.size === selectedSize)?.price)
        || (item.variants && item.variants.find((v: any) => v.size === selectedSize)?.price)
        || item.price;
      return sum + variantPrice;
    }, 0);

    const giftSetDetails = selectedProducts.map((item) => {
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
      name: `Custom Gift Set`,
      price: totalPrice,
      imageFront: "/images/gift_set_builder_bg.jpg",
      size: selectedSize,
      quantity: 1,
      isGiftSet: true,
      giftSetItems: selectedProducts.map((f) => f.name),
      giftSetDetails: giftSetDetails
    };

    let cart = [];
    try {
      const stored = localStorage.getItem("cart");
      if (stored) cart = JSON.parse(stored);
    } catch (e) { }

    cart.push(bundleItem);
    saveCart(cart);
    setCartItems(cart);
    setShowCartDrawer(true);
  };

  if (loading) {
    return <NewtonsCradleLoader fullScreen={true} />;
  }

  // Check if admin turned off storefront gift set page visibility
  if (settings && settings.showGiftSetPage === false) {
    return (
      <div className={styles.page}>
        <Navbar onCartClick={() => setShowCartDrawer(true)} />
        <main className={styles.mainContent} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "40px 20px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#111827" style={{ width: "32px", height: "32px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-9.75-13.5h19.5" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>
            Gift Sets Coming Soon
          </h1>
          <p style={{ color: "#6b7280", maxWidth: "480px", marginBottom: "24px", lineHeight: 1.6 }}>
            Our custom gift box curator is currently undergoing maintenance. Please explore our full product catalog in the meantime.
          </p>
          <Link href="/all" style={{ backgroundColor: "#111827", color: "#ffffff", padding: "12px 28px", borderRadius: "8px", fontWeight: 600, textDecoration: "none" }}>
            Explore All Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Dynamic Header Background Style
  const headerBgType = settings?.giftSetHeaderBgType || "color";
  const headerBgStyle: React.CSSProperties = { position: "relative", overflow: "hidden" };
  if (headerBgType === "image") {
    const imageUrl = settings?.giftSetHeaderBgImage || "/images/gift_set_header_bg.jpg";
    headerBgStyle.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.25) 100%), url(${imageUrl})`;
    headerBgStyle.backgroundSize = "cover";
    headerBgStyle.backgroundPosition = "center";
  } else if (headerBgType === "video") {
    headerBgStyle.backgroundImage = "none";
    headerBgStyle.backgroundColor = "#000000";
  } else {
    // Solid Color
    headerBgStyle.backgroundImage = "none";
    headerBgStyle.backgroundColor = settings?.giftSetHeaderBgColor || "#1e293b";
  }

  return (
    <div className={styles.page}>
      <Navbar onCartClick={() => setShowCartDrawer(true)} />

      <main className={styles.mainContent}>
        {/* Top Header Banner */}
        <section className={styles.headerBannerSection}>
          <div className={styles.headerBannerCard} style={headerBgStyle}>
            {headerBgType === "video" && settings?.giftSetHeaderBgVideo && (
              <video
                autoPlay
                loop
                muted
                playsInline
                src={settings.giftSetHeaderBgVideo}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 0
                }}
              />
            )}
            <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
              <span className={styles.headerBadge}>
                {settings?.giftSetHeaderBadge || "CURATE · GIFT · DELIGHT"}
              </span>
              <h1
                className={styles.headerTitle}
                style={{
                  fontFamily: settings?.giftSetHeaderTitleFontType || "Outfit",
                  fontSize: settings?.giftSetHeaderTitleFontSize || "3.5rem",
                  color: settings?.giftSetHeaderTitleFontColor || "#111827",
                  fontWeight: settings?.giftSetHeaderTitleFontWeight || "800",
                  textAlign: (settings?.giftSetHeaderTitleFontAlignment as any) || "center"
                }}
              >
                {settings?.giftSetHeaderTitle || "Build Your Gift Set"}
              </h1>
              <p
                className={styles.headerSubtitle}
                style={{
                  fontFamily: settings?.giftSetHeaderSubtitleFontType || "Outfit",
                  fontSize: settings?.giftSetHeaderSubtitleFontSize || "1.1rem",
                  color: settings?.giftSetHeaderSubtitleFontColor || "#6b7280",
                  fontWeight: settings?.giftSetHeaderSubtitleFontWeight || "500"
                }}
              >
                {settings?.giftSetHeaderSubtitle || `Pick any ${maxProducts} products to create your gift set`}
              </p>
            </div>
          </div>
        </section>

        {/* Builder Container */}
        <section className={styles.builderSection}>
          {/* Step 1: Choose a box size */}
          <div className={styles.stepHeaderRow}>
            <div className={styles.stepNumberBadge}>1</div>
            <h2 className={styles.stepTitle}>Choose box size</h2>
          </div>

          <div className={styles.sizeCardsGrid}>
            {configuredSizes.map(({ size, label, description, desc }: any) => {
              const isSelected = selectedSize === size;
              const displayDesc = description || desc || "";
              return (
                <div
                  key={size}
                  onClick={() => handleSelectSize(size)}
                  className={`${styles.sizeCard} ${isSelected ? styles.sizeCardActive : ""}`}
                >
                  <div className={styles.bottleIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "22px", height: "22px" }}>
                      <path d="M20 12v10H4V12" />
                      <path d="M22 7H2v5h20V7z" />
                      <path d="M12 22V7" />
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                    </svg>
                  </div>
                  <div className={styles.sizeCardValue}>{size}</div>
                  <div className={styles.desktopSizeCardTag}>{label}{displayDesc ? ` · ${displayDesc}` : ""}</div>
                  <div className={styles.mobileSizeCardTag}>
                    <div>{label}</div>
                    {displayDesc && <div>{displayDesc}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slot Selection Tracker Bar */}
          <div className={`${styles.slotTrackerBar} ${selectedProducts.length > 0 ? styles.slotTrackerBarVisible : ""}`}>
            <div className={styles.slotsList}>
              {Array.from({ length: maxProducts }).map((_, index) => {
                const item = selectedProducts[index];
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
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <div className={styles.emptySlotContent}>
                        <div className={styles.emptySlotPlaceholderIcon}>?</div>
                        <div className={styles.slotInfo}>
                          <p className={styles.slotName} style={{ color: "#94a3b8" }}>Select Item #{index + 1}</p>
                          <span className={styles.slotSize}>{selectedSize}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {(() => {
              const totalPrice = selectedProducts.reduce((sum, item) => {
                const variantPrice = (item.options && item.options.find((o: any) => o.size === selectedSize)?.price)
                  || (item.variants && item.variants.find((v: any) => v.size === selectedSize)?.price)
                  || item.price;
                return sum + variantPrice;
              }, 0);

              const isSolid = (settings?.giftSetButtonStyle || "solid") === "solid";
              const btnBg = isSolid ? (settings?.giftSetButtonColor || "#000000") : "transparent";
              const btnTextColor = isSolid ? (settings?.giftSetButtonTextColor || "#ffffff") : (settings?.giftSetButtonColor || "#000000");
              const btnBorder = isSolid ? "none" : `2px solid ${settings?.giftSetButtonColor || "#000000"}`;

              return (
                <button
                  onClick={handleAddGiftBoxToCart}
                  disabled={selectedProducts.length !== maxProducts}
                  className={styles.addBundleBtn}
                  style={{
                    backgroundColor: selectedProducts.length === maxProducts ? btnBg : undefined,
                    color: selectedProducts.length === maxProducts ? btnTextColor : undefined,
                    border: selectedProducts.length === maxProducts ? btnBorder : undefined
                  }}
                >
                  {selectedProducts.length === maxProducts
                    ? `${settings?.giftSetButtonText || "Add Gift Box to Cart"} · ₹${totalPrice.toLocaleString("en-IN")}`
                    : `Select ${maxProducts - selectedProducts.length} More Items`}
                </button>
              );
            })()}
          </div>

          {/* Step 2: Pick items */}
          <div className={styles.stepHeaderRow} style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div className={styles.stepNumberBadge}>2</div>
              <h2 className={styles.stepTitle}>Pick {maxProducts} items</h2>
            </div>
            <div className={styles.chosenPill}>
              {selectedProducts.length} / {maxProducts} chosen
            </div>
          </div>

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
                      if (isSizeAvailable && productCount === 0 && selectedProducts.length < maxProducts) {
                        handleIncrementProduct(e, product);
                      }
                    }}
                    className={`${styles.fragranceCard} ${isSelected ? styles.fragranceCardSelected : ""} ${!isSizeAvailable ? styles.fragranceCardDisabled : ""}`}
                    style={{
                      cursor: isSizeAvailable && productCount === 0 && selectedProducts.length < maxProducts ? "pointer" : "default"
                    }}
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
                    {isSizeAvailable && (
                      <div className={styles.cardPrice}>
                        ₹{displayPrice.toLocaleString("en-IN")}
                      </div>
                    )}

                    {/* Clicking product card toggles selection if no count yet, or increments if available */}
                    {isSizeAvailable && (
                      <div
                        className={styles.cardActionArea}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (productCount === 0 && selectedProducts.length < maxProducts) {
                            handleIncrementProduct(e, product);
                          }
                        }}
                        style={{ cursor: productCount === 0 && selectedProducts.length < maxProducts ? "pointer" : "default" }}
                      >
                        {productCount > 0 && (
                          <div className={styles.productPageQtyContainer} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleDecrementProduct(e, product)}
                              className={styles.productPageQtyBtn}
                            >
                              −
                            </button>
                            <span className={styles.productPageQtyVal}>{productCount}</span>
                            <button
                              type="button"
                              onClick={(e) => handleIncrementProduct(e, product)}
                              disabled={selectedProducts.length >= maxProducts}
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
          primaryColor={settings?.primaryColor || "#111827"}
          onOrderSuccess={(orderId: string, details?: any) => {
            clearCart();
            setCartItems([]);
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
          primaryColor={settings?.primaryColor || "#111827"}
        />
      )}
    </div>
  );
}
