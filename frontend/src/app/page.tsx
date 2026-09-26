'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Footer from "@/components/Footer";

import Navbar from "@/components/Navbar/Navbar";
import Preloader from "@/components/Preloader";
import CartDrawer from "@/components/CartDrawer";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import QuickViewDrawer from "@/components/QuickViewDrawer";
import HeroSection from "@/components/home/HeroSection";
import VideoBanner from "@/components/home/VideoBanner";
import ArrivalsSection from "@/components/home/ArrivalsSection";
import RecentlyViewedSection from "@/components/home/RecentlyViewedSection";
import TrustIconBar from "@/components/home/TrustIconBar";
import { useCart } from "@/context/CartContext";
import { saveCart, clearCart, fetchAndSyncUserCart } from "@/utils/cartSync";

const defaultProducts: any[] = [];


interface FaqItem {
  question: string;
  answer: string;
}

// removed reviewsData

const defaultFaqs: FaqItem[] = [];

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
  const [isStorefrontError, setIsStorefrontError] = useState<boolean>(false);
  const [isStorefrontLoading, setIsStorefrontLoading] = useState<boolean>(true);
  const [storefrontErrorMessage, setStorefrontErrorMessage] = useState<string>("");
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
  const [activeImageIndexes, setActiveImageIndexes] = useState<{ [productId: string]: number }>({});
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  const getProductImages = (product: any) => {
    const list: string[] = [];
    if (product.imageFront) list.push(product.imageFront);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: string) => {
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

  const handlePrevImage = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const imagesList = getProductImages(product);
    if (imagesList.length <= 1) return;
    
    const currentIndex = activeImageIndexes[product._id] ?? 0;
    const nextIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
    setActiveImageIndexes(prev => ({ ...prev, [product._id]: nextIndex }));
  };

  const handleNextImage = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const imagesList = getProductImages(product);
    if (imagesList.length <= 1) return;
    
    const currentIndex = activeImageIndexes[product._id] ?? 0;
    const nextIndex = (currentIndex + 1) % imagesList.length;
    setActiveImageIndexes(prev => ({ ...prev, [product._id]: nextIndex }));
  };

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

  // Mobile Hero Layout States (Completely Unlinked from Desktop)
  const [mobileHeroTemplate, setMobileHeroTemplate] = useState<string>("center");
  const [mobileHeroTitle, setMobileHeroTitle] = useState<string>("");
  const [mobileHeroTitleFontType, setMobileHeroTitleFontType] = useState<string>("Outfit");
  const [mobileHeroTitleFontColor, setMobileHeroTitleFontColor] = useState<string>("#111827");
  const [mobileHeroTitleFontSize, setMobileHeroTitleFontSize] = useState<string>("2.5rem");
  const [mobileHeroTitleFontAlignment, setMobileHeroTitleFontAlignment] = useState<string>("center");
  const [mobileHeroTitleFontWeight, setMobileHeroTitleFontWeight] = useState<string>("700");
  const [showMobileHeroTitle, setShowMobileHeroTitle] = useState<boolean>(true);

  const [mobileHeroManifesto, setMobileHeroManifesto] = useState<string>("");
  const [mobileHeroManifestoFontType, setMobileHeroManifestoFontType] = useState<string>("Outfit");
  const [mobileHeroManifestoFontColor, setMobileHeroManifestoFontColor] = useState<string>("#ffffff");
  const [mobileHeroManifestoFontSize, setMobileHeroManifestoFontSize] = useState<string>("0.85rem");
  const [mobileHeroManifestoFontAlignment, setMobileHeroManifestoFontAlignment] = useState<string>("center");
  const [mobileHeroManifestoFontWeight, setMobileHeroManifestoFontWeight] = useState<string>("500");
  const [showMobileHeroManifesto, setShowMobileHeroManifesto] = useState<boolean>(true);

  const [mobileHeroButtonText, setMobileHeroButtonText] = useState<string>("Shop Now");
  const [mobileHeroButtonStyle, setMobileHeroButtonStyle] = useState<string>("solid");
  const [mobileHeroButtonSize, setMobileHeroButtonSize] = useState<string>("sm");
  const [mobileHeroButtonColor, setMobileHeroButtonColor] = useState<string>("");
  const [mobileHeroButtonTextColor, setMobileHeroButtonTextColor] = useState<string>("#ffffff");
  const [showMobileHeroButton, setShowMobileHeroButton] = useState<boolean>(true);

  // Mobile-specific Video Layout state (unlinked)
  const [mobileVideoTemplate, setMobileVideoTemplate] = useState<string>("center");
  const [mobileVideoTitle, setMobileVideoTitle] = useState<string>("");
  const [mobileVideoTitleFontType, setMobileVideoTitleFontType] = useState<string>("Outfit");
  const [mobileVideoTitleFontColor, setMobileVideoTitleFontColor] = useState<string>("#ffffff");
  const [mobileVideoTitleFontSize, setMobileVideoTitleFontSize] = useState<string>("2.5rem");
  const [mobileVideoTitleFontAlignment, setMobileVideoTitleFontAlignment] = useState<string>("center");
  const [mobileVideoTitleFontWeight, setMobileVideoTitleFontWeight] = useState<string>("700");
  const [showMobileVideoTitle, setShowMobileVideoTitle] = useState<boolean>(true);

  const [mobileVideoSubtitle, setMobileVideoSubtitle] = useState<string>("");
  const [mobileVideoSubtitleFontType, setMobileVideoSubtitleFontType] = useState<string>("Outfit");
  const [mobileVideoSubtitleFontColor, setMobileVideoSubtitleFontColor] = useState<string>("#ffffff");
  const [mobileVideoSubtitleFontSize, setMobileVideoSubtitleFontSize] = useState<string>("0.85rem");
  const [mobileVideoSubtitleFontAlignment, setMobileVideoSubtitleFontAlignment] = useState<string>("center");
  const [mobileVideoSubtitleFontWeight, setMobileVideoSubtitleFontWeight] = useState<string>("500");
  const [showMobileVideoSubtitle, setShowMobileVideoSubtitle] = useState<boolean>(true);

  const [mobileVideoButtonText, setMobileVideoButtonText] = useState<string>("Shop Now");
  const [mobileVideoButtonStyle, setMobileVideoButtonStyle] = useState<string>("outline");
  const [mobileVideoButtonSize, setMobileVideoButtonSize] = useState<string>("sm");
  const [mobileVideoButtonColor, setMobileVideoButtonColor] = useState<string>("#ffffff");
  const [mobileVideoButtonTextColor, setMobileVideoButtonTextColor] = useState<string>("#121212");
  const [showMobileVideoButton, setShowMobileVideoButton] = useState<boolean>(true);


  const [videoTitle, setVideoTitle] = useState<string>("NEW ARRIVALS");
  const [videoSubtitle, setVideoSubtitle] = useState<string>("Drop's live. Shop the exclusive new collection now.");
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

  const [lifestyleText, setLifestyleText] = useState<string>("Uncompromising Quality, Curated for You. Discover 29sFORMULA.");
  const [lifestyleImage, setLifestyleImage] = useState<string>("https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
  const [lifestyleTextFontType, setLifestyleTextFontType] = useState<string>("Outfit");
  const [lifestyleTextFontColor, setLifestyleTextFontColor] = useState<string>("#ffffff");
  const [lifestyleTextFontSize, setLifestyleTextFontSize] = useState<string>("2.5rem");
  const [lifestyleTextFontAlignment, setLifestyleTextFontAlignment] = useState<string>("center");
  const [lifestyleTextFontWeight, setLifestyleTextFontWeight] = useState<string>("700");
  const [showLifestyleText, setShowLifestyleText] = useState<boolean>(true);
  const [showLifestyleButton, setShowLifestyleButton] = useState<boolean>(true);
  const [lifestyleButtonText, setLifestyleButtonText] = useState<string>("Explore Now");
  const [lifestyleButtonStyle, setLifestyleButtonStyle] = useState<string>("solid");
  const [lifestyleButtonSize, setLifestyleButtonSize] = useState<string>("md");
  const [lifestyleButtonColor, setLifestyleButtonColor] = useState<string>("");
  const [lifestyleButtonTextColor, setLifestyleButtonTextColor] = useState<string>("#ffffff");

  const [mobileLifestyleText, setMobileLifestyleText] = useState<string>("");
  const [mobileLifestyleTextFontType, setMobileLifestyleTextFontType] = useState<string>("Outfit");
  const [mobileLifestyleTextFontColor, setMobileLifestyleTextFontColor] = useState<string>("#ffffff");
  const [mobileLifestyleTextFontSize, setMobileLifestyleTextFontSize] = useState<string>("1.8rem");
  const [mobileLifestyleTextFontAlignment, setMobileLifestyleTextFontAlignment] = useState<string>("center");
  const [mobileLifestyleTextFontWeight, setMobileLifestyleTextFontWeight] = useState<string>("700");
  const [showMobileLifestyleText, setShowMobileLifestyleText] = useState<boolean>(true);
  const [showMobileLifestyleButton, setShowMobileLifestyleButton] = useState<boolean>(true);
  const [mobileLifestyleButtonText, setMobileLifestyleButtonText] = useState<string>("Explore Now");
  const [mobileLifestyleButtonStyle, setMobileLifestyleButtonStyle] = useState<string>("solid");
  const [mobileLifestyleButtonSize, setMobileLifestyleButtonSize] = useState<string>("sm");
  const [mobileLifestyleButtonColor, setMobileLifestyleButtonColor] = useState<string>("");
  const [mobileLifestyleButtonTextColor, setMobileLifestyleButtonTextColor] = useState<string>("#ffffff");

  useEffect(() => {
    [heroTitleFontType, heroManifestoFontType, videoTitleFontType, videoSubtitleFontType, mobileHeroTitleFontType, mobileHeroManifestoFontType, mobileVideoTitleFontType, mobileVideoSubtitleFontType, lifestyleTextFontType, mobileLifestyleTextFontType].forEach(font => {
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
  }, [heroTitleFontType, heroManifestoFontType, videoTitleFontType, videoSubtitleFontType, mobileHeroTitleFontType, mobileHeroManifestoFontType, mobileVideoTitleFontType, mobileVideoSubtitleFontType, lifestyleTextFontType, mobileLifestyleTextFontType]);
  const [primaryColor, setPrimaryColor] = useState<string>(
    "#57bc74"
  );
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [showLifestyle, setShowLifestyle] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Global Cart Context
  const {
    cartItems,
    showCartDrawer,
    setShowCartDrawer,
    isCartClosing,
    cartError,
    addToCart,
    updateQuantity,
    closeCartDrawer,
    clearCart
  } = useCart();

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
    closeCartDrawer();
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

    // Clear cart locally and on backend
    clearCart();
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.warn("Autoplay was prevented by browser:", e));
    }
  }, [videoUrl]);

  const loadData = useCallback(() => {
    setIsStorefrontLoading(true);
    setIsStorefrontError(false);
    setStorefrontErrorMessage("");

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/storefront/home`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
        return res.json();
      })
      .then(payload => {
        setIsStorefrontLoading(false);
        setIsStorefrontError(false);
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

          // Mobile Hero Layout Loading (unlinked)
          if (data.mobileHeroTemplate !== undefined) setMobileHeroTemplate(data.mobileHeroTemplate);
          if (data.mobileHeroTitle !== undefined) setMobileHeroTitle(data.mobileHeroTitle);
          if (data.mobileHeroTitleFontType !== undefined) setMobileHeroTitleFontType(data.mobileHeroTitleFontType);
          if (data.mobileHeroTitleFontColor !== undefined) setMobileHeroTitleFontColor(data.mobileHeroTitleFontColor);
          if (data.mobileHeroTitleFontSize !== undefined) setMobileHeroTitleFontSize(data.mobileHeroTitleFontSize);
          if (data.mobileHeroTitleFontAlignment !== undefined) setMobileHeroTitleFontAlignment(data.mobileHeroTitleFontAlignment);
          if (data.mobileHeroTitleFontWeight !== undefined) setMobileHeroTitleFontWeight(data.mobileHeroTitleFontWeight);
          if (data.showMobileHeroTitle !== undefined) setShowMobileHeroTitle(data.showMobileHeroTitle);

          if (data.mobileHeroManifesto !== undefined) setMobileHeroManifesto(data.mobileHeroManifesto);
          if (data.mobileHeroManifestoFontType !== undefined) setMobileHeroManifestoFontType(data.mobileHeroManifestoFontType);
          if (data.mobileHeroManifestoFontColor !== undefined) setMobileHeroManifestoFontColor(data.mobileHeroManifestoFontColor);
          if (data.mobileHeroManifestoFontSize !== undefined) setMobileHeroManifestoFontSize(data.mobileHeroManifestoFontSize);
          if (data.mobileHeroManifestoFontAlignment !== undefined) setMobileHeroManifestoFontAlignment(data.mobileHeroManifestoFontAlignment);
          if (data.mobileHeroManifestoFontWeight !== undefined) setMobileHeroManifestoFontWeight(data.mobileHeroManifestoFontWeight);
          if (data.showMobileHeroManifesto !== undefined) setShowMobileHeroManifesto(data.showMobileHeroManifesto);

          if (data.mobileHeroButtonText !== undefined) setMobileHeroButtonText(data.mobileHeroButtonText);
          if (data.mobileHeroButtonStyle !== undefined) setMobileHeroButtonStyle(data.mobileHeroButtonStyle);
          if (data.mobileHeroButtonSize !== undefined) setMobileHeroButtonSize(data.mobileHeroButtonSize);
          if (data.mobileHeroButtonColor !== undefined) setMobileHeroButtonColor(data.mobileHeroButtonColor);
          if (data.mobileHeroButtonTextColor !== undefined) setMobileHeroButtonTextColor(data.mobileHeroButtonTextColor);
          if (data.showMobileHeroButton !== undefined) setShowMobileHeroButton(data.showMobileHeroButton);
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

          // Mobile Video Layout Loading (unlinked)
          if (data.mobileVideoTemplate !== undefined) setMobileVideoTemplate(data.mobileVideoTemplate);
          if (data.mobileVideoTitle !== undefined) setMobileVideoTitle(data.mobileVideoTitle);
          if (data.mobileVideoTitleFontType !== undefined) setMobileVideoTitleFontType(data.mobileVideoTitleFontType);
          if (data.mobileVideoTitleFontColor !== undefined) setMobileVideoTitleFontColor(data.mobileVideoTitleFontColor);
          if (data.mobileVideoTitleFontSize !== undefined) setMobileVideoTitleFontSize(data.mobileVideoTitleFontSize);
          if (data.mobileVideoTitleFontAlignment !== undefined) setMobileVideoTitleFontAlignment(data.mobileVideoTitleFontAlignment);
          if (data.mobileVideoTitleFontWeight !== undefined) setMobileVideoTitleFontWeight(data.mobileVideoTitleFontWeight);
          if (data.showMobileVideoTitle !== undefined) setShowMobileVideoTitle(data.showMobileVideoTitle);

          if (data.mobileVideoSubtitle !== undefined) setMobileVideoSubtitle(data.mobileVideoSubtitle);
          if (data.mobileVideoSubtitleFontType !== undefined) setMobileVideoSubtitleFontType(data.mobileVideoSubtitleFontType);
          if (data.mobileVideoSubtitleFontColor !== undefined) setMobileVideoSubtitleFontColor(data.mobileVideoSubtitleFontColor);
          if (data.mobileVideoSubtitleFontSize !== undefined) setMobileVideoSubtitleFontSize(data.mobileVideoSubtitleFontSize);
          if (data.mobileVideoSubtitleFontAlignment !== undefined) setMobileVideoSubtitleFontAlignment(data.mobileVideoSubtitleFontAlignment);
          if (data.mobileVideoSubtitleFontWeight !== undefined) setMobileVideoSubtitleFontWeight(data.mobileVideoSubtitleFontWeight);
          if (data.showMobileVideoSubtitle !== undefined) setShowMobileVideoSubtitle(data.showMobileVideoSubtitle);

          if (data.mobileVideoButtonText !== undefined) setMobileVideoButtonText(data.mobileVideoButtonText);
          if (data.mobileVideoButtonStyle !== undefined) setMobileVideoButtonStyle(data.mobileVideoButtonStyle);
          if (data.mobileVideoButtonSize !== undefined) setMobileVideoButtonSize(data.mobileVideoButtonSize);
          if (data.mobileVideoButtonColor !== undefined) setMobileVideoButtonColor(data.mobileVideoButtonColor);
          if (data.mobileVideoButtonTextColor !== undefined) setMobileVideoButtonTextColor(data.mobileVideoButtonTextColor);
          if (data.showMobileVideoButton !== undefined) setShowMobileVideoButton(data.showMobileVideoButton);
          if (data.lifestyleText !== undefined) {
            setLifestyleText(data.lifestyleText);
            localStorage.setItem("settings_lifestyleText", data.lifestyleText);
          }
          if (data.lifestyleImage !== undefined) {
            setLifestyleImage(data.lifestyleImage);
            localStorage.setItem("settings_lifestyleImage", data.lifestyleImage);
          }
          if (data.lifestyleTextFontType !== undefined) setLifestyleTextFontType(data.lifestyleTextFontType);
          if (data.lifestyleTextFontColor !== undefined) setLifestyleTextFontColor(data.lifestyleTextFontColor);
          if (data.lifestyleTextFontSize !== undefined) setLifestyleTextFontSize(data.lifestyleTextFontSize);
          if (data.lifestyleTextFontAlignment !== undefined) setLifestyleTextFontAlignment(data.lifestyleTextFontAlignment);
          if (data.lifestyleTextFontWeight !== undefined) setLifestyleTextFontWeight(data.lifestyleTextFontWeight);
          if (data.showLifestyleText !== undefined) setShowLifestyleText(data.showLifestyleText);
          if (data.showLifestyleButton !== undefined) setShowLifestyleButton(data.showLifestyleButton);
          if (data.lifestyleButtonText !== undefined) setLifestyleButtonText(data.lifestyleButtonText);
          if (data.lifestyleButtonStyle !== undefined) setLifestyleButtonStyle(data.lifestyleButtonStyle);
          if (data.lifestyleButtonSize !== undefined) setLifestyleButtonSize(data.lifestyleButtonSize);
          if (data.lifestyleButtonColor !== undefined) setLifestyleButtonColor(data.lifestyleButtonColor);
          if (data.lifestyleButtonTextColor !== undefined) setLifestyleButtonTextColor(data.lifestyleButtonTextColor);

          if (data.mobileLifestyleText !== undefined) setMobileLifestyleText(data.mobileLifestyleText);
          if (data.mobileLifestyleTextFontType !== undefined) setMobileLifestyleTextFontType(data.mobileLifestyleTextFontType);
          if (data.mobileLifestyleTextFontColor !== undefined) setMobileLifestyleTextFontColor(data.mobileLifestyleTextFontColor);
          if (data.mobileLifestyleTextFontSize !== undefined) setMobileLifestyleTextFontSize(data.mobileLifestyleTextFontSize);
          if (data.mobileLifestyleTextFontAlignment !== undefined) setMobileLifestyleTextFontAlignment(data.mobileLifestyleTextFontAlignment);
          if (data.mobileLifestyleTextFontWeight !== undefined) setMobileLifestyleTextFontWeight(data.mobileLifestyleTextFontWeight);
          if (data.showMobileLifestyleText !== undefined) setShowMobileLifestyleText(data.showMobileLifestyleText);
          if (data.showMobileLifestyleButton !== undefined) setShowMobileLifestyleButton(data.showMobileLifestyleButton);
          if (data.mobileLifestyleButtonText !== undefined) setMobileLifestyleButtonText(data.mobileLifestyleButtonText);
          if (data.mobileLifestyleButtonStyle !== undefined) setMobileLifestyleButtonStyle(data.mobileLifestyleButtonStyle);
          if (data.mobileLifestyleButtonSize !== undefined) setMobileLifestyleButtonSize(data.mobileLifestyleButtonSize);
          if (data.mobileLifestyleButtonColor !== undefined) setMobileLifestyleButtonColor(data.mobileLifestyleButtonColor);
          if (data.mobileLifestyleButtonTextColor !== undefined) setMobileLifestyleButtonTextColor(data.mobileLifestyleButtonTextColor);
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
      .catch(err => {
        console.warn("Storefront fetch error:", err.message || err);
        setIsStorefrontLoading(false);
        setIsStorefrontError(true);
        setStorefrontErrorMessage(err.message || "Failed to load live catalog");
      });
  }, []);

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

    loadData();
  }, [loadData]);

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

      {/* 3.5 Storefront Error Alert & Retry Bar */}
      {isStorefrontError && (
        <div style={{
          backgroundColor: "#1f2937",
          color: "#f9fafb",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "0.85rem",
          borderBottom: "1px solid #374151",
          position: "relative",
          zIndex: 99
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ display: "inline-flex", padding: "4px", backgroundColor: "rgba(239, 68, 68, 0.15)", borderRadius: "50%", color: "#ef4444" }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </span>
            <span>
              <strong>Server Connection Alert:</strong> Unable to reach live server ({storefrontErrorMessage}). {arrivals.length > 0 ? "Showing cached catalog." : "Please check backend server."}
            </span>
          </div>
          <button
            onClick={() => loadData()}
            disabled={isStorefrontLoading}
            style={{
              backgroundColor: "#ffffff",
              color: "#111827",
              border: "none",
              padding: "7px 18px",
              borderRadius: "4px",
              fontWeight: 700,
              fontSize: "0.75rem",
              cursor: isStorefrontLoading ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
              opacity: isStorefrontLoading ? 0.7 : 1
            }}
          >
            {isStorefrontLoading ? (
              <>Retrying...</>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Retry Connection
              </>
            )}
          </button>
        </div>
      )}


      {/* 4. Hero Section */}
      <HeroSection
        isMobile={isMobile}
        heroTemplate={heroTemplate}
        mobileHeroTemplate={mobileHeroTemplate}
        heroTitle={heroTitle}
        mobileHeroTitle={mobileHeroTitle}
        heroTitleFontType={heroTitleFontType}
        mobileHeroTitleFontType={mobileHeroTitleFontType}
        heroTitleFontColor={heroTitleFontColor}
        mobileHeroTitleFontColor={mobileHeroTitleFontColor}
        heroTitleFontSize={heroTitleFontSize}
        mobileHeroTitleFontSize={mobileHeroTitleFontSize}
        heroTitleFontAlignment={heroTitleFontAlignment}
        mobileHeroTitleFontAlignment={mobileHeroTitleFontAlignment}
        heroTitleFontWeight={heroTitleFontWeight}
        mobileHeroTitleFontWeight={mobileHeroTitleFontWeight}
        showHeroTitle={showHeroTitle}
        showMobileHeroTitle={showMobileHeroTitle}

        heroManifesto={heroManifesto}
        mobileHeroManifesto={mobileHeroManifesto}
        heroManifestoFontType={heroManifestoFontType}
        mobileHeroManifestoFontType={mobileHeroManifestoFontType}
        heroManifestoFontColor={heroManifestoFontColor}
        mobileHeroManifestoFontColor={mobileHeroManifestoFontColor}
        heroManifestoFontSize={heroManifestoFontSize}
        mobileHeroManifestoFontSize={mobileHeroManifestoFontSize}
        heroManifestoFontAlignment={heroManifestoFontAlignment}
        mobileHeroManifestoFontAlignment={mobileHeroManifestoFontAlignment}
        heroManifestoFontWeight={heroManifestoFontWeight}
        mobileHeroManifestoFontWeight={mobileHeroManifestoFontWeight}
        showHeroManifesto={showHeroManifesto}
        showMobileHeroManifesto={showMobileHeroManifesto}

        heroButtonText={heroButtonText}
        mobileHeroButtonText={mobileHeroButtonText}
        heroButtonStyle={heroButtonStyle}
        mobileHeroButtonStyle={mobileHeroButtonStyle}
        heroButtonSize={heroButtonSize}
        mobileHeroButtonSize={mobileHeroButtonSize}
        heroButtonColor={heroButtonColor}
        mobileHeroButtonColor={mobileHeroButtonColor}
        heroButtonTextColor={heroButtonTextColor}
        mobileHeroButtonTextColor={mobileHeroButtonTextColor}
        showHeroButton={showHeroButton}
        showMobileHeroButton={showMobileHeroButton}

        heroBgType={heroBgType}
        heroBgColor={heroBgColor}
        heroBgImage={heroBgImage}
        heroBgVideo={heroBgVideo}
        primaryColor={primaryColor}
      />

      {/* 4.5 Trust Icon Bar Section */}
      <TrustIconBar primaryColor={primaryColor} isMobile={isMobile} />

      {/* 4.8 Recently Viewed Products Section */}
      <RecentlyViewedSection
        setQuickViewProduct={setQuickViewProduct}
        isMobile={isMobile}
      />

      {/* 5. Video Banner Section */}
      <VideoBanner
        showVideo={showVideo}
        isMobile={isMobile}
        videoTemplate={videoTemplate}
        mobileVideoTemplate={mobileVideoTemplate}
        videoTitle={videoTitle}
        mobileVideoTitle={mobileVideoTitle}
        videoTitleFontType={videoTitleFontType}
        mobileVideoTitleFontType={mobileVideoTitleFontType}
        videoTitleFontColor={videoTitleFontColor}
        mobileVideoTitleFontColor={mobileVideoTitleFontColor}
        videoTitleFontSize={videoTitleFontSize}
        mobileVideoTitleFontSize={mobileVideoTitleFontSize}
        videoTitleFontAlignment={videoTitleFontAlignment}
        mobileVideoTitleFontAlignment={mobileVideoTitleFontAlignment}
        videoTitleFontWeight={videoTitleFontWeight}
        mobileVideoTitleFontWeight={mobileVideoTitleFontWeight}
        showVideoTitle={showVideoTitle}
        showMobileVideoTitle={showMobileVideoTitle}

        videoSubtitle={videoSubtitle}
        mobileVideoSubtitle={mobileVideoSubtitle}
        videoSubtitleFontType={videoSubtitleFontType}
        mobileVideoSubtitleFontType={mobileVideoSubtitleFontType}
        videoSubtitleFontColor={videoSubtitleFontColor}
        mobileVideoSubtitleFontColor={mobileVideoSubtitleFontColor}
        videoSubtitleFontSize={videoSubtitleFontSize}
        mobileVideoSubtitleFontSize={mobileVideoSubtitleFontSize}
        videoSubtitleFontAlignment={videoSubtitleFontAlignment}
        mobileVideoSubtitleFontAlignment={mobileVideoSubtitleFontAlignment}
        videoSubtitleFontWeight={videoSubtitleFontWeight}
        mobileVideoSubtitleFontWeight={mobileVideoSubtitleFontWeight}
        showVideoSubtitle={showVideoSubtitle}
        showMobileVideoSubtitle={showMobileVideoSubtitle}

        videoButtonText={videoButtonText}
        mobileVideoButtonText={mobileVideoButtonText}
        videoButtonStyle={videoButtonStyle}
        mobileVideoButtonStyle={mobileVideoButtonStyle}
        videoButtonSize={videoButtonSize}
        mobileVideoButtonSize={mobileVideoButtonSize}
        videoButtonColor={videoButtonColor}
        mobileVideoButtonColor={mobileVideoButtonColor}
        videoButtonTextColor={videoButtonTextColor}
        mobileVideoButtonTextColor={mobileVideoButtonTextColor}
        showVideoButton={showVideoButton}
        showMobileVideoButton={showMobileVideoButton}

        videoBgType={videoBgType}
        videoBgColor={videoBgColor}
        videoFallbackColor={videoFallbackColor}
        videoBgImage={videoBgImage}
        videoUrl={videoUrl}
        videoRef={videoRef}
        primaryColor={primaryColor}
      />

      {/* 6. Latest Arrivals Products Section */}
      <ArrivalsSection
        arrivals={arrivals}
        displayedArrivals={displayedArrivals}
        isStorefrontLoading={isStorefrontLoading}
        isStorefrontError={isStorefrontError}
        storefrontErrorMessage={storefrontErrorMessage}
        isMobile={isMobile}
        arrivalsPage={arrivalsPage}
        totalArrivalsPages={totalArrivalsPages}
        arrivalsDirection={arrivalsDirection}
        activeImageIndexes={activeImageIndexes}
        hoveredProductId={hoveredProductId}
        setHoveredProductId={setHoveredProductId}
        setActiveImageIndexes={setActiveImageIndexes}
        handlePrevImage={handlePrevImage}
        handleNextImage={handleNextImage}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEndArrivals={handleTouchEndArrivals}
        setArrivalsDirection={setArrivalsDirection}
        setArrivalsPage={setArrivalsPage}
        setQuickViewProduct={setQuickViewProduct}
        loadData={loadData}
        getProductImages={getProductImages}
      />

      {/* 7. Lifestyle Banner Section */}
      {(() => {
        const activeShowLifestyleText = isMobile ? (showMobileLifestyleText !== undefined ? showMobileLifestyleText : showLifestyleText) : showLifestyleText;
        const activeLifestyleText = isMobile ? (mobileLifestyleText !== "" && mobileLifestyleText !== undefined ? mobileLifestyleText : lifestyleText) : lifestyleText;
        const activeTextFontType = isMobile ? (mobileLifestyleTextFontType || lifestyleTextFontType) : lifestyleTextFontType;
        const activeTextFontColor = isMobile ? (mobileLifestyleTextFontColor || lifestyleTextFontColor) : lifestyleTextFontColor;
        const activeTextFontSize = isMobile ? (mobileLifestyleTextFontSize || "1.8rem") : lifestyleTextFontSize;
        const activeTextFontAlignment = isMobile ? (mobileLifestyleTextFontAlignment || lifestyleTextFontAlignment || "center") : lifestyleTextFontAlignment;
        const activeTextFontWeight = isMobile ? (mobileLifestyleTextFontWeight || lifestyleTextFontWeight) : lifestyleTextFontWeight;

        const activeShowLifestyleButton = isMobile ? (showMobileLifestyleButton !== undefined ? showMobileLifestyleButton : showLifestyleButton) : showLifestyleButton;
        const activeLifestyleButtonText = isMobile ? (mobileLifestyleButtonText || lifestyleButtonText) : lifestyleButtonText;
        const activeLifestyleButtonStyle = isMobile ? (mobileLifestyleButtonStyle || lifestyleButtonStyle) : lifestyleButtonStyle;
        const activeLifestyleButtonSize = isMobile ? (mobileLifestyleButtonSize || "sm") : lifestyleButtonSize;
        const activeLifestyleButtonColor = isMobile ? (mobileLifestyleButtonColor !== undefined ? mobileLifestyleButtonColor : lifestyleButtonColor) : lifestyleButtonColor;
        const activeLifestyleButtonTextColor = isMobile ? (mobileLifestyleButtonTextColor || lifestyleButtonTextColor) : lifestyleButtonTextColor;

        if (!showLifestyle && !activeShowLifestyleText && !activeShowLifestyleButton) return null;

        const buttonPadding = activeLifestyleButtonSize === "sm" ? "8px 18px" : activeLifestyleButtonSize === "lg" ? "16px 36px" : "12px 28px";
        const buttonFontSize = activeLifestyleButtonSize === "sm" ? "0.82rem" : activeLifestyleButtonSize === "lg" ? "1.05rem" : "0.92rem";
        const effectiveButtonBg = activeLifestyleButtonStyle === "outline" ? "transparent" : (activeLifestyleButtonColor || primaryColor || "#ffffff");
        const effectiveButtonBorder = activeLifestyleButtonStyle === "outline" ? `2px solid ${activeLifestyleButtonColor || "#ffffff"}` : "none";

        return (
          <section
            className={styles.lifestyleBanner}
            style={{
              backgroundImage: `url(${lifestyleImage})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px"
            }}
          >
            <div className={styles.lifestyleOverlay} />
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", maxWidth: "900px", width: "100%", textAlign: activeTextFontAlignment as any || "center" }}>
              {activeShowLifestyleText && (
                <p
                  className={styles.lifestyleText}
                  style={{
                    fontFamily: activeTextFontType ? `"${activeTextFontType}", sans-serif` : "inherit",
                    color: activeTextFontColor,
                    fontSize: activeTextFontSize,
                    fontWeight: Number(activeTextFontWeight) || 700,
                    textAlign: (activeTextFontAlignment as any) || "center",
                    margin: 0
                  }}
                >
                  {activeLifestyleText}
                </p>
              )}

              {activeShowLifestyleButton && (
                <Link
                  href="/shop"
                  style={{
                    display: "inline-block",
                    padding: buttonPadding,
                    fontSize: buttonFontSize,
                    fontFamily: `"${activeTextFontType}", sans-serif`,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    borderRadius: "4px",
                    backgroundColor: effectiveButtonBg,
                    color: activeLifestyleButtonTextColor || "#ffffff",
                    border: effectiveButtonBorder,
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {activeLifestyleButtonText}
                </Link>
              )}
            </div>
          </section>
        );
      })()}

      {/* 8. Best Sellers Products Section */}
      <section className={styles.arrivalsSection}>
        <div className={styles.arrivalsHeader}>
          <h2 className={styles.arrivalsTitle}>BEST SELLERS</h2>
          <Link href="/collections?category=bestsellers" className={styles.viewAllLink}>VIEW ALL</Link>
        </div>
        <div
          key={`bestsellers-${bestSellersPage}`}
          className={`${(bestSellers.length > 0 || isStorefrontLoading) ? styles.arrivalsGrid : styles.emptyStateGrid} ${styles.slideAnimated} ${bestSellersDirection === "forward" ? styles.slideForward : styles.slideBackward}`}
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
              <div key={`bestseller_skel_${idx}`} className={styles.productCard}>
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
                    Failed to load best sellers catalog from server ({storefrontErrorMessage})
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
                <p>No featured best sellers cataloged yet. Check back soon!</p>
              )}
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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, fontSize: "1.1rem", color: "#111827", fontFamily: "Outfit, sans-serif" }}>
                          {allReviews[currentReviewIndex]?.name}
                        </span>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          backgroundColor: "#ecfdf5",
                          color: "#059669",
                          border: "1px solid #a7f3d0",
                          borderRadius: "100px",
                          padding: "2px 8px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          letterSpacing: "0.02em"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: "13px", height: "13px" }}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                          Verified Buyer
                        </span>
                      </div>
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
      {faqs && faqs.length > 0 && (
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
      )}



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
