'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import NewtonsCradleLoader from "@/components/NewtonsCradleLoader";
import { StorefrontGridSkeleton } from "@/components/Skeletons/Skeletons";
import QuickViewDrawer from "@/components/QuickViewDrawer";
import { useCart } from "@/context/CartContext";
import { saveCart, clearCart, fetchAndSyncUserCart } from "@/utils/cartSync";

interface Variant {
  size: string;
  quantity: number;
  price: number;
  strikePrice?: number;
  category: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  strikePrice?: number;
  quantity?: number;
  category: string | string[];
  imageFront: string;
  imageBack?: string;
  images?: string[];
  sizes?: string[];
  variants?: Variant[];
}

const defaultProducts: Product[] = [];

function CollectionsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("#57bc74");

  // Filtering & Sorting State
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "in-stock" | "out-of-stock">("all");
  const [priceRange, setPriceRange] = useState<"all" | "under-1500" | "1500-2000" | "over-2000">("all");
  const [sortBy, setSortBy] = useState<"featured" | "low-to-high" | "high-to-low" | "a-z" | "z-a">("featured");
  const [viewLayout, setViewLayout] = useState<"grid" | "list">("grid");

  // Dropdown visibility state
  const [activeDropdown, setActiveDropdown] = useState<"category" | "availability" | "price" | "sort" | null>(null);

  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>("");
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);

  // Image slider indexes per product
  const [activeImageIndexes, setActiveImageIndexes] = useState<{ [productId: string]: number }>({});
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  // Global Cart Context
  const {
    cartItems,
    showCartDrawer,
    setShowCartDrawer,
    cartError,
    addToCart,
    updateQuantity
  } = useCart();

  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
  const [isFilterClosing, setIsFilterClosing] = useState<boolean>(false);

  const handleCloseFilter = () => {
    setIsFilterClosing(true);
    setTimeout(() => {
      setShowMobileFilter(false);
      setIsFilterClosing(false);
    }, 300);
  };

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (showCartDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCartDrawer]);

  const initiateCheckout = () => {
    setShowCheckoutDrawer(true);
  };

  const getProductImages = (product: Product) => {
    const list: string[] = [];
    if (product.imageFront) list.push(product.imageFront);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    if (product.imageBack && !list.includes(product.imageBack)) {
      list.push(product.imageBack);
    }
    return list.length > 0 ? list : [product.imageFront || ''];
  };

  const handlePrevImage = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const imagesList = getProductImages(product);
    if (imagesList.length <= 1) return;
    
    const currentIndex = activeImageIndexes[product._id] ?? 0;
    const nextIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
    setActiveImageIndexes(prev => ({ ...prev, [product._id]: nextIndex }));
  };

  const handleNextImage = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const imagesList = getProductImages(product);
    if (imagesList.length <= 1) return;
    
    const currentIndex = activeImageIndexes[product._id] ?? 0;
    const nextIndex = (currentIndex + 1) % imagesList.length;
    setActiveImageIndexes(prev => ({ ...prev, [product._id]: nextIndex }));
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    // Check search query parameters for category pre-filtering or text search
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        const catLower = cat.toLowerCase().trim();
        if (catLower === "bestsellers" || catLower === "best seller" || catLower === "best sellers" || catLower === "bestseller") {
          setCategoryFilter("Best Seller");
        } else if (catLower === "arrivals" || catLower === "latest arrivals" || catLower === "latest arrival" || catLower === "new arrivals") {
          setCategoryFilter("Latest Arrivals");
        } else {
          setCategoryFilter(cat);
        }
      }
      const searchParam = params.get("search");
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }

    // Load cached products list to avoid slow loading layout shifts
    try {
      const cachedProducts = localStorage.getItem("storefront_products");
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
        setLoading(false);
      }
    } catch (e) {}

    // Fetch shop data
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/storefront/shop`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch shop data");
        return res.json();
      })
      .then(data => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          localStorage.setItem("storefront_products", JSON.stringify(data.products));
        } else {
          setProducts(defaultProducts);
        }
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.primaryColor) {
            setPrimaryColor(data.settings.primaryColor);
            if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.settings.primaryColor);
          }
        }
      })
      .catch(err => {
        console.warn("Quietly catching shop data fetch error:", err.message || err);
        setProducts(defaultProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleDropdown = (dropdown: "category" | "availability" | "price" | "sort") => {
    setActiveDropdown(prev => (prev === dropdown ? null : dropdown));
  };

  const getProductStock = (product: Product): number => {
    if (!product) return 0;
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const variantStock = product.variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
      if (variantStock > 0 || product.quantity === undefined || product.quantity === null) {
        return variantStock;
      }
    }
    if (Array.isArray((product as any).options) && (product as any).options.length > 0) {
      const optionStock = (product as any).options.reduce((sum: number, o: any) => sum + (Number(o.quantity) || 0), 0);
      if (optionStock > 0) return optionStock;
    }
    return Number(product.quantity) || 0;
  };

  // Available Category Options
  const categoryOptions = React.useMemo(() => {
    const set = new Set<string>(["All", "Latest Arrivals", "Best Seller"]);
    products.forEach(p => {
      const cats = Array.isArray(p.category) ? p.category : [p.category || ""];
      cats.forEach(c => {
        const trimmed = c.trim();
        if (trimmed && trimmed !== "All") set.add(trimmed);
      });
    });
    return Array.from(set);
  }, [products]);

  // Filter logic
  const filteredProducts = products.filter(product => {
    // Category match
    let matchesCategory = categoryFilter === "All";
    if (!matchesCategory) {
      const prodCats = Array.isArray(product.category)
        ? product.category.map(c => String(c).toLowerCase().trim())
        : [String(product.category || '').toLowerCase().trim()];
      
      const filterLower = categoryFilter.toLowerCase().trim();

      if (filterLower === "latest arrivals" || filterLower === "arrivals" || filterLower === "latest arrival") {
        matchesCategory = prodCats.some(c => c.includes("latest") || c.includes("arrival") || c === "arrivals");
      } else if (filterLower === "best seller" || filterLower === "bestsellers" || filterLower === "best sellers") {
        matchesCategory = prodCats.some(c => c.includes("best") || c.includes("seller") || c === "bestsellers");
      } else {
        matchesCategory = prodCats.some(c => c === filterLower || c.includes(filterLower));
      }
    }

    // Text search match
    const categoryString = Array.isArray(product.category) ? product.category.join(", ") : (product.category || "");
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryString.toLowerCase().includes(searchQuery.toLowerCase());

    // Availability match
    const stock = getProductStock(product);
    const matchesAvailability =
      availabilityFilter === "in-stock" || inStockOnly
        ? stock > 0
        : availabilityFilter === "out-of-stock"
        ? stock <= 0
        : true;

    // Price range match
    let matchesPrice = true;
    if (priceRange === "under-1500") matchesPrice = product.price < 1500;
    else if (priceRange === "1500-2000") matchesPrice = product.price >= 1500 && product.price <= 2000;
    else if (priceRange === "over-2000") matchesPrice = product.price > 2000;

    return matchesCategory && matchesSearch && matchesAvailability && matchesPrice;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-to-high") return a.price - b.price;
    if (sortBy === "high-to-low") return b.price - a.price;
    if (sortBy === "a-z") return a.name.localeCompare(b.name);
    if (sortBy === "z-a") return b.name.localeCompare(a.name);
    return 0; // featured
  });

  const activeFilterCount = [
    categoryFilter !== "All",
    availabilityFilter !== "all" || inStockOnly,
    priceRange !== "all",
    sortBy !== "featured"
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setCategoryFilter("All");
    setSortBy("featured");
    setPriceRange("all");
    setAvailabilityFilter("all");
    setInStockOnly(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("category");
      url.searchParams.delete("search");
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div suppressHydrationWarning className={styles.page}>
      {/* 1. Header Navigation */}
      <Navbar onCartClick={() => setShowCartDrawer(true)} />

      {/* Main Container */}
      <main className={styles.mainContent}>


        {/* 2. Advanced Filters and Sort Bar */}
        <div className={styles.filtersBar}>
          <div className={styles.filtersLeft}>
            <div className={styles.layoutToggles}>
              {/* Grid Toggle */}
              <button 
                aria-label="Grid view"
                className={`${styles.layoutBtn} ${viewLayout === "grid" ? styles.activeLayoutBtn : ""}`}
                onClick={() => setViewLayout("grid")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="8" height="8" rx="1" />
                  <rect x="14" y="2" width="8" height="8" rx="1" />
                  <rect x="2" y="14" width="8" height="8" rx="1" />
                  <rect x="14" y="14" width="8" height="8" rx="1" />
                </svg>
              </button>
              {/* Dense Grid Toggle */}
              <button 
                aria-label="Dense Grid view"
                className={`${styles.layoutBtn} ${viewLayout === "list" ? styles.activeLayoutBtn : ""}`}
                onClick={() => setViewLayout("list")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="3" width="5" height="7" rx="1" />
                  <rect x="9" y="3" width="5" height="7" rx="1" />
                  <rect x="16" y="3" width="5" height="7" rx="1" />
                  <rect x="2" y="14" width="5" height="7" rx="1" />
                  <rect x="9" y="14" width="5" height="7" rx="1" />
                  <rect x="16" y="14" width="5" height="7" rx="1" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.filtersRight}>
            <span className={styles.itemCount}>{sortedProducts.length} ITEMS</span>
            {/* Filter & Sort Drawer Trigger */}
            <button 
              className={styles.mobileFilterBtn}
              onClick={() => setShowMobileFilter(true)}
            >
              FILTER & SORT
              {activeFilterCount > 0 && (
                <span className={styles.filterCountBadge}>{activeFilterCount}</span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </button>
          </div>
        </div>





        {/* 3. Catalog Products Grid */}
        {loading ? (
          <StorefrontGridSkeleton count={8} />
        ) : sortedProducts.length > 0 ? (
          <div className={viewLayout === "grid" ? styles.productsGrid : styles.productsList}>
            {sortedProducts.map((product) => {
              return (
                <div 
                  key={product._id} 
                  className={styles.productCard}
                  style={{
                    cursor: getProductStock(product) === 0 ? "not-allowed" : "pointer"
                  }}
                  onMouseEnter={() => {
                    if (getProductStock(product) === 0) return;
                    setHoveredProductId(product._id);
                    const imgs = getProductImages(product);
                    if (imgs.length > 1 && (activeImageIndexes[product._id] === undefined || activeImageIndexes[product._id] === 0)) {
                      setActiveImageIndexes(prev => ({ ...prev, [product._id]: 1 }));
                    }
                  }}
                  onMouseLeave={() => {
                    if (getProductStock(product) === 0) return;
                    setHoveredProductId(null);
                    setActiveImageIndexes(prev => ({ ...prev, [product._id]: 0 }));
                  }}
                >
                  <div className={styles.productImageContainer} style={getProductStock(product) === 0 ? { pointerEvents: "none", filter: "grayscale(1)", opacity: 0.7 } : {}}>
                    {(() => {
                      const cats = Array.isArray(product.category)
                        ? product.category.map(c => String(c).toLowerCase().trim())
                        : [String(product.category || '').toLowerCase().trim()];
                      const isBestSeller = cats.some(c => c.includes("best seller") || c.includes("bestseller"));
                      const isLatest = !isBestSeller && cats.some(c => c.includes("latest") || c.includes("new arrival"));
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
                    <Link 
                      href={`/product/${product._id}`} 
                      style={{ textDecoration: "none", color: "inherit", position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: getProductStock(product) === 0 ? "none" : "auto" }}
                    >
                      {(() => {
                        const imagesList = getProductImages(product);
                        const activeIdx = activeImageIndexes[product._id] ?? 0;
                        const isHovered = hoveredProductId === product._id;

                        return (
                          <>
                            {imagesList.map((imgUrl, idx) => {
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
                    </Link>

                    {/* Arrow controls (shown on hover if multiple images exist) */}
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
                              ←
                            </button>
                            <button 
                              aria-label="Next image" 
                              className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
                              onClick={(e) => handleNextImage(e, product)}
                            >
                              →
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

                  <div className={styles.productInfo} style={getProductStock(product) === 0 ? { pointerEvents: "none" } : {}}>
                    <Link href={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit", pointerEvents: getProductStock(product) === 0 ? "none" : "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <h3 className={styles.productTitle}>{product.name.toUpperCase()}</h3>
                      {(() => {
                        const inStockVariants = product.variants ? product.variants.filter(v => (Number(v.quantity) || 0) > 0) : [];
                        const cheapestVariant = inStockVariants.length > 0
                          ? [...inStockVariants].sort((a, b) => a.price - b.price)[0]
                          : (product.variants && product.variants.length > 0 ? [...product.variants].sort((a, b) => a.price - b.price)[0] : null);

                        const displayPrice = cheapestVariant ? cheapestVariant.price : product.price;
                        const displayStrikePrice = cheapestVariant ? cheapestVariant.strikePrice : (product as any).strikePrice;

                        const availableSizes = product.variants && product.variants.length > 0
                          ? product.variants.filter(v => (Number(v.quantity) || 0) > 0).map(v => v.size)
                          : (Number(product.quantity || 0) > 0 ? ((product as any).sizes || []) : []);

                        return (
                          <>
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
                            {availableSizes.length > 0 && (
                              <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "4px" }}>
                                Available in: {availableSizes.join(", ")}
                              </p>
                            )}
                            {(() => {
                              const stock = getProductStock(product);
                              if (stock <= 5) {
                                return (
                                  <p style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 700, marginTop: "4px", letterSpacing: "0.02em" }}>
                                    {stock === 0 ? "OUT OF STOCK" : `ONLY ${stock} LEFT`}
                                  </p>
                                );
                              }
                              return null;
                            })()}
                          </>
                        );
                      })()}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyStateContainer}>
            <p>No matching fragrances cataloged at the moment. Try a different category or query.</p>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <Footer />

      {/* Cart Slider Drawer Overlay */}
      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onCheckout={initiateCheckout}
        cartError={cartError}
      />
      
      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className={`${styles.mobileFilterOverlay} ${isFilterClosing ? styles.mobileFilterOverlayClosing : ""}`} onClick={handleCloseFilter}>
          <div className={`${styles.mobileFilterDrawer} ${isFilterClosing ? styles.mobileFilterDrawerClosing : ""}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileFilterHeader}>
              <h2 className={styles.mobileFilterTitle}>FILTER & SORT</h2>
              <button className={styles.closeCartBtn} onClick={handleCloseFilter}>✕</button>
            </div>
            <div className={styles.mobileFilterBody}>
              <div className={styles.mobileFilterGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h3 className={styles.mobileFilterGroupTitle} style={{ margin: 0 }}>CATEGORY</h3>
                  {categoryFilter !== "All" && (
                    <button 
                      onClick={() => {
                        setCategoryFilter("All");
                        if (typeof window !== "undefined") {
                          const url = new URL(window.location.href);
                          url.searchParams.delete("category");
                          window.history.replaceState({}, "", url.toString());
                        }
                      }}
                      style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className={styles.mobileFilterOptions}>
                  {categoryOptions.map((cat) => (
                    <label key={cat} className={styles.radioLabel}>
                      <input 
                        type="radio" 
                        name="mobileCategory" 
                        checked={categoryFilter === cat}
                        onChange={() => {
                          setCategoryFilter(cat);
                          if (typeof window !== "undefined") {
                            const url = new URL(window.location.href);
                            if (cat === "All") url.searchParams.delete("category");
                            else url.searchParams.set("category", cat === "Latest Arrivals" ? "arrivals" : cat === "Best Seller" ? "bestsellers" : cat);
                            window.history.replaceState({}, "", url.toString());
                          }
                        }}
                      />
                      {cat === "All" ? "All Categories" : cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.mobileFilterGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h3 className={styles.mobileFilterGroupTitle} style={{ margin: 0 }}>SORT BY</h3>
                  {sortBy !== "featured" && (
                    <button 
                      onClick={() => setSortBy("featured")}
                      style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className={styles.mobileFilterOptions}>
                  {[
                    { val: "featured", label: "Featured" },
                    { val: "low-to-high", label: "Price: Low to High" },
                    { val: "high-to-low", label: "Price: High to Low" },
                    { val: "a-z", label: "Alphabetically: A-Z" },
                    { val: "z-a", label: "Alphabetically: Z-A" }
                  ].map((sortOpt) => (
                    <label key={sortOpt.val} className={styles.radioLabel}>
                      <input 
                        type="radio" 
                        name="mobileSort" 
                        checked={sortBy === sortOpt.val}
                        onChange={() => setSortBy(sortOpt.val as any)}
                      />
                      {sortOpt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.mobileFilterGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h3 className={styles.mobileFilterGroupTitle} style={{ margin: 0 }}>PRICE</h3>
                  {priceRange !== "all" && (
                    <button 
                      onClick={() => setPriceRange("all")}
                      style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className={styles.mobileFilterOptions}>
                  {[
                    { val: "all", label: "All Prices" },
                    { val: "under-1500", label: "Under Rs. 1,500" },
                    { val: "1500-2000", label: "Rs. 1,500 - Rs. 2,000" },
                    { val: "over-2000", label: "Over Rs. 2,000" }
                  ].map((pr) => (
                    <label key={pr.val} className={styles.radioLabel}>
                      <input 
                        type="radio" 
                        name="mobilePrice" 
                        checked={priceRange === pr.val}
                        onChange={() => setPriceRange(pr.val as any)}
                      />
                      {pr.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.mobileFilterGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h3 className={styles.mobileFilterGroupTitle} style={{ margin: 0 }}>AVAILABILITY</h3>
                  {(availabilityFilter !== "all" || inStockOnly) && (
                    <button 
                      onClick={() => { setAvailabilityFilter("all"); setInStockOnly(false); }}
                      style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="mobileAvailability" 
                      checked={availabilityFilter === "all" && !inStockOnly} 
                      onChange={() => { setAvailabilityFilter("all"); setInStockOnly(false); }} 
                    />
                    All Products
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="mobileAvailability" 
                      checked={availabilityFilter === "in-stock" || inStockOnly} 
                      onChange={() => { setAvailabilityFilter("in-stock"); setInStockOnly(true); }} 
                    />
                    In Stock
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="mobileAvailability" 
                      checked={availabilityFilter === "out-of-stock"} 
                      onChange={() => { setAvailabilityFilter("out-of-stock"); setInStockOnly(false); }} 
                    />
                    Out of Stock
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.mobileFilterFooter} style={{ display: "flex", gap: "10px" }}>
              {activeFilterCount > 0 && (
                <button 
                  onClick={resetAllFilters}
                  style={{
                    flex: 1,
                    padding: "15px",
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    border: "1px solid #e2e8f0",
                    fontWeight: 700,
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    letterSpacing: "0.05em"
                  }}
                >
                  CLEAR ALL
                </button>
              )}
              <button className={styles.applyFilterBtn} style={{ flex: 2 }} onClick={handleCloseFilter}>
                APPLY ({sortedProducts.length} ITEMS)
              </button>
            </div>
          </div>
        </div>
      )}

      <CheckoutDrawer
        isOpen={showCheckoutDrawer}
        onClose={() => setShowCheckoutDrawer(false)}
        cartItems={cartItems}
        primaryColor="#d0d0d0"
        onOrderSuccess={(orderId: string, orderDetails: any) => {
          clearCart();
          setShowCheckoutDrawer(false);
          setCompletedOrderId(orderId);
          setCompletedOrderDetails(orderDetails);
          setShowSuccessModal(true);
        }}
      />
      <OrderSuccessModal
        isOpen={showSuccessModal}
        orderId={completedOrderId}
        orderDetails={completedOrderDetails}
        onClose={() => setShowSuccessModal(false)}
        primaryColor="#d0d0d0"
      />
      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(prod, size, qty) => addToCart(prod, size, qty)}
      />
    </div>
  );
}

export default function Collections() {
  return (
    <Suspense fallback={<NewtonsCradleLoader fullScreen={true} />}>
      <CollectionsContent />
    </Suspense>
  );
}