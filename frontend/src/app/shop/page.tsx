'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Footer from "@/components/Footer";

import Navbar from "@/components/Navbar/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import NewtonsCradleLoader from "@/components/NewtonsCradleLoader";
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
  quantity?: number;
  category: string | string[];
  imageFront: string;
  imageBack?: string;
  images?: string[];
  sizes?: string[];
  variants?: Variant[];
}

const defaultProducts: Product[] = [];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>(
    "#57bc74"
  );

  // Filtering & Sorting State
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<"all" | "under-1500" | "1500-2000" | "over-2000">("all");
  const [sortBy, setSortBy] = useState<"featured" | "low-to-high" | "high-to-low" | "a-z" | "z-a">("featured");
  const [viewLayout, setViewLayout] = useState<"grid" | "list">("grid");

  // Dropdown visibility state
  const [activeDropdown, setActiveDropdown] = useState<"availability" | "price" | "sort" | null>(null);

  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>("");
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);

  // Swatches mock highlights per product
  const [activeSwatches, setActiveSwatches] = useState<{ [productId: string]: number }>({});

  // Image slider indexes per product
  const [activeImageIndexes, setActiveImageIndexes] = useState<{ [productId: string]: number }>({});

  // Cart Drawer State
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
  const [isFilterClosing, setIsFilterClosing] = useState<boolean>(false);

  const handleCloseFilter = () => {
    setIsFilterClosing(true);
    setTimeout(() => {
      setShowMobileFilter(false);
      setIsFilterClosing(false);
    }, 800);
  };

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartError, setCartError] = useState<string | null>(null);

  const showCartError = (msg: string) => {
    setCartError(msg);
    setTimeout(() => setCartError(null), 3000);
  };

  const [isCartClosing, setIsCartClosing] = useState<boolean>(false);

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


  const handleCloseCart = () => {
    setIsCartClosing(true);
    setTimeout(() => {
      setShowCartDrawer(false);
      setIsCartClosing(false);
    }, 300);
  };

  const initiateCheckout = () => {
    setShowCheckoutDrawer(true);
  };

  const loadCart = () => {
    if (typeof window !== "undefined") {
      const items = localStorage.getItem("cart");
      if (items) {
        try {
          setCartItems(JSON.parse(items));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    loadCart();
    fetchAndSyncUserCart();
    const handleStorageChange = () => loadCart();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  const addToCart = (product: Product, size: string = "50ml") => {
    if (typeof window !== "undefined") {
      const current = localStorage.getItem("cart");
      let itemsList = [];
      if (current) {
        try {
          itemsList = JSON.parse(current);
        } catch (e) {}
      }
      
      const maxStock = ((product as any).variants && (product as any).variants.find((v: any) => v.size === size)?.quantity) ?? product.quantity;

      const existingIdx = itemsList.findIndex((item: any) => item._id === product._id && item.size === size);
      if (existingIdx > -1) {
        if (itemsList[existingIdx].quantity + 1 > maxStock) {
          showCartError(`Only ${maxStock} units of ${product.name} (${size}) are available in stock.`);
          itemsList[existingIdx].quantity = maxStock;
          setShowCartDrawer(true);
        } else {
          itemsList[existingIdx].quantity += 1;
        }
      } else {
        const variantPrice = ((product as any).options && (product as any).options.find((o: any) => o.size === size)?.price) 
                          || ((product as any).variants && (product as any).variants.find((v: any) => v.size === size)?.price)
                          || product.price;
        const variantStrikePrice = ((product as any).options && (product as any).options.find((o: any) => o.size === size)?.strikePrice) 
                          || ((product as any).variants && (product as any).variants.find((v: any) => v.size === size)?.strikePrice)
                          || (product as any).strikePrice;

        let qtyToPush = 1;
        if (1 > maxStock) {
          showCartError(`Only ${maxStock} units of ${product.name} (${size}) are available in stock.`);
          qtyToPush = maxStock;
          setShowCartDrawer(true);
        }

        itemsList.push({
          _id: product._id,
          name: product.name,
          price: variantPrice,
          strikePrice: variantStrikePrice,
          imageFront: product.imageFront,
          size: size,
          quantity: qtyToPush,
          maxStock: maxStock
        });
      }
      saveCart(itemsList);
      setShowCartDrawer(true);
    }
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      const updated = cartItems.filter((_, idx) => idx !== index);
      setCartItems(updated);
      saveCart(updated);
    } else {
      const item = cartItems[index];
      if (item.maxStock !== undefined && newQty > item.maxStock) {
        showCartError(`Only ${item.maxStock} units of ${item.name} (${item.size}) are available in stock.`);
        const updated = [...cartItems];
        updated[index].quantity = item.maxStock;
        setCartItems(updated);
        saveCart(updated);
        setShowCartDrawer(true);
        return;
      }
      const updated = [...cartItems];
      updated[index].quantity = newQty;
      setCartItems(updated);
      saveCart(updated);
    }
  };

  const getProductImages = (product: Product) => {
    const list = [product.imageFront];
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img && img !== product.imageFront) {
          list.push(img);
        }
      });
    } else if (product.imageBack && product.imageBack !== product.imageFront) {
      list.push(product.imageBack);
    }
    return list;
  };

  const handlePrevImage = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const imagesList = getProductImages(product);
    
    const currentIndex = activeImageIndexes[product._id] || 0;
    const nextIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
    setActiveImageIndexes(prev => ({ ...prev, [product._id]: nextIndex }));
  };

  const handleNextImage = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const imagesList = getProductImages(product);
    
    const currentIndex = activeImageIndexes[product._id] || 0;
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
    // Check search query parameters for category pre-filtering
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat === "bestsellers") {
        setCategoryFilter("Best Seller");
      } else if (cat === "arrivals") {
        setCategoryFilter("Latest Arrivals");
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
          }
        }
      })
      .catch(err => {
        console.warn("Quietly catching shop data fetch error:", err.message || err);
        setProducts(defaultProducts);
      })
      .finally(() => setLoading(false));

    // Session is now handled by Navbar
  }, []);

  const toggleDropdown = (dropdown: "availability" | "price" | "sort") => {
    setActiveDropdown(prev => (prev === dropdown ? null : dropdown));
  };

  // Helper to generate color swatches based on perfume name
  const getSwatchesForProduct = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("oud") || lowerName.includes("classic")) {
      return ["#5c4033", "#b8860b", "#000000"]; // Woody colors
    }
    if (lowerName.includes("citrus") || lowerName.includes("intense")) {
      return ["#ff8c00", "#ffd700", "#228b22"]; // Citrusy/Green colors
    }
    if (lowerName.includes("ambassador") || lowerName.includes("black")) {
      return ["#000000", "#555555", "#c0c0c0"]; // Dark/Black variants
    }
    if (lowerName.includes("sport") || lowerName.includes("cobalt")) {
      return ["#0000ff", "#008080", "#ffffff"]; // Cool blue/white
    }
    return ["#d2b48c", "#8b0000", "#111111"]; // Amber/Ruby/Charcoal defaults
  };

  // Filter logic
  const filteredProducts = products.filter(product => {
    // Category match
    const matchesCategory =
      categoryFilter === "All" ||
      (Array.isArray(product.category)
        ? product.category.includes(categoryFilter)
        : product.category === categoryFilter);

    // Text search match
    const categoryString = Array.isArray(product.category) ? product.category.join(", ") : (product.category || "");
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryString.toLowerCase().includes(searchQuery.toLowerCase());

    // Availability match
    const matchesAvailability = !inStockOnly || (product.quantity ?? 0) > 0;

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

  if (loading) {
    return <NewtonsCradleLoader fullScreen={true} />;
  }

  return (
    <div suppressHydrationWarning className={styles.page}>
      {/* 1. Header Navigation */}
      <Navbar onCartClick={() => setShowCartDrawer(true)} />


      {/* Main Container */}
      <main className={styles.mainContent}>


        {/* 2. Advanced Filters and Sort Bar */}
        <div className={styles.filtersBar} ref={dropdownRef}>
          <div className={styles.filtersLeft}>
            {/* Availability Dropdown */}
            <div className={styles.dropdownWrapper}>
              <button 
                className={styles.filterTrigger} 
                onClick={() => toggleDropdown("availability")}
              >
                AVAILABILITY 
                <svg className={`${styles.chevron} ${activeDropdown === "availability" ? styles.rotated : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {activeDropdown === "availability" && (
                <div className={styles.dropdownContent}>
                  <CustomCheckbox 
                    checked={inStockOnly} 
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    label="In Stock Only"
                    style={{ '--checkbox-color': primaryColor } as React.CSSProperties}
                  />
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className={styles.dropdownWrapper}>
              <button 
                className={styles.filterTrigger} 
                onClick={() => toggleDropdown("price")}
              >
                PRICE
                <svg className={`${styles.chevron} ${activeDropdown === "price" ? styles.rotated : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {activeDropdown === "price" && (
                <div className={styles.dropdownContent}>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="priceRange" 
                      checked={priceRange === "all"} 
                      onChange={() => setPriceRange("all")} 
                    />
                    All Prices
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="priceRange" 
                      checked={priceRange === "under-1500"} 
                      onChange={() => setPriceRange("under-1500")} 
                    />
                    Under Rs. 1,500
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="priceRange" 
                      checked={priceRange === "1500-2000"} 
                      onChange={() => setPriceRange("1500-2000")} 
                    />
                    Rs. 1,500 - Rs. 2,000
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="priceRange" 
                      checked={priceRange === "over-2000"} 
                      onChange={() => setPriceRange("over-2000")} 
                    />
                    Over Rs. 2,000
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className={styles.filtersRight}>
            <span className={styles.itemCount}>{sortedProducts.length} ITEMS</span>

            {/* Sort Dropdown */}
            <div className={styles.dropdownWrapper}>
              <button 
                className={styles.filterTrigger} 
                onClick={() => toggleDropdown("sort")}
              >
                SORT: {sortBy.replace("-", " ").toUpperCase()}
                <svg className={`${styles.chevron} ${activeDropdown === "sort" ? styles.rotated : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {activeDropdown === "sort" && (
                <div className={styles.dropdownContent} style={{ right: 0 }}>
                  <button onClick={() => { setSortBy("featured"); setActiveDropdown(null); }} className={styles.sortOption}>Featured</button>
                  <button onClick={() => { setSortBy("low-to-high"); setActiveDropdown(null); }} className={styles.sortOption}>Price: Low to High</button>
                  <button onClick={() => { setSortBy("high-to-low"); setActiveDropdown(null); }} className={styles.sortOption}>Price: High to Low</button>
                  <button onClick={() => { setSortBy("a-z"); setActiveDropdown(null); }} className={styles.sortOption}>Alphabetically: A-Z</button>
                  <button onClick={() => { setSortBy("z-a"); setActiveDropdown(null); }} className={styles.sortOption}>Alphabetically: Z-A</button>
                </div>
              )}
            </div>

            {/* Layout Toggles */}
            
            {/* Mobile Filter Trigger */}
            <button 
              className={styles.mobileFilterBtn}
              onClick={() => setShowMobileFilter(true)}
            >
              FILTER & SORT
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </button>
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
        </div>

        {/* 3. Catalog Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className={viewLayout === "grid" ? styles.productsGrid : styles.productsList}>
            {sortedProducts.map((product) => {
              const swatchesColors = getSwatchesForProduct(product.name);
              const selectedSwatch = activeSwatches[product._id] !== undefined ? activeSwatches[product._id] : 0;

              return (
                <div 
                  key={product._id} 
                  className={styles.productCard}
                  style={{
                    cursor: product.quantity === 0 ? "not-allowed" : "pointer"
                  }}
                  onMouseEnter={() => {
                    if (product.quantity === 0) return;
                    const imgs = getProductImages(product);
                    if (imgs.length > 1) {
                      setActiveImageIndexes(prev => ({ ...prev, [product._id]: 1 }));
                    }
                  }}
                  onMouseLeave={() => {
                    if (product.quantity === 0) return;
                    setActiveImageIndexes(prev => ({ ...prev, [product._id]: 0 }));
                  }}
                >
                  <div className={styles.productImageContainer} style={product.quantity === 0 ? { pointerEvents: "none", filter: "grayscale(1)", opacity: 0.7 } : {}}>
                    <Link 
                      href={`/product/${product._id}`} 
                      style={{ textDecoration: "none", color: "inherit", display: "block", pointerEvents: product.quantity === 0 ? "none" : "auto" }}
                    >
                      {(() => {
                        const imagesList = getProductImages(product);
                        const activeIdx = activeImageIndexes[product._id] || 0;
                        const coverImage = imagesList[0];
                        const hoverIdx = activeIdx === 0 && imagesList.length > 1 ? 1 : activeIdx;
                        const hoverImage = imagesList[hoverIdx];

                        return (
                          <>
                            <img 
                              className={`${styles.productImage} ${styles.productImageFront}`} 
                              src={coverImage} 
                              alt={product.name}
                              loading="lazy"
                            />
                            {imagesList.length > 1 && (
                              <img 
                                className={`${styles.productImage} ${styles.productImageBack}`} 
                                src={hoverImage} 
                                alt={`${product.name} Alternate`}
                                loading="lazy"
                              />
                            )}
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
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={styles.cartIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    </button>
                  </div>

                  <div className={styles.productInfo} style={product.quantity === 0 ? { pointerEvents: "none" } : {}}>
                    <Link href={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit", pointerEvents: product.quantity === 0 ? "none" : "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <h3 className={styles.productTitle}>{product.name.toUpperCase()}</h3>
                      {(() => {
                        const cheapestVariant = product.variants && product.variants.length > 0
                          ? [...product.variants].sort((a, b) => a.price - b.price)[0]
                          : null;

                        const displayPrice = cheapestVariant ? cheapestVariant.price : product.price;
                        const displayStrikePrice = cheapestVariant ? cheapestVariant.strikePrice : (product as any).strikePrice;

                        const lowestQuantity = product.variants && product.variants.length > 0
                          ? Math.min(...product.variants.map(v => v.quantity))
                          : (product.quantity || 0);

                        const availableSizes = product.variants && product.variants.length > 0
                          ? product.variants.map(v => v.size)
                          : (product.sizes || []);

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
                            {lowestQuantity !== undefined && lowestQuantity <= 5 && (
                              <p style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 700, marginTop: "4px", letterSpacing: "0.02em" }}>
                                {lowestQuantity === 0 ? "OUT OF STOCK" : `ONLY ${lowestQuantity} LEFT`}
                              </p>
                            )}
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
            <p>No matching fragrances cataloged at the moment. Try a different query.</p>
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
                <h3 className={styles.mobileFilterGroupTitle}>SORT BY</h3>
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
                <h3 className={styles.mobileFilterGroupTitle}>PRICE</h3>
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
                <h3 className={styles.mobileFilterGroupTitle}>AVAILABILITY</h3>
                <CustomCheckbox 
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  label="In Stock Only"
                  style={{ '--checkbox-color': primaryColor } as React.CSSProperties}
                />
              </div>

            </div>
            <div className={styles.mobileFilterFooter}>
              <button className={styles.applyFilterBtn} onClick={handleCloseFilter}>
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
          setCartItems([]);
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
    </div>
  );
}