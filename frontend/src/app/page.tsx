'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Footer from "@/components/Footer";

import Navbar from "@/components/Navbar/Navbar";
import Preloader from "@/components/Preloader";
import CartDrawer from "@/components/CartDrawer";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import QuickViewDrawer from "@/components/QuickViewDrawer";

const defaultProducts: any[] = [];


interface FaqItem {
  question: string;
  answer: string;
}

// removed reviewsData

const defaultFaqs: FaqItem[] = [
  {
    question: "ARE THESE FRAGRANCES LONG-LASTING?",
    answer: "Yes, our Extrait de Parfum formulas contain a high concentration of fragrance oils (30-40%), ensuring they last 12+ hours on skin and days on clothing."
  },
  {
    question: "DO YOU USE NATURAL OR SYNTHETIC INGREDIENTS?",
    answer: "We use a precise blend of both. Natural absolutes provide depth and complexity, while safe synthetics provide stability, projection, and ethical alternatives to animal-derived notes like musk."
  },
  {
    question: "IS YOUR PACKAGING ECO-FRIENDLY?",
    answer: "Yes, our glass bottles are 100% recyclable, and our packaging uses sustainably sourced, biodegradable materials with minimal plastic."
  },
  {
    question: "WHAT IS YOUR RETURN POLICY?",
    answer: "We offer a 14-day return policy for unopened and unused products. For hygiene reasons, we cannot accept returns on opened fragrances."
  },
  {
    question: "DO YOU SHIP INTERNATIONALLY?",
    answer: "Currently, we ship nationwide within our home market. We are actively working on expanding our shipping network to international destinations."
  }
];

