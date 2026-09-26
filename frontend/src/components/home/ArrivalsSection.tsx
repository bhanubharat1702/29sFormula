"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/page.module.css";

interface ArrivalsSectionProps {
  arrivals: any[];
  displayedArrivals: any[];
  isStorefrontLoading: boolean;
  isStorefrontError: boolean;
  storefrontErrorMessage: string;
  isMobile: boolean;
  arrivalsPage: number;
  totalArrivalsPages: number;
  arrivalsDirection: "forward" | "backward";
  activeImageIndexes: { [key: string]: number };
  hoveredProductId: string | null;
  setHoveredProductId: (id: string | null) => void;
  setActiveImageIndexes: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  handlePrevImage: (e: React.MouseEvent, product: any) => void;
  handleNextImage: (e: React.MouseEvent, product: any) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEndArrivals: () => void;
  setArrivalsDirection: (dir: "forward" | "backward") => void;
  setArrivalsPage: React.Dispatch<React.SetStateAction<number>>;
  setQuickViewProduct: (product: any) => void;
  loadData: () => void;
  getProductImages: (product: any) => string[];
}

export default function ArrivalsSection({
  arrivals,
  displayedArrivals,
  isStorefrontLoading,
  isStorefrontError,
  storefrontErrorMessage,
  isMobile,
  arrivalsPage,
  totalArrivalsPages,
  arrivalsDirection,
  activeImageIndexes,
  hoveredProductId,
  setHoveredProductId,
  setActiveImageIndexes,
  handlePrevImage,
  handleNextImage,
  handleTouchStart,
  handleTouchMove,
  handleTouchEndArrivals,
  setArrivalsDirection,
  setArrivalsPage,
  setQuickViewProduct,
  loadData,
  getProductImages
}: ArrivalsSectionProps) {
  return (
    <section className={styles.arrivalsSection}>
      <div className={styles.arrivalsHeader}>
        <h2 className={styles.arrivalsTitle}>LATEST ARRIVALS</h2>
        <Link href="/collections?category=arrivals" className={styles.viewAllLink}>VIEW ALL</Link>
      </div>
      <div
        key={`arrivals-${arrivalsPage}`}
        className={`${(arrivals.length > 0 || isStorefrontLoading) ? styles.arrivalsGrid : styles.emptyStateGrid} ${styles.slideAnimated} ${arrivalsDirection === "forward" ? styles.slideForward : styles.slideBackward}`}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchMove={isMobile ? handleTouchMove : undefined}
        onTouchEnd={isMobile ? handleTouchEndArrivals : undefined}
      >
        {arrivals.length > 0 ? (
          displayedArrivals.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              onClick={(e) => {
                if (product.quantity === 0) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                cursor: product.quantity === 0 ? "not-allowed" : "pointer"
              }}
            >
              <div 
                className={styles.productCard} 
                style={product.quantity === 0 ? { pointerEvents: "none" } : {}}
                onMouseEnter={() => {
                  if (product.quantity === 0) return;
                  setHoveredProductId(product._id);
                  const imgs = getProductImages(product);
                  if (imgs.length > 1 && (activeImageIndexes[product._id] === undefined || activeImageIndexes[product._id] === 0)) {
                    setActiveImageIndexes(prev => ({ ...prev, [product._id]: 1 }));
                  }
                }}
                onMouseLeave={() => {
                  if (product.quantity === 0) return;
                  setHoveredProductId(null);
                  setActiveImageIndexes(prev => ({ ...prev, [product._id]: 0 }));
                }}
              >
                <div className={styles.productImageContainer} style={product.quantity === 0 ? { filter: "grayscale(1)", opacity: 0.7 } : {}}>
                  {(() => {
                    const cats = Array.isArray(product.category)
                      ? product.category.map((c: any) => String(c).toLowerCase().trim())
                      : [String(product.category || '').toLowerCase().trim()];
                    const isBestSeller = cats.some((c: string) => c.includes("best seller") || c.includes("bestseller"));
                    const isLatest = !isBestSeller && cats.some((c: string) => c.includes("latest") || c.includes("new arrival"));
                    if (isBestSeller || isLatest) {
                      return (
                        <span 
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            backgroundColor: isBestSeller ? "#000000" : "#111827",
                            color: "#ffffff",
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            padding: "4px 8px",
                            borderRadius: "2px",
                            zIndex: 8,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                            pointerEvents: "none",
                            textTransform: "uppercase"
                          }}
                        >
                          {isBestSeller ? "BEST SELLER" : "LATEST ARRIVAL"}
                        </span>
                      );
                    }
                    return null;
                  })()}
                  {(() => {
                    const imagesList = getProductImages(product);
                    const activeIdx = activeImageIndexes[product._id] ?? 0;
                    const isHovered = hoveredProductId === product._id;

                    return (
                      <>
                        {imagesList.map((imgUrl: string, idx: number) => {
                          const isVisible = isHovered && imagesList.length > 1 
                            ? idx === activeIdx 
                            : idx === 0;

                          return (
                            <Image 
                              key={`${product._id}_img_${idx}`}
                              className={styles.productImage} 
                              src={imgUrl} 
                              alt={product.name || "Product image"}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                              priority={idx === 0}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                opacity: isVisible ? 1 : 0,
                                transform: isHovered ? "scale(1.04)" : "scale(1.00)",
                                transition: "opacity 0.5s ease-in-out, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                                pointerEvents: "none"
                              }}
                            />
                          );
                        })}
                      </>
                    );
                  })()}

                  {/* Arrow controls */}
                  {(() => {
                    const imagesList = getProductImages(product);
                    if (imagesList.length > 1) {
                      return (
                        <>
                          <button
                            aria-label="Previous image"
                            className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
                            onClick={(e) => handlePrevImage(e, product)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.arrowIcon}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                          </button>
                          <button
                            aria-label="Next image"
                            className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
                            onClick={(e) => handleNextImage(e, product)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.arrowIcon}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </button>
                        </>
                      );
                    }
                    return null;
                  })()}

                  <button
                    aria-label="Add to cart"
                    className={styles.addToCartCircle}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(product); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={styles.cartIcon}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </button>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  {(() => {
                    const inStockVariants = product.variants ? product.variants.filter((v: any) => (Number(v.quantity) || 0) > 0) : [];
                    const cheapestVariant = inStockVariants.length > 0
                      ? [...inStockVariants].sort((a, b) => a.price - b.price)[0]
                      : (product.variants && product.variants.length > 0 ? [...product.variants].sort((a, b) => a.price - b.price)[0] : null);

                    const displayPrice = cheapestVariant ? cheapestVariant.price : product.price;
                    const displayStrikePrice = cheapestVariant ? cheapestVariant.strikePrice : product.strikePrice;

                    return (
                      <p className={styles.productPrice}>
                        {displayStrikePrice && displayStrikePrice > displayPrice && (
                          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ color: "#ef4444", fontSize: "0.75em", fontWeight: 400 }}>
                                -{Math.round(((displayStrikePrice - displayPrice) / displayStrikePrice) * 100)}%
                              </span>
                              <span style={{ fontSize: "1.5em", fontWeight: 400, color: "#111" }}>
                                ₹ {displayPrice.toLocaleString("en-IN")}.00
                              </span>
                            </span>
                            <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                              M.R.P: <del>₹ {displayStrikePrice.toLocaleString("en-IN")}.00</del>
                            </span>
                          </span>
                        )}
                        {(!displayStrikePrice || displayStrikePrice <= displayPrice) && (
                          <span style={{ fontSize: "1.5em", fontWeight: 400, color: "#111" }}>
                            ₹ {displayPrice.toLocaleString("en-IN")}.00
                          </span>
                        )}
                      </p>
                    );
                  })()}
                  {product.quantity !== undefined && product.quantity <= 5 && (
                    <p style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 700, marginTop: "4px", letterSpacing: "0.02em" }}>
                      {product.quantity === 0 ? "OUT OF STOCK" : `ONLY ${product.quantity} LEFT`}
                    </p>
                  )}
                  {isMobile && (
                    <span
                      className={styles.productAddToBag}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                    >
                      ADD TO BAG
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : isStorefrontLoading ? (
          Array.from({ length: isMobile ? 2 : 4 }).map((_, idx) => (
            <div key={`arrival_skel_${idx}`} className={styles.productCard}>
              <div className="skeleton-shimmer" style={{ width: "100%", aspectRatio: isMobile ? "4/5" : "1/1", borderRadius: "4px" }} />
              <div className={styles.productInfo} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                <div className="skeleton-shimmer" style={{ width: "75%", height: "16px", borderRadius: "4px" }} />
                <div className="skeleton-shimmer" style={{ width: "40%", height: "18px", borderRadius: "4px" }} />
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyStateContainer}>
            {isStorefrontError ? (
              <div style={{ padding: "30px 15px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <p style={{ margin: 0, color: "#dc2626", fontWeight: 600, fontSize: "0.95rem" }}>
                  Failed to load latest arrivals from server ({storefrontErrorMessage})
                </p>
                <button
                  onClick={() => loadData()}
                  disabled={isStorefrontLoading}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#111827",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: isStorefrontLoading ? "not-allowed" : "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em"
                  }}
                >
                  {isStorefrontLoading ? "Retrying..." : "Retry Connection"}
                </button>
              </div>
            ) : (
              <p>Our latest arrivals are currently being prepared. Check back soon!</p>
            )}
          </div>
        )}
      </div>
      {isMobile && totalArrivalsPages > 1 && (
        <div className={styles.mobilePagination}>
          <button
            className={styles.paginationBtn}
            onClick={() => {
              setArrivalsDirection("backward");
              setArrivalsPage(p => Math.max(1, p - 1));
            }}
            disabled={arrivalsPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span>{arrivalsPage} / {totalArrivalsPages}</span>
          <button
            className={styles.paginationBtn}
            onClick={() => {
              setArrivalsDirection("forward");
              setArrivalsPage(p => Math.min(totalArrivalsPages, p + 1));
            }}
            disabled={arrivalsPage === totalArrivalsPages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
