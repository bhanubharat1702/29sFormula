"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/page.module.css";
import { getRecentlyViewed, RecentlyViewedProduct } from "@/utils/recentlyViewed";

interface RecentlyViewedSectionProps {
  setQuickViewProduct: (product: any) => void;
  isMobile?: boolean;
}

export default function RecentlyViewedSection({
  setQuickViewProduct,
  isMobile = false,
}: RecentlyViewedSectionProps) {
  const [items, setItems] = useState<RecentlyViewedProduct[]>([]);
  const [activeImageIndexes, setActiveImageIndexes] = useState<{ [productId: string]: number }>({});
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  const loadItems = () => {
    const list = getRecentlyViewed();
    setItems(list);
  };

  useEffect(() => {
    loadItems();
    window.addEventListener("recentlyViewedUpdated", loadItems);
    window.addEventListener("storage", loadItems);
    return () => {
      window.removeEventListener("recentlyViewedUpdated", loadItems);
      window.removeEventListener("storage", loadItems);
    };
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  const getProductImages = (product: RecentlyViewedProduct): string[] => {
    const list: string[] = [];
    if (product.imageFront) list.push(product.imageFront);
    if (Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (product.imageBack && !list.includes(product.imageBack)) {
      list.push(product.imageBack);
    }
    return list.length > 0 ? list : ["/placeholder.png"];
  };

  const handlePrevImage = (e: React.MouseEvent, product: RecentlyViewedProduct) => {
    e.preventDefault();
    e.stopPropagation();
    const imgs = getProductImages(product);
    if (imgs.length <= 1) return;
    setActiveImageIndexes((prev) => {
      const current = prev[product._id] ?? 0;
      const next = current === 0 ? imgs.length - 1 : current - 1;
      return { ...prev, [product._id]: next };
    });
  };

  const handleNextImage = (e: React.MouseEvent, product: RecentlyViewedProduct) => {
    e.preventDefault();
    e.stopPropagation();
    const imgs = getProductImages(product);
    if (imgs.length <= 1) return;
    setActiveImageIndexes((prev) => {
      const current = prev[product._id] ?? 0;
      const next = current === imgs.length - 1 ? 0 : current + 1;
      return { ...prev, [product._id]: next };
    });
  };

  return (
    <section className={styles.arrivalsSection} style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "40px" }}>
      <div className={styles.arrivalsHeader}>
        <h2 className={styles.arrivalsTitle}>RECENTLY VIEWED ITEMS</h2>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em" }}>
          {items.length} {items.length === 1 ? "ITEM" : "ITEMS"}
        </span>
      </div>

      <div className={styles.arrivalsGrid}>
        {items.map((product) => {
          const imagesList = getProductImages(product);
          const activeIdx = activeImageIndexes[product._id] ?? 0;
          const isHovered = hoveredProductId === product._id;
          const isOutOfStock = product.quantity === 0;

          const cats = Array.isArray(product.category)
            ? product.category.map((c: any) => String(c).toLowerCase().trim())
            : [String(product.category || "").toLowerCase().trim()];
          const isBestSeller = cats.some((c: string) => c.includes("best seller") || c.includes("bestseller"));
          const isLatest = !isBestSeller && cats.some((c: string) => c.includes("latest") || c.includes("new arrival"));

          const inStockVariants = product.variants ? product.variants.filter((v: any) => (Number(v.quantity) || 0) > 0) : [];
          const cheapestVariant = inStockVariants.length > 0
            ? [...inStockVariants].sort((a, b) => a.price - b.price)[0]
            : (product.variants && product.variants.length > 0 ? [...product.variants].sort((a, b) => a.price - b.price)[0] : null);

          const displayPrice = cheapestVariant ? cheapestVariant.price : product.price;
          const displayStrikePrice = cheapestVariant ? cheapestVariant.strikePrice : product.strikePrice;

          return (
            <Link
              key={`recently_viewed_${product._id}`}
              href={`/product/${product._id}`}
              onClick={(e) => {
                if (isOutOfStock) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
            >
              <div
                className={styles.productCard}
                style={isOutOfStock ? { pointerEvents: "none" } : {}}
                onMouseEnter={() => {
                  if (isOutOfStock) return;
                  setHoveredProductId(product._id);
                  if (imagesList.length > 1 && (activeImageIndexes[product._id] === undefined || activeImageIndexes[product._id] === 0)) {
                    setActiveImageIndexes((prev) => ({ ...prev, [product._id]: 1 }));
                  }
                }}
                onMouseLeave={() => {
                  if (isOutOfStock) return;
                  setHoveredProductId(null);
                  setActiveImageIndexes((prev) => ({ ...prev, [product._id]: 0 }));
                }}
              >
                <div className={styles.productImageContainer} style={isOutOfStock ? { filter: "grayscale(1)", opacity: 0.7 } : {}}>
                  {(isBestSeller || isLatest) && (
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
                        textTransform: "uppercase",
                      }}
                    >
                      {isBestSeller ? "BEST SELLER" : "LATEST ARRIVAL"}
                    </span>
                  )}

                  {imagesList.map((imgUrl: string, idx: number) => {
                    const isVisible = isHovered && imagesList.length > 1 ? idx === activeIdx : idx === 0;

                    return (
                      <Image
                        key={`${product._id}_recent_img_${idx}`}
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
                          pointerEvents: "none",
                        }}
                      />
                    );
                  })}

                  {imagesList.length > 1 && (
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
                  )}

                  <button
                    aria-label="Add to cart"
                    className={styles.addToCartCircle}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={styles.cartIcon}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </button>
                </div>

                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <p className={styles.productPrice}>
                    {displayStrikePrice && displayStrikePrice > displayPrice ? (
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
                    ) : (
                      <span style={{ fontSize: "1.5em", fontWeight: 400, color: "#111" }}>
                        ₹ {displayPrice.toLocaleString("en-IN")}.00
                      </span>
                    )}
                  </p>
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
          );
        })}
      </div>
    </section>
  );
}
