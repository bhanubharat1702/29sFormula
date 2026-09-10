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
import { saveCart, clearCart, fetchAndSyncUserCart } from "@/utils/cartSync";

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
  variants?: any[];
}

const defaultProducts: Product[] = [];

export default function Collections() {
  const [products, setProducts] = useState<Product[]>([]);
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

    // Fetch products
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
          localStorage.setItem("storefront_products", JSON.stringify(data));
        } else {
          setProducts(defaultProducts);
        }
      })
      .catch(err => {
        console.warn("Quietly catching catalog products fetch error:", err.message || err);
        setProducts(defaultProducts);
      })
      .finally(() => setLoading(false));

    // Fetch primary theme color
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
      })
      .then(data => {
        if (data && data.primaryColor) {
          setPrimaryColor(data.primaryColor);
              if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.primaryColor);
        }
      })
      .catch(err => console.warn("Quietly catching settings fetch error:", err.message || err));
  }, []);

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

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      categoryFilter === "All" ||
      (Array.isArray(product.category)
        ? product.category.includes(categoryFilter)
        : product.category === categoryFilter);

    const categoryString = Array.isArray(product.category) ? product.category.join(", ") : (product.category || "");
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryString.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAvailability = !inStockOnly || (product.quantity ?? 0) > 0;

    let matchesPrice = true;
    if (priceRange === "under-1500") matchesPrice = product.price < 1500;
    else if (priceRange === "1500-2000") matchesPrice = product.price >= 1500 && product.price <= 2000;
    else if (priceRange === "over-2000") matchesPrice = product.price > 2000;

    return matchesCategory && matchesSearch && matchesAvailability && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-to-high") return a.price - b.price;
    if (sortBy === "high-to-low") return b.price - a.price;
    if (sortBy === "a-z") return a.name.localeCompare(b.name);
    if (sortBy === "z-a") return b.name.localeCompare(a.name);
    return 0; // featured
  });

  
  const collectionGroups = React.useMemo(() => {
    const groups: { [key: string]: Product[] } = {};
    
    if (typeof window !== "undefined") {
      try {
        const customCats = JSON.parse(localStorage.getItem("admin_custom_categories") || "[]");
        if (Array.isArray(customCats)) {
          customCats.forEach((cat: string) => {
            const c = cat.trim();
            if (c && c !== "Latest Arrivals" && c !== "Best Seller" && c !== "Best Sellers" && c !== "All") {
              groups[c] = [];
            }
          });
        }
      } catch (e) {}
    }

    products.forEach(product => {
      const cats = Array.isArray(product.category) ? product.category : [product.category || ""];
      cats.forEach(cat => {
        const c = cat.trim();
        if (c && c !== "Latest Arrivals" && c !== "Best Seller" && c !== "Best Sellers" && c !== "All") {
          if (!groups[c]) groups[c] = [];
          groups[c].push(product);
        }
      });
    });
    return groups;
  }, [products]);
  
  if (loading) {
    return <NewtonsCradleLoader fullScreen={true} />;
  }

  return (
    <div suppressHydrationWarning className={styles.page}>
      <Navbar onCartClick={() => setShowCartDrawer(true)} />

      {/* Main Container */}
      <main className={styles.mainContent}>
        <div className={styles.catalogHeader} style={{ textAlign: "center", marginBottom: "40px", paddingTop: "40px" }}>
          <h1 className={styles.pageTitle}>OUR COLLECTIONS</h1>
          <p className={styles.pageSubtitle}>Discover our exquisite range of fragrances categorized by signature collections.</p>
        </div>

        {Object.keys(collectionGroups).sort().map(cat => (
          <div key={cat} className={styles.collectionSection} style={{ marginBottom: "60px", padding: "0 20px" }}>
            <h2 className={styles.collectionHeading} style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "20px", borderBottom: "2px solid #eaeaea", paddingBottom: "10px", textTransform: "uppercase" }}>{cat}</h2>
            <div className={styles.productsList}>
              {collectionGroups[cat].map((product) => {
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
                    </Link>
                    {product.quantity !== undefined && product.quantity <= 5 && (
                      <p style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 700, marginTop: "4px", letterSpacing: "0.02em" }}>
                        {product.quantity === 0 ? "OUT OF STOCK" : `ONLY ${product.quantity} LEFT`}
                      </p>
                    )}
                  </div>
                </div>
              );
            }
              )}
            </div>
          </div>
        ))}
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