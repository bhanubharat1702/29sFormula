"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

interface NavbarProps {
  onCartClick: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [brandLogoType, setBrandLogoType] = useState<string>("text");
  const [brandLogoValue, setBrandLogoValue] = useState<string>("29sFORMULA");
  const [imageError, setImageError] = useState<boolean>(false);
  const pathname = usePathname();
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [hasFetchedProducts, setHasFetchedProducts] = useState<boolean>(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
        const loadCartCount = () => {
      try {
        const cart = localStorage.getItem("cart");
        if (cart) {
          const itemsList = JSON.parse(cart);
          if (Array.isArray(itemsList)) {
            const count = itemsList.reduce((acc, item) => acc + (item.quantity || 1), 0);
            setCartItemCount(count);
          }
        } else {
          setCartItemCount(0);
        }
      } catch (e) {
        setCartItemCount(0);
      }
    };
    loadCartCount();
    window.addEventListener("cartUpdated", loadCartCount);
    window.addEventListener("storage", loadCartCount);

    // Check for user session
    const session = localStorage.getItem("userSession");
    if (session) {
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {
        console.error("Error parsing userSession:", e);
      }
    }

    // Load cached logo for instant render
    const cachedLogoType = localStorage.getItem("settings_brandLogoType");
    const cachedLogoValue = localStorage.getItem("settings_brandLogoValue");
    if (cachedLogoType) setBrandLogoType(cachedLogoType);
    if (cachedLogoValue) setBrandLogoValue(cachedLogoValue);

    // Fetch latest settings in background
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.brandLogoType) {
            setBrandLogoType(data.brandLogoType);
            localStorage.setItem("settings_brandLogoType", data.brandLogoType);
          }
          if (data.brandLogoValue) {
            setBrandLogoValue(data.brandLogoValue);
            localStorage.setItem("settings_brandLogoValue", data.brandLogoValue);
          }
        }
      })
      .catch(err => console.warn("Error fetching logo settings:", err));

    return () => {
      window.removeEventListener("cartUpdated", loadCartCount);
      window.removeEventListener("storage", loadCartCount);
    };
  }, []);

  // Search Effects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen && !hasFetchedProducts) {
      setHasFetchedProducts(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setProducts(data);
        })
        .catch((err) => console.error("Error fetching products for search:", err));
    }
  }, [isSearchOpen, hasFetchedProducts]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return products
      .filter((p) => p.name.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query)))
      .slice(0, 6);
  };
  const searchResults = getSearchResults();

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    setCurrentUser(null);
    setShowProfileDropdown(false);
    window.location.reload();
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.navLeft}>
        <Link href="/" aria-label="Home" className={styles.logo}>
          {brandLogoType === "image" ? (
            <img 
              src={brandLogoValue} 
              alt="Brand Logo" 
              style={{ maxHeight: "35px", objectFit: "contain", display: "block" }} 
            />
          ) : (
            brandLogoValue
          )}
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.activeLink : ""}`}>HOME</Link>
          <Link href="/shop" className={`${styles.navLink} ${pathname === "/shop" ? styles.activeLink : ""}`}>SHOP ALL</Link>
          <Link href="/collections" className={`${styles.navLink} ${pathname === "/collections" ? styles.activeLink : ""}`}>COLLECTIONS</Link>
          <Link href="/gift-set" className={`${styles.navLink} ${pathname === "/gift-set" ? styles.activeLink : ""}`}>GIFT SET</Link>
          <Link href="/track" className={`${styles.navLink} ${pathname === "/track" ? styles.activeLink : ""}`}>TRACK ORDER</Link>
        </nav>
        {/* Mobile Navigation Drawer Overlay */}
        <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.mobileMenuOverlayOpen : ""}`}>
          <div className={styles.mobileMenuContainer}>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.mobileMenuItem} ${styles.mobileNavLink} ${pathname === "/" ? styles.mobileNavLinkActive : ""}`}>HOME</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.mobileMenuItem} ${styles.mobileNavLink} ${pathname === "/shop" ? styles.mobileNavLinkActive : ""}`}>SHOP ALL</Link>
            <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.mobileMenuItem} ${styles.mobileNavLink} ${pathname === "/collections" ? styles.mobileNavLinkActive : ""}`}>COLLECTIONS</Link>
            <Link href="/gift-set" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.mobileMenuItem} ${styles.mobileNavLink} ${pathname === "/gift-set" ? styles.mobileNavLinkActive : ""}`}>GIFT SET</Link>
            <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.mobileMenuItem} ${styles.mobileNavLink} ${pathname === "/track" ? styles.mobileNavLinkActive : ""}`}>TRACK ORDER</Link>
          </div>
        </div>
      </div>
      
      <div className={styles.navRight}>
        <button aria-label="Search" className={styles.iconBtn} onClick={() => setIsSearchOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.navIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
          </svg>
        </button>
        {currentUser ? (
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => setShowProfileDropdown(prev => !prev)} 
              style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "50%", 
                backgroundColor: "#ffffff", 
                color: "#000000", 
                border: "none", 
                fontSize: "0.85rem", 
                fontWeight: 700, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                textTransform: "uppercase" 
              }}
              title={currentUser.name}
            >
              {currentUser.profilePicture && !imageError ? (
                <img 
                  src={currentUser.profilePicture} 
                  alt={currentUser.name} 
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
                  onError={() => setImageError(true)}
                />
              ) : (
                (currentUser.email || currentUser.name || "U").charAt(0)
              )}
            </button>
            
            {showProfileDropdown && (
              <div style={{ 
                position: "absolute", 
                top: "40px", 
                right: 0, 
                backgroundColor: "#ffffff", 
                border: "1px solid #eaeaea", 
                borderRadius: "6px", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)", 
                padding: "15px", 
                zIndex: 1000, 
                minWidth: "180px", 
                textAlign: "left" 
              }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", fontWeight: 700, color: "#111" }}>{currentUser.name}</p>
                <p style={{ margin: "0 0 12px 0", fontSize: "0.75rem", color: "#6b7280", wordBreak: "break-all" }}>{currentUser.email}</p>
                
                <Link 
                  href="/track" 
                  onClick={() => setShowProfileDropdown(false)}
                  style={{ 
                    display: "block",
                    width: "100%", 
                    padding: "8px", 
                    backgroundColor: "#f3f4f6", 
                    color: "#111",
                    textDecoration: "none",
                    textAlign: "center",
                    border: "none", 
                    borderRadius: "4px", 
                    fontSize: "0.75rem", 
                    fontWeight: 700, 
                    cursor: "pointer",
                    marginBottom: "8px"
                  }}
                >
                  Orders
                </Link>

                <button 
                  onClick={handleLogout}
                  style={{ 
                    width: "100%", 
                    padding: "8px", 
                    backgroundColor: "#000", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "4px", 
                    fontSize: "0.75rem", 
                    fontWeight: 700, 
                    cursor: "pointer" 
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" aria-label="Account" className={styles.iconBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.navIcon}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </Link>
        )}
        <button aria-label="Cart" className={styles.iconBtn} onClick={onCartClick} style={{ position: "relative" }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={styles.navIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          {cartItemCount > 0 && (
            <span style={{ 
              position: "absolute", 
              top: "-5px", 
              right: "-5px", 
              backgroundColor: "#000000", 
              color: "#fff", 
              fontSize: "0.6rem", 
              fontWeight: "bold", 
              borderRadius: "50%", 
              width: "16px", 
              height: "16px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              lineHeight: 1
            }}>
              {cartItemCount}
            </span>
          )}
        </button>
        <button 
          className={`${styles.hamburgerBtn} ${isMobileMenuOpen ? styles.hamburgerBtnOpen : ''}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={styles.hamburgerInner}>
            <div className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineTopOpen : ''}`} />
            <div className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineMiddleOpen : ''}`} />
            <div className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineBottomOpen : ''}`} />
          </div>
        </button>
      </div>
      {/* Global Search Overlay */}
      <div 
        onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
        style={{
          position: 'fixed', inset: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 10010,
          transition: 'opacity 0.4s ease-in-out',
          opacity: isSearchOpen ? 1 : 0,
          pointerEvents: isSearchOpen ? 'auto' : 'none'
        }}
      />

      <div style={{
        position: 'fixed', left: 0, right: 0, backgroundColor: '#ffffff', zIndex: 10011,
        paddingTop: '40px', paddingBottom: '30px', paddingLeft: '24px', paddingRight: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        top: isSearchOpen ? 0 : '-600px',
        opacity: isSearchOpen ? 1 : 0,
        pointerEvents: isSearchOpen ? 'auto' : 'none',
        color: '#111827'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', maxHeight: '70vh' }}>
          
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#9ca3af" style={{ width: '24px', height: '24px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602Z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search Fragrance"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', backgroundColor: 'transparent', border: 'none', outline: 'none',
                color: '#111827', fontSize: '1.25rem', padding: 0, margin: 0,
                boxShadow: 'none'
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', color: '#86868b', cursor: 'pointer', padding: '4px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 8px' }}></div>
            <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} style={{ background: 'transparent', border: 'none', color: '#4b5563', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'} title="Close search">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '24px', height: '24px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
            {!searchQuery.trim() ? (
              <div style={{ padding: '4px 0' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#86868b', textTransform: 'uppercase', marginBottom: '16px' }}>Quick Links</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button onClick={() => { router.push('/'); setIsSearchOpen(false); setSearchQuery(''); }} style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#4b5563', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Home</button>
                  <button onClick={() => { router.push('/shop'); setIsSearchOpen(false); setSearchQuery(''); }} style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#4b5563', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Shop All Products</button>
                  <button onClick={() => { router.push('/track'); setIsSearchOpen(false); setSearchQuery(''); }} style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#4b5563', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Track Order</button>
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div style={{ padding: '32px 0', textAlign: 'center', color: '#6b7280' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602Z" />
                </svg>
                <p>No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#86868b', textTransform: 'uppercase', marginBottom: '8px' }}>Products</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {searchResults.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => { router.push(`/product/${p._id}`); setIsSearchOpen(false); setSearchQuery(''); }}
                      style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#111827', transition: 'all 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {p.imageFront ? <img src={p.imageFront} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', marginRight: '12px' }} /> : <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#e5e7eb', marginRight: '12px' }}></div>}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{p.name}</span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Rs. {p.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