const getFontFamilyStack = (fontName: string) => {
  if (fontName === "SF Pro") {
    return `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  }
  if (fontName === "New York") {
    return `"New York", Georgia, "Times New Roman", serif`;
  }
  if (fontName === "SF Mono") {
    return `"SF Mono", Consolas, "Courier New", monospace`;
  }
  if (fontName === "Segoe UI") {
    return `"Segoe UI", -apple-system, Roboto, Helvetica, Arial, sans-serif`;
  }
  if (fontName === "Helvetica Neue") {
    return `"Helvetica Neue", Helvetica, Arial, sans-serif`;
  }
  return `"${fontName}", sans-serif`;
};

export default function Home() {
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultFaqs);
  const [globalSettings, setGlobalSettings] = useState<any>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewFade, setReviewFade] = useState(true);
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">("forward");

  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [arrivalsPage, setArrivalsPage] = useState<number>(1);
  const [arrivalsDirection, setArrivalsDirection] = useState<"forward" | "backward">("forward");
  const [bestSellersPage, setBestSellersPage] = useState<number>(1);
  const [bestSellersDirection, setBestSellersDirection] = useState<"forward" | "backward">("forward");
  const itemsPerPage = 2;

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Hero Section State
  const [heroBgType, setHeroBgType] = useState<"color" | "image" | "video">("color");
  const [heroBgColor, setHeroBgColor] = useState<string>("#121212");
  const [heroBgImage, setHeroBgImage] = useState<string | null>(null);
  const [heroBgVideo, setHeroBgVideo] = useState<string | null>(null);
  
  const [heroTitle, setHeroTitle] = useState<string>("");
  const [heroTitleFontType, setHeroTitleFontType] = useState<string>("Outfit");
  
  const [allReviews, setAllReviews] = useState<any[]>([]);

  // Auto-slide reviews every 4 seconds
  useEffect(() => {
    if (allReviews.length <= 1) return;
    const interval = setInterval(() => {
      const nextIndex = (currentReviewIndex + 1) % allReviews.length;
      setSlideDirection(nextIndex > currentReviewIndex ? "forward" : "backward");
      setReviewFade(false);
      setTimeout(() => {
        setCurrentReviewIndex(nextIndex);
        setReviewFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [allReviews.length, currentReviewIndex]);

  // Computed Review Stats
  const totalReviews = allReviews.length;
  const avgRating = totalReviews > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
    : "5.0";
    
  const getRatingPercent = (star: number) => {
    if (totalReviews === 0) return 0;
    const count = allReviews.filter(r => r.rating === star).length;
    return (count / totalReviews) * 100;
  };
  const [heroTitleFontColor, setHeroTitleFontColor] = useState<string>("#111827");
  const [heroTitleFontSize, setHeroTitleFontSize] = useState<string>("4.5rem");
  const [heroTitleFontAlignment, setHeroTitleFontAlignment] = useState<string>("center");
  const [heroTitleFontWeight, setHeroTitleFontWeight] = useState<string>("700");

  const [heroManifesto, setHeroManifesto] = useState<string>("");
  const [heroTemplate, setHeroTemplate] = useState<string>("center");
  const [showHeroTitle, setShowHeroTitle] = useState<boolean>(true);
  const [showHeroManifesto, setShowHeroManifesto] = useState<boolean>(true);
  const [showHeroButton, setShowHeroButton] = useState<boolean>(true);
  const [heroButtonText, setHeroButtonText] = useState<string>("");
  const [heroButtonStyle, setHeroButtonStyle] = useState<string>("solid");
  const [heroButtonSize, setHeroButtonSize] = useState<string>("md");
  const [heroButtonColor, setHeroButtonColor] = useState<string>("");
  const [heroButtonTextColor, setHeroButtonTextColor] = useState<string>("#ffffff");
  const [heroManifestoFontType, setHeroManifestoFontType] = useState<string>("Outfit");
  const [heroManifestoFontColor, setHeroManifestoFontColor] = useState<string>("#ffffff");
  const [heroManifestoFontSize, setHeroManifestoFontSize] = useState<string>("0.72rem");
  const [heroManifestoFontAlignment, setHeroManifestoFontAlignment] = useState<string>("left");
  const [heroManifestoFontWeight, setHeroManifestoFontWeight] = useState<string>("500");


  const [videoTitle, setVideoTitle] = useState<string>("NEW ARRIVALS");
  const [videoSubtitle, setVideoSubtitle] = useState<string>("Drop's live. Smells divine. Feels better.");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoFallbackColor, setVideoFallbackColor] = useState<string>("#121212");
  const [videoTitleFontType, setVideoTitleFontType] = useState<string>("Outfit");
  const [videoTitleFontColor, setVideoTitleFontColor] = useState<string>("#ffffff");
  const [videoTitleFontSize, setVideoTitleFontSize] = useState<string>("3.5rem");
  const [videoTitleFontAlignment, setVideoTitleFontAlignment] = useState<string>("center");
  const [videoTitleFontWeight, setVideoTitleFontWeight] = useState<string>("700");
  const [videoSubtitleFontType, setVideoSubtitleFontType] = useState<string>("Outfit");
  const [videoSubtitleFontColor, setVideoSubtitleFontColor] = useState<string>("#ffffff");
  const [videoSubtitleFontSize, setVideoSubtitleFontSize] = useState<string>("1.1rem");
  const [videoSubtitleFontAlignment, setVideoSubtitleFontAlignment] = useState<string>("center");
  const [videoSubtitleFontWeight, setVideoSubtitleFontWeight] = useState<string>("500");
  const [videoTemplate, setVideoTemplate] = useState<string>("center");
  const [showVideoTitle, setShowVideoTitle] = useState<boolean>(true);
  const [showVideoSubtitle, setShowVideoSubtitle] = useState<boolean>(true);
  const [showVideoButton, setShowVideoButton] = useState<boolean>(true);
  const [videoButtonText, setVideoButtonText] = useState<string>("Shop Now");
  const [videoButtonStyle, setVideoButtonStyle] = useState<string>("outline");
  const [videoButtonSize, setVideoButtonSize] = useState<string>("md");
  const [videoButtonColor, setVideoButtonColor] = useState<string>("#ffffff");
  const [videoButtonTextColor, setVideoButtonTextColor] = useState<string>("#121212");
  const [videoBgType, setVideoBgType] = useState<string>("video");
  const [videoBgColor, setVideoBgColor] = useState<string>("#121212");
  const [videoBgImage, setVideoBgImage] = useState<string>("");

  useEffect(() => {
    [heroTitleFontType, heroManifestoFontType, videoTitleFontType, videoSubtitleFontType].forEach(font => {
      if (!font) return;
      const systemFonts = ["SF Pro", "New York", "SF Mono", "Segoe UI", "Helvetica Neue", "Georgia", "Garamond"];
      if (systemFonts.includes(font)) return;
      const fontId = "dynamic-font-store-" + font.replace(/\s+/g, "-").toLowerCase();
      if (document.getElementById(fontId)) return;
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
      document.head.appendChild(link);
    });
  }, [heroTitleFontType, heroManifestoFontType, videoTitleFontType, videoSubtitleFontType]);
  const [lifestyleText, setLifestyleText] = useState<string>("Intense notes, Raw elements. This is 29sFORMULA.");
  const [lifestyleImage, setLifestyleImage] = useState<string>("https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
  const [primaryColor, setPrimaryColor] = useState<string>(
    "#57bc74"
  );
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [showLifestyle, setShowLifestyle] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Cart Drawer State
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [expandedGiftSets, setExpandedGiftSets] = useState<{ [key: string]: boolean }>({});
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

  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>("");
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);

  const initiateCheckout = () => {
    setShowCartDrawer(false);
    setShowCheckoutDrawer(true);
  };

  const handleOrderSuccess = (orderId: string, orderDetails: any) => {
    setShowCheckoutDrawer(false);
    setCompletedOrderId(orderId);
    setCompletedOrderDetails(orderDetails);
    setShowSuccessModal(true);
    
    // Clear cart
    localStorage.removeItem("cart");
    // Dispatch cart update event
    window.dispatchEvent(new Event("cartUpdated"));
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
    const handleStorageChange = () => loadCart();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600); // 600px is the breakpoint for mobile grid
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const addToCart = (product: any, size: string = "50ml", qty: number = 1) => {
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
        if (itemsList[existingIdx].quantity + qty > maxStock) {
          showCartError(`Only ${maxStock} units of ${product.name} (${size}) are available in stock.`);
          itemsList[existingIdx].quantity = maxStock;
          setShowCartDrawer(true);
        } else {
          itemsList[existingIdx].quantity += qty;
        }
      } else {
        const variantPrice = (product.options && product.options.find((o: any) => o.size === size)?.price) 
                          || (product.variants && product.variants.find((v: any) => v.size === size)?.price)
                          || product.price;
        const variantStrikePrice = ((product as any).options && (product as any).options.find((o: any) => o.size === size)?.strikePrice) 
                          || ((product as any).variants && (product as any).variants.find((v: any) => v.size === size)?.strikePrice)
                          || product.strikePrice;

        let qtyToPush = qty;
        if (qty > maxStock) {
          showCartError(`Only ${maxStock} units of ${product.name} (${size}) are available in stock.`);
          qtyToPush = maxStock;
          setShowCartDrawer(true);
        }

        if (qtyToPush > 0) {
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
      }
      localStorage.setItem("cart", JSON.stringify(itemsList));
      window.dispatchEvent(new Event("cartUpdated"));
      setShowCartDrawer(true);
    }
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      const updated = cartItems.filter((_, idx) => idx !== index);
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    } else {
      const item = cartItems[index];
      if (item.maxStock !== undefined && newQty > item.maxStock) {
        showCartError(`Only ${item.maxStock} units of ${item.name} (${item.size}) are available in stock.`);
        const updated = [...cartItems];
        updated[index].quantity = item.maxStock;
        setCartItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cartUpdated"));
        setShowCartDrawer(true);
        return;
      }
      const updated = [...cartItems];
      updated[index].quantity = newQty;
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.warn("Autoplay was prevented by browser:", e));
    }
  }, [videoUrl]);

  useEffect(() => {
    // Load cached settings immediately to prevent visual jumps during load
    try {
      const cachedPrimaryColor = localStorage.getItem("settings_primaryColor");
      if (cachedPrimaryColor) setPrimaryColor(cachedPrimaryColor);
      const cachedHeroTitle = localStorage.getItem("settings_heroTitle");
      if (cachedHeroTitle) setHeroTitle(cachedHeroTitle);
      const cachedHeroTitleFontType = localStorage.getItem("settings_heroTitleFontType");
      if (cachedHeroTitleFontType) setHeroTitleFontType(cachedHeroTitleFontType);
      const cachedHeroTitleFontColor = localStorage.getItem("settings_heroTitleFontColor");
      if (cachedHeroTitleFontColor) setHeroTitleFontColor(cachedHeroTitleFontColor);
      const cachedHeroTitleFontSize = localStorage.getItem("settings_heroTitleFontSize");
      if (cachedHeroTitleFontSize) setHeroTitleFontSize(cachedHeroTitleFontSize);
      const cachedHeroTitleFontAlignment = localStorage.getItem("settings_heroTitleFontAlignment");
      if (cachedHeroTitleFontAlignment) setHeroTitleFontAlignment(cachedHeroTitleFontAlignment);
            const cachedHeroTemplate = localStorage.getItem("settings_heroTemplate");
      if (cachedHeroTemplate) setHeroTemplate(cachedHeroTemplate);
      const cachedShowHeroTitle = localStorage.getItem("settings_showHeroTitle");
      if (cachedShowHeroTitle) setShowHeroTitle(cachedShowHeroTitle === "true");
      const cachedShowHeroManifesto = localStorage.getItem("settings_showHeroManifesto");
      if (cachedShowHeroManifesto) setShowHeroManifesto(cachedShowHeroManifesto === "true");
      const cachedShowHeroButton = localStorage.getItem("settings_showHeroButton");
      if (cachedShowHeroButton) setShowHeroButton(cachedShowHeroButton === "true");
      const cachedHeroButtonText = localStorage.getItem("settings_heroButtonText");
      const cachedHeroButtonStyle = localStorage.getItem("settings_heroButtonStyle");
      if (cachedHeroButtonStyle) setHeroButtonStyle(cachedHeroButtonStyle);
      const cachedHeroButtonSize = localStorage.getItem("settings_heroButtonSize");
      if (cachedHeroButtonSize) setHeroButtonSize(cachedHeroButtonSize);
      const cachedHeroButtonColor = localStorage.getItem("settings_heroButtonColor");
      if (cachedHeroButtonColor) setHeroButtonColor(cachedHeroButtonColor);
      const cachedHeroButtonTextColor = localStorage.getItem("settings_heroButtonTextColor");
      if (cachedHeroButtonTextColor) setHeroButtonTextColor(cachedHeroButtonTextColor);
      if (cachedHeroButtonText) setHeroButtonText(cachedHeroButtonText);
      const cachedHeroBgType = localStorage.getItem("settings_heroBgType");
      if (cachedHeroBgType === "color" || cachedHeroBgType === "image" || cachedHeroBgType === "video") setHeroBgType(cachedHeroBgType);
      const cachedHeroBgColor = localStorage.getItem("settings_heroBgColor");
      if (cachedHeroBgColor) setHeroBgColor(cachedHeroBgColor);
      const cachedHeroBgImage = localStorage.getItem("settings_heroBgImage");
      if (cachedHeroBgImage) setHeroBgImage(cachedHeroBgImage);
      const cachedHeroBgVideo = localStorage.getItem("settings_heroBgVideo");
      if (cachedHeroBgVideo) setHeroBgVideo(cachedHeroBgVideo);
      const cachedShowVideo = localStorage.getItem("settings_showVideo");
      if (cachedShowVideo) setShowVideo(cachedShowVideo === "true");
      const cachedShowLifestyle = localStorage.getItem("settings_showLifestyle");
      if (cachedShowLifestyle) setShowLifestyle(cachedShowLifestyle === "true");
      
      // Load cached arrays list to avoid slow loading layout shifts
      const cachedArrivals = localStorage.getItem("storefront_arrivals");
      if (cachedArrivals) setArrivals(JSON.parse(cachedArrivals));
      const cachedBestSellers = localStorage.getItem("storefront_bestSellers");
      if (cachedBestSellers) setBestSellers(JSON.parse(cachedBestSellers));
    } catch (e) {
      console.warn("Failed to load cached settings:", e);
    }

    const loadData = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/storefront/home`, { cache: "no-store" })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(payload => {
          if (payload.arrivals && Array.isArray(payload.arrivals)) {
            setArrivals(payload.arrivals);
            localStorage.setItem("storefront_arrivals", JSON.stringify(payload.arrivals));
          }
          if (payload.bestSellers && Array.isArray(payload.bestSellers)) {
            setBestSellers(payload.bestSellers);
            localStorage.setItem("storefront_bestSellers", JSON.stringify(payload.bestSellers));
          }
          
          if (payload.reviews && Array.isArray(payload.reviews)) {
            const formatted = payload.reviews.map((r: any) => ({
              name: r.author || r.authorName || "Anonymous",
              date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              rating: Number(r.rating) || 5,
              text: r.comment || r.text || ""
            }));
            setAllReviews(formatted);
          }

          if (payload.settings) {
            const data = payload.settings;
            setGlobalSettings(data);
            if (data.heroTitle !== undefined) {
              setHeroTitle(data.heroTitle);
              localStorage.setItem("settings_heroTitle", data.heroTitle);
            }
            if (data.heroTitleFontType !== undefined) {
              setHeroTitleFontType(data.heroTitleFontType);
              localStorage.setItem("settings_heroTitleFontType", data.heroTitleFontType);
            }
            if (data.heroTitleFontColor !== undefined) {
              setHeroTitleFontColor(data.heroTitleFontColor);
              localStorage.setItem("settings_heroTitleFontColor", data.heroTitleFontColor);
            }
            if (data.heroTitleFontSize !== undefined) {
              setHeroTitleFontSize(data.heroTitleFontSize);
              localStorage.setItem("settings_heroTitleFontSize", data.heroTitleFontSize);
            }
            if (data.heroTitleFontAlignment !== undefined) {
              setHeroTitleFontAlignment(data.heroTitleFontAlignment);
              localStorage.setItem("settings_heroTitleFontAlignment", data.heroTitleFontAlignment);
            }
            if (data.heroTitleFontWeight !== undefined) {
              setHeroTitleFontWeight(data.heroTitleFontWeight);
              localStorage.setItem("settings_heroTitleFontWeight", data.heroTitleFontWeight);
            }
            if (data.heroTemplate !== undefined) {
              setHeroTemplate(data.heroTemplate);
              localStorage.setItem("settings_heroTemplate", data.heroTemplate);
            }
            if (data.showHeroTitle !== undefined) {
              setShowHeroTitle(data.showHeroTitle);
              localStorage.setItem("settings_showHeroTitle", String(data.showHeroTitle));
            }
            if (data.showHeroManifesto !== undefined) {
              setShowHeroManifesto(data.showHeroManifesto);
              localStorage.setItem("settings_showHeroManifesto", String(data.showHeroManifesto));
            }
            if (data.showHeroButton !== undefined) {
              setShowHeroButton(data.showHeroButton);
              localStorage.setItem("settings_showHeroButton", String(data.showHeroButton));
            }
            if (data.heroButtonStyle !== undefined) {
              setHeroButtonStyle(data.heroButtonStyle);
              localStorage.setItem("settings_heroButtonStyle", data.heroButtonStyle);
            }
            if (data.heroButtonSize !== undefined) {
              setHeroButtonSize(data.heroButtonSize);
              localStorage.setItem("settings_heroButtonSize", data.heroButtonSize);
            }
            if (data.heroButtonColor !== undefined) {
              setHeroButtonColor(data.heroButtonColor);
              localStorage.setItem("settings_heroButtonColor", data.heroButtonColor);
            }
            if (data.heroButtonTextColor !== undefined) {
              setHeroButtonTextColor(data.heroButtonTextColor);
              localStorage.setItem("settings_heroButtonTextColor", data.heroButtonTextColor);
            }
            if (data.heroButtonText !== undefined) {
              setHeroButtonText(data.heroButtonText);
              localStorage.setItem("settings_heroButtonText", data.heroButtonText);
            }
            if (data.heroManifesto !== undefined) {
              setHeroManifesto(data.heroManifesto);
              localStorage.setItem("settings_heroManifesto", data.heroManifesto);
            }
            if (data.heroManifestoFontType !== undefined) { setHeroManifestoFontType(data.heroManifestoFontType); localStorage.setItem("settings_heroManifestoFontType", data.heroManifestoFontType); }
            if (data.heroManifestoFontColor !== undefined) { setHeroManifestoFontColor(data.heroManifestoFontColor); localStorage.setItem("settings_heroManifestoFontColor", data.heroManifestoFontColor); }
            if (data.heroManifestoFontSize !== undefined) { setHeroManifestoFontSize(data.heroManifestoFontSize); localStorage.setItem("settings_heroManifestoFontSize", data.heroManifestoFontSize); }
            if (data.heroManifestoFontAlignment !== undefined) { setHeroManifestoFontAlignment(data.heroManifestoFontAlignment); localStorage.setItem("settings_heroManifestoFontAlignment", data.heroManifestoFontAlignment); }
            if (data.heroManifestoFontWeight !== undefined) { setHeroManifestoFontWeight(data.heroManifestoFontWeight); localStorage.setItem("settings_heroManifestoFontWeight", data.heroManifestoFontWeight); }
            if (data.videoTitle !== undefined) {
              setVideoTitle(data.videoTitle);
              localStorage.setItem("settings_videoTitle", data.videoTitle);
            }
            if (data.videoSubtitle !== undefined) {
              setVideoSubtitle(data.videoSubtitle);
              localStorage.setItem("settings_videoSubtitle", data.videoSubtitle);
            }
            if (data.videoUrl !== undefined) {
              setVideoUrl(data.videoUrl);
              localStorage.setItem("settings_videoUrl", data.videoUrl);
            }
            if (data.videoFallbackColor !== undefined) {
              setVideoFallbackColor(data.videoFallbackColor);
              localStorage.setItem("settings_videoFallbackColor", data.videoFallbackColor);
            }
            if (data.videoTitleFontType !== undefined) { setVideoTitleFontType(data.videoTitleFontType); localStorage.setItem("settings_videoTitleFontType", data.videoTitleFontType); }
            if (data.videoTitleFontColor !== undefined) { setVideoTitleFontColor(data.videoTitleFontColor); localStorage.setItem("settings_videoTitleFontColor", data.videoTitleFontColor); }
            if (data.videoTitleFontSize !== undefined) { setVideoTitleFontSize(data.videoTitleFontSize); localStorage.setItem("settings_videoTitleFontSize", data.videoTitleFontSize); }
            if (data.videoTitleFontAlignment !== undefined) { setVideoTitleFontAlignment(data.videoTitleFontAlignment); localStorage.setItem("settings_videoTitleFontAlignment", data.videoTitleFontAlignment); }
            if (data.videoTitleFontWeight !== undefined) { setVideoTitleFontWeight(data.videoTitleFontWeight); localStorage.setItem("settings_videoTitleFontWeight", data.videoTitleFontWeight); }
            if (data.videoSubtitleFontType !== undefined) { setVideoSubtitleFontType(data.videoSubtitleFontType); localStorage.setItem("settings_videoSubtitleFontType", data.videoSubtitleFontType); }
            if (data.videoSubtitleFontColor !== undefined) { setVideoSubtitleFontColor(data.videoSubtitleFontColor); localStorage.setItem("settings_videoSubtitleFontColor", data.videoSubtitleFontColor); }
            if (data.videoSubtitleFontSize !== undefined) { setVideoSubtitleFontSize(data.videoSubtitleFontSize); localStorage.setItem("settings_videoSubtitleFontSize", data.videoSubtitleFontSize); }
            if (data.videoSubtitleFontAlignment !== undefined) { setVideoSubtitleFontAlignment(data.videoSubtitleFontAlignment); localStorage.setItem("settings_videoSubtitleFontAlignment", data.videoSubtitleFontAlignment); }
            if (data.videoSubtitleFontWeight !== undefined) { setVideoSubtitleFontWeight(data.videoSubtitleFontWeight); localStorage.setItem("settings_videoSubtitleFontWeight", data.videoSubtitleFontWeight); }
            if (data.videoTemplate !== undefined) { setVideoTemplate(data.videoTemplate); localStorage.setItem("settings_videoTemplate", data.videoTemplate); }
            if (data.showVideoTitle !== undefined) { setShowVideoTitle(data.showVideoTitle); localStorage.setItem("settings_showVideoTitle", String(data.showVideoTitle)); }
            if (data.showVideoSubtitle !== undefined) { setShowVideoSubtitle(data.showVideoSubtitle); localStorage.setItem("settings_showVideoSubtitle", String(data.showVideoSubtitle)); }
            if (data.showVideoButton !== undefined) { setShowVideoButton(data.showVideoButton); localStorage.setItem("settings_showVideoButton", String(data.showVideoButton)); }
            if (data.videoButtonText !== undefined) { setVideoButtonText(data.videoButtonText); localStorage.setItem("settings_videoButtonText", data.videoButtonText); }
            if (data.videoButtonStyle !== undefined) { setVideoButtonStyle(data.videoButtonStyle); localStorage.setItem("settings_videoButtonStyle", data.videoButtonStyle); }
            if (data.videoButtonSize !== undefined) { setVideoButtonSize(data.videoButtonSize); localStorage.setItem("settings_videoButtonSize", data.videoButtonSize); }
            if (data.videoButtonColor !== undefined) { setVideoButtonColor(data.videoButtonColor); localStorage.setItem("settings_videoButtonColor", data.videoButtonColor); }
            if (data.videoButtonTextColor !== undefined) { setVideoButtonTextColor(data.videoButtonTextColor); localStorage.setItem("settings_videoButtonTextColor", data.videoButtonTextColor); }
            if (data.videoBgType !== undefined) { setVideoBgType(data.videoBgType); localStorage.setItem("settings_videoBgType", data.videoBgType); }
            if (data.videoBgColor !== undefined) { setVideoBgColor(data.videoBgColor); localStorage.setItem("settings_videoBgColor", data.videoBgColor); }
            if (data.videoBgImage !== undefined) { setVideoBgImage(data.videoBgImage); localStorage.setItem("settings_videoBgImage", data.videoBgImage); }
            if (data.lifestyleText !== undefined) {
              setLifestyleText(data.lifestyleText);
              localStorage.setItem("settings_lifestyleText", data.lifestyleText);
            }
            if (data.lifestyleImage !== undefined) {
              setLifestyleImage(data.lifestyleImage);
              localStorage.setItem("settings_lifestyleImage", data.lifestyleImage);
            }
            if (data.primaryColor !== undefined) {
              setPrimaryColor(data.primaryColor);
              if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.primaryColor);
              localStorage.setItem("settings_primaryColor", data.primaryColor);
            }
            if (data.heroBgType !== undefined) {
              setHeroBgType(data.heroBgType);
              localStorage.setItem("settings_heroBgType", data.heroBgType);
            }
            if (data.heroBgColor !== undefined) {
              setHeroBgColor(data.heroBgColor);
              localStorage.setItem("settings_heroBgColor", data.heroBgColor);
            }
            if (data.heroBgImage !== undefined) {
              setHeroBgImage(data.heroBgImage);
              localStorage.setItem("settings_heroBgImage", data.heroBgImage);
            }
            if (data.heroBgVideo !== undefined) {
              setHeroBgVideo(data.heroBgVideo);
              localStorage.setItem("settings_heroBgVideo", data.heroBgVideo);
            }
            if (data.showVideo !== undefined) {
              setShowVideo(data.showVideo);
              localStorage.setItem("settings_showVideo", String(data.showVideo));
            }
            if (data.showLifestyle !== undefined) {
              setShowLifestyle(data.showLifestyle);
              localStorage.setItem("settings_showLifestyle", String(data.showLifestyle));
            }
            if (data.faqs !== undefined && Array.isArray(data.faqs)) setFaqs(data.faqs);
          }
        })
        .catch(err => console.warn("Quietly catching storefront fetch error:", err.message || err));
    };

    loadData();
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  
  const totalArrivalsPages = Math.ceil(arrivals.length / itemsPerPage);
  const displayedArrivals = isMobile ? arrivals.slice((arrivalsPage - 1) * itemsPerPage, arrivalsPage * itemsPerPage) : arrivals.slice(0, 4);

  const totalBestSellersPages = Math.ceil(bestSellers.length / itemsPerPage);
  const displayedBestSellers = isMobile ? bestSellers.slice((bestSellersPage - 1) * itemsPerPage, bestSellersPage * itemsPerPage) : bestSellers.slice(0, 4);

  // Touch Handlers for Swipe
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEndArrivals = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && arrivalsPage < totalArrivalsPages) {
      setArrivalsDirection("forward");
      setArrivalsPage(p => p + 1);
    }
    if (isRightSwipe && arrivalsPage > 1) {
      setArrivalsDirection("backward");
      setArrivalsPage(p => p - 1);
    }
  };

  const handleTouchEndBestSellers = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && bestSellersPage < totalBestSellersPages) {
      setBestSellersDirection("forward");
      setBestSellersPage(p => p + 1);
    }
    if (isRightSwipe && bestSellersPage > 1) {
      setBestSellersDirection("backward");
      setBestSellersPage(p => p - 1);
    }
  };

  return (
    <div suppressHydrationWarning className={styles.page}>
      <Preloader />
      <style>{`
        @keyframes slideInFromRight {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutToLeft {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-30px); }
        }
        @keyframes slideInFromLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutToRight {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(30px); }
        }
      `}</style>
      
      {/* 2.5 Top Marquee Ticker */}
      {globalSettings?.showTicker && globalSettings?.tickerText && (
        <div className={styles.tickerContainer} style={{ backgroundColor: globalSettings?.tickerBgColor || "#ffffff", color: globalSettings?.tickerTextColor || "#000000" }}>
          <div className={styles.tickerTrack} style={{ animationDuration: `${(globalSettings.tickerSpeed || 60)}s` }}>
            {/* Group 1 (First 50%) */}
            {[...Array(4)].map((_, i) => (
              <span key={`t1-${i}`}>{globalSettings.tickerText}</span>
            ))}
            {/* Group 2 (Second 50% for seamless looping) */}
            {[...Array(4)].map((_, i) => (
              <span key={`t2-${i}`}>{globalSettings.tickerText}</span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Navigation Header */}
      <Navbar onCartClick={() => setShowCartDrawer(true)} />

      
      {/* 4. Hero Section */}
      <section 
        className={styles.hero}
        style={{
          backgroundColor: heroBgType === "color" ? (heroBgColor || "var(--primary-brand-color, #57bc74)") : "#121212",
          backgroundImage: heroBgType === "image" && heroBgImage ? `url("${heroBgImage}")` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: 
            heroTemplate === "top-left" || heroTemplate === "right-top" || heroTemplate === "top-center" ? "flex-start" : 
            heroTemplate === "bottom-left" || heroTemplate === "right-bottom" || heroTemplate === "bottom-center" ? "flex-end" : "center",
          alignItems: 
            heroTemplate === "center" || heroTemplate.endsWith("center") ? "center" : 
            heroTemplate.startsWith("right") ? "flex-end" : "flex-start",
          padding: 
            heroTemplate === "bottom-left" || heroTemplate === "right-bottom" || heroTemplate === "bottom-center" ? "100px 5vw" : 
            heroTemplate === "top-left" || heroTemplate === "right-top" || heroTemplate === "top-center" ? "100px 5vw" : "0 5vw",
          textAlign: 
            heroTemplate === "center" || heroTemplate.endsWith("center") ? "center" : 
            heroTemplate.startsWith("right") ? "right" : "left",
          minHeight: "80vh"
        }}
      >
        {heroBgType === "video" && heroBgVideo && (
          <video src={heroBgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
        )}
        {heroBgType !== "color" && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />}

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", width: "100%" }}>
          {showHeroTitle && (
            <h1 style={{
              fontFamily: heroTitleFontType ? `"${heroTitleFontType}", sans-serif` : "inherit",
              color: heroTitleFontColor,
              fontSize: heroTitleFontSize,
              fontWeight: Number(heroTitleFontWeight),
              margin: 0,
              lineHeight: "1.1"
            }}>
              {heroTitle || ""}
            </h1>
          )}
          {showHeroManifesto && (
            <p style={{
              fontFamily: heroManifestoFontType ? `"${heroManifestoFontType}", sans-serif` : "inherit",
              color: heroManifestoFontColor,
              fontSize: heroManifestoFontSize,
              fontWeight: Number(heroManifestoFontWeight),
              margin: 0,
              lineHeight: "1.6",
              textTransform: "uppercase",
              letterSpacing: "0.03em"
            }}>
              {heroManifesto || ""}
            </p>
          )}
          {showHeroButton && (() => {
            const btnColor = heroButtonColor ? heroButtonColor : (primaryColor || "#000");
            const isSolid = heroButtonStyle === "solid";
            const isOutline = heroButtonStyle === "outline";
            
            const paddings: Record<string, string> = { sm: "10px 24px", md: "14px 36px", lg: "18px 48px" };
            const fontSizes: Record<string, string> = { sm: "0.75rem", md: "0.85rem", lg: "0.95rem" };
            
            return (
              <div style={{ 
                marginTop: "10px", 
                alignSelf: 
                  heroTemplate === "center" || heroTemplate.endsWith("center") ? "center" : 
                  heroTemplate.startsWith("right") ? "flex-end" : "flex-start" 
              }}>
                <Link href="/shop" style={{
                  display: "inline-block",
                  padding: paddings[heroButtonSize] || paddings.md,
                  fontSize: fontSizes[heroButtonSize] || fontSizes.md,
                  backgroundColor: isSolid ? btnColor : "transparent",
                  color: isSolid ? (heroButtonTextColor || "#ffffff") : (heroButtonTextColor || btnColor),
                  border: isSolid || isOutline ? `2px solid ${btnColor}` : "none",
                  textDecoration: heroButtonStyle === "minimal" ? "underline" : "none",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  transition: "background 0.3s, transform 0.2s"
                }}>
                  {heroButtonText || ""}
                </Link>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 5. New Arrivals Video Section */}
      {showVideo && (
        <section
          className={styles.videoSection}
          style={{
            backgroundColor: videoBgType === "color" ? (videoBgColor || videoFallbackColor) : videoFallbackColor,
            backgroundImage: videoBgType === "image" && videoBgImage ? `url(${videoBgImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: videoTemplate === "bottom" ? "flex-end" : videoTemplate === "top" ? "flex-start" : "center",
            justifyContent: "center",
            position: "relative",
            minHeight: "100vh"
          }}
        >
          {videoBgType === "video" && videoUrl && (
            <video 
              ref={videoRef}
              key={videoUrl}
              className={styles.bgVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          )}
          
          {(videoBgType === "video" || videoBgType === "image") && <div className={styles.videoOverlay} style={{ backgroundColor: "rgba(0,0,0,0.4)", position: "absolute", inset: 0 }} />}
          
          <div className={styles.videoContent} style={{ position: "relative", zIndex: 10, textAlign: videoTitleFontAlignment as any, padding: "20px" }}>
            {showVideoTitle && (
              <h2 style={{
                fontFamily: videoTitleFontType,
                color: videoTitleFontColor,
                fontSize: videoTitleFontSize,
                fontWeight: videoTitleFontWeight,
                margin: "0 0 10px 0"
              }}>
                {videoTitle}
              </h2>
            )}
            {showVideoSubtitle && (
              <p style={{
                fontFamily: videoSubtitleFontType,
                color: videoSubtitleFontColor,
                fontSize: videoSubtitleFontSize,
                fontWeight: videoSubtitleFontWeight,
                margin: "0 0 20px 0"
              }}>
                {videoSubtitle}
              </p>
            )}
            {showVideoButton && (
              <Link href="/shop">
                <button style={{
                  padding: videoButtonSize === "sm" ? "8px 16px" : videoButtonSize === "lg" ? "16px 32px" : "12px 24px",
                  fontSize: videoButtonSize === "sm" ? "0.9rem" : videoButtonSize === "lg" ? "1.2rem" : "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "all 0.3s ease",
                  backgroundColor: videoButtonStyle === "solid" ? videoButtonColor : "transparent",
                  color: videoButtonStyle === "solid" ? videoButtonTextColor : videoButtonColor,
                  border: `2px solid ${videoButtonColor}`
                }}>
                  {videoButtonText}
                </button>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* 6. Latest Arrivals Products Section */}
      <section className={styles.arrivalsSection}>
        <div className={styles.arrivalsHeader}>
          <h2 className={styles.arrivalsTitle}>LATEST ARRIVALS</h2>
          <Link href="/shop?category=arrivals" className={styles.viewAllLink}>VIEW ALL</Link>
        </div>
        <div 
          key={`arrivals-${arrivalsPage}`}
          className={`${arrivals.length > 0 ? styles.arrivalsGrid : styles.emptyStateGrid} ${styles.slideAnimated} ${arrivalsDirection === "forward" ? styles.slideForward : styles.slideBackward}`}
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
                <div className={styles.productCard} style={product.quantity === 0 ? { pointerEvents: "none" } : {}}>
                  <div className={styles.productImageContainer} style={product.quantity === 0 ? { filter: "grayscale(1)", opacity: 0.7 } : {}}>
                    <img 
                      className={`${styles.productImage} ${styles.productImageFront}`} 
                      src={product.imageFront} 
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.imageBack && (
                      <img 
                        className={`${styles.productImage} ${styles.productImageBack}`} 
                        src={product.imageBack} 
                        alt={`${product.name} Alternate`}
                        loading="lazy"
                      />
                    )}
                    
                    {/* Arrow controls */}
                    <button 
                      aria-label="Previous image" 
                      className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.arrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                    <button 
                      aria-label="Next image" 
                      className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.arrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
    
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
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
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
          ) : (
            <div className={styles.emptyStateContainer}>
              <p>Our latest perfume arrivals are currently being prepared. Check back soon!</p>
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

      {/* 7. Lifestyle Banner Section */}
      {showLifestyle && (
        <section 
          className={styles.lifestyleBanner}
          style={{ backgroundImage: `url(${lifestyleImage})` }}
        >
          <div className={styles.lifestyleOverlay} />
          <p className={styles.lifestyleText}>{lifestyleText}</p>
        </section>
      )}

      {/* 8. Best Sellers Products Section */}
      <section className={styles.arrivalsSection}>
        <div className={styles.arrivalsHeader}>
          <h2 className={styles.arrivalsTitle}>BEST SELLERS</h2>
          <Link href="/shop?category=bestsellers" className={styles.viewAllLink}>SHOP ALL</Link>
        </div>
        <div 
          key={`bestsellers-${bestSellersPage}`}
          className={`${bestSellers.length > 0 ? styles.arrivalsGrid : styles.emptyStateGrid} ${styles.slideAnimated} ${bestSellersDirection === "forward" ? styles.slideForward : styles.slideBackward}`}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchMove={isMobile ? handleTouchMove : undefined}
          onTouchEnd={isMobile ? handleTouchEndBestSellers : undefined}
        >
          {bestSellers.length > 0 ? (
            displayedBestSellers.map((product) => (
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
                <div className={styles.productCard} style={product.quantity === 0 ? { pointerEvents: "none" } : {}}>
                  <div className={styles.productImageContainer} style={product.quantity === 0 ? { filter: "grayscale(1)", opacity: 0.7 } : {}}>
                    <img 
                      className={`${styles.productImage} ${styles.productImageFront}`} 
                      src={product.imageFront} 
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.imageBack && (
                      <img 
                        className={`${styles.productImage} ${styles.productImageBack}`} 
                        src={product.imageBack} 
                        alt={`${product.name} Alternate`}
                        loading="lazy"
                      />
                    )}
                    
                    {/* Arrow controls */}
                    <button 
                      aria-label="Previous image" 
                      className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.arrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                    <button 
                      aria-label="Next image" 
                      className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.arrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
    
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
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
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
          ) : (
            <div className={styles.emptyStateContainer}>
              <p>No featured best sellers cataloged yet. Check back soon!</p>
            </div>
          )}
        </div>
        {isMobile && totalBestSellersPages > 1 && (
          <div className={styles.mobilePagination}>
            <button 
              className={styles.paginationBtn}
              onClick={() => {
                setBestSellersDirection("backward");
                setBestSellersPage(p => Math.max(1, p - 1));
              }}
              disabled={bestSellersPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span>{bestSellersPage} / {totalBestSellersPages}</span>
            <button 
              className={styles.paginationBtn}
              onClick={() => {
                setBestSellersDirection("forward");
                setBestSellersPage(p => Math.min(totalBestSellersPages, p + 1));
              }}
              disabled={bestSellersPage === totalBestSellersPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </section>

      {/* 9. Customer Reviews Section */}
      <section style={{
        backgroundColor: "#f9fafb",
        padding: "80px 40px",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1100px",
          display: "flex",
          flexDirection: "column",
          gap: "35px"
        }}>
          {/* Header Title */}
          <h2 style={{
            fontSize: "2.2rem",
            fontWeight: 600,
            fontFamily: "Outfit, Inter, sans-serif",
            color: "#111827",
            margin: "0 0 10px 0",
            textAlign: "left"
          }}>
            Rating & Reviews
          </h2>

          {/* Grid Layout containing rating summary on left and review card on right */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(300px, 1fr) 1.2fr",
            gap: isMobile ? "30px" : "60px",
            alignItems: "center",
            width: "100%"
          }}>
            {/* Left Column: Summary Rating */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "40px",
              justifyContent: "space-between",
              flexDirection: "row",
              width: "100%"
            }}>
              {/* Overall Score */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <span style={{
                    fontSize: isMobile ? "4.5rem" : "7.5rem",
                    fontWeight: 700,
                    color: "#111827",
                    fontFamily: "Outfit, sans-serif",
                    lineHeight: "0.9"
                  }}>
                    {avgRating}
                  </span>
                  <span style={{
                    fontSize: "2.2rem",
                    color: "#9ca3af",
                    fontWeight: 500,
                    marginLeft: "4px"
                  }}>
                    /5
                  </span>
                </div>
                <span style={{
                  fontSize: "1rem",
                  color: "#9ca3af",
                  fontWeight: 500,
                  marginTop: "16px",
                  fontFamily: "Inter, sans-serif"
                }}>
                  ({totalReviews} Reviews)
                </span>
              </div>

              {/* Progress Bars */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                flexGrow: 1,
                maxWidth: "240px"
              }}>
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#000000", fontSize: "1.1rem" }}>★</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", width: "12px" }}>{star}</span>
                    <div style={{ flexGrow: 1, height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", position: "relative" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${getRatingPercent(star)}%`, backgroundColor: "#111827", borderRadius: "4px", transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Review Card */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: isMobile ? "20px" : "32px",
              boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.03)",
              minHeight: isMobile ? "auto" : "220px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative"
            }}>
              <div style={{
                animation: reviewFade 
                  ? (slideDirection === "forward" ? "slideInFromRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" : "slideInFromLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards") 
                  : (slideDirection === "forward" ? "slideOutToLeft 0.3s ease forwards" : "slideOutToRight 0.3s ease forwards"),
              }}>
                {totalReviews === 0 ? (
                  <div style={{ padding: "40px 0", textAlign: "center" }}>
                    <p style={{ fontSize: "1.2rem", color: "#6b7280", fontFamily: "Inter, sans-serif", margin: 0 }}>
                      No reviews yet. Check out our products and be the first to leave a review!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Name and Date Row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: 600, fontSize: "1.1rem", color: "#111827", fontFamily: "Outfit, sans-serif" }}>
                        {allReviews[currentReviewIndex]?.name}
                      </span>
                      {/* Date */}
                      <span style={{
                        fontSize: "0.9rem",
                        color: "#9ca3af",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500
                      }}>
                        {allReviews[currentReviewIndex]?.date}
                      </span>
                    </div>
                    {/* Stars Row */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "16px"
                    }}>
                      {/* Black Stars */}
                      <div style={{ display: "flex", gap: "2px", color: "#000000", fontSize: "1.1rem" }}>
                        {"★".repeat(allReviews[currentReviewIndex]?.rating || 5)}
                      </div>
                    </div>
                    {/* Review text */}
                    <p style={{
                      fontSize: "1.1rem",
                      color: "#374151",
                      fontFamily: "Inter, sans-serif",
                      lineHeight: "1.6",
                      margin: 0
                    }}>
                      &ldquo;{allReviews[currentReviewIndex]?.text}&rdquo;
                    </p>
                  </>
                )}
              </div>

              {/* Dynamic Dots Carousel */}
              <div style={{ display: "flex", gap: "6px", overflow: "hidden", borderRadius: "100px", height: "6px", backgroundColor: "#e5e7eb" }}>
                {allReviews.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (i === currentReviewIndex) return;
                      setSlideDirection(i > currentReviewIndex ? "forward" : "backward");
                      setReviewFade(false);
                      setTimeout(() => {
                        setCurrentReviewIndex(i);
                        setReviewFade(true);
                      }, 200);
                    }}
                    style={{
                      flex: 1,
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {/* Active Bar indicator */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "#111827",
                      opacity: currentReviewIndex === i ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      borderRadius: "100px"
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Frequently Asked Questions Section */}
      <section className={styles.faqSection}>
        <h2 className={styles.faqTitle}>FREQUENTLY ASKED QUESTIONS</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem} onClick={() => toggleFaq(index)}>
              <div className={styles.faqItemHeader}>
                <span className={styles.faqQuestion}>{faq.question.toUpperCase()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`${styles.faqChevron} ${activeFaq === index ? styles.faqChevronActive : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <div className={`${styles.faqItemContent} ${activeFaq === index ? styles.faqItemContentActive : ""}`}>
                <p className={styles.faqAnswerText}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Gift Set Builder Banner Section */}
      <section className={styles.giftSetBannerSection}>
        <div className={styles.giftSetBannerCard}>
          <div className={styles.giftSetContentLeft}>
            <div className={styles.giftSetBadge}>
              <span className={styles.giftSetSparkle}>✦</span> LIMITED COLLECTION
            </div>
            <h2 className={styles.giftSetTitle}>Gift Set Builder</h2>
            <p className={styles.giftSetSubtitle}>
              Curate any 3 fragrances in 20 ml, 50 ml, or 100 ml — beautifully packed in a signature gift box.
            </p>
            <div className={styles.giftSetPills}>
              <span className={styles.giftSetPill}>20 ml × 3</span>
              <span className={styles.giftSetPill}>50 ml × 3</span>
              <span className={styles.giftSetPill}>100 ml × 3</span>
            </div>
          </div>
          <div className={styles.giftSetActionRight}>
            <Link href="/gift-set" className={styles.buildSetBtn}>
              Build a Set
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

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

      {/* Realtime Checkout Drawer and Success Overlay */}
      <CheckoutDrawer
        isOpen={showCheckoutDrawer}
        onClose={() => setShowCheckoutDrawer(false)}
        cartItems={cartItems}
        primaryColor={primaryColor}
        onOrderSuccess={handleOrderSuccess}
      />
      <OrderSuccessModal
        isOpen={showSuccessModal}
        orderId={completedOrderId}
        orderDetails={completedOrderDetails}
        onClose={() => setShowSuccessModal(false)}
        primaryColor={primaryColor}
      />
      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
}
