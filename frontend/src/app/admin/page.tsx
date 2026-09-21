'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import AdminSidebar from "./components/AdminSidebar";
import HomeTab from "./components/tabs/HomeTab";
import OrdersTab from "./components/tabs/OrdersTab";
import ProductsTab from "./components/tabs/ProductsTab";
import OnlineStoreTab from "./components/tabs/OnlineStoreTab";
import CustomersTab from "./components/tabs/CustomersTab";
import MarketingTab from "./components/tabs/MarketingTab";
import DiscountsTab from "./components/tabs/DiscountsTab";
import { FaqItem, DashboardStats, Product } from "./types";
import { fontCategories, getFontFamilyStack } from "./constants/fonts";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useDashboardData } from "./hooks/useDashboardData";
import AdminModals from "./components/modals/AdminModals";
import CustomizeLayoutModal from "./components/modals/CustomizeLayoutModal";





export default function AdminDashboard() {
  const fetchedTabs = useRef(new Set<string>());
  const { dashboardStats, fetchDashboardStats } = useDashboardData();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Authorization state
  const { authorized } = useAdminAuth();

  // Layout State
  const [timelineFilter, setTimelineFilter] = useState<string>("year");
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "products" | "customers" | "marketing" | "discounts" | "online-store">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState<boolean>(false);
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState<boolean>(false);
  const [onlineStoreDropdownOpen, setOnlineStoreDropdownOpen] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<"all" | "categories" | "cancelled" | "completed" | "returns">("all");

  // Scroll detection state for mobile header
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHeaderVisible(false); // scrolling down
      } else {
        setIsHeaderVisible(true); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [deletedDefaultCategories, setDeletedDefaultCategories] = useState<string[]>([]);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<string | null>(null);
  const [deleteCategoryLoading, setDeleteCategoryLoading] = useState<boolean>(false);
  const [renameCategoryTarget, setRenameCategoryTarget] = useState<string | null>(null);
  const [renameCategoryNewName, setRenameCategoryNewName] = useState<string>("");
  const [isRenamingCategory, setIsRenamingCategory] = useState<boolean>(false);
  const [editCategorySelectedProductIds, setEditCategorySelectedProductIds] = useState<string[]>([]);
  const [selectedCategoryView, setSelectedCategoryView] = useState<string | null>(null);
  const [showCategoryAddOptionsModal, setShowCategoryAddOptionsModal] = useState<boolean>(false);
  const [showAddExistingToCategoryModal, setShowAddExistingToCategoryModal] = useState<boolean>(false);
  const [existingProductIdsToAssign, setExistingProductIdsToAssign] = useState<string[]>([]);
  const [assignLoading, setAssignLoading] = useState<boolean>(false);
  const [activeCategoryPopoverProductId, setActiveCategoryPopoverProductId] = useState<string | null>(null);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  const SEARCH_PAGES = [
    { label: "Dashboard Home", target: "home" },
    { label: "Products Catalog", target: "products" },
    { label: "Orders Management", target: "orders" },
    { label: "Customers ", target: "customers" },
    { label: "Marketing Campaigns & Promos", target: "marketing" },
    { label: "Discounts & Coupons", target: "discounts" },
    { label: "Online Store Settings", target: "online-store" },
  ];

  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const toggleExpand = (productId: string) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Load custom categories and deleted default categories from local storage

  // Tab-specific lazy fetching
  useEffect(() => {
    if (!authorized) return;

    if (activeTab === "home") {
      fetchDashboardStats(timelineFilter);
    }

    if (activeTab === "products" && !fetchedTabs.current.has("products")) {
      fetchedTabs.current.add("products");
      fetchProducts();
    }
    if (activeTab === "orders" && !fetchedTabs.current.has("orders")) {
      fetchedTabs.current.add("orders");
      fetchOrders();
    }
    if (activeTab === "customers" && !fetchedTabs.current.has("customers")) {
      fetchedTabs.current.add("customers");
      fetchCustomers();
    }
    if (activeTab === "online-store" && !fetchedTabs.current.has("online-store")) {
      fetchedTabs.current.add("online-store");
      fetchSettings();
      fetchAdminReviews();
    }
    if (activeTab === "discounts" && !fetchedTabs.current.has("discounts")) {
      fetchedTabs.current.add("discounts");
      fetchDiscounts();
    }
  }, [activeTab, authorized, timelineFilter]);

  useEffect(() => {
    if (isSearchOpen) {
      if (!fetchedTabs.current.has("products")) {
        fetchedTabs.current.add("products");
        fetchProducts();
      }
      if (!fetchedTabs.current.has("orders")) {
        fetchedTabs.current.add("orders");
        fetchOrders();
      }
      if (!fetchedTabs.current.has("customers")) {
        fetchedTabs.current.add("customers");
        fetchCustomers();
      }
    }
  }, [isSearchOpen]);
  useEffect(() => {
    const savedCustom = localStorage.getItem("admin_custom_categories");
    if (savedCustom) {
      try {
        setCustomCategories(JSON.parse(savedCustom));
      } catch (e) {
        console.error(e);
      }
    }
    const savedDeletedDefaults = localStorage.getItem("admin_deleted_default_categories");
    if (savedDeletedDefaults) {
      try {
        setDeletedDefaultCategories(JSON.parse(savedDeletedDefaults));
      } catch (e) {
        console.error(e);
      }
    }

    // Temporary one-time wipe of old categories logic
    if (!localStorage.getItem("admin_cleared_old_categories_v2")) {
      localStorage.removeItem("admin_custom_categories");
      localStorage.removeItem("admin_deleted_default_categories");
      localStorage.setItem("admin_cleared_old_categories_v2", "true");
      setCustomCategories([]);
      setDeletedDefaultCategories([]);
    }
  }, []);

  // Popover click outside handler
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveCategoryPopoverProductId(null);
      setCategoriesDropdownOpen(false);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // Discount Coupons State
  const [discountsList, setDiscountsList] = useState<any[]>([]);
  const [newDiscountCode, setNewDiscountCode] = useState<string>("");
  const [newDiscountType, setNewDiscountType] = useState<string>("percentage");
  const [newDiscountValue, setNewDiscountValue] = useState<string>("");
  const [newDiscountMinOrder, setNewDiscountMinOrder] = useState<string>("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [deleteDiscountConfirmId, setDeleteDiscountConfirmId] = useState<string | null>(null);

  // Orders Management State
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");
  const [refundStatusFilter, setRefundStatusFilter] = useState<string>("All");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState<boolean>(false);
  const [isRefundFilterOpen, setIsRefundFilterOpen] = useState<boolean>(false);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);
  const [returnStatusModalOpen, setReturnStatusModalOpen] = useState(false);
  const [returnStatusAction, setReturnStatusAction] = useState<{ orderId: string, newStatus: string }>({ orderId: "", newStatus: "" });
  const [returnStatusNotes, setReturnStatusNotes] = useState("");
  const [deleteOrderTargetId, setDeleteOrderTargetId] = useState<string | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState<string>("");
  const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
  const [deleteCustomerTargetId, setDeleteCustomerTargetId] = useState<string | null>(null);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState<boolean>(false);

  // CRUD Form State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [makingPrice, setMakingPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [additionalInformation, setAdditionalInformation] = useState<string>("");
  const [category, setCategory] = useState<string[]>([]);
  const [imageFront, setImageFront] = useState<string>("");
  const [imageBack, setImageBack] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>(["50ml", "100ml", "150ml"]);
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({});
  const [options, setOptions] = useState<{ size: string; quantity: number | ""; price: number | ""; strikePrice: number | ""; makingPrice: number | ""; category: string[] }[]>([{ size: "", quantity: "", price: "", strikePrice: "", makingPrice: "", category: [] }]);
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [newSizeInput, setNewSizeInput] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadingVideo, setUploadingVideo] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number | null>(null);

  // Storefront CMS Configuration State
  const [tickerText, setTickerText] = useState<string>("");
  const [tickerSpeed, setTickerSpeed] = useState<number>(60);
  const [tickerBgColor, setTickerBgColor] = useState<string>("#ffffff");
  const [tickerTextColor, setTickerTextColor] = useState<string>("#000000");
  const [announcementText, setAnnouncementText] = useState<string>("");
  const [heroTitle, setHeroTitle] = useState<string>("");
  const [heroTitleFontType, setHeroTitleFontType] = useState<string>("Outfit");
  const [heroTitleFontColor, setHeroTitleFontColor] = useState<string>("#111827");
  const [heroTitleFontSize, setHeroTitleFontSize] = useState<string>("4.5rem");
  const [heroTitleFontAlignment, setHeroTitleFontAlignment] = useState<string>("center");
  const [heroTitleFontWeight, setHeroTitleFontWeight] = useState<string>("700");

  const [heroTemplate, setHeroTemplate] = useState<string>("center");
  const [showHeroTitle, setShowHeroTitle] = useState<boolean>(true);
  const [showHeroManifesto, setShowHeroManifesto] = useState<boolean>(true);
  const [showHeroButton, setShowHeroButton] = useState<boolean>(true);
  const [heroButtonText, setHeroButtonText] = useState<string>("Shop Now");
  const [heroButtonStyle, setHeroButtonStyle] = useState<string>("solid");
  const [heroButtonSize, setHeroButtonSize] = useState<string>("md");
  const [heroButtonColor, setHeroButtonColor] = useState<string>("");
  const [heroButtonTextColor, setHeroButtonTextColor] = useState<string>("#ffffff");
  const [heroManifesto, setHeroManifesto] = useState<string>("");
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




  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoSubtitle, setVideoSubtitle] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [lifestyleText, setLifestyleText] = useState<string>("");
  const [lifestyleImage, setLifestyleImage] = useState<string>("");
  const [uploadingLifestyle, setUploadingLifestyle] = useState<boolean>(false);
  const [primaryColor, setPrimaryColor] = useState<string>("#57bc74");
  const [brandLogoType, setBrandLogoType] = useState<string>("text");
  const [brandLogoValue, setBrandLogoValue] = useState<string>("29sFORMULA");
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);
  const [heroBgType, setHeroBgType] = useState<string>("color");
  const [heroBgColor, setHeroBgColor] = useState<string>("#57bc74");
  const [heroBgImage, setHeroBgImage] = useState<string>("");
  const [heroBgVideo, setHeroBgVideo] = useState<string>("");
  const [showTicker, setShowTicker] = useState<boolean>(true);
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(true);
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [videoFallbackColor, setVideoFallbackColor] = useState<string>("#121212");
  const [isVideoCustomizerModalOpen, setIsVideoCustomizerModalOpen] = useState(false);
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
  const [isLifestyleCustomizerModalOpen, setIsLifestyleCustomizerModalOpen] = useState(false);
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
  const [showLifestyle, setShowLifestyle] = useState<boolean>(true);
  const [supportText, setSupportText] = useState<string>("For support inquiries, please contact us.");
  const [careersText, setCareersText] = useState<string>("Join our team! Check out our open positions.");
  const [tradeEnquiryText, setTradeEnquiryText] = useState<string>("For trade and wholesale inquiries, contact our B2B team.");
  const [aboutUsText, setAboutUsText] = useState<string>("We are 29sFORMULA, redefining luxury.");
  const [instagramLink, setInstagramLink] = useState<string>("#");
  const [facebookLink, setFacebookLink] = useState<string>("#");
  const [contactLink, setContactLink] = useState<string>("#");
  const [contactUsText, setContactUsText] = useState<string>("Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours.");
  const [returnPolicyText, setReturnPolicyText] = useState<string>("We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund.");
  const [shippingPolicyText, setShippingPolicyText] = useState<string>("We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days.");
  const [googleClientId, setGoogleClientId] = useState<string>("523936375845-75tjhav8ce01o9mdk325iggb1glgpi21.apps.googleusercontent.com");

  // Dynamic Product Preview Page CMS Settings
  const [showProductReviews, setShowProductReviews] = useState<boolean>(true);
  const [showProductExploreMore, setShowProductExploreMore] = useState<boolean>(true);
  const [showProductFaq, setShowProductFaq] = useState<boolean>(true);
  const [usageGuideText, setUsageGuideText] = useState<string>("Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes.");
  const [exploreMoreTitle, setExploreMoreTitle] = useState<string>("Don't Stop. Explore More.");
  const [deliverySubtext, setDeliverySubtext] = useState<string>("TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.");

  // Admin Reviews Moderation State
  const [adminReviews, setAdminReviews] = useState<any[]>([]);
  const [reviewSearchQuery, setReviewSearchQuery] = useState<string>("");
  const [deleteReviewTarget, setDeleteReviewTarget] = useState<string | null>(null);
  const [isDeletingReview, setIsDeletingReview] = useState<boolean>(false);
  const [editReviewTarget, setEditReviewTarget] = useState<any>(null);
  const [isEditingReview, setIsEditingReview] = useState<boolean>(false);

  // Customize Page Sub-Tab Switcher State ("landing" vs "product" vs "giftset" vs "reviews")
  const [customizeSubTab, setCustomizeSubTab] = useState<"landing" | "product" | "giftset" | "reviews">("landing");

  // Gift Set Page CMS State
  const [showGiftSetPage, setShowGiftSetPage] = useState<boolean>(true);
  const [giftSetHeaderBadge, setGiftSetHeaderBadge] = useState<string>("CURATE · GIFT · DELIGHT");
  const [giftSetHeaderTitle, setGiftSetHeaderTitle] = useState<string>("Build Your Gift Set");
  const [giftSetHeaderSubtitle, setGiftSetHeaderSubtitle] = useState<string>("Pick any 3 fragrances in the same size");
  const [giftSetHeaderTitleFontType, setGiftSetHeaderTitleFontType] = useState<string>("Outfit");
  const [giftSetHeaderTitleFontSize, setGiftSetHeaderTitleFontSize] = useState<string>("3.5rem");
  const [giftSetHeaderTitleFontColor, setGiftSetHeaderTitleFontColor] = useState<string>("#111827");
  const [giftSetHeaderTitleFontWeight, setGiftSetHeaderTitleFontWeight] = useState<string>("800");
  const [giftSetHeaderTitleFontAlignment, setGiftSetHeaderTitleFontAlignment] = useState<string>("center");
  const [giftSetHeaderSubtitleFontType, setGiftSetHeaderSubtitleFontType] = useState<string>("Outfit");
  const [giftSetHeaderSubtitleFontSize, setGiftSetHeaderSubtitleFontSize] = useState<string>("1.1rem");
  const [giftSetHeaderSubtitleFontColor, setGiftSetHeaderSubtitleFontColor] = useState<string>("#6b7280");
  const [giftSetHeaderSubtitleFontWeight, setGiftSetHeaderSubtitleFontWeight] = useState<string>("500");
  const [giftSetBgType, setGiftSetBgType] = useState<string>("color");
  const [giftSetBgColor, setGiftSetBgColor] = useState<string>("#faf5ff");
  const [giftSetBgImage, setGiftSetBgImage] = useState<string>("");
  const [giftSetBgGradient, setGiftSetBgGradient] = useState<string>("linear-gradient(135deg, #faf5ff 0%, #f0e7ff 100%)");
  const [giftSetSizes, setGiftSetSizes] = useState<{ size: string; label: string; description: string }[]>([
    { size: "20 ml", label: "Discovery Set", description: "Pocket perfection for travel" },
    { size: "50 ml", label: "Classic Trio", description: "The most popular signature box" },
    { size: "100 ml", label: "Grand Vault", description: "Ultimate statement fragrance collection" }
  ]);
  const [giftSetDefaultSize, setGiftSetDefaultSize] = useState<string>("50 ml");
  const [giftSetMaxFragrances, setGiftSetMaxFragrances] = useState<number>(3);
  const [giftSetButtonText, setGiftSetButtonText] = useState<string>("Add Gift Box to Cart");
  const [giftSetButtonColor, setGiftSetButtonColor] = useState<string>("#111827");
  const [giftSetButtonTextColor, setGiftSetButtonTextColor] = useState<string>("#ffffff");
  const [giftSetButtonStyle, setGiftSetButtonStyle] = useState<string>("solid");
  const [giftSetCardBorderColor, setGiftSetCardBorderColor] = useState<string>("#e2e8f0");
  const [giftSetCardSelectedColor, setGiftSetCardSelectedColor] = useState<string>("#111827");
  const [giftSetAccentColor, setGiftSetAccentColor] = useState<string>("#111827");

  const [giftSetHeaderBgType, setGiftSetHeaderBgType] = useState<string>("color");
  const [giftSetHeaderBgColor, setGiftSetHeaderBgColor] = useState<string>("#ffffff");
  const [giftSetHeaderBgImage, setGiftSetHeaderBgImage] = useState<string>("");
  const [giftSetHeaderBgVideo, setGiftSetHeaderBgVideo] = useState<string>("");
  const [uploadingGiftSetHeaderImage, setUploadingGiftSetHeaderImage] = useState<boolean>(false);
  const [uploadingGiftSetHeaderVideo, setUploadingGiftSetHeaderVideo] = useState<boolean>(false);
  const [giftSetHeaderVideoProgress, setGiftSetHeaderVideoProgress] = useState<number | null>(null);
  const [uploadingHeroBgVideo, setUploadingHeroBgVideo] = useState<boolean>(false);
  const [heroBgVideoProgress, setHeroBgVideoProgress] = useState<number | null>(null);
  const [uploadingHeroBgImage, setUploadingHeroBgImage] = useState<boolean>(false);
  const [heroBgImageProgress, setHeroBgImageProgress] = useState<number | null>(null);

  const [loadingSettings, setLoadingSettings] = useState<boolean>(false);
  const [activeCustomizerSection, setActiveCustomizerSection] = useState<string | null>(null);
  const [isHeroCustomizerModalOpen, setIsHeroCustomizerModalOpen] = useState(false);

  // Navigation Guard & Unsaved Changes modal states
  const [originalSettings, setOriginalSettings] = useState<any>(null);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false);
  const [showCrudModal, setShowCrudModal] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [categoryModalError, setCategoryModalError] = useState<string | null>(null);
  const [categoryModalLoading, setCategoryModalLoading] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState<boolean>(false);
  const [customAlert, setCustomAlert] = useState<{ title: string; message: string } | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  const normalizeSettingsSnapshot = (data: any) => {
    if (!data) return null;
    return {
      tickerText: data.tickerText || "",
      tickerSpeed: data.tickerSpeed || 60,
      tickerBgColor: data.tickerBgColor || "#ffffff",
      tickerTextColor: data.tickerTextColor || "#000000",
      announcementText: data.announcementText || "",
      heroTitle: data.heroTitle || "",
      heroTitleFontType: data.heroTitleFontType || "Outfit",
      heroTitleFontColor: data.heroTitleFontColor || "#111827",
      heroTitleFontSize: data.heroTitleFontSize || "4.5rem",
      heroTitleFontAlignment: data.heroTitleFontAlignment || "center",
      heroTitleFontWeight: data.heroTitleFontWeight || "700",
      heroManifestoFontType: data.heroManifestoFontType || "Outfit",
      heroManifestoFontColor: data.heroManifestoFontColor || "#ffffff",
      heroManifestoFontSize: data.heroManifestoFontSize || "0.72rem",
      heroManifestoFontAlignment: data.heroManifestoFontAlignment || "left",
      heroManifestoFontWeight: data.heroManifestoFontWeight || "500",
      heroManifesto: data.heroManifesto || "",
      heroTemplate: data.heroTemplate || "center",
      showHeroTitle: data.showHeroTitle !== false,
      showHeroManifesto: data.showHeroManifesto !== false,
      showHeroButton: data.showHeroButton !== false,
      heroButtonText: data.heroButtonText || "Shop Now",
      heroButtonStyle: data.heroButtonStyle || "solid",
      heroButtonSize: data.heroButtonSize || "md",
      heroButtonColor: data.heroButtonColor || "",
      heroButtonTextColor: data.heroButtonTextColor || "#ffffff",
      mobileHeroTemplate: data.mobileHeroTemplate || data.heroTemplate || "center",
      mobileHeroTitle: data.mobileHeroTitle !== undefined ? data.mobileHeroTitle : "",
      mobileHeroTitleFontType: data.mobileHeroTitleFontType || data.heroTitleFontType || "Outfit",
      mobileHeroTitleFontColor: data.mobileHeroTitleFontColor || data.heroTitleFontColor || "#111827",
      mobileHeroTitleFontSize: data.mobileHeroTitleFontSize || "2.5rem",
      mobileHeroTitleFontAlignment: data.mobileHeroTitleFontAlignment || data.heroTitleFontAlignment || "center",
      mobileHeroTitleFontWeight: data.mobileHeroTitleFontWeight || data.heroTitleFontWeight || "700",
      showMobileHeroTitle: data.showMobileHeroTitle !== undefined ? data.showMobileHeroTitle : true,

      mobileHeroManifesto: data.mobileHeroManifesto !== undefined ? data.mobileHeroManifesto : "",
      mobileHeroManifestoFontType: data.mobileHeroManifestoFontType || data.heroManifestoFontType || "Outfit",
      mobileHeroManifestoFontColor: data.mobileHeroManifestoFontColor || data.heroManifestoFontColor || "#ffffff",
      mobileHeroManifestoFontSize: data.mobileHeroManifestoFontSize || "0.85rem",
      mobileHeroManifestoFontAlignment: data.mobileHeroManifestoFontAlignment || data.heroManifestoFontAlignment || "center",
      mobileHeroManifestoFontWeight: data.mobileHeroManifestoFontWeight || data.heroManifestoFontWeight || "500",
      showMobileHeroManifesto: data.showMobileHeroManifesto !== undefined ? data.showMobileHeroManifesto : true,

      mobileHeroButtonText: data.mobileHeroButtonText || data.heroButtonText || "Shop Now",
      mobileHeroButtonStyle: data.mobileHeroButtonStyle || data.heroButtonStyle || "solid",
      mobileHeroButtonSize: data.mobileHeroButtonSize || "sm",
      mobileHeroButtonColor: data.mobileHeroButtonColor !== undefined ? data.mobileHeroButtonColor : "",
      mobileHeroButtonTextColor: data.mobileHeroButtonTextColor || data.heroButtonTextColor || "#ffffff",
      showMobileHeroButton: data.showMobileHeroButton !== undefined ? data.showMobileHeroButton : true,
      videoTitle: data.videoTitle || "",
      videoSubtitle: data.videoSubtitle || "",
      videoUrl: data.videoUrl || "",
      videoFallbackColor: data.videoFallbackColor || "#121212",
      videoTitleFontType: data.videoTitleFontType || "Outfit",
      videoTitleFontColor: data.videoTitleFontColor || "#ffffff",
      videoTitleFontSize: data.videoTitleFontSize || "3.5rem",
      videoTitleFontAlignment: data.videoTitleFontAlignment || "center",
      videoTitleFontWeight: data.videoTitleFontWeight || "700",
      videoSubtitleFontType: data.videoSubtitleFontType || "Outfit",
      videoSubtitleFontColor: data.videoSubtitleFontColor || "#ffffff",
      videoSubtitleFontSize: data.videoSubtitleFontSize || "1.1rem",
      videoSubtitleFontAlignment: data.videoSubtitleFontAlignment || "center",
      videoSubtitleFontWeight: data.videoSubtitleFontWeight || "500",
      videoTemplate: data.videoTemplate || "center",
      showVideoTitle: data.showVideoTitle !== false,
      showVideoSubtitle: data.showVideoSubtitle !== false,
      showVideoButton: data.showVideoButton !== false,
      videoButtonText: data.videoButtonText || "Shop Now",
      videoButtonStyle: data.videoButtonStyle || "outline",
      videoButtonSize: data.videoButtonSize || "md",
      videoButtonColor: data.videoButtonColor || "#ffffff",
      videoButtonTextColor: data.videoButtonTextColor || "#121212",
      videoBgType: data.videoBgType || "video",
      videoBgColor: data.videoBgColor || "#121212",
      videoBgImage: data.videoBgImage || "",
      mobileVideoTemplate: data.mobileVideoTemplate || data.videoTemplate || "center",
      mobileVideoTitle: data.mobileVideoTitle !== undefined ? data.mobileVideoTitle : "",
      mobileVideoTitleFontType: data.mobileVideoTitleFontType || data.videoTitleFontType || "Outfit",
      mobileVideoTitleFontColor: data.mobileVideoTitleFontColor || data.videoTitleFontColor || "#ffffff",
      mobileVideoTitleFontSize: data.mobileVideoTitleFontSize || "2.5rem",
      mobileVideoTitleFontAlignment: data.mobileVideoTitleFontAlignment || data.videoTitleFontAlignment || "center",
      mobileVideoTitleFontWeight: data.mobileVideoTitleFontWeight || data.videoTitleFontWeight || "700",
      showMobileVideoTitle: data.showMobileVideoTitle !== undefined ? data.showMobileVideoTitle : true,

      mobileVideoSubtitle: data.mobileVideoSubtitle !== undefined ? data.mobileVideoSubtitle : "",
      mobileVideoSubtitleFontType: data.mobileVideoSubtitleFontType || data.videoSubtitleFontType || "Outfit",
      mobileVideoSubtitleFontColor: data.mobileVideoSubtitleFontColor || data.videoSubtitleFontColor || "#ffffff",
      mobileVideoSubtitleFontSize: data.mobileVideoSubtitleFontSize || "0.85rem",
      mobileVideoSubtitleFontAlignment: data.mobileVideoSubtitleFontAlignment || data.videoSubtitleFontAlignment || "center",
      mobileVideoSubtitleFontWeight: data.mobileVideoSubtitleFontWeight || data.videoSubtitleFontWeight || "500",
      showMobileVideoSubtitle: data.showMobileVideoSubtitle !== undefined ? data.showMobileVideoSubtitle : true,

      mobileVideoButtonText: data.mobileVideoButtonText !== undefined ? data.mobileVideoButtonText : (data.videoButtonText || "Shop Now"),
      mobileVideoButtonStyle: data.mobileVideoButtonStyle !== undefined ? data.mobileVideoButtonStyle : (data.videoButtonStyle || "outline"),
      mobileVideoButtonSize: data.mobileVideoButtonSize !== undefined ? data.mobileVideoButtonSize : "sm",
      mobileVideoButtonColor: data.mobileVideoButtonColor !== undefined ? data.mobileVideoButtonColor : "#ffffff",
      mobileVideoButtonTextColor: data.mobileVideoButtonTextColor !== undefined ? data.mobileVideoButtonTextColor : (data.videoButtonTextColor || "#121212"),
      showMobileVideoButton: data.showMobileVideoButton !== undefined ? data.showMobileVideoButton : true,
      lifestyleText: data.lifestyleText || "",
      lifestyleImage: data.lifestyleImage || "https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80",
      lifestyleTextFontType: data.lifestyleTextFontType || "Outfit",
      lifestyleTextFontColor: data.lifestyleTextFontColor || "#ffffff",
      lifestyleTextFontSize: data.lifestyleTextFontSize || "2.5rem",
      lifestyleTextFontAlignment: data.lifestyleTextFontAlignment || "center",
      lifestyleTextFontWeight: data.lifestyleTextFontWeight || "700",
      showLifestyleText: data.showLifestyleText !== undefined ? data.showLifestyleText : true,
      showLifestyleButton: data.showLifestyleButton !== undefined ? data.showLifestyleButton : true,
      lifestyleButtonText: data.lifestyleButtonText !== undefined ? data.lifestyleButtonText : "Explore Now",
      lifestyleButtonStyle: data.lifestyleButtonStyle !== undefined ? data.lifestyleButtonStyle : "solid",
      lifestyleButtonSize: data.lifestyleButtonSize !== undefined ? data.lifestyleButtonSize : "md",
      lifestyleButtonColor: data.lifestyleButtonColor !== undefined ? data.lifestyleButtonColor : "",
      lifestyleButtonTextColor: data.lifestyleButtonTextColor !== undefined ? data.lifestyleButtonTextColor : "#ffffff",

      mobileLifestyleText: data.mobileLifestyleText !== undefined ? data.mobileLifestyleText : "",
      mobileLifestyleTextFontType: data.mobileLifestyleTextFontType || data.lifestyleTextFontType || "Outfit",
      mobileLifestyleTextFontColor: data.mobileLifestyleTextFontColor || data.lifestyleTextFontColor || "#ffffff",
      mobileLifestyleTextFontSize: data.mobileLifestyleTextFontSize || "1.8rem",
      mobileLifestyleTextFontAlignment: data.mobileLifestyleTextFontAlignment || data.lifestyleTextFontAlignment || "center",
      mobileLifestyleTextFontWeight: data.mobileLifestyleTextFontWeight || data.lifestyleTextFontWeight || "700",
      showMobileLifestyleText: data.showMobileLifestyleText !== undefined ? data.showMobileLifestyleText : true,
      showMobileLifestyleButton: data.showMobileLifestyleButton !== undefined ? data.showMobileLifestyleButton : true,
      mobileLifestyleButtonText: data.mobileLifestyleButtonText !== undefined ? data.mobileLifestyleButtonText : (data.lifestyleButtonText || "Explore Now"),
      mobileLifestyleButtonStyle: data.mobileLifestyleButtonStyle !== undefined ? data.mobileLifestyleButtonStyle : (data.lifestyleButtonStyle || "solid"),
      mobileLifestyleButtonSize: data.mobileLifestyleButtonSize !== undefined ? data.mobileLifestyleButtonSize : "sm",
      mobileLifestyleButtonColor: data.mobileLifestyleButtonColor !== undefined ? data.mobileLifestyleButtonColor : (data.lifestyleButtonColor || ""),
      mobileLifestyleButtonTextColor: data.mobileLifestyleButtonTextColor !== undefined ? data.mobileLifestyleButtonTextColor : (data.lifestyleButtonTextColor || "#ffffff"),
      primaryColor: data.primaryColor || "#57bc74",
      brandLogoType: data.brandLogoType || "text",
      brandLogoValue: data.brandLogoValue || "29sFORMULA",
      heroBgType: data.heroBgType || "color",
      heroBgColor: data.heroBgColor || "#57bc74",
      heroBgImage: data.heroBgImage || "",
      heroBgVideo: data.heroBgVideo || "",
      showTicker: data.showTicker !== undefined ? data.showTicker : true,
      showAnnouncement: data.showAnnouncement !== undefined ? data.showAnnouncement : true,
      showVideo: data.showVideo !== undefined ? data.showVideo : true,
      showLifestyle: data.showLifestyle !== undefined ? data.showLifestyle : true,
      showProductReviews: data.showProductReviews !== undefined ? data.showProductReviews : true,
      showProductExploreMore: data.showProductExploreMore !== undefined ? data.showProductExploreMore : true,
      showProductFaq: data.showProductFaq !== undefined ? data.showProductFaq : true,
      usageGuideText: data.usageGuideText || "Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes.",
      exploreMoreTitle: data.exploreMoreTitle || "Don't Stop. Explore More.",
      deliverySubtext: data.deliverySubtext || "TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.",
      googleClientId: data.googleClientId || "523936375845-75tjhav8ce01o9mdk325iggb1glgpi21.apps.googleusercontent.com",
      supportText: data.supportText !== undefined ? data.supportText : "For support inquiries, please contact us.",
      careersText: data.careersText !== undefined ? data.careersText : "Join our team! Check out our open positions.",
      tradeEnquiryText: data.tradeEnquiryText !== undefined ? data.tradeEnquiryText : "For trade and wholesale inquiries, contact our B2B team.",
      aboutUsText: data.aboutUsText !== undefined ? data.aboutUsText : "We are 29sFORMULA, redefining luxury.",
      instagramLink: data.instagramLink !== undefined ? data.instagramLink : "#",
      facebookLink: data.facebookLink !== undefined ? data.facebookLink : "#",
      contactLink: data.contactLink !== undefined ? data.contactLink : "#",
      contactUsText: data.contactUsText !== undefined ? data.contactUsText : "Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours.",
      returnPolicyText: data.returnPolicyText !== undefined ? data.returnPolicyText : "We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund.",
      shippingPolicyText: data.shippingPolicyText !== undefined ? data.shippingPolicyText : "We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days.",
      faqs: data.faqs || [],
      showGiftSetPage: data.showGiftSetPage !== undefined ? data.showGiftSetPage : true,
      giftSetHeaderBadge: data.giftSetHeaderBadge || "CURATE · GIFT · DELIGHT",
      giftSetHeaderTitle: data.giftSetHeaderTitle || "Build Your Gift Set",
      giftSetHeaderSubtitle: data.giftSetHeaderSubtitle || "Pick any 3 fragrances in the same size",
      giftSetHeaderTitleFontType: data.giftSetHeaderTitleFontType || "Outfit",
      giftSetHeaderTitleFontSize: data.giftSetHeaderTitleFontSize || "3.5rem",
      giftSetHeaderTitleFontColor: data.giftSetHeaderTitleFontColor || "#111827",
      giftSetHeaderTitleFontWeight: data.giftSetHeaderTitleFontWeight || "800",
      giftSetHeaderTitleFontAlignment: data.giftSetHeaderTitleFontAlignment || "center",
      giftSetHeaderSubtitleFontType: data.giftSetHeaderSubtitleFontType || "Outfit",
      giftSetHeaderSubtitleFontSize: data.giftSetHeaderSubtitleFontSize || "1.1rem",
      giftSetHeaderSubtitleFontColor: data.giftSetHeaderSubtitleFontColor || "#6b7280",
      giftSetHeaderSubtitleFontWeight: data.giftSetHeaderSubtitleFontWeight || "500",
      giftSetHeaderBgType: data.giftSetHeaderBgType || "color",
      giftSetHeaderBgColor: data.giftSetHeaderBgColor || "#ffffff",
      giftSetHeaderBgImage: data.giftSetHeaderBgImage || "",
      giftSetHeaderBgVideo: data.giftSetHeaderBgVideo || "",
      giftSetBgType: data.giftSetBgType || "color",
      giftSetBgColor: data.giftSetBgColor || "#faf5ff",
      giftSetBgImage: data.giftSetBgImage || "",
      giftSetBgGradient: data.giftSetBgGradient || "linear-gradient(135deg, #faf5ff 0%, #f0e7ff 100%)",
      giftSetSizes: data.giftSetSizes || [
        { size: "20 ml", label: "Discovery Set", description: "Pocket perfection for travel" },
        { size: "50 ml", label: "Classic Trio", description: "The most popular signature box" },
        { size: "100 ml", label: "Grand Vault", description: "Ultimate statement fragrance collection" }
      ],
      giftSetDefaultSize: data.giftSetDefaultSize || "50 ml",
      giftSetMaxFragrances: data.giftSetMaxFragrances || 3,
      giftSetButtonText: data.giftSetButtonText || "Add Gift Box to Cart",
      giftSetButtonColor: data.giftSetButtonColor || "#111827",
      giftSetButtonTextColor: data.giftSetButtonTextColor || "#ffffff",
      giftSetButtonStyle: data.giftSetButtonStyle || "solid",
      giftSetCardBorderColor: data.giftSetCardBorderColor || "#e2e8f0",
      giftSetCardSelectedColor: data.giftSetCardSelectedColor || "#111827",
      giftSetAccentColor: data.giftSetAccentColor || "#111827"
    };
  };

  const hasUnsavedChanges = originalSettings ? (
    tickerText !== originalSettings.tickerText ||
    tickerSpeed !== originalSettings.tickerSpeed ||
    tickerBgColor !== originalSettings.tickerBgColor ||
    tickerTextColor !== originalSettings.tickerTextColor ||
    announcementText !== originalSettings.announcementText ||
    heroTitle !== originalSettings.heroTitle ||
    heroTitleFontType !== originalSettings.heroTitleFontType ||
    heroTitleFontColor !== originalSettings.heroTitleFontColor ||
    heroTitleFontSize !== originalSettings.heroTitleFontSize ||
    heroTitleFontAlignment !== originalSettings.heroTitleFontAlignment ||
    heroTitleFontWeight !== originalSettings.heroTitleFontWeight ||
    heroManifesto !== originalSettings.heroManifesto ||
    heroManifestoFontType !== originalSettings.heroManifestoFontType ||
    heroManifestoFontColor !== originalSettings.heroManifestoFontColor ||
    heroManifestoFontSize !== originalSettings.heroManifestoFontSize ||
    heroManifestoFontAlignment !== originalSettings.heroManifestoFontAlignment ||
    heroManifestoFontWeight !== originalSettings.heroManifestoFontWeight ||
    heroTemplate !== originalSettings.heroTemplate ||
    showHeroTitle !== originalSettings.showHeroTitle ||
    showHeroManifesto !== originalSettings.showHeroManifesto ||
    showHeroButton !== originalSettings.showHeroButton ||
    heroButtonText !== originalSettings.heroButtonText ||
    heroButtonStyle !== originalSettings.heroButtonStyle ||
    heroButtonSize !== originalSettings.heroButtonSize ||
    heroButtonColor !== originalSettings.heroButtonColor ||
    heroButtonTextColor !== originalSettings.heroButtonTextColor ||
    mobileHeroTemplate !== originalSettings.mobileHeroTemplate ||
    mobileHeroTitle !== originalSettings.mobileHeroTitle ||
    mobileHeroTitleFontType !== originalSettings.mobileHeroTitleFontType ||
    mobileHeroTitleFontColor !== originalSettings.mobileHeroTitleFontColor ||
    mobileHeroTitleFontSize !== originalSettings.mobileHeroTitleFontSize ||
    mobileHeroTitleFontAlignment !== originalSettings.mobileHeroTitleFontAlignment ||
    mobileHeroTitleFontWeight !== originalSettings.mobileHeroTitleFontWeight ||
    showMobileHeroTitle !== originalSettings.showMobileHeroTitle ||

    mobileHeroManifesto !== originalSettings.mobileHeroManifesto ||
    mobileHeroManifestoFontType !== originalSettings.mobileHeroManifestoFontType ||
    mobileHeroManifestoFontColor !== originalSettings.mobileHeroManifestoFontColor ||
    mobileHeroManifestoFontSize !== originalSettings.mobileHeroManifestoFontSize ||
    mobileHeroManifestoFontAlignment !== originalSettings.mobileHeroManifestoFontAlignment ||
    mobileHeroManifestoFontWeight !== originalSettings.mobileHeroManifestoFontWeight ||
    showMobileHeroManifesto !== originalSettings.showMobileHeroManifesto ||

    mobileHeroButtonText !== originalSettings.mobileHeroButtonText ||
    mobileHeroButtonStyle !== originalSettings.mobileHeroButtonStyle ||
    mobileHeroButtonSize !== originalSettings.mobileHeroButtonSize ||
    mobileHeroButtonColor !== originalSettings.mobileHeroButtonColor ||
    mobileHeroButtonTextColor !== originalSettings.mobileHeroButtonTextColor ||
    showMobileHeroButton !== originalSettings.showMobileHeroButton ||
    videoTitle !== originalSettings.videoTitle ||
    videoSubtitle !== originalSettings.videoSubtitle ||
    videoUrl !== originalSettings.videoUrl ||
    videoFallbackColor !== originalSettings.videoFallbackColor ||
    videoTitleFontType !== originalSettings.videoTitleFontType ||
    videoTitleFontColor !== originalSettings.videoTitleFontColor ||
    videoTitleFontSize !== originalSettings.videoTitleFontSize ||
    videoTitleFontAlignment !== originalSettings.videoTitleFontAlignment ||
    videoTitleFontWeight !== originalSettings.videoTitleFontWeight ||
    videoSubtitleFontType !== originalSettings.videoSubtitleFontType ||
    videoSubtitleFontColor !== originalSettings.videoSubtitleFontColor ||
    videoSubtitleFontSize !== originalSettings.videoSubtitleFontSize ||
    videoSubtitleFontAlignment !== originalSettings.videoSubtitleFontAlignment ||
    videoSubtitleFontWeight !== originalSettings.videoSubtitleFontWeight ||
    videoTemplate !== originalSettings.videoTemplate ||
    showVideoTitle !== originalSettings.showVideoTitle ||
    showVideoSubtitle !== originalSettings.showVideoSubtitle ||
    showVideoButton !== originalSettings.showVideoButton ||
    videoButtonText !== originalSettings.videoButtonText ||
    videoButtonStyle !== originalSettings.videoButtonStyle ||
    videoButtonSize !== originalSettings.videoButtonSize ||
    videoButtonColor !== originalSettings.videoButtonColor ||
    videoButtonTextColor !== originalSettings.videoButtonTextColor ||
    videoBgType !== originalSettings.videoBgType ||
    videoBgColor !== originalSettings.videoBgColor ||
    videoBgImage !== originalSettings.videoBgImage ||
    mobileVideoTemplate !== originalSettings.mobileVideoTemplate ||
    mobileVideoTitle !== originalSettings.mobileVideoTitle ||
    mobileVideoTitleFontType !== originalSettings.mobileVideoTitleFontType ||
    mobileVideoTitleFontColor !== originalSettings.mobileVideoTitleFontColor ||
    mobileVideoTitleFontSize !== originalSettings.mobileVideoTitleFontSize ||
    mobileVideoTitleFontAlignment !== originalSettings.mobileVideoTitleFontAlignment ||
    mobileVideoTitleFontWeight !== originalSettings.mobileVideoTitleFontWeight ||
    showMobileVideoTitle !== originalSettings.showMobileVideoTitle ||

    mobileVideoSubtitle !== originalSettings.mobileVideoSubtitle ||
    mobileVideoSubtitleFontType !== originalSettings.mobileVideoSubtitleFontType ||
    mobileVideoSubtitleFontColor !== originalSettings.mobileVideoSubtitleFontColor ||
    mobileVideoSubtitleFontSize !== originalSettings.mobileVideoSubtitleFontSize ||
    mobileVideoSubtitleFontAlignment !== originalSettings.mobileVideoSubtitleFontAlignment ||
    mobileVideoSubtitleFontWeight !== originalSettings.mobileVideoSubtitleFontWeight ||
    showMobileVideoSubtitle !== originalSettings.showMobileVideoSubtitle ||

    mobileVideoButtonText !== originalSettings.mobileVideoButtonText ||
    mobileVideoButtonStyle !== originalSettings.mobileVideoButtonStyle ||
    mobileVideoButtonSize !== originalSettings.mobileVideoButtonSize ||
    mobileVideoButtonColor !== originalSettings.mobileVideoButtonColor ||
    mobileVideoButtonTextColor !== originalSettings.mobileVideoButtonTextColor ||
    showMobileVideoButton !== originalSettings.showMobileVideoButton ||
    lifestyleText !== originalSettings.lifestyleText ||
    lifestyleImage !== originalSettings.lifestyleImage ||
    lifestyleTextFontType !== originalSettings.lifestyleTextFontType ||
    lifestyleTextFontColor !== originalSettings.lifestyleTextFontColor ||
    lifestyleTextFontSize !== originalSettings.lifestyleTextFontSize ||
    lifestyleTextFontAlignment !== originalSettings.lifestyleTextFontAlignment ||
    lifestyleTextFontWeight !== originalSettings.lifestyleTextFontWeight ||
    showLifestyleText !== originalSettings.showLifestyleText ||
    showLifestyleButton !== originalSettings.showLifestyleButton ||
    lifestyleButtonText !== originalSettings.lifestyleButtonText ||
    lifestyleButtonStyle !== originalSettings.lifestyleButtonStyle ||
    lifestyleButtonSize !== originalSettings.lifestyleButtonSize ||
    lifestyleButtonColor !== originalSettings.lifestyleButtonColor ||
    lifestyleButtonTextColor !== originalSettings.lifestyleButtonTextColor ||

    mobileLifestyleText !== originalSettings.mobileLifestyleText ||
    mobileLifestyleTextFontType !== originalSettings.mobileLifestyleTextFontType ||
    mobileLifestyleTextFontColor !== originalSettings.mobileLifestyleTextFontColor ||
    mobileLifestyleTextFontSize !== originalSettings.mobileLifestyleTextFontSize ||
    mobileLifestyleTextFontAlignment !== originalSettings.mobileLifestyleTextFontAlignment ||
    mobileLifestyleTextFontWeight !== originalSettings.mobileLifestyleTextFontWeight ||
    showMobileLifestyleText !== originalSettings.showMobileLifestyleText ||
    showMobileLifestyleButton !== originalSettings.showMobileLifestyleButton ||
    mobileLifestyleButtonText !== originalSettings.mobileLifestyleButtonText ||
    mobileLifestyleButtonStyle !== originalSettings.mobileLifestyleButtonStyle ||
    mobileLifestyleButtonSize !== originalSettings.mobileLifestyleButtonSize ||
    mobileLifestyleButtonColor !== originalSettings.mobileLifestyleButtonColor ||
    mobileLifestyleButtonTextColor !== originalSettings.mobileLifestyleButtonTextColor ||
    primaryColor !== originalSettings.primaryColor ||
    brandLogoType !== originalSettings.brandLogoType ||
    brandLogoValue !== originalSettings.brandLogoValue ||
    heroBgType !== originalSettings.heroBgType ||
    heroBgColor !== originalSettings.heroBgColor ||
    heroBgImage !== originalSettings.heroBgImage ||
    heroBgVideo !== originalSettings.heroBgVideo ||
    showTicker !== originalSettings.showTicker ||
    showAnnouncement !== originalSettings.showAnnouncement ||
    showVideo !== originalSettings.showVideo ||
    showLifestyle !== originalSettings.showLifestyle ||
    showProductReviews !== originalSettings.showProductReviews ||
    showProductExploreMore !== originalSettings.showProductExploreMore ||
    showProductFaq !== originalSettings.showProductFaq ||
    usageGuideText !== originalSettings.usageGuideText ||
    exploreMoreTitle !== originalSettings.exploreMoreTitle ||
    deliverySubtext !== originalSettings.deliverySubtext ||
    supportText !== originalSettings.supportText ||
    careersText !== originalSettings.careersText ||
    tradeEnquiryText !== originalSettings.tradeEnquiryText ||
    aboutUsText !== originalSettings.aboutUsText ||
    instagramLink !== originalSettings.instagramLink ||
    facebookLink !== originalSettings.facebookLink ||
    contactLink !== originalSettings.contactLink ||
    contactUsText !== originalSettings.contactUsText ||
    returnPolicyText !== originalSettings.returnPolicyText ||
    shippingPolicyText !== originalSettings.shippingPolicyText ||
    showGiftSetPage !== originalSettings.showGiftSetPage ||
    giftSetHeaderBadge !== originalSettings.giftSetHeaderBadge ||
    giftSetHeaderTitle !== originalSettings.giftSetHeaderTitle ||
    giftSetHeaderSubtitle !== originalSettings.giftSetHeaderSubtitle ||
    giftSetHeaderTitleFontType !== originalSettings.giftSetHeaderTitleFontType ||
    giftSetHeaderTitleFontSize !== originalSettings.giftSetHeaderTitleFontSize ||
    giftSetHeaderTitleFontColor !== originalSettings.giftSetHeaderTitleFontColor ||
    giftSetHeaderTitleFontWeight !== originalSettings.giftSetHeaderTitleFontWeight ||
    giftSetHeaderTitleFontAlignment !== originalSettings.giftSetHeaderTitleFontAlignment ||
    giftSetHeaderSubtitleFontType !== originalSettings.giftSetHeaderSubtitleFontType ||
    giftSetHeaderSubtitleFontSize !== originalSettings.giftSetHeaderSubtitleFontSize ||
    giftSetHeaderSubtitleFontColor !== originalSettings.giftSetHeaderSubtitleFontColor ||
    giftSetHeaderSubtitleFontWeight !== originalSettings.giftSetHeaderSubtitleFontWeight ||
    giftSetHeaderBgType !== originalSettings.giftSetHeaderBgType ||
    giftSetHeaderBgColor !== originalSettings.giftSetHeaderBgColor ||
    giftSetHeaderBgImage !== originalSettings.giftSetHeaderBgImage ||
    giftSetHeaderBgVideo !== originalSettings.giftSetHeaderBgVideo ||
    giftSetBgType !== originalSettings.giftSetBgType ||
    giftSetBgColor !== originalSettings.giftSetBgColor ||
    giftSetBgImage !== originalSettings.giftSetBgImage ||
    giftSetBgGradient !== originalSettings.giftSetBgGradient ||
    JSON.stringify(giftSetSizes) !== JSON.stringify(originalSettings.giftSetSizes || []) ||
    giftSetDefaultSize !== originalSettings.giftSetDefaultSize ||
    giftSetMaxFragrances !== originalSettings.giftSetMaxFragrances ||
    giftSetButtonText !== originalSettings.giftSetButtonText ||
    giftSetButtonColor !== originalSettings.giftSetButtonColor ||
    giftSetButtonTextColor !== originalSettings.giftSetButtonTextColor ||
    giftSetButtonStyle !== originalSettings.giftSetButtonStyle ||
    giftSetCardBorderColor !== originalSettings.giftSetCardBorderColor ||
    giftSetCardSelectedColor !== originalSettings.giftSetCardSelectedColor ||
    giftSetAccentColor !== originalSettings.giftSetAccentColor ||
    JSON.stringify(faqs) !== JSON.stringify(originalSettings.faqs || [])
  ) : false;

  const getChangedFieldsList = () => {
    const changes: string[] = [];
    if (!originalSettings) return changes;
    if (tickerText !== (originalSettings.tickerText || "")) changes.push("Marquee scrolling ticker text");
    if (tickerSpeed !== (originalSettings.tickerSpeed || 60)) changes.push("Marquee ticker scrolling speed");
    if (tickerBgColor !== (originalSettings.tickerBgColor || "#ffffff")) changes.push("Marquee ticker background color");
    if (tickerTextColor !== (originalSettings.tickerTextColor || "#000000")) changes.push("Marquee ticker text color");
    if (announcementText !== (originalSettings.announcementText || "")) changes.push("Top announcement banner copy");
    if (heroTitle !== (originalSettings.heroTitle || "")) changes.push("Hero brand header title");
    if (heroTitleFontType !== (originalSettings.heroTitleFontType || "Outfit")) changes.push("Hero title font type");
    if (heroTitleFontColor !== (originalSettings.heroTitleFontColor || "#111827")) changes.push("Hero title font color");
    if (heroTitleFontSize !== (originalSettings.heroTitleFontSize || "4.5rem")) changes.push("Hero title font size");
    if (heroTitleFontAlignment !== (originalSettings.heroTitleFontAlignment || "center")) changes.push("Hero title font alignment");
    if (heroTitleFontWeight !== (originalSettings.heroTitleFontWeight || "700")) changes.push("Hero title font weight");
    if (heroManifesto !== (originalSettings.heroManifesto || "")) changes.push("Hero brand manifesto subtext");
    if (heroManifestoFontType !== (originalSettings.heroManifestoFontType || "Outfit")) changes.push("Hero manifesto font type");
    if (heroManifestoFontColor !== (originalSettings.heroManifestoFontColor || "#ffffff")) changes.push("Hero manifesto font color");
    if (heroManifestoFontSize !== (originalSettings.heroManifestoFontSize || "0.72rem")) changes.push("Hero manifesto font size");
    if (heroManifestoFontAlignment !== (originalSettings.heroManifestoFontAlignment || "left")) changes.push("Hero manifesto font alignment");
    if (heroManifestoFontWeight !== (originalSettings.heroManifestoFontWeight || "500")) changes.push("Hero manifesto font weight");
    if (heroTemplate !== (originalSettings.heroTemplate || "center")) changes.push("Hero layout templates");
    if (showHeroTitle !== (originalSettings.showHeroTitle !== false)) changes.push("Hero Title toggle");
    if (showHeroManifesto !== (originalSettings.showHeroManifesto !== false)) changes.push("Hero Manifesto toggle");
    if (showHeroButton !== (originalSettings.showHeroButton !== false)) changes.push("Hero Button toggle");
    if (heroButtonText !== (originalSettings.heroButtonText || "Shop Now")) changes.push("Hero CTA Button text");
    if (heroButtonStyle !== (originalSettings.heroButtonStyle || "solid")) changes.push("Hero CTA Button style");
    if (heroButtonSize !== (originalSettings.heroButtonSize || "md")) changes.push("Hero CTA Button size");
    if (heroButtonColor !== (originalSettings.heroButtonColor || "")) changes.push("Hero CTA Button color");
    if (heroButtonTextColor !== (originalSettings.heroButtonTextColor || "#ffffff")) changes.push("Hero CTA Button text color");
    if (videoTitle !== (originalSettings.videoTitle || "")) changes.push("Video banner headline title");
    if (videoSubtitle !== (originalSettings.videoSubtitle || "")) changes.push("Video banner description");
    if (videoUrl !== (originalSettings.videoUrl || "")) changes.push("Background video URL");
    if (videoTitleFontType !== (originalSettings.videoTitleFontType || "Outfit")) changes.push("Video title font type");
    if (videoTitleFontColor !== (originalSettings.videoTitleFontColor || "#ffffff")) changes.push("Video title font color");
    if (videoTitleFontSize !== (originalSettings.videoTitleFontSize || "3.5rem")) changes.push("Video title font size");
    if (videoTitleFontAlignment !== (originalSettings.videoTitleFontAlignment || "center")) changes.push("Video title font alignment");
    if (videoTitleFontWeight !== (originalSettings.videoTitleFontWeight || "700")) changes.push("Video title font weight");
    if (videoSubtitleFontType !== (originalSettings.videoSubtitleFontType || "Outfit")) changes.push("Video subtitle font type");
    if (videoSubtitleFontColor !== (originalSettings.videoSubtitleFontColor || "#ffffff")) changes.push("Video subtitle font color");
    if (videoSubtitleFontSize !== (originalSettings.videoSubtitleFontSize || "1.1rem")) changes.push("Video subtitle font size");
    if (videoSubtitleFontAlignment !== (originalSettings.videoSubtitleFontAlignment || "center")) changes.push("Video subtitle font alignment");
    if (videoSubtitleFontWeight !== (originalSettings.videoSubtitleFontWeight || "500")) changes.push("Video subtitle font weight");
    if (videoTemplate !== (originalSettings.videoTemplate || "center")) changes.push("Video layout template");
    if (showVideoTitle !== (originalSettings.showVideoTitle ?? true)) changes.push("Video Title toggle");
    if (showVideoSubtitle !== (originalSettings.showVideoSubtitle ?? true)) changes.push("Video Subtitle toggle");
    if (showVideoButton !== (originalSettings.showVideoButton ?? true)) changes.push("Video Button toggle");
    if (videoButtonText !== (originalSettings.videoButtonText || "Shop Now")) changes.push("Video CTA Button text");
    if (videoButtonStyle !== (originalSettings.videoButtonStyle || "outline")) changes.push("Video CTA Button style");
    if (videoButtonSize !== (originalSettings.videoButtonSize || "md")) changes.push("Video CTA Button size");
    if (videoButtonColor !== (originalSettings.videoButtonColor || "#ffffff")) changes.push("Video CTA Button color");
    if (videoButtonTextColor !== (originalSettings.videoButtonTextColor || "#121212")) changes.push("Video CTA Button text color");
    if (videoBgType !== (originalSettings.videoBgType || "video")) changes.push("Video background type");
    if (videoBgColor !== (originalSettings.videoBgColor || "#121212")) changes.push("Video custom background color");
    if (videoBgImage !== (originalSettings.videoBgImage || "")) changes.push("Video background image URL");
    if (JSON.stringify(faqs) !== JSON.stringify(originalSettings.faqs || [])) changes.push("Frequently Asked Questions (FAQ) list");
    if (lifestyleText !== (originalSettings.lifestyleText || "")) changes.push("Lifestyle overlay text copy");
    if (lifestyleImage !== (originalSettings.lifestyleImage || "")) changes.push("Lifestyle banner background image");
    if (lifestyleTextFontType !== (originalSettings.lifestyleTextFontType || "Outfit")) changes.push("Lifestyle text font type");
    if (lifestyleTextFontColor !== (originalSettings.lifestyleTextFontColor || "#ffffff")) changes.push("Lifestyle text font color");
    if (lifestyleTextFontSize !== (originalSettings.lifestyleTextFontSize || "2.5rem")) changes.push("Lifestyle text font size");
    if (lifestyleTextFontAlignment !== (originalSettings.lifestyleTextFontAlignment || "center")) changes.push("Lifestyle text font alignment");
    if (lifestyleTextFontWeight !== (originalSettings.lifestyleTextFontWeight || "700")) changes.push("Lifestyle text font weight");
    if (showLifestyleText !== (originalSettings.showLifestyleText ?? true)) changes.push("Lifestyle text toggle");
    if (showLifestyleButton !== (originalSettings.showLifestyleButton ?? true)) changes.push("Lifestyle button toggle");
    if (lifestyleButtonText !== (originalSettings.lifestyleButtonText || "Explore Now")) changes.push("Lifestyle button text");
    if (lifestyleButtonStyle !== (originalSettings.lifestyleButtonStyle || "solid")) changes.push("Lifestyle button style");
    if (lifestyleButtonSize !== (originalSettings.lifestyleButtonSize || "md")) changes.push("Lifestyle button size");
    if (lifestyleButtonColor !== (originalSettings.lifestyleButtonColor || "")) changes.push("Lifestyle button color");
    if (lifestyleButtonTextColor !== (originalSettings.lifestyleButtonTextColor || "#ffffff")) changes.push("Lifestyle button text color");

    if (mobileLifestyleText !== (originalSettings.mobileLifestyleText || "")) changes.push("Mobile lifestyle overlay text copy");
    if (mobileLifestyleTextFontType !== (originalSettings.mobileLifestyleTextFontType || "Outfit")) changes.push("Mobile lifestyle text font type");
    if (mobileLifestyleTextFontColor !== (originalSettings.mobileLifestyleTextFontColor || "#ffffff")) changes.push("Mobile lifestyle text font color");
    if (mobileLifestyleTextFontSize !== (originalSettings.mobileLifestyleTextFontSize || "1.8rem")) changes.push("Mobile lifestyle text font size");
    if (mobileLifestyleTextFontAlignment !== (originalSettings.mobileLifestyleTextFontAlignment || "center")) changes.push("Mobile lifestyle text font alignment");
    if (mobileLifestyleTextFontWeight !== (originalSettings.mobileLifestyleTextFontWeight || "700")) changes.push("Mobile lifestyle text font weight");
    if (showMobileLifestyleText !== (originalSettings.showMobileLifestyleText ?? true)) changes.push("Mobile lifestyle text toggle");
    if (showMobileLifestyleButton !== (originalSettings.showMobileLifestyleButton ?? true)) changes.push("Mobile lifestyle button toggle");
    if (mobileLifestyleButtonText !== (originalSettings.mobileLifestyleButtonText || "Explore Now")) changes.push("Mobile lifestyle button text");
    if (mobileLifestyleButtonStyle !== (originalSettings.mobileLifestyleButtonStyle || "solid")) changes.push("Mobile lifestyle button style");
    if (mobileLifestyleButtonSize !== (originalSettings.mobileLifestyleButtonSize || "sm")) changes.push("Mobile lifestyle button size");
    if (mobileLifestyleButtonColor !== (originalSettings.mobileLifestyleButtonColor || "")) changes.push("Mobile lifestyle button color");
    if (mobileLifestyleButtonTextColor !== (originalSettings.mobileLifestyleButtonTextColor || "#ffffff")) changes.push("Mobile lifestyle button text color");
    if (primaryColor !== (originalSettings.primaryColor || "#57bc74")) changes.push("Primary brand theme color");
    if (brandLogoType !== (originalSettings.brandLogoType || "text") || brandLogoValue !== (originalSettings.brandLogoValue || "29sFORMULA")) changes.push("Brand Logo");
    if (heroBgType !== (originalSettings.heroBgType || "color")) changes.push("Hero section background layout type");
    if (heroBgColor !== (originalSettings.heroBgColor || "#57bc74")) changes.push("Hero section custom background color");
    if (heroBgImage !== (originalSettings.heroBgImage || "")) changes.push("Hero section background image URL");
    if (heroBgVideo !== (originalSettings.heroBgVideo || "")) changes.push("Hero section background video URL");
    if (showTicker !== (originalSettings.showTicker !== undefined ? originalSettings.showTicker : true)) changes.push("Marquee Ticker visibility toggle");
    if (showAnnouncement !== (originalSettings.showAnnouncement !== undefined ? originalSettings.showAnnouncement : true)) changes.push("Top Announcement Banner visibility toggle");
    if (showVideo !== (originalSettings.showVideo !== undefined ? originalSettings.showVideo : true)) changes.push("Video section visibility toggle");
    if (showLifestyle !== (originalSettings.showLifestyle !== undefined ? originalSettings.showLifestyle : true)) changes.push("Lifestyle banner visibility toggle");
    return changes;
  };


  // Browser refresh, close tab, and back button navigation guards
  useEffect(() => {
    if (!authorized) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeTab === "online-store" && hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved storefront customizations. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (activeTab === "online-store" && hasUnsavedChanges) {
        // Push state back to prevent history back navigation
        window.history.pushState(null, "", window.location.href);
        setPendingTabChange("storefront");
        setShowUnsavedModal(true);
      }
    };

    // Ensure state exists to hijack back actions
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [authorized, activeTab, hasUnsavedChanges, timelineFilter]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch settings catalog");
      const data = await res.json();
      if (data) {
        setTickerText(data.tickerText || "");
        setTickerSpeed(data.tickerSpeed || 60);
        setTickerBgColor(data.tickerBgColor || "#ffffff");
        setTickerTextColor(data.tickerTextColor || "#000000");
        setAnnouncementText(data.announcementText || "");
        setHeroTitle(data.heroTitle || "");
        setHeroTitleFontType(data.heroTitleFontType || "Outfit");
        setHeroTitleFontColor(data.heroTitleFontColor || "#111827");
        setHeroTitleFontSize(data.heroTitleFontSize || "4.5rem");
        setHeroTitleFontAlignment(data.heroTitleFontAlignment || "center");
        setHeroTitleFontWeight(data.heroTitleFontWeight || "700");
        if (data.heroManifestoFontType) setHeroManifestoFontType(data.heroManifestoFontType);
        if (data.heroManifestoFontColor) setHeroManifestoFontColor(data.heroManifestoFontColor);
        if (data.heroManifestoFontSize) setHeroManifestoFontSize(data.heroManifestoFontSize);
        if (data.heroManifestoFontAlignment) setHeroManifestoFontAlignment(data.heroManifestoFontAlignment);
        if (data.heroManifestoFontWeight) setHeroManifestoFontWeight(data.heroManifestoFontWeight);
        setHeroManifesto(data.heroManifesto || "");
        setHeroTemplate(data.heroTemplate || "center");
        setShowHeroTitle(data.showHeroTitle !== false);
        setShowHeroManifesto(data.showHeroManifesto !== false);
        setShowHeroButton(data.showHeroButton !== false);
        setHeroButtonText(data.heroButtonText || "Shop Now");
        setHeroButtonStyle(data.heroButtonStyle || "solid");
        setHeroButtonSize(data.heroButtonSize || "md");
        setHeroButtonColor(data.heroButtonColor || "");
        setHeroButtonTextColor(data.heroButtonTextColor || "#ffffff");

        // Mobile hero layout setters (unlinked)
        setMobileHeroTemplate(data.mobileHeroTemplate || data.heroTemplate || "center");
        setMobileHeroTitle(data.mobileHeroTitle !== undefined ? data.mobileHeroTitle : "");
        setMobileHeroTitleFontType(data.mobileHeroTitleFontType || data.heroTitleFontType || "Outfit");
        setMobileHeroTitleFontColor(data.mobileHeroTitleFontColor || data.heroTitleFontColor || "#111827");
        setMobileHeroTitleFontSize(data.mobileHeroTitleFontSize || "2.5rem");
        setMobileHeroTitleFontAlignment(data.mobileHeroTitleFontAlignment || data.heroTitleFontAlignment || "center");
        setMobileHeroTitleFontWeight(data.mobileHeroTitleFontWeight || data.heroTitleFontWeight || "700");
        setShowMobileHeroTitle(data.showMobileHeroTitle !== undefined ? data.showMobileHeroTitle : true);

        setMobileHeroManifesto(data.mobileHeroManifesto !== undefined ? data.mobileHeroManifesto : "");
        setMobileHeroManifestoFontType(data.mobileHeroManifestoFontType || data.heroManifestoFontType || "Outfit");
        setMobileHeroManifestoFontColor(data.mobileHeroManifestoFontColor || data.heroManifestoFontColor || "#ffffff");
        setMobileHeroManifestoFontSize(data.mobileHeroManifestoFontSize || "0.85rem");
        setMobileHeroManifestoFontAlignment(data.mobileHeroManifestoFontAlignment || data.heroManifestoFontAlignment || "center");
        setMobileHeroManifestoFontWeight(data.mobileHeroManifestoFontWeight || data.heroManifestoFontWeight || "500");
        setShowMobileHeroManifesto(data.showMobileHeroManifesto !== undefined ? data.showMobileHeroManifesto : true);

        setMobileHeroButtonText(data.mobileHeroButtonText || data.heroButtonText || "Shop Now");
        setMobileHeroButtonStyle(data.mobileHeroButtonStyle || data.heroButtonStyle || "solid");
        setMobileHeroButtonSize(data.mobileHeroButtonSize || "sm");
        setMobileHeroButtonColor(data.mobileHeroButtonColor !== undefined ? data.mobileHeroButtonColor : "");
        setMobileHeroButtonTextColor(data.mobileHeroButtonTextColor || data.heroButtonTextColor || "#ffffff");
        setShowMobileHeroButton(data.showMobileHeroButton !== undefined ? data.showMobileHeroButton : true);
        setVideoTitle(data.videoTitle || "");
        setVideoSubtitle(data.videoSubtitle || "");
        setVideoUrl(data.videoUrl || "");
        setVideoFallbackColor(data.videoFallbackColor || "#121212");
        setVideoTitleFontType(data.videoTitleFontType || "Outfit");
        setVideoTitleFontColor(data.videoTitleFontColor || "#ffffff");
        setVideoTitleFontSize(data.videoTitleFontSize || "3.5rem");
        setVideoTitleFontAlignment(data.videoTitleFontAlignment || "center");
        setVideoTitleFontWeight(data.videoTitleFontWeight || "700");
        setVideoSubtitleFontType(data.videoSubtitleFontType || "Outfit");
        setVideoSubtitleFontColor(data.videoSubtitleFontColor || "#ffffff");
        setVideoSubtitleFontSize(data.videoSubtitleFontSize || "1.1rem");
        setVideoSubtitleFontAlignment(data.videoSubtitleFontAlignment || "center");
        setVideoSubtitleFontWeight(data.videoSubtitleFontWeight || "500");
        setVideoTemplate(data.videoTemplate || "center");
        setShowVideoTitle(data.showVideoTitle !== undefined ? data.showVideoTitle : true);
        setShowVideoSubtitle(data.showVideoSubtitle !== undefined ? data.showVideoSubtitle : true);
        setShowVideoButton(data.showVideoButton !== undefined ? data.showVideoButton : true);
        setVideoButtonText(data.videoButtonText || "Shop Now");
        setVideoButtonStyle(data.videoButtonStyle || "outline");
        setVideoButtonSize(data.videoButtonSize || "md");
        setVideoButtonColor(data.videoButtonColor || "#ffffff");
        setVideoButtonTextColor(data.videoButtonTextColor || "#121212");
        setVideoBgType(data.videoBgType || "video");
        setVideoBgColor(data.videoBgColor || "#121212");
        setVideoBgImage(data.videoBgImage || "");

        // Mobile video layout setters (unlinked)
        setMobileVideoTemplate(data.mobileVideoTemplate || data.videoTemplate || "center");
        setMobileVideoTitle(data.mobileVideoTitle !== undefined ? data.mobileVideoTitle : "");
        setMobileVideoTitleFontType(data.mobileVideoTitleFontType || data.videoTitleFontType || "Outfit");
        setMobileVideoTitleFontColor(data.mobileVideoTitleFontColor || data.videoTitleFontColor || "#ffffff");
        setMobileVideoTitleFontSize(data.mobileVideoTitleFontSize || "2.5rem");
        setMobileVideoTitleFontAlignment(data.mobileVideoTitleFontAlignment || data.videoTitleFontAlignment || "center");
        setMobileVideoTitleFontWeight(data.mobileVideoTitleFontWeight || data.videoTitleFontWeight || "700");
        setShowMobileVideoTitle(data.showMobileVideoTitle !== undefined ? data.showMobileVideoTitle : true);

        setMobileVideoSubtitle(data.mobileVideoSubtitle !== undefined ? data.mobileVideoSubtitle : "");
        setMobileVideoSubtitleFontType(data.mobileVideoSubtitleFontType || data.videoSubtitleFontType || "Outfit");
        setMobileVideoSubtitleFontColor(data.mobileVideoSubtitleFontColor || data.videoSubtitleFontColor || "#ffffff");
        setMobileVideoSubtitleFontSize(data.mobileVideoSubtitleFontSize || "0.85rem");
        setMobileVideoSubtitleFontAlignment(data.mobileVideoSubtitleFontAlignment || data.videoSubtitleFontAlignment || "center");
        setMobileVideoSubtitleFontWeight(data.mobileVideoSubtitleFontWeight || data.videoSubtitleFontWeight || "500");
        setShowMobileVideoSubtitle(data.showMobileVideoSubtitle !== undefined ? data.showMobileVideoSubtitle : true);

        setMobileVideoButtonText(data.mobileVideoButtonText !== undefined ? data.mobileVideoButtonText : (data.videoButtonText || "Shop Now"));
        setMobileVideoButtonStyle(data.mobileVideoButtonStyle !== undefined ? data.mobileVideoButtonStyle : (data.videoButtonStyle || "outline"));
        setMobileVideoButtonSize(data.mobileVideoButtonSize !== undefined ? data.mobileVideoButtonSize : "sm");
        setMobileVideoButtonColor(data.mobileVideoButtonColor !== undefined ? data.mobileVideoButtonColor : "#ffffff");
        setMobileVideoButtonTextColor(data.mobileVideoButtonTextColor !== undefined ? data.mobileVideoButtonTextColor : (data.videoButtonTextColor || "#121212"));
        setLifestyleText(data.lifestyleText || "");
        setLifestyleImage(data.lifestyleImage || "https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
        setLifestyleTextFontType(data.lifestyleTextFontType || "Outfit");
        setLifestyleTextFontColor(data.lifestyleTextFontColor || "#ffffff");
        setLifestyleTextFontSize(data.lifestyleTextFontSize || "2.5rem");
        setLifestyleTextFontAlignment(data.lifestyleTextFontAlignment || "center");
        setLifestyleTextFontWeight(data.lifestyleTextFontWeight || "700");
        setShowLifestyleText(data.showLifestyleText !== undefined ? data.showLifestyleText : true);
        setShowLifestyleButton(data.showLifestyleButton !== undefined ? data.showLifestyleButton : true);
        setLifestyleButtonText(data.lifestyleButtonText !== undefined ? data.lifestyleButtonText : "Explore Now");
        setLifestyleButtonStyle(data.lifestyleButtonStyle || "solid");
        setLifestyleButtonSize(data.lifestyleButtonSize || "md");
        setLifestyleButtonColor(data.lifestyleButtonColor || "");
        setLifestyleButtonTextColor(data.lifestyleButtonTextColor || "#ffffff");

        setMobileLifestyleText(data.mobileLifestyleText !== undefined ? data.mobileLifestyleText : "");
        setMobileLifestyleTextFontType(data.mobileLifestyleTextFontType || data.lifestyleTextFontType || "Outfit");
        setMobileLifestyleTextFontColor(data.mobileLifestyleTextFontColor || data.lifestyleTextFontColor || "#ffffff");
        setMobileLifestyleTextFontSize(data.mobileLifestyleTextFontSize || "1.8rem");
        setMobileLifestyleTextFontAlignment(data.mobileLifestyleTextFontAlignment || data.lifestyleTextFontAlignment || "center");
        setMobileLifestyleTextFontWeight(data.mobileLifestyleTextFontWeight || data.lifestyleTextFontWeight || "700");
        setShowMobileLifestyleText(data.showMobileLifestyleText !== undefined ? data.showMobileLifestyleText : true);
        setShowMobileLifestyleButton(data.showMobileLifestyleButton !== undefined ? data.showMobileLifestyleButton : true);
        setMobileLifestyleButtonText(data.mobileLifestyleButtonText !== undefined ? data.mobileLifestyleButtonText : (data.lifestyleButtonText || "Explore Now"));
        setMobileLifestyleButtonStyle(data.mobileLifestyleButtonStyle || data.lifestyleButtonStyle || "solid");
        setMobileLifestyleButtonSize(data.mobileLifestyleButtonSize || "sm");
        setMobileLifestyleButtonColor(data.mobileLifestyleButtonColor !== undefined ? data.mobileLifestyleButtonColor : data.lifestyleButtonColor);
        setMobileLifestyleButtonTextColor(data.mobileLifestyleButtonTextColor || data.lifestyleButtonTextColor || "#ffffff");
        setPrimaryColor(data.primaryColor || "#57bc74");
        setBrandLogoType(data.brandLogoType || "text");
        setBrandLogoValue(data.brandLogoValue || "29sFORMULA");
        setHeroBgType(data.heroBgType || "color");
        setHeroBgColor(data.heroBgColor || "#57bc74");
        setHeroBgImage(data.heroBgImage || "");
        setHeroBgVideo(data.heroBgVideo || "");
        setShowTicker(data.showTicker !== undefined ? data.showTicker : true);
        setShowAnnouncement(data.showAnnouncement !== undefined ? data.showAnnouncement : true);
        setShowVideo(data.showVideo !== undefined ? data.showVideo : true);
        setShowLifestyle(data.showLifestyle !== undefined ? data.showLifestyle : true);
        setShowProductReviews(data.showProductReviews !== undefined ? data.showProductReviews : true);
        setShowProductExploreMore(data.showProductExploreMore !== undefined ? data.showProductExploreMore : true);
        setShowProductFaq(data.showProductFaq !== undefined ? data.showProductFaq : true);
        setUsageGuideText(data.usageGuideText || "Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes.");
        setExploreMoreTitle(data.exploreMoreTitle || "Don't Stop. Explore More.");
        setDeliverySubtext(data.deliverySubtext || "TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.");
        setGoogleClientId(data.googleClientId || "523936375845-75tjhav8ce01o9mdk325iggb1glgpi21.apps.googleusercontent.com");
        if (data.supportText !== undefined) setSupportText(data.supportText);
        if (data.careersText !== undefined) setCareersText(data.careersText);
        if (data.tradeEnquiryText !== undefined) setTradeEnquiryText(data.tradeEnquiryText);
        if (data.aboutUsText !== undefined) setAboutUsText(data.aboutUsText);
        if (data.instagramLink !== undefined) setInstagramLink(data.instagramLink);
        if (data.facebookLink !== undefined) setFacebookLink(data.facebookLink);
        if (data.contactLink !== undefined) setContactLink(data.contactLink);
        if (data.contactUsText !== undefined) setContactUsText(data.contactUsText);
        if (data.returnPolicyText !== undefined) setReturnPolicyText(data.returnPolicyText);
        if (data.shippingPolicyText !== undefined) setShippingPolicyText(data.shippingPolicyText);
        if (data.showGiftSetPage !== undefined) setShowGiftSetPage(data.showGiftSetPage);
        if (data.giftSetHeaderBadge !== undefined) setGiftSetHeaderBadge(data.giftSetHeaderBadge);
        if (data.giftSetHeaderTitle !== undefined) setGiftSetHeaderTitle(data.giftSetHeaderTitle);
        if (data.giftSetHeaderSubtitle !== undefined) setGiftSetHeaderSubtitle(data.giftSetHeaderSubtitle);
        if (data.giftSetHeaderTitleFontType !== undefined) setGiftSetHeaderTitleFontType(data.giftSetHeaderTitleFontType);
        if (data.giftSetHeaderTitleFontSize !== undefined) setGiftSetHeaderTitleFontSize(data.giftSetHeaderTitleFontSize);
        if (data.giftSetHeaderTitleFontColor !== undefined) setGiftSetHeaderTitleFontColor(data.giftSetHeaderTitleFontColor);
        if (data.giftSetHeaderTitleFontWeight !== undefined) setGiftSetHeaderTitleFontWeight(data.giftSetHeaderTitleFontWeight);
        if (data.giftSetHeaderTitleFontAlignment !== undefined) setGiftSetHeaderTitleFontAlignment(data.giftSetHeaderTitleFontAlignment);
        if (data.giftSetHeaderSubtitleFontType !== undefined) setGiftSetHeaderSubtitleFontType(data.giftSetHeaderSubtitleFontType);
        if (data.giftSetHeaderSubtitleFontSize !== undefined) setGiftSetHeaderSubtitleFontSize(data.giftSetHeaderSubtitleFontSize);
        if (data.giftSetHeaderSubtitleFontColor !== undefined) setGiftSetHeaderSubtitleFontColor(data.giftSetHeaderSubtitleFontColor);
        if (data.giftSetHeaderSubtitleFontWeight !== undefined) setGiftSetHeaderSubtitleFontWeight(data.giftSetHeaderSubtitleFontWeight);
        if (data.giftSetHeaderBgType !== undefined) setGiftSetHeaderBgType(data.giftSetHeaderBgType);
        if (data.giftSetHeaderBgColor !== undefined) setGiftSetHeaderBgColor(data.giftSetHeaderBgColor);
        if (data.giftSetHeaderBgImage !== undefined) setGiftSetHeaderBgImage(data.giftSetHeaderBgImage);
        if (data.giftSetHeaderBgVideo !== undefined) setGiftSetHeaderBgVideo(data.giftSetHeaderBgVideo);
        if (data.giftSetBgType !== undefined) setGiftSetBgType(data.giftSetBgType);
        if (data.giftSetBgColor !== undefined) setGiftSetBgColor(data.giftSetBgColor);
        if (data.giftSetBgImage !== undefined) setGiftSetBgImage(data.giftSetBgImage);
        if (data.giftSetBgGradient !== undefined) setGiftSetBgGradient(data.giftSetBgGradient);
        if (data.giftSetSizes !== undefined) setGiftSetSizes(data.giftSetSizes);
        if (data.giftSetDefaultSize !== undefined) setGiftSetDefaultSize(data.giftSetDefaultSize);
        if (data.giftSetMaxFragrances !== undefined) setGiftSetMaxFragrances(data.giftSetMaxFragrances);
        if (data.giftSetButtonText !== undefined) setGiftSetButtonText(data.giftSetButtonText);
        if (data.giftSetButtonColor !== undefined) setGiftSetButtonColor(data.giftSetButtonColor);
        if (data.giftSetButtonTextColor !== undefined) setGiftSetButtonTextColor(data.giftSetButtonTextColor);
        if (data.giftSetButtonStyle !== undefined) setGiftSetButtonStyle(data.giftSetButtonStyle);
        if (data.giftSetCardBorderColor !== undefined) setGiftSetCardBorderColor(data.giftSetCardBorderColor);
        if (data.giftSetCardSelectedColor !== undefined) setGiftSetCardSelectedColor(data.giftSetCardSelectedColor);
        if (data.giftSetAccentColor !== undefined) setGiftSetAccentColor(data.giftSetAccentColor);
        const loadedFaqs = data.faqs || [];
        setFaqs(loadedFaqs);

        // Save initial snapshot
        setOriginalSettings(normalizeSettingsSnapshot(data));
      }
    } catch (err: any) {
      console.warn("Storefront settings query failed (likely backend starting up):", err.message || err);
    }
  };



  const fetchAdminReviews = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/admin/reviews`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAdminReviews(data || []);
      }
    } catch (err) {
      console.warn("Failed to fetch admin reviews:", err);
    }
  };

  const handleDeleteAdminReviewConfirm = async () => {
    if (!deleteReviewTarget) return;
    setIsDeletingReview(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/admin/reviews/${deleteReviewTarget}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setSuccessMessage("Review deleted permanently!");
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchAdminReviews();
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setIsDeletingReview(false);
      setDeleteReviewTarget(null);
    }
  };

  const handleEditReviewSubmit = async () => {
    if (!editReviewTarget) return;
    setIsEditingReview(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/admin/reviews/${editReviewTarget._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: editReviewTarget.rating,
          title: editReviewTarget.title,
          comment: editReviewTarget.comment,
          author: editReviewTarget.author,
          location: editReviewTarget.location
        })
      });
      if (res.ok) {
        setSuccessMessage("Review updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchAdminReviews();
      } else {
        alert("Failed to update review.");
      }
    } catch (err) {
      console.error("Failed to update review:", err);
    } finally {
      setIsEditingReview(false);
      setEditReviewTarget(null);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/discounts`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setDiscountsList(data || []);
      }
    } catch (e) {
      console.warn("Failed to fetch discounts:", e);
    }
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscountCode || !newDiscountValue) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/discounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newDiscountCode,
          type: newDiscountType,
          value: parseFloat(newDiscountValue),
          minOrderAmount: parseFloat(newDiscountMinOrder) || 0
        }),
      });
      if (res.ok) {
        setNewDiscountCode("");
        setNewDiscountValue("");
        setNewDiscountMinOrder("");
        setDiscountError(null);
        fetchDiscounts();
        setSuccessMessage("Discount coupon successfully created!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const data = await res.json();
        setDiscountError(data.error || "Failed to create discount code.");
      }
    } catch (err) {
      setDiscountError("Network error. Could not connect to server.");
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/discounts/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchDiscounts();
        setSuccessMessage("Discount coupon removed!");
        setTimeout(() => setSuccessMessage(null), 3000);
        setDeleteDiscountConfirmId(null);
      }
    } catch (e) {
      console.error("Failed to delete discount:", e);
    }
  };

  const handleNavigationTrigger = (target: "home" | "orders" | "products" | "customers" | "marketing" | "discounts" | "online-store" | "logout" | "storefront") => {
    if (activeTab === "online-store" && hasUnsavedChanges && target !== "online-store") {
      setPendingTabChange(target);
      setShowUnsavedModal(true);
    } else {
      executeNavigation(target);
    }
  };

  const executeNavigation = (target: string) => {
    setIsMobileMenuOpen(false);
    if (target === "home") {
      setActiveTab("home");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(false);
      fetchOrders();
    } else if (target === "products") {
      setActiveTab("products");
      setProductsDropdownOpen(true);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(false);
      setActiveSubTab("all");
      setSelectedCategoryView(null);
    } else if (target === "orders") {
      setActiveTab("orders");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(true);
      setOnlineStoreDropdownOpen(false);
      setActiveSubTab("all");
      fetchOrders();
    } else if (target === "customers") {
      setActiveTab("customers");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(false);
      fetchOrders();
    } else if (target === "marketing") {
      setActiveTab("marketing");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(false);
    } else if (target === "discounts") {
      setActiveTab("discounts");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(false);
      fetchDiscounts();
    } else if (target === "online-store") {
      setActiveTab("online-store");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(true);
      fetchAdminReviews();
    } else if (target === "logout") {
      localStorage.removeItem("adminSession");
      localStorage.removeItem("lastActivityTime");
      window.location.href = "/login";
    } else if (target === "storefront") {
      window.location.href = "/";
    }
  };

  const saveSettingsSilent = async (overrideSettings?: Record<string, any>) => {
    try {
      const payload = {
        tickerText,
        tickerSpeed,
        tickerBgColor,
        tickerTextColor,
        announcementText,
        heroTitle,
        heroTitleFontType,
        heroTitleFontColor,
        heroTitleFontSize,
        heroTitleFontAlignment,
        heroTitleFontWeight,
        heroManifesto,
        heroManifestoFontType,
        heroManifestoFontColor,
        heroManifestoFontSize,
        heroManifestoFontAlignment,
        heroManifestoFontWeight,
        heroTemplate,
        showHeroTitle,
        showHeroManifesto,
        showHeroButton,
        heroButtonText,
        heroButtonStyle,
        heroButtonSize,
        heroButtonColor,
        heroButtonTextColor,

        // Mobile Hero Layout Payload
        mobileHeroTemplate,
        mobileHeroTitle,
        mobileHeroTitleFontType,
        mobileHeroTitleFontColor,
        mobileHeroTitleFontSize,
        mobileHeroTitleFontAlignment,
        mobileHeroTitleFontWeight,
        showMobileHeroTitle,

        mobileHeroManifesto,
        mobileHeroManifestoFontType,
        mobileHeroManifestoFontColor,
        mobileHeroManifestoFontSize,
        mobileHeroManifestoFontAlignment,
        mobileHeroManifestoFontWeight,
        showMobileHeroManifesto,

        mobileHeroButtonText,
        mobileHeroButtonStyle,
        mobileHeroButtonSize,
        mobileHeroButtonColor,
        mobileHeroButtonTextColor,
        showMobileHeroButton,
        videoTitle,
        videoSubtitle,
        videoUrl,
        videoFallbackColor,
        videoTitleFontType,
        videoTitleFontColor,
        videoTitleFontSize,
        videoTitleFontAlignment,
        videoTitleFontWeight,
        videoSubtitleFontType,
        videoSubtitleFontColor,
        videoSubtitleFontSize,
        videoSubtitleFontAlignment,
        videoSubtitleFontWeight,
        videoTemplate,
        showVideoTitle,
        showVideoSubtitle,
        showVideoButton,
        videoButtonText,
        videoButtonStyle,
        videoButtonSize,
        videoButtonColor,
        videoButtonTextColor,
        videoBgType,
        videoBgColor,
        videoBgImage,

        // Mobile Video Layout Payload
        mobileVideoTemplate,
        mobileVideoTitle,
        mobileVideoTitleFontType,
        mobileVideoTitleFontColor,
        mobileVideoTitleFontSize,
        mobileVideoTitleFontAlignment,
        mobileVideoTitleFontWeight,
        showMobileVideoTitle,

        mobileVideoSubtitle,
        mobileVideoSubtitleFontType,
        mobileVideoSubtitleFontColor,
        mobileVideoSubtitleFontSize,
        mobileVideoSubtitleFontAlignment,
        mobileVideoSubtitleFontWeight,
        showMobileVideoSubtitle,

        mobileVideoButtonText,
        mobileVideoButtonStyle,
        mobileVideoButtonSize,
        mobileVideoButtonColor,
        mobileVideoButtonTextColor,
        showMobileVideoButton,
        lifestyleText,
        lifestyleImage,
        lifestyleTextFontType,
        lifestyleTextFontColor,
        lifestyleTextFontSize,
        lifestyleTextFontAlignment,
        lifestyleTextFontWeight,
        showLifestyleText,
        showLifestyleButton,
        lifestyleButtonText,
        lifestyleButtonStyle,
        lifestyleButtonSize,
        lifestyleButtonColor,
        lifestyleButtonTextColor,

        mobileLifestyleText,
        mobileLifestyleTextFontType,
        mobileLifestyleTextFontColor,
        mobileLifestyleTextFontSize,
        mobileLifestyleTextFontAlignment,
        mobileLifestyleTextFontWeight,
        showMobileLifestyleText,
        showMobileLifestyleButton,
        mobileLifestyleButtonText,
        mobileLifestyleButtonStyle,
        mobileLifestyleButtonSize,
        mobileLifestyleButtonColor,
        mobileLifestyleButtonTextColor,
        primaryColor,
        brandLogoType,
        brandLogoValue,
        heroBgType,
        heroBgColor,
        heroBgImage,
        heroBgVideo,
        showTicker,
        showAnnouncement,
        showVideo,
        showLifestyle,
        showProductReviews,
        showProductExploreMore,
        showProductFaq,
        usageGuideText,
        exploreMoreTitle,
        deliverySubtext,
        supportText,
        careersText,
        tradeEnquiryText,
        aboutUsText,
        instagramLink,
        facebookLink,
        contactLink,
        contactUsText,
        returnPolicyText,
        shippingPolicyText,
        faqs,
        googleClientId,
        ...overrideSettings
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save layout adjustments");

      const data = await res.json();
      setOriginalSettings(normalizeSettingsSnapshot(data));
    } catch (err: any) {
      console.error("Silent save settings error:", err);
    }
  };

  const resetSettingsToOriginal = () => {
    if (originalSettings) {
      setTickerText(originalSettings.tickerText || "");
      setTickerSpeed(originalSettings.tickerSpeed || 60);
      setTickerBgColor(originalSettings.tickerBgColor || "#ffffff");
      setTickerTextColor(originalSettings.tickerTextColor || "#000000");
      setAnnouncementText(originalSettings.announcementText || "");
      setHeroTitle(originalSettings.heroTitle || "");
      setHeroTitleFontType(originalSettings.heroTitleFontType || "Outfit");
      setHeroTitleFontColor(originalSettings.heroTitleFontColor || "#111827");
      setHeroTitleFontSize(originalSettings.heroTitleFontSize || "4.5rem");
      setHeroTitleFontAlignment(originalSettings.heroTitleFontAlignment || "center");
      setHeroTitleFontWeight(originalSettings.heroTitleFontWeight || "700");
      setHeroManifesto(originalSettings.heroManifesto || "");
      setHeroTemplate(originalSettings.heroTemplate || "center");
      setShowHeroTitle(originalSettings.showHeroTitle !== false);
      setShowHeroManifesto(originalSettings.showHeroManifesto !== false);
      setShowHeroButton(originalSettings.showHeroButton !== false);
      setHeroButtonText(originalSettings.heroButtonText || "Shop Now");
      setHeroButtonStyle(originalSettings.heroButtonStyle || "solid");
      setHeroButtonSize(originalSettings.heroButtonSize || "md");
      setHeroButtonColor(originalSettings.heroButtonColor || "");
      setHeroButtonTextColor(originalSettings.heroButtonTextColor || "#ffffff");

      setMobileHeroTemplate(originalSettings.mobileHeroTemplate || originalSettings.heroTemplate || "center");
      setMobileHeroTitle(originalSettings.mobileHeroTitle !== undefined ? originalSettings.mobileHeroTitle : "");
      setMobileHeroTitleFontType(originalSettings.mobileHeroTitleFontType || originalSettings.heroTitleFontType || "Outfit");
      setMobileHeroTitleFontColor(originalSettings.mobileHeroTitleFontColor || originalSettings.heroTitleFontColor || "#111827");
      setMobileHeroTitleFontSize(originalSettings.mobileHeroTitleFontSize || "2.5rem");
      setMobileHeroTitleFontAlignment(originalSettings.mobileHeroTitleFontAlignment || originalSettings.heroTitleFontAlignment || "center");
      setMobileHeroTitleFontWeight(originalSettings.mobileHeroTitleFontWeight || originalSettings.heroTitleFontWeight || "700");
      setShowMobileHeroTitle(originalSettings.showMobileHeroTitle !== undefined ? originalSettings.showMobileHeroTitle : true);

      setMobileHeroManifesto(originalSettings.mobileHeroManifesto !== undefined ? originalSettings.mobileHeroManifesto : "");
      setMobileHeroManifestoFontType(originalSettings.mobileHeroManifestoFontType || originalSettings.heroManifestoFontType || "Outfit");
      setMobileHeroManifestoFontColor(originalSettings.mobileHeroManifestoFontColor || originalSettings.heroManifestoFontColor || "#ffffff");
      setMobileHeroManifestoFontSize(originalSettings.mobileHeroManifestoFontSize || "0.85rem");
      setMobileHeroManifestoFontAlignment(originalSettings.mobileHeroManifestoFontAlignment || originalSettings.heroManifestoFontAlignment || "center");
      setMobileHeroManifestoFontWeight(originalSettings.mobileHeroManifestoFontWeight || originalSettings.heroManifestoFontWeight || "500");
      setShowMobileHeroManifesto(originalSettings.showMobileHeroManifesto !== undefined ? originalSettings.showMobileHeroManifesto : true);

      setMobileHeroButtonText(originalSettings.mobileHeroButtonText || originalSettings.heroButtonText || "Shop Now");
      setMobileHeroButtonStyle(originalSettings.mobileHeroButtonStyle || originalSettings.heroButtonStyle || "solid");
      setMobileHeroButtonSize(originalSettings.mobileHeroButtonSize || "sm");
      setMobileHeroButtonColor(originalSettings.mobileHeroButtonColor !== undefined ? originalSettings.mobileHeroButtonColor : "");
      setMobileHeroButtonTextColor(originalSettings.mobileHeroButtonTextColor || originalSettings.heroButtonTextColor || "#ffffff");
      setShowMobileHeroButton(originalSettings.showMobileHeroButton !== undefined ? originalSettings.showMobileHeroButton : true);
      setVideoTitle(originalSettings.videoTitle || "");
      setVideoSubtitle(originalSettings.videoSubtitle || "");
      setVideoUrl(originalSettings.videoUrl || "");
      setVideoFallbackColor(originalSettings.videoFallbackColor || "#57bc74");
      if (originalSettings.videoTitleFontType) setVideoTitleFontType(originalSettings.videoTitleFontType);
      if (originalSettings.videoTitleFontColor) setVideoTitleFontColor(originalSettings.videoTitleFontColor);
      if (originalSettings.videoTitleFontSize) setVideoTitleFontSize(originalSettings.videoTitleFontSize);
      if (originalSettings.videoTitleFontAlignment) setVideoTitleFontAlignment(originalSettings.videoTitleFontAlignment);
      if (originalSettings.videoTitleFontWeight) setVideoTitleFontWeight(originalSettings.videoTitleFontWeight);
      if (originalSettings.videoSubtitleFontType) setVideoSubtitleFontType(originalSettings.videoSubtitleFontType);
      if (originalSettings.videoSubtitleFontColor) setVideoSubtitleFontColor(originalSettings.videoSubtitleFontColor);
      if (originalSettings.videoSubtitleFontSize) setVideoSubtitleFontSize(originalSettings.videoSubtitleFontSize);
      if (originalSettings.videoSubtitleFontAlignment) setVideoSubtitleFontAlignment(originalSettings.videoSubtitleFontAlignment);
      if (originalSettings.videoSubtitleFontWeight) setVideoSubtitleFontWeight(originalSettings.videoSubtitleFontWeight);
      setVideoTemplate(originalSettings.videoTemplate || "center");
      if (originalSettings.showVideoTitle !== undefined) setShowVideoTitle(originalSettings.showVideoTitle);
      if (originalSettings.showVideoSubtitle !== undefined) setShowVideoSubtitle(originalSettings.showVideoSubtitle);
      if (originalSettings.showVideoButton !== undefined) setShowVideoButton(originalSettings.showVideoButton);
      setVideoButtonText(originalSettings.videoButtonText || "Shop Now");
      setVideoButtonStyle(originalSettings.videoButtonStyle || "outline");
      setVideoButtonSize(originalSettings.videoButtonSize || "md");
      setVideoButtonColor(originalSettings.videoButtonColor || "#ffffff");
      setVideoButtonTextColor(originalSettings.videoButtonTextColor || "#121212");
      setVideoBgType(originalSettings.videoBgType || "video");
      setVideoBgColor(originalSettings.videoBgColor || "#121212");
      setVideoBgImage(originalSettings.videoBgImage || "");
      setLifestyleText(originalSettings.lifestyleText || "");
      setLifestyleImage(originalSettings.lifestyleImage || "https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
      setLifestyleTextFontType(originalSettings.lifestyleTextFontType || "Outfit");
      setLifestyleTextFontColor(originalSettings.lifestyleTextFontColor || "#ffffff");
      setLifestyleTextFontSize(originalSettings.lifestyleTextFontSize || "2.5rem");
      setLifestyleTextFontAlignment(originalSettings.lifestyleTextFontAlignment || "center");
      setLifestyleTextFontWeight(originalSettings.lifestyleTextFontWeight || "700");
      if (originalSettings.showLifestyleText !== undefined) setShowLifestyleText(originalSettings.showLifestyleText);
      if (originalSettings.showLifestyleButton !== undefined) setShowLifestyleButton(originalSettings.showLifestyleButton);
      setLifestyleButtonText(originalSettings.lifestyleButtonText || "Explore Now");
      setLifestyleButtonStyle(originalSettings.lifestyleButtonStyle || "solid");
      setLifestyleButtonSize(originalSettings.lifestyleButtonSize || "md");
      setLifestyleButtonColor(originalSettings.lifestyleButtonColor || "");
      setLifestyleButtonTextColor(originalSettings.lifestyleButtonTextColor || "#ffffff");

      setMobileLifestyleText(originalSettings.mobileLifestyleText || "");
      setMobileLifestyleTextFontType(originalSettings.mobileLifestyleTextFontType || "Outfit");
      setMobileLifestyleTextFontColor(originalSettings.mobileLifestyleTextFontColor || "#ffffff");
      setMobileLifestyleTextFontSize(originalSettings.mobileLifestyleTextFontSize || "1.8rem");
      setMobileLifestyleTextFontAlignment(originalSettings.mobileLifestyleTextFontAlignment || "center");
      setMobileLifestyleTextFontWeight(originalSettings.mobileLifestyleTextFontWeight || "700");
      if (originalSettings.showMobileLifestyleText !== undefined) setShowMobileLifestyleText(originalSettings.showMobileLifestyleText);
      if (originalSettings.showMobileLifestyleButton !== undefined) setShowMobileLifestyleButton(originalSettings.showMobileLifestyleButton);
      setMobileLifestyleButtonText(originalSettings.mobileLifestyleButtonText || "Explore Now");
      setMobileLifestyleButtonStyle(originalSettings.mobileLifestyleButtonStyle || "solid");
      setMobileLifestyleButtonSize(originalSettings.mobileLifestyleButtonSize || "sm");
      setMobileLifestyleButtonColor(originalSettings.mobileLifestyleButtonColor || "");
      setMobileLifestyleButtonTextColor(originalSettings.mobileLifestyleButtonTextColor || "#ffffff");
      setHeroBgType(originalSettings.heroBgType || "color");
      setHeroBgColor(originalSettings.heroBgColor || "#57bc74");
      setHeroBgImage(originalSettings.heroBgImage || "");
      setHeroBgVideo(originalSettings.heroBgVideo || "");
      setPrimaryColor(originalSettings.primaryColor || "#57bc74");
      setBrandLogoType(originalSettings.brandLogoType || "text");
      setBrandLogoValue(originalSettings.brandLogoValue || "29sFORMULA");
      setShowTicker(originalSettings.showTicker !== undefined ? originalSettings.showTicker : true);
      setShowAnnouncement(originalSettings.showAnnouncement !== undefined ? originalSettings.showAnnouncement : true);
      setShowVideo(originalSettings.showVideo !== undefined ? originalSettings.showVideo : true);
      setShowLifestyle(originalSettings.showLifestyle !== undefined ? originalSettings.showLifestyle : true);
      setGoogleClientId(originalSettings.googleClientId || "523936375845-75tjhav8ce01o9mdk325iggb1glgpi21.apps.googleusercontent.com");
      setSupportText(originalSettings.supportText || "For support inquiries, please contact us.");
      setCareersText(originalSettings.careersText || "Join our team! Check out our open positions.");
      setTradeEnquiryText(originalSettings.tradeEnquiryText || "For trade and wholesale inquiries, contact our B2B team.");
      setAboutUsText(originalSettings.aboutUsText || "We are 29sFORMULA, redefining luxury.");
      setInstagramLink(originalSettings.instagramLink || "#");
      setFacebookLink(originalSettings.facebookLink || "#");
      setContactLink(originalSettings.contactLink || "#");
      setContactUsText(originalSettings.contactUsText || "Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours.");
      setReturnPolicyText(originalSettings.returnPolicyText || "We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund.");
      setShippingPolicyText(originalSettings.shippingPolicyText || "We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days.");
      setFaqs(originalSettings.faqs || []);
    }
  };

  const handleSaveAndContinue = async () => {
    await saveSettingsSilent();
    setShowUnsavedModal(false);
    if (pendingTabChange) {
      executeNavigation(pendingTabChange);
      setPendingTabChange(null);
    }
  };

  const handleDiscardAndContinue = () => {
    resetSettingsToOriginal();
    setShowUnsavedModal(false);
    if (pendingTabChange) {
      executeNavigation(pendingTabChange);
      setPendingTabChange(null);
    }
  };

  const handleCancelNavigation = () => {
    setShowUnsavedModal(false);
    setPendingTabChange(null);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingSettings(true);
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickerText,
          tickerSpeed,
          tickerBgColor,
          tickerTextColor,
          announcementText,
          heroTitle,
          heroTitleFontType,
          heroTitleFontColor,
          heroTitleFontSize,
          heroTitleFontAlignment,
          heroTitleFontWeight,
          heroManifesto,
          heroManifestoFontType,
          heroManifestoFontColor,
          heroManifestoFontSize,
          heroManifestoFontAlignment,
          heroManifestoFontWeight,
          heroTemplate,
          showHeroTitle,
          showHeroManifesto,
          showHeroButton,
          heroButtonText,
          heroButtonStyle,
          heroButtonSize,
          heroButtonColor,
          heroButtonTextColor,
          mobileHeroTemplate,
          mobileHeroTitle,
          mobileHeroTitleFontType,
          mobileHeroTitleFontColor,
          mobileHeroTitleFontSize,
          mobileHeroTitleFontAlignment,
          mobileHeroTitleFontWeight,
          showMobileHeroTitle,

          mobileHeroManifesto,
          mobileHeroManifestoFontType,
          mobileHeroManifestoFontColor,
          mobileHeroManifestoFontSize,
          mobileHeroManifestoFontAlignment,
          mobileHeroManifestoFontWeight,
          showMobileHeroManifesto,

          mobileHeroButtonText,
          mobileHeroButtonStyle,
          mobileHeroButtonSize,
          mobileHeroButtonColor,
          mobileHeroButtonTextColor,
          showMobileHeroButton,
          videoTitle,
          videoSubtitle,
          videoUrl,
          videoFallbackColor,
          videoTitleFontType,
          videoTitleFontColor,
          videoTitleFontSize,
          videoTitleFontAlignment,
          videoTitleFontWeight,
          videoSubtitleFontType,
          videoSubtitleFontColor,
          videoSubtitleFontSize,
          videoSubtitleFontAlignment,
          videoSubtitleFontWeight,
          videoTemplate,
          showVideoTitle,
          showVideoSubtitle,
          showVideoButton,
          videoButtonText,
          videoButtonStyle,
          videoButtonSize,
          videoButtonColor,
          videoButtonTextColor,
          videoBgType,
          videoBgColor,
          videoBgImage,

          // Mobile Video Layout Payload
          mobileVideoTemplate,
          mobileVideoTitle,
          mobileVideoTitleFontType,
          mobileVideoTitleFontColor,
          mobileVideoTitleFontSize,
          mobileVideoTitleFontAlignment,
          mobileVideoTitleFontWeight,
          showMobileVideoTitle,

          mobileVideoSubtitle,
          mobileVideoSubtitleFontType,
          mobileVideoSubtitleFontColor,
          mobileVideoSubtitleFontSize,
          mobileVideoSubtitleFontAlignment,
          mobileVideoSubtitleFontWeight,
          showMobileVideoSubtitle,

          mobileVideoButtonText,
          mobileVideoButtonStyle,
          mobileVideoButtonSize,
          mobileVideoButtonColor,
          mobileVideoButtonTextColor,
          showMobileVideoButton,
          lifestyleText,
          lifestyleImage,
          lifestyleTextFontType,
          lifestyleTextFontColor,
          lifestyleTextFontSize,
          lifestyleTextFontAlignment,
          lifestyleTextFontWeight,
          showLifestyleText,
          showLifestyleButton,
          lifestyleButtonText,
          lifestyleButtonStyle,
          lifestyleButtonSize,
          lifestyleButtonColor,
          lifestyleButtonTextColor,

          mobileLifestyleText,
          mobileLifestyleTextFontType,
          mobileLifestyleTextFontColor,
          mobileLifestyleTextFontSize,
          mobileLifestyleTextFontAlignment,
          mobileLifestyleTextFontWeight,
          showMobileLifestyleText,
          showMobileLifestyleButton,
          mobileLifestyleButtonText,
          mobileLifestyleButtonStyle,
          mobileLifestyleButtonSize,
          mobileLifestyleButtonColor,
          mobileLifestyleButtonTextColor,
          primaryColor,
          brandLogoType,
          brandLogoValue,
          heroBgType,
          heroBgColor,
          heroBgImage,
          heroBgVideo,
          showTicker,
          showAnnouncement,
          showVideo,
          showLifestyle,
          showProductReviews,
          showProductExploreMore,
          showProductFaq,
          usageGuideText,
          exploreMoreTitle,
          deliverySubtext,
          supportText,
          careersText,
          tradeEnquiryText,
          aboutUsText,
          instagramLink,
          facebookLink,
          contactLink,
          contactUsText,
          returnPolicyText,
          shippingPolicyText,
          faqs,
          googleClientId,
          showGiftSetPage,
          giftSetHeaderBadge,
          giftSetHeaderTitle,
          giftSetHeaderSubtitle,
          giftSetHeaderTitleFontType,
          giftSetHeaderTitleFontSize,
          giftSetHeaderTitleFontColor,
          giftSetHeaderTitleFontWeight,
          giftSetHeaderTitleFontAlignment,
          giftSetHeaderSubtitleFontType,
          giftSetHeaderSubtitleFontSize,
          giftSetHeaderSubtitleFontColor,
          giftSetHeaderSubtitleFontWeight,
          giftSetHeaderBgType,
          giftSetHeaderBgColor,
          giftSetHeaderBgImage,
          giftSetHeaderBgVideo,
          giftSetBgType,
          giftSetBgColor,
          giftSetBgImage,
          giftSetBgGradient,
          giftSetSizes,
          giftSetDefaultSize,
          giftSetMaxFragrances,
          giftSetButtonText,
          giftSetButtonColor,
          giftSetButtonTextColor,
          giftSetButtonStyle,
          giftSetCardBorderColor,
          giftSetCardSelectedColor,
          giftSetAccentColor
        })
      });
      if (!res.ok) throw new Error("Failed to save layout adjustments");

      const data = await res.json();
      setOriginalSettings(normalizeSettingsSnapshot(data));

      setSuccessMessage("Homepage layout customized successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update page settings.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoadingSettings(false);
    }
  };


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to query store database.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(err => console.error("Error fetching orders:", err));
  };

  const fetchCustomers = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/customers`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCustomers(data);
        }
      })
      .catch(err => console.error("Error fetching customers:", err));
  };

  const handleDeleteCustomer = async (id: string) => {
    setIsDeletingCustomer(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/customers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchCustomers();
        setSelectedCustomer(null);
      } else {
        alert("Failed to delete customer");
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
    } finally {
      setIsDeletingCustomer(false);
      setDeleteCustomerTargetId(null);
    }
  };

  const handleUpdateReturnStatus = (orderId: string, newStatus: string) => {
    if (newStatus === "Pending") {
      executeReturnStatusUpdate(orderId, newStatus, "");
    } else {
      setReturnStatusAction({ orderId, newStatus });
      setReturnStatusNotes("");
      setReturnStatusModalOpen(true);
    }
  };

  const executeReturnStatusUpdate = async (orderId: string, newStatus: string, notes: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/${orderId}/return-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminNotes: notes })
      });
      if (!res.ok) throw new Error("Failed to update return status");
      const updatedReq = await res.json();

      setOrders(prev => prev.map(o => {
        if (o._id === orderId) {
          const isReplacement = (updatedReq.returnType || o.returnRequest?.returnType) === "Replacement";
          const newOrderStatus = newStatus === "Approved"
            ? (isReplacement ? "Processing" : "Return Approved")
            : newStatus === "Rejected" ? "Return Rejected" : o.status;
          return {
            ...o,
            returnRequest: updatedReq,
            status: newOrderStatus
          };
        }
        return o;
      }));
      setReturnStatusModalOpen(false);
      setSuccessMessage(newStatus === "Approved" ? "Return request approved successfully" : "Return request rejected");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update return request status.");
    }
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: string,
    rtoCharges?: number,
    courierPartner?: string,
    awbNumber?: string,
    trackingUrl?: string
  ) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rtoCharges, courierPartner, awbNumber, trackingUrl })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then(updated => {
        setOrders(prev => prev.map(o => o._id === updated._id ? { ...o, ...updated } : o));
        if (selectedOrder && selectedOrder._id === updated._id) {
          setSelectedOrder((prev: any) => prev ? { ...prev, ...updated } : null);
        }
        setSuccessMessage("Order status updated to " + status);
        setTimeout(() => setSuccessMessage(null), 3000);
        return updated;
      })
      .catch(err => {
        alert("Error updating status: " + err.message);
        throw err;
      });
  };

  const handleSaveTrackingInfo = (orderId: string, courierPartner: string, awbNumber: string, trackingUrl?: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courierPartner, awbNumber, trackingUrl })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update tracking info");
        return res.json();
      })
      .then(updated => {
        setOrders(prev => prev.map(o => o._id === updated._id ? { ...o, ...updated } : o));
        if (selectedOrder && selectedOrder._id === updated._id) {
          setSelectedOrder((prev: any) => prev ? { ...prev, ...updated } : null);
        }
        setSuccessMessage("Tracking info updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        return updated;
      })
      .catch(err => {
        alert("Error updating tracking info: " + err.message);
        throw err;
      });
  };

  const handleDeleteOrder = (orderId: string) => {
    setDeleteOrderTargetId(orderId);
  };

  const executeDeleteOrder = async (orderId: string) => {
    setIsDeletingOrder(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancellationReason: cancelReasonInput.trim() })
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
        setDeleteOrderTargetId(null);
        setCancelReasonInput("");
        setSuccessMessage("Order cancelled successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (err: any) {
      alert("Error deleting order: " + err.message);
    } finally {
      setIsDeletingOrder(false);
      setDeleteOrderTargetId(null);
    }
  };

  const handleUpdateRefundStatus = (orderId: string, refundStatus: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refundStatus })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update refund status");
        return res.json();
      })
      .then(updated => {
        setOrders(prev => prev.map(o => o._id === updated._id ? { ...o, refundStatus: updated.refundStatus } : o));
        if (selectedOrder && selectedOrder._id === updated._id) {
          setSelectedOrder({ ...selectedOrder, refundStatus: updated.refundStatus });
        }
        setSuccessMessage("Refund status updated to: " + refundStatus);
        setTimeout(() => setSuccessMessage(null), 3000);
      })
      .catch(err => alert("Error updating refund status: " + err.message));
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedCount = files.length;
    const currentCount = images.length;
    if (currentCount + selectedCount > 6) {
      setCustomAlert({
        title: "Image Limit Exceeded",
        message: "You can upload a maximum of 6 images in total."
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < selectedCount; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`, {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      const newImagesList = [...images, ...uploadedUrls];
      setImages(newImagesList);

      // Auto-select the first image as the cover image if none is currently selected
      if (!imageFront && newImagesList.length > 0) {
        setImageFront(newImagesList[0]);
      }
    } catch (err: any) {
      setCustomAlert({
        title: "Upload Failed",
        message: "Failed to upload image(s): " + err.message
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const urlToRemove = images[indexToRemove];
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);

    // If we removed the cover image, reset it to the first remaining image or null
    if (imageFront === urlToRemove) {
      setImageFront(updated.length > 0 ? updated[0] : "");
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setVideoProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        setVideoProgress(percentage);
      }
    };

    xhr.onload = () => {
      setUploadingVideo(false);
      setVideoProgress(null);
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          setVideoUrl(data.url);
        } catch (err) {
          setCustomAlert({
            title: "Parse Error",
            message: "Failed to parse upload server response."
          });
        }
      } else {
        let errMsg = "Upload failed";
        try {
          const data = JSON.parse(xhr.responseText);
          errMsg = data.error || errMsg;
        } catch (e) { }
        setCustomAlert({
          title: "Video Upload Failed",
          message: errMsg
        });
      }
    };

    xhr.onerror = () => {
      setUploadingVideo(false);
      setVideoProgress(null);
      setCustomAlert({
        title: "Network Error",
        message: "Network request failed. Please check connection to server."
      });
    };

    xhr.send(formData);
  };

  const handleGiftSetHeaderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGiftSetHeaderImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      setGiftSetHeaderBgImage(data.url);
    } catch (err: any) {
      setCustomAlert({ title: "Upload Failed", message: err.message || "Failed to upload image" });
    } finally {
      setUploadingGiftSetHeaderImage(false);
    }
  };

  const handleGiftSetHeaderVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGiftSetHeaderVideo(true);
    setGiftSetHeaderVideoProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        setGiftSetHeaderVideoProgress(percentage);
      }
    };
    xhr.onload = () => {
      setUploadingGiftSetHeaderVideo(false);
      setGiftSetHeaderVideoProgress(null);
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          setGiftSetHeaderBgVideo(data.url);
        } catch (err) {
          setCustomAlert({ title: "Parse Error", message: "Failed to parse upload server response." });
        }
      } else {
        setCustomAlert({ title: "Video Upload Failed", message: "Upload failed." });
      }
    };
    xhr.onerror = () => {
      setUploadingGiftSetHeaderVideo(false);
      setGiftSetHeaderVideoProgress(null);
      setCustomAlert({ title: "Network Error", message: "Network request failed." });
    };
    xhr.send(formData);
  };

  const handleHeroBgVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroBgVideo(true);
    setHeroBgVideoProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        setHeroBgVideoProgress(percentage);
      }
    };
    xhr.onload = () => {
      setUploadingHeroBgVideo(false);
      setHeroBgVideoProgress(null);
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          setHeroBgVideo(data.url);
        } catch (err) {
          setCustomAlert({ title: "Parse Error", message: "Failed to parse upload server response." });
        }
      } else {
        setCustomAlert({ title: "Video Upload Failed", message: "Upload failed." });
      }
    };
    xhr.onerror = () => {
      setUploadingHeroBgVideo(false);
      setHeroBgVideoProgress(null);
      setCustomAlert({ title: "Network Error", message: "Network request failed." });
    };
    xhr.send(formData);
  };

  const handleHeroBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroBgImage(true);
    setHeroBgImageProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        setHeroBgImageProgress(percentage);
      }
    };
    xhr.onload = () => {
      setUploadingHeroBgImage(false);
      setHeroBgImageProgress(null);
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          setHeroBgImage(data.url);
        } catch (err) {
          setCustomAlert({ title: "Parse Error", message: "Failed to parse upload server response." });
        }
      } else {
        setCustomAlert({ title: "Image Upload Failed", message: "Upload failed." });
      }
    };
    xhr.onerror = () => {
      setUploadingHeroBgImage(false);
      setHeroBgImageProgress(null);
      setCustomAlert({ title: "Network Error", message: "Network request failed." });
    };
    xhr.send(formData);
  };

  const handleLifestyleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLifestyle(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      setLifestyleImage(data.url);
    } catch (err: any) {
      setCustomAlert({
        title: "Upload Failed",
        message: "Failed to upload lifestyle image: " + err.message
      });
    } finally {
      setUploadingLifestyle(false);
    }
  };

  const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      setBrandLogoValue(data.url);
    } catch (err: any) {
      setCustomAlert({
        title: "Upload Failed",
        message: "Failed to upload brand logo: " + err.message
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleResetToDefaults = () => {
    setTickerText("7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | 7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | 7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | ");
    setTickerSpeed(60);
    setAnnouncementText("EVERY BOTTLE IS PREPARED WITH CARE. DUE TO SEASONAL DEMAND, PROCESSING MAY TAKE UP TO 5-7 DAYS BEFORE DISPATCH.");
    setHeroTitle("29sFORMULA");
    setHeroManifesto("SCENT IS THE DIFFERENCE YOU FEEL AND NEVER FAKE. EVERY 29S FORMULA BOTTLE IS CRAFTED BY HANDS THAT CARE, NOT MACHINES THAT RUSH.");
    setVideoTitle("NEW ARRIVALS");
    setVideoSubtitle("Drop's live. Smells divine. Feels better.");
    setVideoUrl("");
    setVideoFallbackColor("#121212");
    setLifestyleText("Intense notes, Raw elements. This is 29sFORMULA.");
    setLifestyleImage("https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
    setPrimaryColor("#57bc74");
    setBrandLogoType("text");
    setBrandLogoValue("29sFORMULA");
    setShowTicker(true);
    setShowAnnouncement(true);
    setShowVideo(true);
    setShowLifestyle(true);
    setShowResetConfirmModal(false);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setMakingPrice("");
    setQuantity("");
    setDescription("");
    setAdditionalInformation("");
    setCategory([]);
    setImageFront("");
    setImageBack("");
    setImages([]);
    setSizes(["50ml", "100ml", "150ml"]);
    setSizeQuantities({});
    setOptions([{ size: "", quantity: "", price: "", strikePrice: "", makingPrice: "", category: [] }]);
    setIsEditing(false);
    setEditId(null);
    setCategoriesDropdownOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isQuillEmpty = (html: string) => !html || html.replace(/<[^>]*>?/gm, '').trim() === '';

    if (!name || isQuillEmpty(description) || isQuillEmpty(additionalInformation)) {
      setError("Please complete all required parameters (Name, Description, Additional Information).");
      return;
    }
    if (options.length === 0) {
      setError("Please add at least one product variant.");
      return;
    }
    if (options.some(opt => !opt.size.trim())) {
      setError("Please specify sizes for all variants.");
      return;
    }
    if (options.some(opt => !opt.category || opt.category.length === 0)) {
      setError("Please select at least one Category for every product variant in the table.");
      return;
    }
    if (options.some(opt => opt.quantity === "" || opt.quantity == null || opt.price === "" || opt.price == null || opt.makingPrice === "" || opt.makingPrice == null)) {
      setError("Please specify valid Quantity, Price, and Making Price for all variants in the table.");
      return;
    }

    if (images.length < 3 || images.length > 6) {
      setError("Please upload between 3 and 6 images.");
      return;
    }

    if (!imageFront) {
      setError("Please select one of the uploaded images as the cover image.");
      return;
    }

    // Set imageBack (hover image) as the first non-cover image to keep hover functionality working
    const nonCoverImages = images.filter(img => img !== imageFront);
    const alternateImage = nonCoverImages.length > 0 ? nonCoverImages[0] : "";

    const payload = {
      name,
      description,
      additionalInformation,
      imageFront,
      imageBack: alternateImage || undefined,
      images,
      variants: options
    };

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products/${editId}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Failed to update database inventory`);

      setSuccessMessage(`Product successfully ${isEditing ? "modified" : "cataloged"}!`);
      setTimeout(() => setSuccessMessage(null), 3000);

      resetForm();
      fetchProducts();
      setShowCrudModal(false);
    } catch (err: any) {
      setError(err.message || "Submit failed.");
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setEditId(product._id || null);
    setName(product.name);
    setPrice(product.price ? product.price.toString() : "0");
    setMakingPrice(product.makingPrice ? product.makingPrice.toString() : "0");
    setQuantity(product.quantity !== undefined ? product.quantity.toString() : "0");
    setDescription(product.description || "");
    setAdditionalInformation(product.additionalInformation || "");
    setCategory(Array.isArray(product.category) ? product.category : [product.category].filter(Boolean));
    setImageFront(product.imageFront);
    setImageBack(product.imageBack || "");
    setImages(product.images || []);
    setSizes(product.sizes || []);
    setSizeQuantities(product.sizeQuantities || {});

    // Load variants/options with legacy fallback
    if (product.variants && product.variants.length > 0) {
      const mappedVariants = product.variants.map(opt => ({ ...opt, category: Array.isArray(opt.category) ? opt.category : (opt.category ? [opt.category as unknown as string] : []) }));
      setOptions(mappedVariants as any);
    } else if (product.options && product.options.length > 0) {
      const mappedOptions = product.options.map(opt => ({ ...opt, category: Array.isArray(opt.category) ? opt.category : (opt.category ? [opt.category] : []) }));
      setOptions(mappedOptions as any);
    } else {
      const legacyOptions = (product.sizes || []).map(sz => ({
        size: sz,
        quantity: product.sizeQuantities ? (product.sizeQuantities[sz] || 0) : 0,
        price: product.price || 0,
        strikePrice: product.strikePrice || "",
        makingPrice: product.makingPrice || 0,
        category: Array.isArray(product.category) ? product.category.filter(c => c !== "Latest Arrivals") : (product.category && product.category !== "Latest Arrivals" ? [product.category] : [])
      }));
      setOptions(legacyOptions.length > 0 ? legacyOptions : [{ size: "", quantity: "", price: "", strikePrice: "", makingPrice: "", category: [] }] as any);
    }

    setShowCrudModal(true);
    setActiveTab("products");
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setCategoryModalError("Please enter a category name.");
      return;
    }
    const name = newCategoryName.trim();
    if (allCategories.includes(name)) {
      setCategoryModalError("This category already exists!");
      return;
    }

    setCategoryModalLoading(true);
    setCategoryModalError(null);

    try {
      // 1. Update all selected products to append the new category
      for (const prodId of selectedProductIds) {
        const prod = products.find(p => p._id === prodId);
        if (!prod) continue;
        const existingCats = Array.isArray(prod.category) ? prod.category : [prod.category].filter(Boolean);
        const updatedCats = Array.from(new Set([...existingCats, name]));

        const updatedVariants = (prod.variants || []).map((v: any) => ({
          ...v,
          category: Array.from(new Set([...(Array.isArray(v.category) ? v.category : [v.category].filter(Boolean)), name]))
        }));

        const updatedOptions = (prod.options || []).map((o: any) => ({
          ...o,
          category: Array.from(new Set([...(Array.isArray(o.category) ? o.category : [o.category].filter(Boolean)), name]))
        }));

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products/${prodId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...prod,
            category: updatedCats,
            variants: updatedVariants,
            options: updatedOptions
          })
        });
        if (!res.ok) {
          throw new Error(`Failed to update product ${prod.name}`);
        }
      }

      // 2. Add category to custom categories list
      const updated = [...customCategories, name];
      setCustomCategories(updated);
      localStorage.setItem("admin_custom_categories", JSON.stringify(updated));

      // 3. Reset state & close modal
      setNewCategoryName("");
      setSelectedProductIds([]);
      setShowAddCategoryModal(false);

      // 4. Refresh product list
      fetchProducts();
      setSuccessMessage("Category created successfully and products updated!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setCategoryModalError(err.message || "Something went wrong.");
    } finally {
      setCategoryModalLoading(false);
    }
  };

  const handleEditCategorySubmit = async () => {
    if (!renameCategoryTarget) return;
    setIsRenamingCategory(true);
    try {
      // 1. Update product assignments FIRST (using old category name)
      const currentProductsInCat = products.filter(p => {
        const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean);
        return cats.includes(renameCategoryTarget);
      }).map(p => p._id as string);

      const toAdd = editCategorySelectedProductIds.filter(id => !currentProductsInCat.includes(id));
      const toRemove = currentProductsInCat.filter(id => !editCategorySelectedProductIds.includes(id));
      const productsToUpdateIds = [...toAdd, ...toRemove];

      for (const prodId of productsToUpdateIds) {
        const prod = products.find(p => p._id === prodId);
        if (!prod) continue;

        let updatedCats = Array.isArray(prod.category) ? [...prod.category] : [prod.category].filter(Boolean);
        if (toAdd.includes(prodId)) {
          updatedCats = Array.from(new Set([...updatedCats, renameCategoryTarget]));
        } else if (toRemove.includes(prodId)) {
          updatedCats = updatedCats.filter(c => c !== renameCategoryTarget);
        }

        const updatedVariants = (prod.variants || []).map((v: any) => {
          let vCats = Array.isArray(v.category) ? [...v.category] : [v.category].filter(Boolean);
          if (toAdd.includes(prodId)) vCats = Array.from(new Set([...vCats, renameCategoryTarget]));
          else if (toRemove.includes(prodId)) vCats = vCats.filter(c => c !== renameCategoryTarget);
          return { ...v, category: vCats };
        });

        const updatedOptions = (prod.options || []).map((o: any) => {
          let oCats = Array.isArray(o.category) ? [...o.category] : [o.category].filter(Boolean);
          if (toAdd.includes(prodId)) oCats = Array.from(new Set([...oCats, renameCategoryTarget]));
          else if (toRemove.includes(prodId)) oCats = oCats.filter(c => c !== renameCategoryTarget);
          return { ...o, category: oCats };
        });

        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products/${prodId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...prod, category: updatedCats, variants: updatedVariants, options: updatedOptions })
        });
      }

      // 2. Rename category if changed
      const trimmedNewName = renameCategoryNewName.trim();
      if (trimmedNewName && trimmedNewName !== renameCategoryTarget) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/categories/rename`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldName: renameCategoryTarget, newName: trimmedNewName })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to rename category");

        const defaultCategoriesList = ["Best Seller"];
        if (defaultCategoriesList.includes(renameCategoryTarget)) {
          const updated = [...deletedDefaultCategories, renameCategoryTarget];
          setDeletedDefaultCategories(updated);
          localStorage.setItem("admin_deleted_default_categories", JSON.stringify(updated));
        }

        const updatedCustomCats = customCategories.filter(c => c !== renameCategoryTarget);
        if (!updatedCustomCats.includes(trimmedNewName)) {
          updatedCustomCats.push(trimmedNewName);
        }
        setCustomCategories(updatedCustomCats);
        localStorage.setItem("admin_custom_categories", JSON.stringify(updatedCustomCats));
      }

      fetchProducts();
      setSuccessMessage("Category updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setRenameCategoryTarget(null);
      setRenameCategoryNewName("");
      setEditCategorySelectedProductIds([]);
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setIsRenamingCategory(false);
    }
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!deleteCategoryTarget) return;
    setDeleteCategoryLoading(true);
    try {
      // 1. Find all products in this category and remove it from their category list
      const productsToUpdate = products.filter(p => {
        const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean);
        return cats.includes(deleteCategoryTarget);
      });
      for (const prod of productsToUpdate) {
        const existingCats = Array.isArray(prod.category) ? prod.category : [prod.category].filter(Boolean);
        const updatedCats = existingCats.filter(c => c !== deleteCategoryTarget);

        const updatedVariants = (prod.variants || []).map((v: any) => ({
          ...v,
          category: (Array.isArray(v.category) ? v.category : [v.category]).filter(Boolean).filter((c: any) => c !== deleteCategoryTarget)
        }));

        const updatedOptions = (prod.options || []).map((o: any) => ({
          ...o,
          category: (Array.isArray(o.category) ? o.category : [o.category]).filter(Boolean).filter((c: any) => c !== deleteCategoryTarget)
        }));

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products/${prod._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...prod,
            category: updatedCats,
            variants: updatedVariants,
            options: updatedOptions
          })
        });
        if (!res.ok) {
          throw new Error(`Failed to update product ${prod.name}`);
        }
      }

      // 2. Remove from customCategories if it's there
      if (customCategories.includes(deleteCategoryTarget)) {
        const updated = customCategories.filter(c => c !== deleteCategoryTarget);
        setCustomCategories(updated);
        localStorage.setItem("admin_custom_categories", JSON.stringify(updated));
      } else {
        // It's a default category, add to deletedDefaultCategories
        const updated = [...deletedDefaultCategories, deleteCategoryTarget];
        setDeletedDefaultCategories(updated);
        localStorage.setItem("admin_deleted_default_categories", JSON.stringify(updated));
      }

      // 3. Reset states & refresh
      setDeleteCategoryTarget(null);
      fetchProducts();
      setSuccessMessage("Category deleted successfully and products unlinked!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    } finally {
      setDeleteCategoryLoading(false);
    }
  };

  const handleAssignExistingToCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryView || existingProductIdsToAssign.length === 0) return;
    setAssignLoading(true);

    try {
      for (const prodId of existingProductIdsToAssign) {
        const prod = products.find(p => p._id === prodId);
        if (!prod) continue;
        const existingCats = Array.isArray(prod.category) ? prod.category : [prod.category].filter(Boolean);
        const updatedCats = Array.from(new Set([...existingCats, selectedCategoryView]));

        const updatedVariants = (prod.variants || []).map((v: any) => ({
          ...v,
          category: Array.from(new Set([...(Array.isArray(v.category) ? v.category : [v.category].filter(Boolean)), selectedCategoryView]))
        }));

        const updatedOptions = (prod.options || []).map((o: any) => ({
          ...o,
          category: Array.from(new Set([...(Array.isArray(o.category) ? o.category : [o.category].filter(Boolean)), selectedCategoryView]))
        }));

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products/${prodId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...prod,
            category: updatedCats,
            variants: updatedVariants,
            options: updatedOptions
          })
        });
        if (!res.ok) {
          throw new Error(`Failed to assign product ${prod.name}`);
        }
      }

      setSuccessMessage("Products added to category successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      setExistingProductIdsToAssign([]);
      setShowAddExistingToCategoryModal(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || "Failed to assign products.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete product");

      setSuccessMessage("Product removed from inventory!");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Delete failed.");
      setTimeout(() => setError(null), 4000);
    }
  };

  // Stats
  const totalProducts = products.length;
  const avgPrice = totalProducts > 0
    ? Math.round(products.reduce((acc, curr) => acc + curr.price, 0) / totalProducts)
    : 0;
  const latestArrivalsCount = products.filter(p => Array.isArray(p.category) ? p.category.includes("Latest Arrivals") : p.category === "Latest Arrivals").length;
  const bestSellersCount = products.filter(p => Array.isArray(p.category) ? p.category.includes("Best Seller") : p.category === "Best Seller").length;

  // Dynamic categories list (sorted A-Z)
  const defaultCategoriesList = ["Best Seller", "Latest Arrivals"];
  const categoriesFromProducts = Array.from(new Set(
    products.flatMap(p => Array.isArray(p.category) ? p.category : [p.category]).filter(c => Boolean(c) && c !== "Latest Arrivals" && c !== "Best Seller")
  ));
  const allCategories = Array.from(new Set([
    ...defaultCategoriesList,
    ...categoriesFromProducts,
    ...customCategories
  ])).sort((a, b) => {
    const isBotA = a === "Best Seller" || a === "Latest Arrivals";
    const isBotB = b === "Best Seller" || b === "Latest Arrivals";
    if (isBotA && !isBotB) return -1;
    if (!isBotA && isBotB) return 1;
    return a.localeCompare(b);
  });

  // Filtered products for search, sorted alphabetically A-Z
  const filteredProducts = products
    .filter(p => {
      const categoryString = Array.isArray(p.category) ? p.category.join(", ") : (p.category || "");
      return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryString.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!authorized) {
    return (
      <div className={styles.authCheckingWrapper}>
        <div className={styles.spinner} />
        <span className={styles.authText}>Verifying Credentials...</span>
      </div>
    );
  }



  const getSearchResults = () => {
    if (!searchQuery.trim()) return { pages: [], products: [], orders: [], customers: [] };
    const query = searchQuery.toLowerCase().trim();

    const matchedPages = SEARCH_PAGES.filter(p => p.label.toLowerCase().includes(query));

    const matchedProducts = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    ).slice(0, 5);

    const matchedOrders = orders.filter(o => {
      const oid = o.orderId || "";
      const customerName = (o.shippingAddress?.fullName || "").toLowerCase();
      const customerEmail = (o.shippingAddress?.email || "").toLowerCase();
      const customerPhone = String(o.shippingAddress?.phone || "");
      return oid.toLowerCase().includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        customerPhone.includes(query);
    });

    const matchedCustomers = customers.filter(c =>
      (c.name && c.name.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.phone && String(c.phone).includes(query))
    ).slice(0, 5);

    return { pages: matchedPages, products: matchedProducts, orders: matchedOrders, customers: matchedCustomers };
  };
  const searchResults = getSearchResults();

  return (
    <div className={styles.adminPageWrapper}>

      {/* Mobile Header */}
      <div
        className={`${styles.mobileHeader} ${!isHeaderVisible && !isMobileMenuOpen ? styles.mobileHeaderHidden : ''}`}
        style={{
          zIndex: isMobileMenuOpen ? 10002 : 10000,
          backgroundColor: isMobileMenuOpen ? 'transparent' : '#ffffff',
          borderBottom: isMobileMenuOpen ? 'none' : '1px solid #e5e7eb',
          transition: 'all 0.3s ease'
        }}
      >
        <span className={styles.brandName} style={{ opacity: isMobileMenuOpen ? 0 : 1, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center' }}>
          {brandLogoType === "image" && brandLogoValue ? (
            <img src={brandLogoValue} alt="Brand Logo" style={{ maxHeight: "24px", maxWidth: "120px", objectFit: "contain" }} />
          ) : (
            brandLogoValue || "29sFORMULA"
          )}
        </span>
        <button className={styles.hamburgerBtn} onClick={() => {
          if (!isMobileMenuOpen) {
            // Open the dropdown for the active tab, close others
            setOrdersDropdownOpen(activeTab === "orders");
            setProductsDropdownOpen(activeTab === "products");
            setOnlineStoreDropdownOpen(activeTab === "online-store");
          }
          setIsMobileMenuOpen(!isMobileMenuOpen);
        }}>
          <div className={styles.hamburgerInner}>
            <div className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineTopOpen : ''}`} />
            <div className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineMiddleOpen : ''}`} />
            <div className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineBottomOpen : ''}`} />
          </div>
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        customizeSubTab={customizeSubTab}
        setCustomizeSubTab={setCustomizeSubTab}
        ordersDropdownOpen={ordersDropdownOpen}
        productsDropdownOpen={productsDropdownOpen}
        onlineStoreDropdownOpen={onlineStoreDropdownOpen}
        setOrdersDropdownOpen={setOrdersDropdownOpen}
        setProductsDropdownOpen={setProductsDropdownOpen}
        setOnlineStoreDropdownOpen={setOnlineStoreDropdownOpen}
        setActiveTab={setActiveTab}
        setActiveSubTab={setActiveSubTab}
        setSelectedCategoryView={setSelectedCategoryView}
        handleNavigationTrigger={handleNavigationTrigger}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        brandLogoType={brandLogoType}
        brandLogoValue={brandLogoValue}
      />

      {/* 2. Main Page Content Wrapper */}
      <div className={styles.mainWrapper}>

        {/* Top bar with search input */}
        <header className={styles.topNavbar} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
          <div onClick={() => setIsSearchOpen(true)} style={{ cursor: 'pointer', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '30px', transition: 'all 0.2s', padding: '8px 12px 8px 16px', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#6b7280" style={{ width: '18px', height: '18px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602Z" />
            </svg>
            <span style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', fontWeight: 600, color: '#6b7280', letterSpacing: '0.05em', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>⌘K</span>
          </div>
        </header>

        {/* GoJim Style Global Search Overlay */}
        <div
          onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
          style={{
            position: 'fixed', inset: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000,
            transition: 'opacity 0.4s ease-in-out',
            opacity: isSearchOpen ? 1 : 0,
            pointerEvents: isSearchOpen ? 'auto' : 'none'
          }}
        />

        <div style={{
          position: 'fixed', left: 0, right: 0, backgroundColor: '#ffffff', zIndex: 1050,
          paddingTop: '40px', paddingBottom: '30px', paddingLeft: '24px', paddingRight: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          top: isSearchOpen ? 0 : '-600px',
          opacity: isSearchOpen ? 1 : 0,
          pointerEvents: isSearchOpen ? 'auto' : 'none'
        }}>
          <div style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', flexDirection: 'column', maxHeight: '50vh' }}>

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#86868b" style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602Z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Admin Portal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', backgroundColor: 'transparent', border: 'none', outline: 'none',
                  color: '#111827', fontSize: '1.25rem', padding: 0, margin: 0,
                  boxShadow: 'none'
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', color: '#86868b', cursor: 'pointer' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 8px' }}></div>
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#4b5563', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', letterSpacing: '0.05em' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} title="Close search">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '14px', height: '14px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
              {!searchQuery.trim() ? (
                <div style={{ padding: '4px 0' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#86868b', textTransform: 'uppercase', marginBottom: '16px' }}>Quick Links</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {SEARCH_PAGES.map((link) => (
                      <button
                        key={link.label}
                        onClick={() => {
                          handleNavigationTrigger(link.target as any);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#4b5563', transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#111827'; (e.currentTarget.firstChild as HTMLElement).style.color = '#111827'; e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = '#4b5563'; (e.currentTarget.firstChild as HTMLElement).style.color = '#86868b'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#86868b', transition: 'color 0.2s', marginRight: '12px' }}>→</span>
                        <span style={{ fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>{link.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '4px 0' }}>
                  {searchResults.pages.length === 0 && searchResults.products.length === 0 && searchResults.orders.length === 0 && searchResults.customers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#86868b" style={{ width: '24px', height: '24px', margin: '0 auto 12px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: '0 0 4px 0' }}>No results found</p>
                      <p style={{ fontSize: '12px', color: '#86868b', margin: 0 }}>No match found for "{searchQuery}". Check the spelling and try again.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                      {/* Pages */}
                      {searchResults.pages.length > 0 && (
                        <div>
                          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#86868b', textTransform: 'uppercase', marginBottom: '8px' }}>Pages</p>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {searchResults.pages.map((link) => (
                              <button
                                key={link.label}
                                onClick={() => { handleNavigationTrigger(link.target as any); setIsSearchOpen(false); setSearchQuery(''); }}
                                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#111827', transition: 'all 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>{link.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Products */}
                      {searchResults.products.length > 0 && (
                        <div>
                          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#86868b', textTransform: 'uppercase', marginBottom: '8px' }}>Products</p>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {searchResults.products.map((p) => (
                              <button
                                key={p._id}
                                onClick={() => { handleEdit(p); setIsSearchOpen(false); setSearchQuery(''); }}
                                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#111827', transition: 'all 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                {p.imageFront ? <img src={p.imageFront} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', marginRight: '12px' }} /> : <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#e5e7eb', marginRight: '12px' }}></div>}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{p.name}</span>
                                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Rs. {p.price}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Orders */}
                      {searchResults.orders.length > 0 && (
                        <div>
                          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#86868b', textTransform: 'uppercase', marginBottom: '8px' }}>Orders</p>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {searchResults.orders.map((o) => (
                              <button
                                key={o._id}
                                onClick={() => {
                                  let targetSubTab = "all";
                                  if (o.status === "Delivered") targetSubTab = "completed";
                                  else if (o.status === "Cancelled") targetSubTab = "cancelled";
                                  else if (o.status === "Returned" || (o.returnRequest && o.returnRequest.status)) targetSubTab = "returns";

                                  setActiveTab('orders');
                                  setActiveSubTab(targetSubTab as any);
                                  setSelectedOrder(o);
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                }}
                                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#111827', transition: 'all 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#6b7280" style={{ width: '16px', height: '16px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '14px', fontWeight: 500 }}>Order #{o.orderId}</span>
                                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{o.shippingAddress?.fullName} - Rs. {o.totalAmount}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Customers */}
                      {searchResults.customers.length > 0 && (
                        <div>
                          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#86868b', textTransform: 'uppercase', marginBottom: '8px' }}>Customers</p>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {searchResults.customers.map((c, idx) => (
                              <button
                                key={idx}
                                onClick={() => { setActiveTab('customers'); setIsSearchOpen(false); setSearchQuery(''); }}
                                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#111827', transition: 'all 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <div style={{ width: '32px', height: '32px', borderRadius: '16px', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#4338ca', fontSize: '14px', fontWeight: 600 }}>
                                  {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{c.name || 'Unknown'}</span>
                                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{c.email || c.phone}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic tabs render content */}
        <div className={styles.scrollableContent}>

          {activeTab === "home" && (
            <HomeTab
              dashboardStats={dashboardStats}
              setActiveTab={setActiveTab}
              setActiveSubTab={setActiveSubTab}
              timelineFilter={timelineFilter}
              setTimelineFilter={setTimelineFilter}
              setSelectedOrder={setSelectedOrder}
            />
          )}


          {activeTab === "orders" && (
            <OrdersTab
              activeSubTab={activeSubTab}
              orders={orders}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isRefundFilterOpen={isRefundFilterOpen}
              setIsRefundFilterOpen={setIsRefundFilterOpen}
              refundStatusFilter={refundStatusFilter}
              setRefundStatusFilter={setRefundStatusFilter}
              isStatusFilterOpen={isStatusFilterOpen}
              setIsStatusFilterOpen={setIsStatusFilterOpen}
              orderStatusFilter={orderStatusFilter}
              setOrderStatusFilter={setOrderStatusFilter}
              fetchOrders={fetchOrders}
              openStatusDropdownId={openStatusDropdownId}
              setOpenStatusDropdownId={setOpenStatusDropdownId}
              handleUpdateReturnStatus={handleUpdateReturnStatus}
              handleUpdateOrderStatus={handleUpdateOrderStatus}
              setSelectedOrder={setSelectedOrder}
              handleDeleteOrder={handleDeleteOrder}
            />
          )}

          <ProductsTab
            activeTab={activeTab}
            activeSubTab={activeSubTab}
            setIsEditing={setIsEditing}
            resetForm={resetForm}
            setShowCrudModal={setShowCrudModal}
            error={error}
            showCrudModal={showCrudModal}
            loading={loading}
            filteredProducts={filteredProducts}
            expandedProducts={expandedProducts}
            toggleExpand={toggleExpand}
            setActiveCategoryPopoverProductId={setActiveCategoryPopoverProductId}
            activeCategoryPopoverProductId={activeCategoryPopoverProductId}
            handleEdit={handleEdit}
            setDeleteTargetId={setDeleteTargetId}
            selectedCategoryView={selectedCategoryView}
            setSelectedCategoryView={setSelectedCategoryView}
            setShowCategoryAddOptionsModal={setShowCategoryAddOptionsModal}
            products={products}
            setNewCategoryName={setNewCategoryName}
            setSelectedProductIds={setSelectedProductIds}
            setCategoryModalError={setCategoryModalError}
            setShowAddCategoryModal={setShowAddCategoryModal}
            allCategories={allCategories}
            setRenameCategoryTarget={setRenameCategoryTarget}
            setRenameCategoryNewName={setRenameCategoryNewName}
            setEditCategorySelectedProductIds={setEditCategorySelectedProductIds}
            setDeleteCategoryTarget={setDeleteCategoryTarget}
          />
          <OnlineStoreTab
            heroButtonColor={heroButtonColor}
            heroButtonSize={heroButtonSize}
            heroButtonStyle={heroButtonStyle}
            heroButtonText={heroButtonText}
            heroButtonTextColor={heroButtonTextColor}
            heroTemplate={heroTemplate}
            showHeroTitle={showHeroTitle}
            showHeroManifesto={showHeroManifesto}
            showHeroButton={showHeroButton}
            activeTab={activeTab}
            customizeSubTab={customizeSubTab}
            error={error}
            handleSaveSettings={handleSaveSettings}
            setActiveCustomizerSection={setActiveCustomizerSection}
            setIsHeroCustomizerModalOpen={setIsHeroCustomizerModalOpen}
            setIsVideoCustomizerModalOpen={setIsVideoCustomizerModalOpen}
            setIsLifestyleCustomizerModalOpen={setIsLifestyleCustomizerModalOpen}
            activeCustomizerSection={activeCustomizerSection}
            heroTitleFontType={heroTitleFontType}
            heroTitleFontSize={heroTitleFontSize}
            heroTitleFontColor={heroTitleFontColor}
            heroTitleFontAlignment={heroTitleFontAlignment}
            heroTitleFontWeight={heroTitleFontWeight}
            heroManifestoFontType={heroManifestoFontType}
            heroManifestoFontSize={heroManifestoFontSize}
            heroManifestoFontColor={heroManifestoFontColor}
            heroManifestoFontAlignment={heroManifestoFontAlignment}
            heroManifestoFontWeight={heroManifestoFontWeight}
            heroTitle={heroTitle}
            setHeroTitle={setHeroTitle}
            heroManifesto={heroManifesto}
            setHeroManifesto={setHeroManifesto}
            heroBgType={heroBgType}
            setHeroBgType={setHeroBgType}
            heroBgColor={heroBgColor}
            setHeroBgColor={setHeroBgColor}
            heroBgImage={heroBgImage}
            setHeroBgImage={setHeroBgImage}
            heroBgVideo={heroBgVideo}
            setHeroBgVideo={setHeroBgVideo}
            uploadingHeroBgVideo={uploadingHeroBgVideo}
            heroBgVideoProgress={heroBgVideoProgress}
            handleHeroBgVideoUpload={handleHeroBgVideoUpload}
            uploadingHeroBgImage={uploadingHeroBgImage}
            heroBgImageProgress={heroBgImageProgress}
            handleHeroBgImageUpload={handleHeroBgImageUpload}
            setHeroTitleFontType={setHeroTitleFontType}
            setHeroTitleFontColor={setHeroTitleFontColor}
            setHeroTitleFontSize={setHeroTitleFontSize}
            setHeroTitleFontAlignment={setHeroTitleFontAlignment}
            setHeroTitleFontWeight={setHeroTitleFontWeight}
            showVideo={showVideo}
            setShowVideo={setShowVideo}
            videoTitle={videoTitle}
            setVideoTitle={setVideoTitle}
            videoSubtitle={videoSubtitle}
            setVideoSubtitle={setVideoSubtitle}
            videoUrl={videoUrl}
            setVideoUrl={setVideoUrl}
            videoBgType={videoBgType}
            setVideoBgType={setVideoBgType}
            videoBgColor={videoBgColor}
            setVideoBgColor={setVideoBgColor}
            videoBgImage={videoBgImage}
            setVideoBgImage={setVideoBgImage}
            uploadingVideo={uploadingVideo}
            videoFallbackColor={videoFallbackColor}
            handleVideoUpload={handleVideoUpload}
            videoProgress={videoProgress}
            setVideoFallbackColor={setVideoFallbackColor}
            showLifestyle={showLifestyle}
            setShowLifestyle={setShowLifestyle}
            lifestyleText={lifestyleText}
            setLifestyleText={setLifestyleText}
            lifestyleImage={lifestyleImage}
            setLifestyleImage={setLifestyleImage}
            uploadingLifestyle={uploadingLifestyle}
            handleLifestyleImageUpload={handleLifestyleImageUpload}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            brandLogoType={brandLogoType}
            setBrandLogoType={setBrandLogoType}
            brandLogoValue={brandLogoValue}
            setBrandLogoValue={setBrandLogoValue}
            uploadingLogo={uploadingLogo}
            handleBrandLogoUpload={handleBrandLogoUpload}
            setGoogleClientId={setGoogleClientId}
            supportText={supportText}
            setSupportText={setSupportText}
            careersText={careersText}
            setCareersText={setCareersText}
            tradeEnquiryText={tradeEnquiryText}
            setTradeEnquiryText={setTradeEnquiryText}
            aboutUsText={aboutUsText}
            setAboutUsText={setAboutUsText}
            instagramLink={instagramLink}
            setInstagramLink={setInstagramLink}
            facebookLink={facebookLink}
            setFacebookLink={setFacebookLink}
            contactLink={contactLink}
            setContactLink={setContactLink}
            contactUsText={contactUsText}
            setContactUsText={setContactUsText}
            returnPolicyText={returnPolicyText}
            setReturnPolicyText={setReturnPolicyText}
            shippingPolicyText={shippingPolicyText}
            setShippingPolicyText={setShippingPolicyText}
            faqs={faqs}
            setFaqs={setFaqs}
            showProductReviews={showProductReviews}
            setShowProductReviews={setShowProductReviews}
            showProductExploreMore={showProductExploreMore}
            setShowProductExploreMore={setShowProductExploreMore}
            showProductFaq={showProductFaq}
            setShowProductFaq={setShowProductFaq}
            usageGuideText={usageGuideText}
            setUsageGuideText={setUsageGuideText}
            exploreMoreTitle={exploreMoreTitle}
            setExploreMoreTitle={setExploreMoreTitle}
            deliverySubtext={deliverySubtext}
            setDeliverySubtext={setDeliverySubtext}
            fetchAdminReviews={fetchAdminReviews}
            adminReviews={adminReviews}
            reviewSearchQuery={reviewSearchQuery}
            setEditReviewTarget={setEditReviewTarget}
            setDeleteReviewTarget={setDeleteReviewTarget}
            loadingSettings={loadingSettings}
            hasUnsavedChanges={hasUnsavedChanges}
            setShowResetConfirmModal={setShowResetConfirmModal}
            showGiftSetPage={showGiftSetPage}
            setShowGiftSetPage={setShowGiftSetPage}
            giftSetHeaderBadge={giftSetHeaderBadge}
            setGiftSetHeaderBadge={setGiftSetHeaderBadge}
            giftSetHeaderTitle={giftSetHeaderTitle}
            setGiftSetHeaderTitle={setGiftSetHeaderTitle}
            giftSetHeaderSubtitle={giftSetHeaderSubtitle}
            setGiftSetHeaderSubtitle={setGiftSetHeaderSubtitle}
            giftSetHeaderTitleFontType={giftSetHeaderTitleFontType}
            setGiftSetHeaderTitleFontType={setGiftSetHeaderTitleFontType}
            giftSetHeaderTitleFontSize={giftSetHeaderTitleFontSize}
            setGiftSetHeaderTitleFontSize={setGiftSetHeaderTitleFontSize}
            giftSetHeaderTitleFontColor={giftSetHeaderTitleFontColor}
            setGiftSetHeaderTitleFontColor={setGiftSetHeaderTitleFontColor}
            giftSetHeaderTitleFontWeight={giftSetHeaderTitleFontWeight}
            setGiftSetHeaderTitleFontWeight={setGiftSetHeaderTitleFontWeight}
            giftSetHeaderTitleFontAlignment={giftSetHeaderTitleFontAlignment}
            setGiftSetHeaderTitleFontAlignment={setGiftSetHeaderTitleFontAlignment}
            giftSetHeaderSubtitleFontType={giftSetHeaderSubtitleFontType}
            setGiftSetHeaderSubtitleFontType={setGiftSetHeaderSubtitleFontType}
            giftSetHeaderSubtitleFontSize={giftSetHeaderSubtitleFontSize}
            setGiftSetHeaderSubtitleFontSize={setGiftSetHeaderSubtitleFontSize}
            giftSetHeaderSubtitleFontColor={giftSetHeaderSubtitleFontColor}
            setGiftSetHeaderSubtitleFontColor={setGiftSetHeaderSubtitleFontColor}
            giftSetHeaderSubtitleFontWeight={giftSetHeaderSubtitleFontWeight}
            setGiftSetHeaderSubtitleFontWeight={setGiftSetHeaderSubtitleFontWeight}
            giftSetBgType={giftSetBgType}
            setGiftSetBgType={setGiftSetBgType}
            giftSetBgColor={giftSetBgColor}
            setGiftSetBgColor={setGiftSetBgColor}
            giftSetBgImage={giftSetBgImage}
            setGiftSetBgImage={setGiftSetBgImage}
            giftSetBgGradient={giftSetBgGradient}
            setGiftSetBgGradient={setGiftSetBgGradient}
            giftSetSizes={giftSetSizes}
            setGiftSetSizes={setGiftSetSizes}
            giftSetDefaultSize={giftSetDefaultSize}
            setGiftSetDefaultSize={setGiftSetDefaultSize}
            giftSetMaxFragrances={giftSetMaxFragrances}
            setGiftSetMaxFragrances={setGiftSetMaxFragrances}
            giftSetButtonText={giftSetButtonText}
            setGiftSetButtonText={setGiftSetButtonText}
            giftSetButtonColor={giftSetButtonColor}
            setGiftSetButtonColor={setGiftSetButtonColor}
            giftSetButtonTextColor={giftSetButtonTextColor}
            setGiftSetButtonTextColor={setGiftSetButtonTextColor}
            giftSetButtonStyle={giftSetButtonStyle}
            setGiftSetButtonStyle={setGiftSetButtonStyle}
            giftSetCardBorderColor={giftSetCardBorderColor}
            setGiftSetCardBorderColor={setGiftSetCardBorderColor}
            giftSetCardSelectedColor={giftSetCardSelectedColor}
            setGiftSetCardSelectedColor={setGiftSetCardSelectedColor}
            giftSetAccentColor={giftSetAccentColor}
            setGiftSetAccentColor={setGiftSetAccentColor}
            giftSetHeaderBgType={giftSetHeaderBgType}
            setGiftSetHeaderBgType={setGiftSetHeaderBgType}
            giftSetHeaderBgColor={giftSetHeaderBgColor}
            setGiftSetHeaderBgColor={setGiftSetHeaderBgColor}
            giftSetHeaderBgImage={giftSetHeaderBgImage}
            setGiftSetHeaderBgImage={setGiftSetHeaderBgImage}
            giftSetHeaderBgVideo={giftSetHeaderBgVideo}
            setGiftSetHeaderBgVideo={setGiftSetHeaderBgVideo}
            uploadingGiftSetHeaderImage={uploadingGiftSetHeaderImage}
            handleGiftSetHeaderImageUpload={handleGiftSetHeaderImageUpload}
            uploadingGiftSetHeaderVideo={uploadingGiftSetHeaderVideo}
            handleGiftSetHeaderVideoUpload={handleGiftSetHeaderVideoUpload}
            giftSetHeaderVideoProgress={giftSetHeaderVideoProgress}
          />
          <CustomersTab
            activeTab={activeTab}
            customers={customers}
            setSelectedCustomer={setSelectedCustomer}
            setDeleteCustomerTargetId={setDeleteCustomerTargetId}
          />
          <MarketingTab
            activeTab={activeTab}
            customizeSubTab={customizeSubTab}
            showTicker={showTicker}
            setShowTicker={setShowTicker}
            saveSettingsSilent={saveSettingsSilent}
            tickerText={tickerText}
            setTickerText={setTickerText}
            tickerSpeed={tickerSpeed}
            setTickerSpeed={setTickerSpeed}
            tickerBgColor={tickerBgColor}
            setTickerBgColor={setTickerBgColor}
            tickerTextColor={tickerTextColor}
            setTickerTextColor={setTickerTextColor}
            setSuccessMessage={setSuccessMessage}
            hasUnsavedChanges={hasUnsavedChanges}
          />
          <DiscountsTab
            activeTab={activeTab}
            handleCreateDiscount={handleCreateDiscount}
            discountError={discountError}
            newDiscountCode={newDiscountCode}
            setNewDiscountCode={setNewDiscountCode}
            newDiscountType={newDiscountType}
            setNewDiscountType={setNewDiscountType}
            newDiscountValue={newDiscountValue}
            setNewDiscountValue={setNewDiscountValue}
            newDiscountMinOrder={newDiscountMinOrder}
            setNewDiscountMinOrder={setNewDiscountMinOrder}
            discountsList={discountsList}
            setDeleteDiscountConfirmId={setDeleteDiscountConfirmId}

          />
        </div>
      </div>
      {deleteDiscountConfirmId && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.unsavedModal} ${styles.mobileAlertModalOverride}`}>
            <div className={`${styles.modalHeader} ${styles.mobileAlertHeader}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#dc2626" className={`${styles.warningIcon} ${styles.mobileAlertIcon}`} style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h3>Confirm Coupon Deletion</h3>
            </div>
            <p className={`${styles.modalBody} ${styles.mobileAlertDescription}`}>
              Are you sure you want to permanently revoke this discount coupon? Customers will no longer be able to apply it during checkout.
            </p>
            <div className={`${styles.modalActionRow} ${styles.mobileAlertActionRow}`}>
              <button
                type="button"
                className={`${styles.modalConfirmBtn} ${styles.primaryActionBtn}`}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                onClick={() => handleDeleteDiscount(deleteDiscountConfirmId)}
              >
                Yes, Revoke Coupon
              </button>
              <button
                type="button"
                className={`${styles.modalCancelBtn} ${styles.secondaryActionBtn}`}
                onClick={() => setDeleteDiscountConfirmId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOrderTargetId && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.unsavedModal} ${styles.mobileAlertModalOverride}`}>
            <div className={`${styles.modalHeader} ${styles.mobileAlertHeader}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#dc2626" className={`${styles.warningIcon} ${styles.mobileAlertIcon}`} style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h3>Confirm Cancle Order</h3>
            </div>

            <p className={`${styles.modalDescription} ${styles.mobileAlertDescription}`} style={{ margin: "0 0 20px 0" }}>
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div style={{ marginBottom: "20px", textAlign: "left", width: "100%" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#374151" }}>Reason for Cancellation <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea
                value={cancelReasonInput}
                onChange={(e) => setCancelReasonInput(e.target.value)}
                placeholder="e.g. Out of stock, customer requested..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  resize: "vertical"
                }}
                required
              />
            </div>
            <div className={`${styles.modalActionRow} ${styles.mobileAlertActionRow}`}>
              <button
                onClick={() => {
                  if (deleteOrderTargetId && cancelReasonInput.trim()) {
                    executeDeleteOrder(deleteOrderTargetId);
                  } else if (!cancelReasonInput.trim()) {
                    alert("Please provide a reason for cancellation.");
                  }
                }}
                disabled={isDeletingOrder}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", opacity: isDeletingOrder ? 0.7 : 1 }}
              >
                {isDeletingOrder ? "Cancelling..." : "Cancel Order"}
              </button>
              <button
                onClick={() => setDeleteOrderTargetId(null)}
                className={styles.secondaryActionBtn}
                disabled={isDeletingOrder}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved changes confirmation modal overlay */}
      {showUnsavedModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.unsavedModal} ${styles.mobileAlertModalOverride}`}>
            <div className={`${styles.modalHeader} ${styles.mobileAlertHeader}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#dc2626" className={`${styles.warningIcon} ${styles.mobileAlertIcon}`} style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h3>Unsaved Changes Detected</h3>
            </div>

            <p className={`${styles.modalDescription} ${styles.mobileAlertDescription}`}>
              You have modified storefront settings without saving. The following adjustments will be lost if you leave:
            </p>

            <ul className={styles.changesList} style={{ width: "100%", boxSizing: "border-box" }}>
              {getChangedFieldsList().map((field, idx) => (
                <li key={idx} className={styles.changeItem}>
                  <span className={styles.bullet}>•</span>
                  {field}
                </li>
              ))}
            </ul>

            <div className={`${styles.modalActionRow} ${styles.mobileAlertActionRow}`}>
              <button onClick={handleSaveAndContinue} className={styles.primaryActionBtn}>
                Save & Continue
              </button>
              <button onClick={handleDiscardAndContinue} className={styles.secondaryActionBtn} style={{ color: "#ef4444", borderColor: "#ef4444" }}>
                Discard Changes
              </button>
              <button onClick={handleCancelNavigation} className={styles.secondaryActionBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminModals
        allCategories={allCategories}
        assignLoading={assignLoading}
        category={category}
        categoryModalError={categoryModalError}
        categoryModalLoading={categoryModalLoading}
        customAlert={customAlert}
        deleteCategoryLoading={deleteCategoryLoading}
        deleteCategoryTarget={deleteCategoryTarget}
        deleteCustomerTargetId={deleteCustomerTargetId}
        deleteReviewTarget={deleteReviewTarget}
        deleteTargetId={deleteTargetId}
        description={description}
        additionalInformation={additionalInformation}
        editReviewTarget={editReviewTarget}
        error={error}
        setError={setError}
        executeReturnStatusUpdate={executeReturnStatusUpdate}
        existingProductIdsToAssign={existingProductIdsToAssign}
        handleAddCategorySubmit={handleAddCategorySubmit}
        handleAssignExistingToCategory={handleAssignExistingToCategory}
        handleDelete={handleDelete}
        handleDeleteAdminReviewConfirm={handleDeleteAdminReviewConfirm}
        handleDeleteCategoryConfirm={handleDeleteCategoryConfirm}
        handleDeleteCustomer={handleDeleteCustomer}
        handleEditReviewSubmit={handleEditReviewSubmit}
        handleMultipleFilesUpload={handleMultipleFilesUpload}
        handleRemoveImage={handleRemoveImage}
        handleEditCategorySubmit={handleEditCategorySubmit}
        handleResetToDefaults={handleResetToDefaults}
        handleSubmit={handleSubmit}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
        handleSaveTrackingInfo={handleSaveTrackingInfo}
        handleUpdateRefundStatus={handleUpdateRefundStatus}
        heroBgColor={heroBgColor}
        heroBgImage={heroBgImage}
        heroBgType={heroBgType}
        heroBgVideo={heroBgVideo}
        heroButtonColor={heroButtonColor}
        heroButtonSize={heroButtonSize}
        heroButtonStyle={heroButtonStyle}
        heroButtonText={heroButtonText}
        heroButtonTextColor={heroButtonTextColor}
        heroManifesto={heroManifesto}
        heroManifestoFontAlignment={heroManifestoFontAlignment}
        heroManifestoFontColor={heroManifestoFontColor}
        heroManifestoFontSize={heroManifestoFontSize}
        heroManifestoFontType={heroManifestoFontType}
        heroManifestoFontWeight={heroManifestoFontWeight}
        heroTemplate={heroTemplate}
        heroTitle={heroTitle}
        heroTitleFontAlignment={heroTitleFontAlignment}
        heroTitleFontColor={heroTitleFontColor}
        heroTitleFontSize={heroTitleFontSize}
        heroTitleFontType={heroTitleFontType}
        heroTitleFontWeight={heroTitleFontWeight}
        imageFront={imageFront}
        images={images}
        isDeletingCustomer={isDeletingCustomer}
        isDeletingProduct={isDeletingProduct}
        isDeletingReview={isDeletingReview}
        isEditing={isEditing}
        isEditingReview={isEditingReview}
        isRenamingCategory={isRenamingCategory}
        name={name}
        newCategoryName={newCategoryName}
        openCategoryIndex={openCategoryIndex}
        options={options}
        orders={orders}
        price={price}
        primaryColor={primaryColor}
        products={products}
        renameCategoryNewName={renameCategoryNewName}
        renameCategoryTarget={renameCategoryTarget}
        editCategorySelectedProductIds={editCategorySelectedProductIds}
        setEditCategorySelectedProductIds={setEditCategorySelectedProductIds}
        resetForm={resetForm}
        returnStatusAction={returnStatusAction}
        returnStatusModalOpen={returnStatusModalOpen}
        returnStatusNotes={returnStatusNotes}
        saveSettingsSilent={saveSettingsSilent}
        selectedCategoryView={selectedCategoryView}
        selectedCustomer={selectedCustomer}
        selectedOrder={selectedOrder}
        selectedProductIds={selectedProductIds}
        setCategory={setCategory}
        setCustomAlert={setCustomAlert}
        setDeleteCategoryTarget={setDeleteCategoryTarget}
        setDeleteCustomerTargetId={setDeleteCustomerTargetId}
        setDeleteReviewTarget={setDeleteReviewTarget}
        setDeleteTargetId={setDeleteTargetId}
        setDescription={setDescription}
        setAdditionalInformation={setAdditionalInformation}
        setEditReviewTarget={setEditReviewTarget}
        setExistingProductIdsToAssign={setExistingProductIdsToAssign}
        setHeroButtonColor={setHeroButtonColor}
        setHeroButtonSize={setHeroButtonSize}
        setHeroButtonStyle={setHeroButtonStyle}
        setHeroButtonText={setHeroButtonText}
        setHeroButtonTextColor={setHeroButtonTextColor}
        setHeroManifesto={setHeroManifesto}
        setHeroManifestoFontAlignment={setHeroManifestoFontAlignment}
        setHeroManifestoFontColor={setHeroManifestoFontColor}
        setHeroManifestoFontSize={setHeroManifestoFontSize}
        setHeroManifestoFontType={setHeroManifestoFontType}
        setHeroManifestoFontWeight={setHeroManifestoFontWeight}
        setHeroTemplate={setHeroTemplate}
        setHeroTitle={setHeroTitle}
        setHeroTitleFontAlignment={setHeroTitleFontAlignment}
        setHeroTitleFontColor={setHeroTitleFontColor}
        setHeroTitleFontSize={setHeroTitleFontSize}
        setHeroTitleFontType={setHeroTitleFontType}
        setHeroTitleFontWeight={setHeroTitleFontWeight}
        setImageFront={setImageFront}
        setIsDeletingProduct={setIsDeletingProduct}
        setIsEditing={setIsEditing}
        setName={setName}
        setNewCategoryName={setNewCategoryName}
        setOpenCategoryIndex={setOpenCategoryIndex}
        setOptions={setOptions}
        setRenameCategoryNewName={setRenameCategoryNewName}
        setRenameCategoryTarget={setRenameCategoryTarget}
        setReturnStatusModalOpen={setReturnStatusModalOpen}
        setReturnStatusNotes={setReturnStatusNotes}
        setSelectedCustomer={setSelectedCustomer}
        setSelectedOrder={setSelectedOrder}
        setSelectedProductIds={setSelectedProductIds}
        setShowAddCategoryModal={setShowAddCategoryModal}
        setShowAddExistingToCategoryModal={setShowAddExistingToCategoryModal}
        setShowCategoryAddOptionsModal={setShowCategoryAddOptionsModal}
        setShowCrudModal={setShowCrudModal}
        setShowHeroButton={setShowHeroButton}
        setShowHeroManifesto={setShowHeroManifesto}
        setShowHeroTitle={setShowHeroTitle}
        setShowResetConfirmModal={setShowResetConfirmModal}
        showAddCategoryModal={showAddCategoryModal}
        showAddExistingToCategoryModal={showAddExistingToCategoryModal}
        showCategoryAddOptionsModal={showCategoryAddOptionsModal}
        showCrudModal={showCrudModal}
        showHeroButton={showHeroButton}
        showHeroManifesto={showHeroManifesto}
        showHeroTitle={showHeroTitle}
        showResetConfirmModal={showResetConfirmModal}
        successMessage={successMessage}
        uploading={uploading}
      />

      {isHeroCustomizerModalOpen && (
        <CustomizeLayoutModal
          isOpen={true}
          onClose={() => setIsHeroCustomizerModalOpen(false)}
          initialConfig={{
            titleText: heroTitle,
            titleFontType: heroTitleFontType,
            titleFontColor: heroTitleFontColor,
            titleFontSize: heroTitleFontSize,
            titleFontAlignment: heroTitleFontAlignment,
            titleFontWeight: heroTitleFontWeight,
            showTitle: showHeroTitle,

            manifestoText: heroManifesto,
            manifestoFontType: heroManifestoFontType,
            manifestoFontColor: heroManifestoFontColor,
            manifestoFontSize: heroManifestoFontSize,
            manifestoFontAlignment: heroManifestoFontAlignment,
            manifestoFontWeight: heroManifestoFontWeight,
            showManifesto: showHeroManifesto,

            buttonText: heroButtonText,
            buttonStyle: heroButtonStyle,
            buttonSize: heroButtonSize,
            buttonColor: heroButtonColor,
            buttonTextColor: heroButtonTextColor,
            showButton: showHeroButton,

            layoutTemplate: heroTemplate,
            bgType: heroBgType,
            bgColor: heroBgColor,
            bgImage: heroBgImage,
            bgVideo: heroBgVideo,

            mobileLayoutTemplate: mobileHeroTemplate,
            mobileTitleText: mobileHeroTitle,
            mobileTitleFontType: mobileHeroTitleFontType,
            mobileTitleFontColor: mobileHeroTitleFontColor,
            mobileTitleFontSize: mobileHeroTitleFontSize,
            mobileTitleFontAlignment: mobileHeroTitleFontAlignment,
            mobileTitleFontWeight: mobileHeroTitleFontWeight,
            showMobileHeroTitle: showMobileHeroTitle,

            mobileManifestoText: mobileHeroManifesto,
            mobileManifestoFontType: mobileHeroManifestoFontType,
            mobileManifestoFontColor: mobileHeroManifestoFontColor,
            mobileManifestoFontSize: mobileHeroManifestoFontSize,
            mobileManifestoFontAlignment: mobileHeroManifestoFontAlignment,
            mobileManifestoFontWeight: mobileHeroManifestoFontWeight,
            showMobileHeroManifesto: showMobileHeroManifesto,

            mobileButtonText: mobileHeroButtonText,
            mobileButtonStyle: mobileHeroButtonStyle,
            mobileButtonSize: mobileHeroButtonSize,
            mobileButtonColor: mobileHeroButtonColor,
            mobileButtonTextColor: mobileHeroButtonTextColor,
            showMobileHeroButton: showMobileHeroButton,
          }}
          onApply={(config) => {
            setHeroTitle(config.titleText);
            setHeroTitleFontType(config.titleFontType);
            setHeroTitleFontColor(config.titleFontColor);
            setHeroTitleFontSize(config.titleFontSize);
            setHeroTitleFontAlignment(config.titleFontAlignment);
            setHeroTitleFontWeight(config.titleFontWeight);
            setShowHeroTitle(config.showTitle);

            setHeroManifesto(config.manifestoText);
            setHeroManifestoFontType(config.manifestoFontType);
            setHeroManifestoFontColor(config.manifestoFontColor);
            setHeroManifestoFontSize(config.manifestoFontSize);
            setHeroManifestoFontAlignment(config.manifestoFontAlignment);
            setHeroManifestoFontWeight(config.manifestoFontWeight);
            setShowHeroManifesto(config.showManifesto);

            setHeroButtonText(config.buttonText);
            setHeroButtonStyle(config.buttonStyle);
            setHeroButtonSize(config.buttonSize);
            setHeroButtonColor(config.buttonColor);
            setHeroButtonTextColor(config.buttonTextColor);
            setShowHeroButton(config.showButton);

            setHeroTemplate(config.layoutTemplate);
            if (config.bgType) setHeroBgType(config.bgType);
            if (config.bgColor) setHeroBgColor(config.bgColor);
            if (config.bgImage !== undefined) setHeroBgImage(config.bgImage);
            if (config.bgVideo !== undefined) setHeroBgVideo(config.bgVideo);

            if (config.mobileLayoutTemplate) setMobileHeroTemplate(config.mobileLayoutTemplate);
            if (config.mobileTitleText !== undefined) setMobileHeroTitle(config.mobileTitleText);
            if (config.mobileTitleFontType) setMobileHeroTitleFontType(config.mobileTitleFontType);
            if (config.mobileTitleFontColor) setMobileHeroTitleFontColor(config.mobileTitleFontColor);
            if (config.mobileTitleFontSize) setMobileHeroTitleFontSize(config.mobileTitleFontSize);
            if (config.mobileTitleFontAlignment) setMobileHeroTitleFontAlignment(config.mobileTitleFontAlignment);
            if (config.mobileTitleFontWeight) setMobileHeroTitleFontWeight(config.mobileTitleFontWeight);
            if (config.showMobileHeroTitle !== undefined) setShowMobileHeroTitle(config.showMobileHeroTitle);

            if (config.mobileManifestoText !== undefined) setMobileHeroManifesto(config.mobileManifestoText);
            if (config.mobileManifestoFontType) setMobileHeroManifestoFontType(config.mobileManifestoFontType);
            if (config.mobileManifestoFontColor) setMobileHeroManifestoFontColor(config.mobileManifestoFontColor);
            if (config.mobileManifestoFontSize) setMobileHeroManifestoFontSize(config.mobileManifestoFontSize);
            if (config.mobileManifestoFontAlignment) setMobileHeroManifestoFontAlignment(config.mobileManifestoFontAlignment);
            if (config.mobileManifestoFontWeight) setMobileHeroManifestoFontWeight(config.mobileManifestoFontWeight);
            if (config.showMobileHeroManifesto !== undefined) setShowMobileHeroManifesto(config.showMobileHeroManifesto);

            if (config.mobileButtonText !== undefined) setMobileHeroButtonText(config.mobileButtonText);
            if (config.mobileButtonStyle !== undefined) setMobileHeroButtonStyle(config.mobileButtonStyle);
            if (config.mobileButtonSize !== undefined) setMobileHeroButtonSize(config.mobileButtonSize);
            if (config.mobileButtonColor !== undefined) setMobileHeroButtonColor(config.mobileButtonColor);
            if (config.mobileButtonTextColor !== undefined) setMobileHeroButtonTextColor(config.mobileButtonTextColor);
            if (config.showMobileHeroButton !== undefined) setShowMobileHeroButton(config.showMobileHeroButton);

            setIsHeroCustomizerModalOpen(false);
          }}
          sectionName="Hero Section"
          primaryColor={primaryColor}
        />
      )}

      {isVideoCustomizerModalOpen && (
        <CustomizeLayoutModal
          isOpen={true}
          onClose={() => setIsVideoCustomizerModalOpen(false)}
          initialConfig={{
            titleText: videoTitle,
            titleFontType: videoTitleFontType,
            titleFontColor: videoTitleFontColor,
            titleFontSize: videoTitleFontSize,
            titleFontAlignment: videoTitleFontAlignment,
            titleFontWeight: videoTitleFontWeight,
            showTitle: showVideoTitle,

            manifestoText: videoSubtitle,
            manifestoFontType: videoSubtitleFontType,
            manifestoFontColor: videoSubtitleFontColor,
            manifestoFontSize: videoSubtitleFontSize,
            manifestoFontAlignment: videoSubtitleFontAlignment,
            manifestoFontWeight: videoSubtitleFontWeight,
            showManifesto: showVideoSubtitle,

            buttonText: videoButtonText,
            buttonStyle: videoButtonStyle,
            buttonSize: videoButtonSize,
            buttonColor: videoButtonColor,
            buttonTextColor: videoButtonTextColor,
            showButton: showVideoButton,

            layoutTemplate: videoTemplate,
            bgType: videoBgType,
            bgColor: videoBgColor,
            bgImage: videoBgImage,
            bgVideo: videoUrl,

            mobileLayoutTemplate: mobileVideoTemplate,
            mobileTitleText: mobileVideoTitle,
            mobileTitleFontType: mobileVideoTitleFontType,
            mobileTitleFontColor: mobileVideoTitleFontColor,
            mobileTitleFontSize: mobileVideoTitleFontSize,
            mobileTitleFontAlignment: mobileVideoTitleFontAlignment,
            mobileTitleFontWeight: mobileVideoTitleFontWeight,
            showMobileHeroTitle: showMobileVideoTitle,

            mobileManifestoText: mobileVideoSubtitle,
            mobileManifestoFontType: mobileVideoSubtitleFontType,
            mobileManifestoFontColor: mobileVideoSubtitleFontColor,
            mobileManifestoFontSize: mobileVideoSubtitleFontSize,
            mobileManifestoFontAlignment: mobileVideoSubtitleFontAlignment,
            mobileManifestoFontWeight: mobileVideoSubtitleFontWeight,
            showMobileHeroManifesto: showMobileVideoSubtitle,

            mobileButtonText: mobileVideoButtonText,
            mobileButtonStyle: mobileVideoButtonStyle,
            mobileButtonSize: mobileVideoButtonSize,
            mobileButtonColor: mobileVideoButtonColor,
            mobileButtonTextColor: mobileVideoButtonTextColor,
            showMobileHeroButton: showMobileVideoButton,
          }}
          onApply={(config) => {
            setVideoTitle(config.titleText);
            setVideoTitleFontType(config.titleFontType);
            setVideoTitleFontColor(config.titleFontColor);
            setVideoTitleFontSize(config.titleFontSize);
            setVideoTitleFontAlignment(config.titleFontAlignment);
            setVideoTitleFontWeight(config.titleFontWeight);
            setShowVideoTitle(config.showTitle);

            setVideoSubtitle(config.manifestoText);
            setVideoSubtitleFontType(config.manifestoFontType);
            setVideoSubtitleFontColor(config.manifestoFontColor);
            setVideoSubtitleFontSize(config.manifestoFontSize);
            setVideoSubtitleFontAlignment(config.manifestoFontAlignment);
            setVideoSubtitleFontWeight(config.manifestoFontWeight);
            setShowVideoSubtitle(config.showManifesto);

            setVideoButtonText(config.buttonText);
            setVideoButtonStyle(config.buttonStyle);
            setVideoButtonSize(config.buttonSize);
            setVideoButtonColor(config.buttonColor);
            setVideoButtonTextColor(config.buttonTextColor);
            setShowVideoButton(config.showButton);

            setVideoTemplate(config.layoutTemplate);
            if (config.bgType) setVideoBgType(config.bgType);
            if (config.bgColor) setVideoBgColor(config.bgColor);
            if (config.bgImage !== undefined) setVideoBgImage(config.bgImage);
            if (config.bgVideo !== undefined) setVideoUrl(config.bgVideo);

            if (config.mobileLayoutTemplate) setMobileVideoTemplate(config.mobileLayoutTemplate);
            if (config.mobileTitleText !== undefined) setMobileVideoTitle(config.mobileTitleText);
            if (config.mobileTitleFontType) setMobileVideoTitleFontType(config.mobileTitleFontType);
            if (config.mobileTitleFontColor) setMobileVideoTitleFontColor(config.mobileTitleFontColor);
            if (config.mobileTitleFontSize) setMobileVideoTitleFontSize(config.mobileTitleFontSize);
            if (config.mobileTitleFontAlignment) setMobileVideoTitleFontAlignment(config.mobileTitleFontAlignment);
            if (config.mobileTitleFontWeight) setMobileVideoTitleFontWeight(config.mobileTitleFontWeight);
            if (config.showMobileHeroTitle !== undefined) setShowMobileVideoTitle(config.showMobileHeroTitle);

            if (config.mobileManifestoText !== undefined) setMobileVideoSubtitle(config.mobileManifestoText);
            if (config.mobileManifestoFontType) setMobileVideoSubtitleFontType(config.mobileManifestoFontType);
            if (config.mobileManifestoFontColor) setMobileVideoSubtitleFontColor(config.mobileManifestoFontColor);
            if (config.mobileManifestoFontSize) setMobileVideoSubtitleFontSize(config.mobileManifestoFontSize);
            if (config.mobileManifestoFontAlignment) setMobileVideoSubtitleFontAlignment(config.mobileManifestoFontAlignment);
            if (config.mobileManifestoFontWeight) setMobileVideoSubtitleFontWeight(config.mobileManifestoFontWeight);
            if (config.showMobileHeroManifesto !== undefined) setShowMobileVideoSubtitle(config.showMobileHeroManifesto);

            if (config.mobileButtonText !== undefined) setMobileVideoButtonText(config.mobileButtonText);
            if (config.mobileButtonStyle !== undefined) setMobileVideoButtonStyle(config.mobileButtonStyle);
            if (config.mobileButtonSize !== undefined) setMobileVideoButtonSize(config.mobileButtonSize);
            if (config.mobileButtonColor !== undefined) setMobileVideoButtonColor(config.mobileButtonColor);
            if (config.mobileButtonTextColor !== undefined) setMobileVideoButtonTextColor(config.mobileButtonTextColor);
            if (config.showMobileHeroButton !== undefined) setShowMobileVideoButton(config.showMobileHeroButton);



            setIsVideoCustomizerModalOpen(false);
          }}
          sectionName="Video Section"
          primaryColor={primaryColor}
        />
      )}

      {isLifestyleCustomizerModalOpen && (
        <CustomizeLayoutModal
          isOpen={true}
          onClose={() => setIsLifestyleCustomizerModalOpen(false)}
          initialConfig={{
            titleText: lifestyleText,
            titleFontType: lifestyleTextFontType,
            titleFontColor: lifestyleTextFontColor,
            titleFontSize: lifestyleTextFontSize,
            titleFontAlignment: lifestyleTextFontAlignment,
            titleFontWeight: lifestyleTextFontWeight,
            showTitle: showLifestyleText,

            showButton: showLifestyleButton,
            buttonText: lifestyleButtonText,
            buttonStyle: lifestyleButtonStyle,
            buttonSize: lifestyleButtonSize,
            buttonColor: lifestyleButtonColor,
            buttonTextColor: lifestyleButtonTextColor,

            bgType: "image",
            bgImage: lifestyleImage,

            mobileTitleText: mobileLifestyleText !== undefined ? mobileLifestyleText : lifestyleText,
            mobileTitleFontType: mobileLifestyleTextFontType,
            mobileTitleFontColor: mobileLifestyleTextFontColor,
            mobileTitleFontSize: mobileLifestyleTextFontSize,
            mobileTitleFontAlignment: mobileLifestyleTextFontAlignment,
            mobileTitleFontWeight: mobileLifestyleTextFontWeight,
            showMobileHeroTitle: showMobileLifestyleText !== undefined ? showMobileLifestyleText : showLifestyleText,

            showMobileHeroButton: showMobileLifestyleButton,
            mobileButtonText: mobileLifestyleButtonText,
            mobileButtonStyle: mobileLifestyleButtonStyle,
            mobileButtonSize: mobileLifestyleButtonSize,
            mobileButtonColor: mobileLifestyleButtonColor,
            mobileButtonTextColor: mobileLifestyleButtonTextColor,
          }}
          onApply={(config) => {
            if (config.titleText !== undefined) setLifestyleText(config.titleText);
            if (config.titleFontType !== undefined) setLifestyleTextFontType(config.titleFontType);
            if (config.titleFontColor !== undefined) setLifestyleTextFontColor(config.titleFontColor);
            if (config.titleFontSize !== undefined) setLifestyleTextFontSize(config.titleFontSize);
            if (config.titleFontAlignment !== undefined) setLifestyleTextFontAlignment(config.titleFontAlignment);
            if (config.titleFontWeight !== undefined) setLifestyleTextFontWeight(config.titleFontWeight);
            if (config.showTitle !== undefined) setShowLifestyleText(config.showTitle);

            if (config.showButton !== undefined) setShowLifestyleButton(config.showButton);
            if (config.buttonText !== undefined) setLifestyleButtonText(config.buttonText);
            if (config.buttonStyle !== undefined) setLifestyleButtonStyle(config.buttonStyle);
            if (config.buttonSize !== undefined) setLifestyleButtonSize(config.buttonSize);
            if (config.buttonColor !== undefined) setLifestyleButtonColor(config.buttonColor);
            if (config.buttonTextColor !== undefined) setLifestyleButtonTextColor(config.buttonTextColor);

            if (config.bgImage && config.bgImage.trim() !== "") setLifestyleImage(config.bgImage);

            if (config.mobileTitleText !== undefined) setMobileLifestyleText(config.mobileTitleText);
            if (config.mobileTitleFontType !== undefined) setMobileLifestyleTextFontType(config.mobileTitleFontType);
            if (config.mobileTitleFontColor !== undefined) setMobileLifestyleTextFontColor(config.mobileTitleFontColor);
            if (config.mobileTitleFontSize !== undefined) setMobileLifestyleTextFontSize(config.mobileTitleFontSize);
            if (config.mobileTitleFontAlignment !== undefined) setMobileLifestyleTextFontAlignment(config.mobileTitleFontAlignment);
            if (config.mobileTitleFontWeight !== undefined) setMobileLifestyleTextFontWeight(config.mobileTitleFontWeight);
            if (config.showMobileHeroTitle !== undefined) setShowMobileLifestyleText(config.showMobileHeroTitle);

            if (config.showMobileHeroButton !== undefined) setShowMobileLifestyleButton(config.showMobileHeroButton);
            if (config.mobileButtonText !== undefined) setMobileLifestyleButtonText(config.mobileButtonText);
            if (config.mobileButtonStyle !== undefined) setMobileLifestyleButtonStyle(config.mobileButtonStyle);
            if (config.mobileButtonSize !== undefined) setMobileLifestyleButtonSize(config.mobileButtonSize);
            if (config.mobileButtonColor !== undefined) setMobileLifestyleButtonColor(config.mobileButtonColor);
            if (config.mobileButtonTextColor !== undefined) setMobileLifestyleButtonTextColor(config.mobileButtonTextColor);

            setIsLifestyleCustomizerModalOpen(false);
          }}
          sectionName="Lifestyle Banner"
          primaryColor={primaryColor}
        />
      )}
    </div>
  );
}
