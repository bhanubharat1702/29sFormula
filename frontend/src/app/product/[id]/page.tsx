'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import homeStyles from "@/app/page.module.css";
import Footer from "@/components/Footer";
import NewtonsCradleLoader from "@/components/NewtonsCradleLoader";

import CheckoutDrawer from "@/components/CheckoutDrawer";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import Navbar from "@/components/Navbar/Navbar";

interface Product {
  _id: string;
  name: string;
  price: number;
  strikePrice?: number;
  quantity?: number;
  description?: string;
  category: string | string[];
  imageFront: string;
  imageBack?: string;
  images?: string[];
  sizes?: string[];
  additionalInformation?: string;
  artOfWrapping?: string;
  onlineOrder?: string;
  variants?: any[];
}

const defaultProducts: Product[] = [];

export default function ProductDetailPage() {
  const { id } = useParams();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [primaryColor, setPrimaryColor] = useState<string>(
    "#57bc74"
  );
  const [allProducts, setAllProducts] = useState<Product[]>(defaultProducts);
  
  // Media Gallery states
  const [activeImg, setActiveImg] = useState<string>("");
  const [allImages, setAllImages] = useState<string[]>([]);
  
  // Swipe handling state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Customizer option choices
  const [selectedVolume, setSelectedVolume] = useState<string>("100ml");
  const [quantity, setQuantity] = useState<number>(1);
  

  // Cart Drawer State
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartError, setCartError] = useState<string | null>(null);

  const showCartError = (msg: string) => {
    setCartError(msg);
    setTimeout(() => setCartError(null), 3000);
  };

  const [isCartClosing, setIsCartClosing] = useState<boolean>(false);

  // Accordion State
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showModerationChart, setShowModerationChart] = useState<boolean>(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState<boolean>(false);
  const [reviewSort, setReviewSort] = useState<string>("Most recent");
  const [isReviewSortOpen, setIsReviewSortOpen] = useState<boolean>(false);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(3);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [explorePage, setExplorePage] = useState<number>(1);
  const [exploreDirection, setExploreDirection] = useState<string>("forward");
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [recentPage, setRecentPage] = useState<number>(1);
  const [recentDirection, setRecentDirection] = useState<string>("forward");

  useEffect(() => {
    if (product && product._id) {
      try {
        const match = document.cookie.match(/(^| )recently_viewed=([^;]+)/);
        let viewed = match ? JSON.parse(decodeURIComponent(match[2])) : [];
        if (!Array.isArray(viewed)) viewed = [];
        
        // Fallback for sandboxed IDE preview if cookies are failing to persist
        if (viewed.length === 0 && typeof window !== "undefined" && window.sessionStorage) {
           const sessionStored = window.sessionStorage.getItem("recently_viewed");
           if (sessionStored) viewed = JSON.parse(sessionStored);
        }
        
        viewed = viewed.filter((i: string) => i !== product._id);
        setRecentlyViewedIds([...viewed]);
        
        viewed.unshift(product._id);
        viewed = viewed.slice(0, 10);
        
        document.cookie = `recently_viewed=${encodeURIComponent(JSON.stringify(viewed))};path=/;max-age=${60*60*24*30}`;
        if (typeof window !== "undefined" && window.sessionStorage) {
           window.sessionStorage.setItem("recently_viewed", JSON.stringify(viewed));
        }
      } catch (e) {
        console.error("Error managing recently viewed cookie", e);
      }
    }
  }, [product]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => (prev === id ? null : id));
  };

  const [activeScrollIdx, setActiveScrollIdx] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isMobile || allImages.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = imageRefs.current.findIndex(ref => ref === entry.target);
          if (index !== -1) setActiveScrollIdx(index);
        }
      });
    }, { rootMargin: "-30% 0px -30% 0px", threshold: 0 });
    
    imageRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, [allImages, isMobile]);

  const scrollToImage = (index: number) => {
    if (imageRefs.current[index]) {
      imageRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

  // Session is now handled by Navbar

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
  // Coupon/Discount States
  const [couponCodeInput, setCouponCodeInput] = useState<string>("");
  const [appliedDiscount, setAppliedDiscount] = useState<any | null>(null);
  const [couponMessage, setCouponMessage] = useState<string>("");

  const handleApplyCoupon = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!couponCodeInput.trim()) return;

    try {
      const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/discounts/validate?code=${couponCodeInput.trim()}&subtotal=${cartSubtotal}`, { cache: "no-store" });
      if (res.ok) {
        const discount = await res.json();
        setAppliedDiscount(discount);
        setCouponMessage(`Coupon ${discount.code} applied successfully!`);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          zIndex: 10000
        });
      } else {
        const errData = await res.json().catch(() => null);
        setAppliedDiscount(null);
        setCouponMessage(errData?.error || "Invalid discount coupon code.");
      }
    } catch (err) {
      setCouponMessage("Could not validate coupon.");
    }
  };

  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  // Reviews Section State (Connected to MongoDB database)
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState<string>("");
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string>("");
  const [reviewsData, setReviewsData] = useState<any>({
    average: 0,
    total: 0,
    breakdown: [
      { stars: 5, percentage: 0, count: 0 },
      { stars: 4, percentage: 0, count: 0 },
      { stars: 3, percentage: 0, count: 0 },
      { stars: 2, percentage: 0, count: 0 },
      { stars: 1, percentage: 0, count: 0 },
    ]
  });
  
  // Real-world Reviews List State
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewFade, setReviewFade] = useState(true);

  const displayReviews = reviewsList;

  useEffect(() => {
    setCurrentReviewIndex(0);
  }, [reviewsList.length]);

  useEffect(() => {
    if (displayReviews.length <= 1) return;
    const interval = setInterval(() => {
      setReviewFade(false);
      setTimeout(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % displayReviews.length);
        setReviewFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [displayReviews.length]);

  // Review Photo Uploads & Lightbox State
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // FAQ Section State
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [faqsList, setFaqsList] = useState<any[]>([
    {
      question: "HOW DO I FIND MY PERFECT SCENT?",
      answer: "We recommend reviewing the scent notes on each product page or starting with our discovery set. Every 29sFORMULA fragrance is crafted with botanical essences that evolve dynamically on skin."
    },
    {
      question: "WHEN WILL MY NEW 29S BOTTLE ARRIVE?",
      answer: "Every order is hand-packaged with care. Express dispatch typically takes 1-2 business days, followed by 3-5 days delivery time across India with live tracking."
    },
    {
      question: "WHAT IS THE LONGEVITY & PROJECTION OF 29S PERFUMES?",
      answer: "Our formulations carry high essential oil concentrations (Extrait / Eau de Parfum grade), ensuring 8-12+ hours of long-lasting sillage on skin and fabric."
    },
    {
      question: "WHAT IF I WANT TO RETURN OR EXCHANGE?",
      answer: "We accept 7-day easy returns and exchanges for unopened bottles in original packaging. Damaged or defective items are replaced immediately with express delivery."
    },
    {
      question: "HOW SHOULD I STORE MY FRAGRANCE FOR LONGEST SHELF LIFE?",
      answer: "Store your bottle in a cool, dry place away from direct sunlight and temperature fluctuations to preserve the pure formulation notes for up to 3+ years."
    }
  ]);

  // Dynamic Admin Product Page CMS Settings
  const [showProductReviews, setShowProductReviews] = useState<boolean>(true);
  const [showProductExploreMore, setShowProductExploreMore] = useState<boolean>(true);
  const [showProductFaq, setShowProductFaq] = useState<boolean>(true);
  const [usageGuideText, setUsageGuideText] = useState<string>("Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes.");
  const [exploreMoreTitle, setExploreMoreTitle] = useState<string>("Don't Stop. Explore More.");
  const [deliverySubtext, setDeliverySubtext] = useState<string>("TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.");

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`, {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            uploadedUrls.push(data.url);
          }
        }
      } catch (err) {
        console.error("Failed to upload review photo:", err);
      }
    }

    setReviewImages(prev => [...prev, ...uploadedUrls]);
    setUploadingImage(false);
  };

  const handleRemoveReviewImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const fetchReviews = async (productId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/reviews/${productId}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setReviewsData({
          average: data.average || 0,
          total: data.total || 0,
          breakdown: data.breakdown || [
            { stars: 5, percentage: 0, count: 0 },
            { stars: 4, percentage: 0, count: 0 },
            { stars: 3, percentage: 0, count: 0 },
            { stars: 2, percentage: 0, count: 0 },
            { stars: 1, percentage: 0, count: 0 },
          ]
        });
        setReviewsList(data.reviews || []);
      }
    } catch (err) {
      console.warn("Failed to fetch database reviews:", err);
    }
  };

  useEffect(() => {
    if (product && product._id) {
      fetchReviews(product._id);
    }
  }, [product]);


  // Lock background page scroll when review modal, cart drawer, or lightbox is open
  useEffect(() => {
    if (showReviewModal || showCartDrawer || lightboxImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showReviewModal, showCartDrawer, lightboxImg]);


  const handleToggleHelpful = async (reviewId: string) => {
    setReviewsList(prev => prev.map(rev => {
      const idStr = rev._id || rev.id;
      if (idStr === reviewId) {
        const isLiked = rev.userLiked;
        return {
          ...rev,
          userLiked: !isLiked,
          helpful: isLiked ? Math.max(0, rev.helpful - 1) : rev.helpful + 1
        };
      }
      return rev;
    }));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: true })
      });
    } catch (e) {
      console.warn("Failed to update helpful count:", e);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !product._id) return;

    try {
      const payload = {
        productId: product._id,
        author: reviewerName.trim() || "Anonymous",
        rating: userRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        location: "IN",
        images: reviewImages
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setReviewsData({
          average: data.average,
          total: data.total,
          breakdown: data.breakdown
        });
        setReviewsList(data.reviews);
        setReviewSuccessMsg("Thank you! Your review has been saved to the database.");
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccessMsg("");
          setReviewerName("");
          setReviewTitle("");
          setReviewComment("");
          setReviewImages([]);
        }, 1200);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to post review");
      }
    } catch (err) {
      console.error("Failed to save review:", err);
      alert("Network error: Could not connect to backend server to save review.");
    }
  };

  const renderStars = (rating: number, size = 20) => {
    const stars = [];
    const activeStarColor = "#000000";
    for (let i = 1; i <= 5; i++) {
      const fillPercent = Math.min(Math.max((rating - (i - 1)) * 100, 0), 100);
      const gradId = `starGrad-${i}-${Math.round(fillPercent)}-${Math.random().toString(36).substring(2, 6)}`;

      if (fillPercent >= 100) {
        stars.push(
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={activeStarColor}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      } else if (fillPercent <= 0) {
        stars.push(
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#d1d5db">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={gradId}>
                <stop offset={`${fillPercent}%`} stopColor={activeStarColor} />
                <stop offset={`${fillPercent}%`} stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path fill={`url(#${gradId})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      }
    }
    return stars;
  };

  const initiateCheckout = () => {
    setShowCartDrawer(false);
    setCheckoutItems(cartItems);
    setShowCheckoutDrawer(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const variantPrice = ((product as any).options && (product as any).options.find((o: any) => o.size === selectedVolume)?.price) 
                      || ((product as any).variants && (product as any).variants.find((v: any) => v.size === selectedVolume)?.price)
                      || product.price;
        // @ts-ignore
        const variantStrikePrice = ((product as any).options && (product as any).options.find((o: any) => o.size === selectedVolume)?.strikePrice) 
                          || ((product as any).variants && (product as any).variants.find((v: any) => v.size === selectedVolume)?.strikePrice)
                          || (product as any).strikePrice;

    const buyNowItem = {
      _id: product._id,
      name: product.name,
      price: variantPrice,
      strikePrice: variantStrikePrice,
      size: selectedVolume,
      quantity: quantity,
      imageFront: product.imageFront
    };
    setCheckoutItems([buyNowItem]);
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
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  const addToCart = (product: any, size: string = "50ml", qtyToAdd: number = 1) => {
    if (typeof window !== "undefined") {
      const current = localStorage.getItem("cart");
      let itemsList = [];
      if (current) {
        try {
          itemsList = JSON.parse(current);
        } catch (e) {}
      }
      
      const existingIdx = itemsList.findIndex((item: any) => item._id === product._id && item.size === size);
      if (existingIdx > -1) {
        const maxS = itemsList[existingIdx].maxStock ?? ((product.variants && product.variants.find((v: any) => v.size === size)?.quantity) ?? product.quantity);
        if (itemsList[existingIdx].quantity + qtyToAdd > maxS) {
          showCartError(`Only ${maxS} units of ${product.name} (${size}) are available in stock.`);
          itemsList[existingIdx].quantity = maxS;
          setShowCartDrawer(true);
        } else {
          itemsList[existingIdx].quantity += qtyToAdd;
        }
      } else {
        const variantPrice = (product.options && product.options.find((o: any) => o.size === size)?.price) 
                          || (product.variants && product.variants.find((v: any) => v.size === size)?.price)
                          || product.price;

        const variantStrikePrice = ((product as any).options && (product as any).options.find((o: any) => o.size === size)?.strikePrice) || ((product as any).variants && (product as any).variants.find((v: any) => v.size === size)?.strikePrice) || (product as any).strikePrice;
        const maxS = (product.variants && product.variants.find((v: any) => v.size === size)?.quantity) ?? product.quantity;
        let qtyToPush = qtyToAdd;
        if (qtyToAdd > maxS) {
          showCartError(`Only ${maxS} units of ${product.name} (${size}) are available in stock.`);
          qtyToPush = maxS;
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
          maxStock: maxS
        });
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

    // Get primary color and Product Page CMS settings from backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.primaryColor) setPrimaryColor(data.primaryColor);
              if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.primaryColor);
          if (data.showProductReviews !== undefined) setShowProductReviews(data.showProductReviews);
          if (data.showProductExploreMore !== undefined) setShowProductExploreMore(data.showProductExploreMore);
          if (data.showProductFaq !== undefined) setShowProductFaq(data.showProductFaq);
          if (data.usageGuideText) setUsageGuideText(data.usageGuideText);
          if (data.exploreMoreTitle) setExploreMoreTitle(data.exploreMoreTitle);
          if (data.deliverySubtext) setDeliverySubtext(data.deliverySubtext);
          if (data.faqs && data.faqs.length > 0) setFaqsList(data.faqs);
        }
      })
      .catch(err => console.warn("Error setting dynamic colors:", err));

    // Load cached products list to avoid slow loading recommended shifts
    try {
      const cachedProducts = localStorage.getItem("storefront_products");
      if (cachedProducts) {
        setAllProducts(JSON.parse(cachedProducts));
      }
    } catch (e) {}

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllProducts(data);
          localStorage.setItem("storefront_products", JSON.stringify(data));
        }
      })
      .catch(err => {
        console.warn("API load failed for recommended products list:", err);
      });

    if (!id) return;

    // Load product details
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products/${id}`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("Product fetch failed");
        return res.json();
      })
      .then((data: Product) => {
        if (data) {
          setProduct(data);
          initializeMedia(data);
          const productSizes = data.sizes && data.sizes.length > 0 ? data.sizes : ["50ml", "100ml", "150ml"];
          setSelectedVolume(productSizes[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("API load failed, trying default list match:", err);
        // Fallback to local default product match
        const found = defaultProducts.find(p => p._id === id);
        if (found) {
          setProduct(found);
          initializeMedia(found);
          const fallbackSizes = found.sizes && found.sizes.length > 0 ? found.sizes : ["50ml", "100ml", "150ml"];
          setSelectedVolume(fallbackSizes[0]);
        }
        setLoading(false);
      });
  }, [id]);

  const initializeMedia = (prod: Product) => {
    const list: string[] = [];
    if (prod.imageFront) list.push(prod.imageFront);
    if (prod.imageBack) list.push(prod.imageBack);
    if (prod.images && prod.images.length > 0) {
      prod.images.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    setAllImages(list);
    if (list.length > 0) {
      setActiveImg(list[0]);
    }
  };

  const handleNextImage = () => {
    if (allImages.length <= 1) return;
    const currentIdx = allImages.indexOf(activeImg);
    const nextIdx = (currentIdx + 1) % allImages.length;
    setActiveImg(allImages[nextIdx]);
  };

  const handlePrevImage = () => {
    if (allImages.length <= 1) return;
    const currentIdx = allImages.indexOf(activeImg);
    const prevIdx = (currentIdx - 1 + allImages.length) % allImages.length;
    setActiveImg(allImages[prevIdx]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
  };

  const handleQuantityIncrease = () => {
    if (!product) return;
    const maxStock = ((product as any).variants && (product as any).variants.find((v: any) => v.size === selectedVolume)?.quantity) ?? (product as any).quantity;
    setQuantity(prev => {
      if (prev + 1 > maxStock) {
        showCartError(`Only ${maxStock} units of ${product.name} (${selectedVolume}) are available in stock.`);
        setShowCartDrawer(true);
        return maxStock;
      }
      return prev + 1;
    });
  };

  const handleQuantityDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return <NewtonsCradleLoader fullScreen={true} />;
  }

  if (!product) {
    return (
      <div className={styles.errorWrapper}>
        <h2>Fragrance Not Found</h2>
        <p>We could not locate this perfume in our inventory catalog.</p>
        <Link href="/" className={styles.backHomeBtn}>
          Back to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className={styles.page}>
      {/* Dynamic Header */}
      <Navbar onCartClick={() => setShowCartDrawer(true)} />


      {/* Main product detail section */}
      <main className={styles.productContainer}>
        <div className={styles.detailGrid}>
          {/* Left Column: Interactive Media Gallery */}
          <div className={styles.mediaGallery}>
            {/* Desktop View: Sticky Dots & Vertical Images */}
            {!isMobile ? (
              <div className={styles.desktopGalleryWrapper}>
                <div className={styles.desktopDotNav}>
                  {allImages.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`${styles.desktopDot} ${activeScrollIdx === idx ? styles.desktopDotActive : ""}`}
                      onClick={() => scrollToImage(idx)}
                    />
                  ))}
                </div>
                <div className={styles.desktopImagesContainer}>
                  {allImages.map((url, idx) => (
                    <div 
                      key={idx}
                      className={styles.desktopImageWrapper}
                      style={{ marginBottom: idx === allImages.length - 1 ? 0 : 250 }}
                      ref={el => { imageRefs.current[idx] = el; }}
                    >
                      <img 
                        src={url} 
                        alt={`${product.name} angle ${idx + 1}`} 
                        className={styles.desktopImage}
                      />
                    </div>
                  ))}

                  {allImages.length > 1 && (
                    <div 
                      className={`${styles.stickyBottomBar} ${activeScrollIdx === allImages.length - 1 ? styles.stickyBottomBarHidden : ""}`} 
                      onClick={() => scrollToImage(activeScrollIdx + 1)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Mobile View: Swipeable Carousel */
              <>
                <div 
                  className={styles.mainImageWrapper}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <img 
                    src={activeImg} 
                    alt={product.name} 
                    className={styles.mainImage}
                  />
                </div>
                {allImages.length > 1 && (
                  <div className={styles.carouselDots}>
                    {allImages.map((url, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setActiveImg(url)}
                        className={`${styles.carouselDot} ${activeImg === url ? styles.carouselDotActive : ""}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column: Checkout Options & Metadata details */}
          <div className={styles.productDetails}>
            {(() => {
              const currentVariant = (product as any).variants?.find((v: any) => v.size === selectedVolume) || (product as any).options?.find((v: any) => v.size === selectedVolume);
              const currentPrice = currentVariant?.price || product.price;
              const currentStrikePrice = currentVariant?.strikePrice || (product as any).strikePrice;
              
              return (
                <>
                  <div className={styles.productHeaderArea}>
                    <h1 className={styles.productTitleChanel}>{product.name}</h1>
                    <div className={styles.titleSeparator}></div>
                    <p className={styles.productSubtitle}>Parfum Spray</p>
                    <a 
                      href="#product-info-section" 
                      className={styles.moreDetailsLink}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenAccordion("description");
                        document.getElementById("product-info-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      More details
                    </a>
                  </div>

                  <div className={styles.priceRowChanel}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                        {currentStrikePrice && currentStrikePrice > currentPrice && (
                          <span style={{ color: "#ef4444", fontSize: "0.9rem", fontWeight: 400 }}>
                            -{Math.round(((currentStrikePrice - currentPrice) / currentStrikePrice) * 100)}%
                          </span>
                        )}
                        <span className={styles.priceValChanel}>
                          ₹ {currentPrice.toLocaleString("en-IN")}*
                        </span>
                      </div>
                      {currentStrikePrice && currentStrikePrice > currentPrice && (
                        <span style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                          M.R.P: <del>₹ {currentStrikePrice.toLocaleString("en-IN")}</del>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.sizeSectionChanel}>
                    <p className={styles.sizeHeaderChanel}>
                      {product.sizes?.length || 3} SIZES AVAILABLE
                    </p>
                    
                    <div className={styles.sizeDropdownWrapper}>
                      <div className={styles.sizeSelectDisplay} onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}>
                        <span>{selectedVolume.toLowerCase().endsWith("ml") ? selectedVolume : `${selectedVolume}ml`}</span>
                        <div className={styles.selectChevron}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "16px", height: "16px", transform: isSizeDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      </div>
                      
                      {isSizeDropdownOpen && (
                        <>
                          <div className={styles.dropdownBackdrop} onClick={() => setIsSizeDropdownOpen(false)} />
                          <div className={styles.sizeDropdownMenu}>
                            {(product.sizes && product.sizes.length > 0 ? product.sizes : ["50ml", "100ml", "150ml"]).map(size => {
                              const variantPrice = (product as any).variants?.find((v: any) => v.size === size)?.price || (product as any).options?.find((v: any) => v.size === size)?.price || product.price;
                              const isSelected = selectedVolume === size;
                              return (
                                <div 
                                  key={size} 
                                  className={styles.sizeDropdownItem}
                                  onClick={() => { setSelectedVolume(size); setIsSizeDropdownOpen(false); }}
                                >
                                  <span style={{ fontWeight: isSelected ? 700 : 400, color: isSelected ? '#111827' : '#4b5563' }}>
                                    {size.toLowerCase().endsWith("ml") ? size : `${size}ml`}
                                  </span>
                                  <span style={{ fontWeight: isSelected ? 700 : 400, color: isSelected ? '#111827' : '#4b5563' }}>
                                    ₹ {variantPrice.toLocaleString("en-IN")}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    className={styles.addToBagBtnChanel}
                    onClick={() => addToCart(product, selectedVolume, 1)}
                    disabled={product.quantity === 0}
                  >
                    {product.quantity === 0 ? "OUT OF STOCK" : "ADD TO BAG"}
                  </button>

                  <div className={styles.taxInfoChanel}>
                    *MRP (inclusive of all taxes).
                  </div>

                  <div className={styles.clientReviewsLinkChanel}>
                    <a 
                      href="#product-info-section" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setOpenAccordion("reviews");
                        document.getElementById("product-info-section")?.scrollIntoView({ behavior: "smooth" }); 
                      }}
                    >
                      Client reviews
                    </a>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </main>

      {/* Product Information Accordion */}
      {product && (
        <section id="product-info-section" className={styles.productInfoSection}>
          <h2 className={styles.productInfoTitle}>PRODUCT INFORMATION</h2>
          
          <div className={styles.accordionContainer}>
            {/* Description */}
            <div className={styles.accordionItem}>
              <button className={styles.accordionHeader} onClick={() => toggleAccordion("description")}>
                <span className={styles.accordionTitle}>DESCRIPTION</span>
                <svg className={`${styles.accordionIcon} ${openAccordion === "description" ? styles.accordionIconOpen : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`${styles.accordionContent} ${openAccordion === "description" ? styles.accordionContentOpen : ""}`}>
                <div className={styles.accordionInnerWrapper}>
                  <div className={styles.accordionContentInner}>
                    {product.description ? (
                      <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    ) : (
                      <p>Detailed description for this exquisite fragrance goes here.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className={styles.accordionItem}>
              <button className={styles.accordionHeader} onClick={() => toggleAccordion("additionalInfo")}>
                <span className={styles.accordionTitle}>ADDITIONAL INFORMATION</span>
                <svg className={`${styles.accordionIcon} ${openAccordion === "additionalInfo" ? styles.accordionIconOpen : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`${styles.accordionContent} ${openAccordion === "additionalInfo" ? styles.accordionContentOpen : ""}`}>
                <div className={styles.accordionInnerWrapper}>
                  <div className={styles.accordionContentInner}>
                    {product.additionalInformation ? (
                      <div dangerouslySetInnerHTML={{ __html: product.additionalInformation }} />
                    ) : (
                      <p>Key ingredients, scent notes, and other additional product details.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className={styles.accordionItem}>
              <button className={styles.accordionHeader} onClick={() => toggleAccordion("reviews")}>
                <span className={styles.accordionTitle} style={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                  REVIEWS
                  {openAccordion !== "reviews" && (
                    <span className={styles.reviewsRatingPreview} style={{ marginLeft: "auto", marginRight: "16px", textTransform: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                      <div className={styles.starsPreview} style={{ display: "flex", gap: "2px" }}>
                        {renderStars(reviewsList.length > 0 ? (reviewsList.reduce((acc, rev) => acc + (rev.rating || 5), 0) / reviewsList.length) : 0, 20)}
                      </div>
                      <span style={{ fontSize: "15px", fontWeight: 600, fontFamily: "Outfit, sans-serif" }}>{reviewsList.length > 0 ? (reviewsList.reduce((acc, rev) => acc + (rev.rating || 5), 0) / reviewsList.length).toFixed(1) : "0.0"}/5</span>
                    </span>
                  )}
                </span>
                <svg className={`${styles.accordionIcon} ${openAccordion === "reviews" ? styles.accordionIconOpen : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`${styles.accordionContent} ${openAccordion === "reviews" ? styles.accordionContentOpen : ""}`}>
                <div className={styles.accordionInnerWrapper}>
                  <div className={styles.accordionInner} style={{ padding: "40px 0" }}>
                    
                    <div className={styles.reviewsGridContainer}>
                      {/* Left side: Summary */}
                      <div className={styles.reviewsSummaryLeft}>
                        <div style={{ fontSize: "5.5rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "#111827", lineHeight: 1 }}>
                          {reviewsList.length > 0 ? (reviewsList.reduce((acc, rev) => acc + (rev.rating || 5), 0) / reviewsList.length).toFixed(1) : "0.0"}
                        </div>
                        <div style={{ display: "flex", gap: "6px", margin: "20px 0 8px 0" }}>
                          {renderStars(reviewsList.length > 0 ? (reviewsList.reduce((acc, rev) => acc + (rev.rating || 5), 0) / reviewsList.length) : 0, 24)}
                        </div>
                        <div style={{ fontSize: "1.1rem", color: "#4b5563", marginBottom: "40px", fontFamily: "Inter, sans-serif" }}>
                          {reviewsList.length} reviews
                        </div>
                        <button 
                          onClick={() => setShowReviewModal(true)}
                          className={styles.writeReviewBtn}
                        >
                          WRITE A REVIEW
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); setShowModerationChart(true); }}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "#111827", textDecoration: "underline", fontSize: "1rem", fontFamily: "Inter, sans-serif" }}
                        >
                          Moderation chart
                        </button>
                      </div>

                      {/* Right side: Reviews List */}
                      <div className={styles.reviewsListRight}>
                        <div className={styles.sortDropdownContainer} onClick={() => setIsReviewSortOpen(!isReviewSortOpen)}>
                           <span className={styles.sortLabel}>Sort by:</span>
                           <div className={styles.sortSelectWrapper}>
                             <span className={styles.sortSelectDisplayValue}>{reviewSort}</span>
                             <div className={styles.sortSelectChevron}>
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "20px", height: "20px", transform: isReviewSortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                               </svg>
                             </div>
                           </div>
                           
                           {isReviewSortOpen && (
                             <>
                               <div className={styles.reviewSortBackdrop} onClick={(e) => { e.stopPropagation(); setIsReviewSortOpen(false); }} />
                               <div className={styles.reviewSortMenu}>
                                  <div className={styles.reviewSortMobileHeader}>
                                    <span>SORT BY:</span>
                                    <button onClick={(e) => { e.stopPropagation(); setIsReviewSortOpen(false); }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                  </div>
                                  <div className={styles.reviewSortMobileDivider}></div>
                                  {["Most recent", "Highest to lowest", "Lowest to highest", "Most helpful"].map(opt => (
                                    <div 
                                      key={opt}
                                      className={`${styles.reviewSortOption} ${reviewSort === opt ? styles.reviewSortOptionActive : ""}`}
                                      onClick={(e) => { e.stopPropagation(); setReviewSort(opt); setIsReviewSortOpen(false); }}
                                    >
                                      {opt}
                                    </div>
                                  ))}
                               </div>
                             </>
                           )}
                        </div>
                        
                        <div className={styles.reviewsListWrapper}>
                           {reviewsList.length === 0 && (
                             <p style={{ color: "#6b7280", fontStyle: "italic", marginTop: "20px" }}>No reviews available.</p>
                           )}
                           {[...reviewsList]
                             .sort((a, b) => {
                               if (reviewSort === "Highest to lowest") return (b.rating || 5) - (a.rating || 5);
                               if (reviewSort === "Lowest to highest") return (a.rating || 5) - (b.rating || 5);
                               if (reviewSort === "Most helpful") return (b.helpful || 0) - (a.helpful || 0);
                               // Most recent
                               const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                               const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                               return dateB - dateA;
                             })
                             .slice(0, visibleReviewsCount)
                             .map((review, idx) => (
                               <div key={review._id || idx} className={styles.reviewCard}>
                                 <div className={styles.reviewCardHeader}>
                                    <div className={styles.reviewAuthorBlock}>
                                      <span className={styles.reviewAuthor}>{review.author || review.name}</span>
                                      {review.createdAt && (
                                        <span className={styles.reviewDate}>
                                          {new Date(review.createdAt).toLocaleDateString("en-GB")}
                                        </span>
                                      )}
                                    </div>
                                    <div className={styles.reviewStarsBlock}>
                                      <div style={{ display: "flex", gap: "4px" }}>
                                        {renderStars(review.rating || 5, 20)}
                                      </div>
                                      <span className={styles.reviewRatingNumber}>{review.rating || 5}</span>
                                    </div>
                                 </div>
                                 {review.purchaseDate && (
                                   <div className={styles.reviewPurchaseDate}>
                                      Purchase date: {new Date(review.purchaseDate).toLocaleDateString("en-GB")}
                                   </div>
                                 )}
                                 <p className={styles.reviewText}>
                                   {review.comment || review.text}
                                 </p>
                              </div>
                           ))}

                           {visibleReviewsCount < reviewsList.length && (
                             <button 
                               className={styles.loadMoreBtn} 
                               onClick={() => setVisibleReviewsCount(prev => prev + 3)}
                             >
                               Load more reviews
                             </button>
                           )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>



            {/* Online Order */}
            <div className={styles.accordionItem}>
              <button className={styles.accordionHeader} onClick={() => toggleAccordion("onlineOrder")}>
                <span className={styles.accordionTitle}>ONLINE ORDER</span>
                <svg className={`${styles.accordionIcon} ${openAccordion === "onlineOrder" ? styles.accordionIconOpen : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`${styles.accordionContent} ${openAccordion === "onlineOrder" ? styles.accordionContentOpen : ""}`}>
                <div className={styles.accordionInnerWrapper}>
                  <div className={styles.accordionInner}>
                    {product.onlineOrder || "Fast shipping and simple returns on all online orders. Contact support for any order inquiries."}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Explore More Section */}
      {showProductExploreMore && (() => {
        const exploreProducts = allProducts.filter(p => p._id !== id);
        const itemsPerPage = isMobile ? 2 : 4;
        const totalExplorePages = Math.ceil(exploreProducts.length / itemsPerPage);
        const displayedExplore = exploreProducts.slice((explorePage - 1) * itemsPerPage, explorePage * itemsPerPage);

        return (
          <section className={homeStyles.arrivalsSection} style={{ width: "100%", boxSizing: "border-box" }}>
            <div className={homeStyles.arrivalsHeader}>
              <h2 className={homeStyles.arrivalsTitle}>{exploreMoreTitle.toUpperCase()}</h2>
            </div>
            <div 
              key={`explore-${explorePage}`}
              className={`${homeStyles.arrivalsGrid} ${homeStyles.slideAnimated} ${exploreDirection === "forward" ? homeStyles.slideForward : homeStyles.slideBackward}`}
              onTouchStart={isMobile ? handleTouchStart : undefined}
              onTouchMove={isMobile ? handleTouchMove : undefined}
              onTouchEnd={isMobile ? () => {
                if (!touchStart || !touchEnd) return;
                const distance = touchStart - touchEnd;
                if (distance > 50 && explorePage < totalExplorePages) {
                  setExploreDirection("forward");
                  setExplorePage(p => p + 1);
                }
                if (distance < -50 && explorePage > 1) {
                  setExploreDirection("backward");
                  setExplorePage(p => p - 1);
                }
              } : undefined}
            >
              {displayedExplore.map((item) => {
                const cheapestVariant = item.variants && item.variants.length > 0
                  ? [...item.variants].sort((a, b) => a.price - b.price)[0]
                  : null;
                const displayPrice = cheapestVariant ? cheapestVariant.price : item.price;
                const displayStrikePrice = cheapestVariant ? cheapestVariant.strikePrice : item.strikePrice;
                
                return (
                  <Link 
                    key={item._id} 
                    href={`/product/${item._id}`}
                    onClick={(e) => {
                      if (item.quantity === 0) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    style={{ 
                      textDecoration: "none", 
                      color: "inherit", 
                      display: "block",
                      cursor: item.quantity === 0 ? "not-allowed" : "pointer"
                    }}
                  >
                    <div className={homeStyles.productCard} style={item.quantity === 0 ? { pointerEvents: "none" } : {}}>
                      <div className={homeStyles.productImageContainer} style={item.quantity === 0 ? { filter: "grayscale(1)", opacity: 0.7 } : {}}>
                        <img 
                          className={`${homeStyles.productImage} ${homeStyles.productImageFront}`} 
                          src={item.imageFront} 
                          alt={item.name}
                          loading="lazy"
                        />
                        {item.imageBack && (
                          <img 
                            className={`${homeStyles.productImage} ${homeStyles.productImageBack}`} 
                            src={item.imageBack} 
                            alt={`${item.name} Alternate`}
                            loading="lazy"
                          />
                        )}
                        
                        <button 
                          aria-label="Add to cart" 
                          className={homeStyles.addToCartCircle}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(item, item.sizes?.[0] || "50ml", 1); }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={homeStyles.cartIcon} style={{ width: "20px", height: "20px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        </button>
                      </div>
                      <div className={homeStyles.productInfo}>
                        <h3 className={homeStyles.productTitle}>{item.name}</h3>
                        {(() => {
                          return (
                            <p className={homeStyles.productPrice}>
                              {displayStrikePrice && displayStrikePrice > displayPrice && (
                                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                  <span style={{ display: "inline-flex", gap: "8px" }}>
                                    <span style={{ color: "#ef4444", fontSize: "0.85em", fontWeight: 400 }}>
                                      -{Math.round(((displayStrikePrice - displayPrice) / displayStrikePrice) * 100)}%
                                    </span>
                                    <span style={{ fontSize: "1.2em", fontWeight: 400, color: "#111" }}>
                                      ₹ {displayPrice.toLocaleString("en-IN")}.00
                                    </span>
                                  </span>
                                  <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                                    M.R.P: <del>₹ {displayStrikePrice.toLocaleString("en-IN")}.00</del>
                                  </span>
                                </span>
                              )}
                              {(!displayStrikePrice || displayStrikePrice <= displayPrice) && (
                                <span style={{ fontSize: "1.2em", fontWeight: 400, color: "#111" }}>
                                  ₹ {displayPrice.toLocaleString("en-IN")}.00
                                </span>
                              )}
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {isMobile && totalExplorePages > 1 && (
              <div className={homeStyles.mobilePagination}>
                <button 
                  className={homeStyles.paginationBtn}
                  onClick={() => {
                    setExploreDirection("backward");
                    setExplorePage(p => Math.max(1, p - 1));
                  }}
                  disabled={explorePage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <span>{explorePage} / {totalExplorePages}</span>
                <button 
                  className={homeStyles.paginationBtn}
                  onClick={() => {
                    setExploreDirection("forward");
                    setExplorePage(p => Math.min(totalExplorePages, p + 1));
                  }}
                  disabled={explorePage === totalExplorePages}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}
          </section>
        );
      })()}

      {/* FREQUENTLY ASKED QUESTIONS Section */}
      {showProductFaq && (
        <section className={styles.faqSection}>
          <h2 className={styles.faqTitle}>FREQUENTLY ASKED QUESTIONS</h2>
          <div className={styles.faqList}>
            {faqsList.map((faq, index) => (
              <div key={index} className={styles.faqItem} onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}>
                <div className={styles.faqItemHeader}>
                  <span className={styles.faqQuestion}>{faq.question.toUpperCase()}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`${styles.faqChevron} ${activeFaqIndex === index ? styles.faqChevronActive : ""}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                <div className={`${styles.faqItemContent} ${activeFaqIndex === index ? styles.faqItemContentActive : ""}`}>
                  <p className={styles.faqAnswerText}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewedIds.length > 0 && (() => {
        const recentProducts = allProducts.filter(p => recentlyViewedIds.includes(p._id));
        recentProducts.sort((a, b) => recentlyViewedIds.indexOf(a._id) - recentlyViewedIds.indexOf(b._id));
        
        if (recentProducts.length === 0) return null;

        const itemsPerPage = isMobile ? 2 : 4;
        const totalRecentPages = Math.ceil(recentProducts.length / itemsPerPage);
        const displayedRecent = recentProducts.slice((recentPage - 1) * itemsPerPage, recentPage * itemsPerPage);

        return (
          <section className={homeStyles.arrivalsSection} style={{ width: "100%", boxSizing: "border-box" }}>
            <div className={homeStyles.arrivalsHeader}>
              <h2 className={homeStyles.arrivalsTitle}>RECENTLY VIEWED</h2>
            </div>
            <div 
              key={`recent-${recentPage}`}
              className={`${homeStyles.arrivalsGrid} ${homeStyles.slideAnimated} ${recentDirection === "forward" ? homeStyles.slideForward : homeStyles.slideBackward}`}
              onTouchStart={isMobile ? handleTouchStart : undefined}
              onTouchMove={isMobile ? handleTouchMove : undefined}
              onTouchEnd={isMobile ? () => {
                if (!touchStart || !touchEnd) return;
                const distance = touchStart - touchEnd;
                if (distance > 50 && recentPage < totalRecentPages) {
                  setRecentDirection("forward");
                  setRecentPage(p => p + 1);
                }
                if (distance < -50 && recentPage > 1) {
                  setRecentDirection("backward");
                  setRecentPage(p => p - 1);
                }
              } : undefined}
            >
              {displayedRecent.map((item) => {
                const cheapestVariant = item.variants && item.variants.length > 0
                  ? [...item.variants].sort((a, b) => a.price - b.price)[0]
                  : null;
                const displayPrice = cheapestVariant ? cheapestVariant.price : item.price;
                const displayStrikePrice = cheapestVariant ? cheapestVariant.strikePrice : item.strikePrice;
                
                return (
                  <Link 
                    key={item._id} 
                    href={`/product/${item._id}`}
                    onClick={(e) => {
                      if (item.quantity === 0) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    style={{ 
                      textDecoration: "none", 
                      color: "inherit", 
                      display: "block",
                      cursor: item.quantity === 0 ? "not-allowed" : "pointer"
                    }}
                  >
                    <div className={homeStyles.productCard} style={item.quantity === 0 ? { pointerEvents: "none" } : {}}>
                      <div className={homeStyles.productImageContainer} style={item.quantity === 0 ? { filter: "grayscale(1)", opacity: 0.7 } : {}}>
                        <img 
                          className={`${homeStyles.productImage} ${homeStyles.productImageFront}`} 
                          src={item.imageFront} 
                          alt={item.name}
                          loading="lazy"
                        />
                        {item.imageBack && (
                          <img 
                            className={`${homeStyles.productImage} ${homeStyles.productImageBack}`} 
                            src={item.imageBack} 
                            alt={`${item.name} Alternate`}
                            loading="lazy"
                          />
                        )}
                        
                        <button 
                          aria-label="Add to cart" 
                          className={homeStyles.addToCartCircle}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(item, item.sizes?.[0] || "50ml", 1); }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={homeStyles.cartIcon} style={{ width: "20px", height: "20px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        </button>
                      </div>
                      <div className={homeStyles.productInfo}>
                        <h3 className={homeStyles.productTitle}>{item.name}</h3>
                        {(() => {
                          return (
                            <p className={homeStyles.productPrice}>
                              {displayStrikePrice && displayStrikePrice > displayPrice && (
                                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                  <span style={{ display: "inline-flex", gap: "8px" }}>
                                    <span style={{ color: "#ef4444", fontSize: "0.85em", fontWeight: 400 }}>
                                      -{Math.round(((displayStrikePrice - displayPrice) / displayStrikePrice) * 100)}%
                                    </span>
                                    <span style={{ fontSize: "1.2em", fontWeight: 400, color: "#111" }}>
                                      ₹ {displayPrice.toLocaleString("en-IN")}.00
                                    </span>
                                  </span>
                                  <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                                    M.R.P: <del>₹ {displayStrikePrice.toLocaleString("en-IN")}.00</del>
                                  </span>
                                </span>
                              )}
                              {(!displayStrikePrice || displayStrikePrice <= displayPrice) && (
                                <span style={{ fontSize: "1.2em", fontWeight: 400, color: "#111" }}>
                                  ₹ {displayPrice.toLocaleString("en-IN")}.00
                                </span>
                              )}
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {isMobile && totalRecentPages > 1 && (
              <div className={homeStyles.mobilePagination}>
                <button 
                  className={homeStyles.paginationBtn}
                  onClick={() => {
                    setRecentDirection("backward");
                    setRecentPage(p => Math.max(1, p - 1));
                  }}
                  disabled={recentPage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <span>{recentPage} / {totalRecentPages}</span>
                <button 
                  className={homeStyles.paginationBtn}
                  onClick={() => {
                    setRecentDirection("forward");
                    setRecentPage(p => Math.min(totalRecentPages, p + 1));
                  }}
                  disabled={recentPage === totalRecentPages}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}
          </section>
        );
      })()}

      {/* Footer Section */}
      <Footer />

      {/* Cart Slider Drawer Overlay */}
      {showCartDrawer && (
        <div className={`${styles.cartOverlay} ${isCartClosing ? styles.cartOverlayClosing : ""}`} onClick={handleCloseCart}>
          <div className={`${styles.cartDrawer} ${isCartClosing ? styles.cartDrawerClosing : ""}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cartDrawerHeader}>
              <div className={styles.cartHeaderLeft}>
                <span>CART</span>
                {cartItems.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                  <span className={styles.cartCountBadge}>
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button 
                aria-label="Close cart" 
                className={styles.closeCartBtn} 
                onClick={handleCloseCart}
              >
                ✕
              </button>
            </div>
            {cartError && (
              <div style={{ backgroundColor: '#fef2f2', borderLeft: '3px solid #ef4444', color: '#dc2626', padding: '12px', fontSize: '0.85rem', borderRadius: '4px', margin: '15px 20px 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{cartError}</span>
              </div>
            )}

            {cartItems.length > 0 ? (
              <div className={styles.cartDrawerBody}>
                <div className={styles.cartItemsList}>
                  {cartItems.map((item, index) => (
                    <div key={`${item._id}-${item.size}`} className={styles.cartItemRow}>
                      <img src={item.imageFront} alt={item.name} className={styles.cartItemImg} />
                      <div className={styles.cartItemInfo}>
                        <div className={styles.cartItemHeaderRow}>
                          <h4 className={styles.cartItemName}>{item.name.toUpperCase()}</h4>
                          <div style={{ fontWeight: 400, color: "#111827", fontSize: "1rem", whiteSpace: "nowrap", marginLeft: "10px" }}>
                            ₹ {(item.price * item.quantity).toLocaleString("en-IN")}
                          </div>
                        </div>
                        <p className={styles.cartItemSize} style={{ marginTop: "4px" }}>{item.size}</p>
                        
                        <div className={styles.cartItemPriceBlock} style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "8px", marginBottom: "8px" }}>
                          {item.strikePrice && item.strikePrice > item.price ? (
                            <>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ color: "#ef4444", fontSize: "0.85em", fontWeight: 400 }}>
                                  -{Math.round(((item.strikePrice - item.price) / item.strikePrice) * 100)}%
                                </span>
                                <span style={{ fontWeight: 400, color: "#111827", fontSize: "1rem" }}>
                                  ₹ {item.price.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <span style={{ color: "#9ca3af", fontSize: "0.8em" }}>
                                M.R.P: <del>₹ {item.strikePrice.toLocaleString("en-IN")}</del>
                              </span>
                            </>
                          ) : (
                            <span style={{ fontWeight: 400, color: "#111827", fontSize: "1rem" }}>
                              ₹ {item.price.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        
                        <div className={styles.cartItemControlsRow}>
                          <div className={styles.qtyControlRow}>
                            <button onClick={() => updateQuantity(index, item.quantity - 1)} className={styles.qtyBtn}>−</button>
                            <span className={styles.qtyVal}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(index, item.quantity + 1)} className={styles.qtyBtn}>+</button>
                          </div>
                          
                          <button onClick={() => updateQuantity(index, 0)} className={styles.removeCartItemBtn} title="Remove item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 16, height: 16 }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.cartDrawerFooter}>
                  <div className={styles.cartDrawerDivider}></div>
                  

                  <div className={styles.totalContainer}>
                    <span className={styles.totalTitle}>Estimated total</span>
                    <span className={styles.totalVal}>
                      {appliedDiscount && (
                        <span style={{ textDecoration: "line-through", color: "#6b7280", marginRight: "8px", fontSize: "0.85rem", fontWeight: 400 }}>
                          Rs. {cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString("en-IN")}.00
                        </span>
                      )}
                      Rs. {Math.max(0, cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) - (appliedDiscount ? (appliedDiscount.type === "percentage" ? (cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) * appliedDiscount.value) / 100 : appliedDiscount.value) : 0)).toLocaleString("en-IN")}.00
                    </span>
                  </div>
                  
                  <p className={styles.taxSubtext}>
                    Duties and taxes included. Shipping is calculated at checkout.
                  </p>
                  
                  <button className={styles.checkoutBtn} onClick={initiateCheckout}>
                    Checkout
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.cartDrawerEmpty}>
                <h2 className={styles.cartEmptyHeading}>YOUR CART IS EMPTY</h2>
                <p className={styles.cartEmptySubtext}>
                  Have an account? <Link href="/login" className={styles.cartLoginLink} onClick={handleCloseCart}>Log in</Link> to check out faster.
                </p>
                <button className={styles.continueBtn} onClick={handleCloseCart}>
                  Continue shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Realtime Checkout Drawer and Success Overlay */}
      <CheckoutDrawer
        isOpen={showCheckoutDrawer}
        onClose={() => setShowCheckoutDrawer(false)}
        cartItems={checkoutItems}
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

      {/* Write a Review Modal */}
      <div className={`${styles.modalOverlay} ${showReviewModal ? styles.modalOverlayOpen : ""}`} onClick={() => setShowReviewModal(false)}>
        <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Write a Review for {product?.name}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowReviewModal(false)}>✕</button>
            </div>

            {reviewSuccessMsg ? (
              <div className={styles.successAlert}>{reviewSuccessMsg}</div>
            ) : (
              <form onSubmit={handleSubmitReview} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Your Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name" 
                    value={reviewerName} 
                    onChange={(e) => setReviewerName(e.target.value)} 
                    className={styles.formInput} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Review Headline</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Give your review a title (e.g. Exceptional longevity!)" 
                    value={reviewTitle} 
                    onChange={(e) => setReviewTitle(e.target.value)} 
                    className={styles.formInput} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Review Comments</label>
                  <textarea 
                    rows={4} 
                    required 
                    placeholder="Describe what you liked about this fragrance formulation..." 
                    value={reviewComment} 
                    onChange={(e) => setReviewComment(e.target.value)} 
                    className={styles.formTextarea} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Rating</label>
                  <div className={styles.starSelector}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        onClick={() => setUserRating(star)}
                        style={{ cursor: "pointer", fontSize: "1.85rem", color: star <= userRating ? "#000000" : "#d1d5db" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Attach Photos (Optional)</label>
                  <div className={styles.imageUploadWrapper}>
                    <label className={styles.uploadBoxLabel}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleReviewImageUpload}
                        style={{ display: "none" }}
                        disabled={uploadingImage}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "22px", height: "22px", color: primaryColor || "#57bc74" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                      </svg>
                      <span style={{ fontSize: "0.82rem", color: "#4b5563", fontWeight: 500 }}>
                        {uploadingImage ? "Uploading photos..." : "Click to upload product photos"}
                      </span>
                    </label>
                  </div>

                  {reviewImages.length > 0 && (
                    <div className={styles.imagePreviewGrid}>
                      {reviewImages.map((imgUrl, idx) => (
                        <div key={idx} className={styles.imagePreviewThumb}>
                          <img src={imgUrl} alt={`Attached review photo ${idx + 1}`} />
                          <button 
                            type="button" 
                            className={styles.removeImgBtn} 
                            onClick={() => handleRemoveReviewImage(idx)}
                            title="Remove photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className={styles.submitReviewBtn}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "Uploading..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>

      {/* Image Lightbox Overlay */}
      {lightboxImg && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxImg(null)}>
          <button className={styles.lightboxCloseBtn} onClick={() => setLightboxImg(null)}>✕</button>
          <img src={lightboxImg} alt="Enlarged review photo" className={styles.lightboxImg} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      {/* Moderation Chart Drawer */}
      <div className={`${styles.moderationOverlay} ${showModerationChart ? styles.moderationOverlayOpen : ""}`} onClick={() => setShowModerationChart(false)}>
        <div className={styles.moderationDrawer} onClick={(e) => e.stopPropagation()}>
          <button className={styles.moderationCloseBtn} onClick={() => setShowModerationChart(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "28px", height: "28px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className={styles.moderationTitle}>MODERATION CHART</h3>
          <p className={styles.moderationText}>
            Each review is moderated manually by our Customer Service before its publication to verify its compliance with our publication criteria addressed in <a href="#" style={{ textDecoration: "underline", color: "#111827" }}>legal mentions</a>.<br /><br />
            Reviews will be published regardless of their rating as long as they meet all the publication criteria. To be able to write a review on one of our products, the customer must have previously purchased the product on <a href="#" style={{ textDecoration: "underline", color: "#111827" }}>29sformula.com</a> in the last year.<br /><br />
            Reviews are posted on our site in chronological order.
          </p>
        </div>
      </div>
    </div>
  );
}
