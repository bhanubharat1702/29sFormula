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

  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>("");
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);

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
    }, 300);
  };

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartError, setCartError] = useState<string | null>(null);

  const showCartError = (msg: string) => {
    setCartError(msg);
    setTimeout(() => setCartError(null), 3000);
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

  const addToCart = (product: Product, size?: string) => {
    const selectedSize = size || (product as any)?.variants?.[0]?.size || (product as any)?.sizes?.[0] || (product as any)?.availableSizes?.[0] || "Standard";
    if (typeof window !== "undefined") {
      const current = localStorage.getItem("cart");
      let itemsList = [];
      if (current) {
        try {
          itemsList = JSON.parse(current);
        } catch (e) {}
      }
      
      const maxStock = ((product as any).variants && (product as any).variants.find((v: any) => v.size === selectedSize)?.quantity) ?? product.quantity;

      const existingIdx = itemsList.findIndex((item: any) => item._id === product._id && item.size === selectedSize);
      if (existingIdx > -1) {
        if (itemsList[existingIdx].quantity + 1 > maxStock) {
          showCartError(`Only ${maxStock} units of ${product.name} (${selectedSize}) are available in stock.`);
          itemsList[existingIdx].quantity = maxStock;
          setShowCartDrawer(true);
        } else {
          itemsList[existingIdx].quantity += 1;
        }
      } else {
        const variantPrice = ((product as any).options && (product as any).options.find((o: any) => o.size === selectedSize)?.price) 
                          || ((product as any).variants && (product as any).variants.find((v: any) => v.size === selectedSize)?.price)
                          || product.price;
        const variantStrikePrice = ((product as any).options && (product as any).options.find((o: any) => o.size === selectedSize)?.strikePrice) 
                          || ((product as any).variants && (product as any).variants.find((v: any) => v.size === selectedSize)?.strikePrice)
                          || (product as any).strikePrice;

        let qtyToPush = 1;
        if (1 > maxStock) {
          showCartError(`Only ${maxStock} units of ${product.name} (${selectedSize}) are available in stock.`);
          qtyToPush = maxStock;
          setShowCartDrawer(true);
        }

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

  return (
    <div suppressHydrationWarning className={styles.page}>
      {/* 1. Header Navigation */}
      <Navbar onCartClick={() => setShowCartDrawer(true)} />

      {/* Main Container */}
      <main className={styles.mainContent}>


        {/* 2. Advanced Filters and Sort Bar */}
        <div className={styles.filtersBar} ref={dropdownRef}>
          <div className={styles.filtersLeft}>
            {/* Category Dropdown */}
            <div className={styles.dropdownWrapper}>
              <button 
                className={styles.filterTrigger} 
                onClick={() => toggleDropdown("category")}
              >
                CATEGORY{categoryFilter !== "All" ? `: ${categoryFilter.toUpperCase()}` : ""}
                <svg className={`${styles.chevron} ${activeDropdown === "category" ? styles.rotated : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {activeDropdown === "category" && (
                <div className={styles.dropdownContent}>
                  {categoryOptions.map(cat => (
                    <button
                      key={cat}
                      className={`${styles.sortOption} ${categoryFilter === cat ? styles.activeSortOption : ""}`}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setActiveDropdown(null);
                        if (typeof window !== "undefined") {
                          const url = new URL(window.location.href);
                          if (cat === "All") url.searchParams.delete("category");
                          else url.searchParams.set("category", cat === "Latest Arrivals" ? "arrivals" : cat === "Best Seller" ? "bestsellers" : cat);
                          window.history.replaceState({}, "", url.toString());
                        }
                      }}
                    >
                      {cat === "All" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="availabilityFilter" 
                      checked={availabilityFilter === "all" && !inStockOnly} 
                      onChange={() => { setAvailabilityFilter("all"); setInStockOnly(false); }} 
                    />
                    All Products
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="availabilityFilter" 
                      checked={availabilityFilter === "in-stock" || inStockOnly} 
                      onChange={() => { setAvailabilityFilter("in-stock"); setInStockOnly(true); }} 
                    />
                    In Stock
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="availabilityFilter" 
                      checked={availabilityFilter === "out-of-stock"} 
                      onChange={() => { setAvailabilityFilter("out-of-stock"); setInStockOnly(false); }} 
                    />
                    Out of Stock
                  </label>
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

        {/* Active Filter Badges Bar */}
        {(categoryFilter !== "All" || availabilityFilter !== "all" || priceRange !== "all" || searchQuery) && (
          <div className={styles.activeFiltersBar}>
            <span className={styles.activeFiltersLabel}>Active Filters:</span>
            {categoryFilter !== "All" && (
              <button 
                className={styles.activeFilterBadge}
                onClick={() => {
                  setCategoryFilter("All");
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("category");
                    window.history.replaceState({}, "", url.toString());
                  }
                }}
              >
                Category: {categoryFilter}
                <span className={styles.removeBadgeIcon}>✕</span>
              </button>
            )}
            {availabilityFilter !== "all" && (
              <button 
                className={styles.activeFilterBadge}
                onClick={() => {
                  setAvailabilityFilter("all");
                  setInStockOnly(false);
                }}
              >
                Availability: {availabilityFilter === "in-stock" ? "In Stock" : "Out of Stock"}
                <span className={styles.removeBadgeIcon}>✕</span>
              </button>
            )}
            {priceRange !== "all" && (
              <button 
                className={styles.activeFilterBadge}
                onClick={() => setPriceRange("all")}
              >
                Price: {priceRange === "under-1500" ? "Under ₹1,500" : priceRange === "1500-2000" ? "₹1,500 - ₹2,000" : "Over ₹2,000"}
                <span className={styles.removeBadgeIcon}>✕</span>
              </button>
            )}
            {searchQuery && (
              <button 
                className={styles.activeFilterBadge}
                onClick={() => {
                  setSearchQuery("");
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("search");
                    window.history.replaceState({}, "", url.toString());
                  }
                }}
              >
                Search: "{searchQuery}"
                <span className={styles.removeBadgeIcon}>✕</span>
              </button>
            )}
            <button 
              className={styles.clearAllBtn}
              onClick={() => {
                setCategoryFilter("All");
                setAvailabilityFilter("all");
                setInStockOnly(false);
                setPriceRange("all");
                setSearchQuery("");
                if (typeof window !== "undefined") {
                  const url = new URL(window.location.href);
                  url.searchParams.delete("category");
                  url.searchParams.delete("search");
                  window.history.replaceState({}, "", url.toString());
                }
              }}
            >
              Clear All
            </button>
          </div>
        )}

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
                    const imgs = getProductImages(product);
                    if (imgs.length > 1) {
                      setActiveImageIndexes(prev => ({ ...prev, [product._id]: 1 }));
                    }
                  }}
                  onMouseLeave={() => {
                    if (getProductStock(product) === 0) return;
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
                      style={{ textDecoration: "none", color: "inherit", display: "block", pointerEvents: getProductStock(product) === 0 ? "none" : "auto" }}
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
                <h3 className={styles.mobileFilterGroupTitle}>CATEGORY</h3>
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

export default function Collections() {
  return (
    <Suspense fallback={<NewtonsCradleLoader fullScreen={true} />}>
      <CollectionsContent />
    </Suspense>
  );
}