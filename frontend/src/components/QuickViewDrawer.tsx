"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./QuickViewDrawer.module.css";

interface QuickViewDrawerProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: any, size?: string, qty?: number) => void;
}

export default function QuickViewDrawer({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewDrawerProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cachedProduct, setCachedProduct] = useState(product);

  const [fullProductData, setFullProductData] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setCachedProduct(product);
      setQuantity(1);
      let defaultSize = "";
      if (product.variants && product.variants.length > 0) {
        const inStockVar = product.variants.find((v: any) => (Number(v.quantity) || 0) > 0);
        if (inStockVar) {
          defaultSize = inStockVar.size;
        }
      } else if (product.sizes && product.sizes.length > 0) {
        if ((Number(product.quantity || 0) > 0)) {
          defaultSize = product.sizes[0];
        }
      }
      setSelectedSize(defaultSize);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen && product?._id) {
      setIsLoadingDetails(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products/${product._id}`)
        .then(res => res.json())
        .then(data => {
          setFullProductData(data);
          
          // Select default size: ONLY select an IN-STOCK size
          let defaultSize = "";
          if (data.variants && data.variants.length > 0) {
            const inStockVariant = data.variants.find((v: any) => (Number(v.quantity) || 0) > 0);
            if (inStockVariant) {
              defaultSize = inStockVariant.size;
            }
          } else if (data.sizes && data.sizes.length > 0) {
            if ((Number(data.quantity || 0) > 0)) {
              defaultSize = data.sizes[0];
            }
          }
          setSelectedSize(defaultSize);
        })
        .catch(err => console.error("Error fetching full product details:", err))
        .finally(() => setIsLoadingDetails(false));
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.stop();
      }

      setIsRendered(true);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // To ensure the animation triggers after render, we use a tiny timeout
      setTimeout(() => setIsAnimating(true), 10);

      return () => {
        if (typeof window !== 'undefined' && (window as any).lenis) {
          (window as any).lenis.start();
        }
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      };
    } else if (isRendered) {
      setIsAnimating(false);
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      // Wait for animation to finish before removing from DOM
      const timer = setTimeout(() => setIsRendered(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clean up overflow on unmount just in case
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Compute images for carousel
  const carouselImages = (() => {
    if (!cachedProduct) return [];
    const rawImages = [
      fullProductData?.imageFront || cachedProduct.imageFront,
      fullProductData?.imageBack,
      ...(fullProductData?.images || [])
    ].filter(Boolean);
    return Array.from(new Set(rawImages));
  })();

  // Auto-scroll carousel every 2 seconds
  useEffect(() => {
    if (carouselImages.length <= 1) return;
    
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(intervalId);
  }, [carouselImages.length]);

  if (!isRendered) return null;
  if (!cachedProduct) return null;

  return (
    <>
      <div 
        className={`${styles.overlay} ${isAnimating ? styles.open : ""}`} 
        onClick={onClose}
        data-lenis-prevent="true"
      />
      
      <div 
        className={`${styles.drawer} ${isAnimating ? styles.open : ""}`}
        data-lenis-prevent="true"
      >
        <div className={styles.header}>
          <button onClick={onClose} className={styles.closeBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content} data-lenis-prevent="true">
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{cachedProduct.name}</h2>
          </div>
          
          <div 
            className={styles.subtitle}
            dangerouslySetInnerHTML={{ __html: cachedProduct.description || "EAU DE PARFUM SPRAY" }}
          />

          {/* SIZES AND PRICING */}
          {(() => {
            const hasVariants = fullProductData && fullProductData.variants && fullProductData.variants.length > 0;
            
            let activePrice = cachedProduct.price;
            let activeStrikePrice = cachedProduct.strikePrice;
            
            if (hasVariants) {
              const variant = selectedSize
                ? fullProductData.variants.find((v: any) => v.size === selectedSize)
                : (fullProductData.variants.find((v: any) => (Number(v.quantity) || 0) > 0) || fullProductData.variants[0]);
              if (variant) {
                activePrice = variant.price;
                activeStrikePrice = variant.strikePrice;
              }
            }

            return (
              <div className={styles.pricingSection}>
                {hasVariants && (
                  <div className={styles.sizesSection}>
                    {(() => {
                      const inStockCount = fullProductData.variants.filter((v: any) => (Number(v.quantity) || 0) > 0).length;
                      return (
                        <p className={styles.sizesLabel}>{inStockCount} {inStockCount === 1 ? "SIZE" : "SIZES"} AVAILABLE</p>
                      );
                    })()}
                    <div className={styles.dropdownContainer}>
                      <button 
                        className={styles.dropdownToggle}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className={styles.dropdownLeft}>{selectedSize || "Out of Stock"}</span>
                        <div className={styles.dropdownRight}>
                          <span>₹ {activePrice.toLocaleString("en-IN")}</span>
                          <svg className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconOpen : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </button>
                      
                      {isDropdownOpen && (
                        <div className={styles.dropdownMenu}>
                          {fullProductData.variants.map((v: any) => {
                            const isOutOfStock = (Number(v.quantity) || 0) <= 0;
                            return (
                              <div 
                                key={v.size} 
                                className={`${styles.dropdownOption} ${selectedSize === v.size ? styles.dropdownOptionActive : ""}`}
                                style={isOutOfStock ? { opacity: 0.5, backgroundColor: "#f9fafb", cursor: "not-allowed", pointerEvents: "none" } : {}}
                                onClick={(e) => {
                                  if (isOutOfStock) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    return;
                                  }
                                  setSelectedSize(v.size);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                <span className={styles.dropdownLeft}>{v.size}</span>
                                <span className={styles.dropdownRight} style={isOutOfStock ? { color: "#dc2626", fontSize: "0.8rem" } : {}}>
                                  {isOutOfStock ? "Out of Stock" : `₹ ${v.price.toLocaleString("en-IN")}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className={styles.priceRow}>
                  {/* Mobile Quantity Selector */}
                  <div className={styles.mobileQuantity}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        style={{ padding: '6px 14px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '1rem', borderRight: '1px solid #e5e7eb', color: '#000' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '6px 16px', fontSize: '0.95rem', fontWeight: 500, color: '#000', minWidth: '40px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        style={{ padding: '6px 14px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '1rem', borderLeft: '1px solid #e5e7eb', color: '#000' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Desktop Price Layout */}
                  <div className={styles.desktopPrice}>
                    <span className={styles.price}>
                      ₹ {activePrice.toLocaleString("en-IN")}
                      {activeStrikePrice && activeStrikePrice > activePrice && (
                        <del style={{ color: "#ef4444", fontSize: "0.7em", marginLeft: "8px" }}>
                          ₹{activeStrikePrice.toLocaleString("en-IN")}
                        </del>
                      )}
                      <span className={styles.taxNote}>*</span>
                    </span>
                  </div>

                  {/* Mobile Price Layout */}
                  <div className={styles.mobilePrice}>
                    {activeStrikePrice && activeStrikePrice > activePrice ? (
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-end", textAlign: "right" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: "#ef4444", fontSize: "0.8em", fontWeight: 400 }}>
                            -{Math.round(((activeStrikePrice - activePrice) / activeStrikePrice) * 100)}%
                          </span>
                          <span style={{ fontWeight: 400, color: "#4a5568", fontSize: "1.3rem" }}>
                            ₹ {activePrice.toLocaleString("en-IN")}
                          </span>
                        </span>
                        <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                          M.R.P: <del>₹ {activeStrikePrice.toLocaleString("en-IN")}</del>
                        </span>
                      </span>
                    ) : (
                      <span className={styles.price} style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                        <span style={{ fontWeight: 400, color: "#4a5568" }}>₹ {activePrice.toLocaleString("en-IN")}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {(() => {
            const isSelectedSizeOutOfStock = (() => {
              if (fullProductData?.variants && fullProductData.variants.length > 0) {
                if (!selectedSize) return true;
                const selectedVar = fullProductData.variants.find((v: any) => v.size === selectedSize);
                return !selectedVar || (Number(selectedVar.quantity) || 0) <= 0;
              }
              if (cachedProduct?.variants && cachedProduct.variants.length > 0) {
                if (!selectedSize) return true;
                const selectedVar = cachedProduct.variants.find((v: any) => v.size === selectedSize);
                return !selectedVar || (Number(selectedVar.quantity) || 0) <= 0;
              }
              return (Number(fullProductData?.quantity ?? cachedProduct?.quantity) || 0) <= 0;
            })();

            return (
              <div className={styles.actionButtons}>
                <button 
                  className={styles.addToBagBtn}
                  onClick={() => {
                    if (isSelectedSizeOutOfStock) return;
                    onAddToCart(cachedProduct, selectedSize || undefined, quantity);
                    onClose();
                  }}
                  disabled={isLoadingDetails || isSelectedSizeOutOfStock}
                  style={isSelectedSizeOutOfStock ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                >
                  {isLoadingDetails ? "LOADING..." : (isSelectedSizeOutOfStock ? "OUT OF STOCK" : "ADD TO BAG")}
                </button>
                <Link href={`/product/${cachedProduct._id}`} className={styles.viewDetailsBtn}>
                  VIEW DETAILS
                </Link>
              </div>
            );
          })()}

          <div className={styles.taxFooter}>
            *MRP (inclusive of all taxes). <a href="#">More information</a>
          </div>

          {/* CAROUSEL */}
          {(() => {
            const handlePrevImage = () => {
              setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
            };
            const handleNextImage = () => {
              setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
            };

            return (
              <div className={styles.carouselContainer}>
                {carouselImages.length > 1 && (
                  <button onClick={handlePrevImage} className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                )}
                
                <div className={styles.imageViewport}>
                  <div 
                    className={styles.imageTrack}
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {carouselImages.map((imgUrl: string, idx: number) => (
                      <div key={idx} className={styles.imageSlide}>
                        <img 
                          src={imgUrl || "/placeholder.jpg"} 
                          alt={`${cachedProduct.name} - ${idx}`} 
                          className={styles.image} 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {carouselImages.length > 1 && (
                  <button onClick={handleNextImage} className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}
