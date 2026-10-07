import mongoose from "mongoose";
import { encrypt, isEncrypted } from "../utils/encryptionHelper.js";

// Define Settings Schema
const settingsSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", index: true },
  tickerText: {
    type: String,
    default: "7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | 7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | 7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | "
  },
  tickerDirection: {
    type: String,
    default: "left"
  },
  tickerSpeed: {
    type: Number,
    default: 60
  },
  tickerBgColor: {
    type: String,
    default: "#ffffff"
  },
  tickerTextColor: {
    type: String,
    default: "#000000"
  },
  announcementText: {
    type: String,
    default: "EVERY ORDER IS PREPARED WITH CARE. DUE TO SEASONAL DEMAND, PROCESSING MAY TAKE UP TO 5-7 DAYS BEFORE DISPATCH."
  },
  heroTitle: { type: String, default: "WELCOME TO OUR STORE" },
  heroTitleFontType: { type: String, default: "Outfit" },
  heroTitleFontColor: { type: String, default: "#ffffff" },
  heroTitleFontSize: { type: String, default: "4.5rem" },
  heroTitleFontAlignment: { type: String, default: "center" },
  heroTitleFontWeight: { type: String, default: "700" },
  heroManifesto: {
    type: String,
    default: "PREMIUM QUALITY YOU CAN TRUST. EVERY PRODUCT IS CRAFTED WITH CARE AND DELIVERED WITH PASSION."
  },
  heroBgType: { type: String, default: "color" },
  heroBgColor: { type: String, default: "#121212" },
  heroBgImage: { type: String, default: "" },
  heroBgVideo: { type: String, default: "" },
  heroManifestoFontType: { type: String, default: "Outfit" },
  heroManifestoFontColor: { type: String, default: "#ffffff" },
  heroManifestoFontSize: { type: String, default: "1.1rem" },
  heroManifestoFontAlignment: { type: String, default: "center" },
  heroManifestoFontWeight: { type: String, default: "600" },
  heroTemplate: { type: String, default: "center" },
  showHeroTitle: { type: Boolean, default: true },
  showHeroManifesto: { type: Boolean, default: true },
  showHeroButton: { type: Boolean, default: true },
  heroButtonText: { type: String, default: "Shop Now" },
  heroButtonStyle: { type: String, default: "solid" },
  heroButtonSize: { type: String, default: "md" },
  heroButtonColor: { type: String, default: "#ffffff" },
  heroButtonTextColor: { type: String, default: "#000000" },
  heroAutoPlay: { type: Boolean, default: true },
  heroAutoPlaySpeed: { type: Number, default: 5 },
  heroSlides: {
    type: [{
      id: { type: String },
      titleText: { type: String, default: "WELCOME TO OUR STORE" },
      titleFontType: { type: String, default: "Outfit" },
      titleFontColor: { type: String, default: "#ffffff" },
      titleFontSize: { type: String, default: "4.5rem" },
      titleFontAlignment: { type: String, default: "center" },
      titleFontWeight: { type: String, default: "700" },
      showTitle: { type: Boolean, default: true },

      manifestoText: { type: String, default: "PREMIUM QUALITY YOU CAN TRUST. EVERY PRODUCT IS CRAFTED WITH CARE AND DELIVERED WITH PASSION." },
      manifestoFontType: { type: String, default: "Outfit" },
      manifestoFontColor: { type: String, default: "#ffffff" },
      manifestoFontSize: { type: String, default: "1.1rem" },
      manifestoFontAlignment: { type: String, default: "center" },
      manifestoFontWeight: { type: String, default: "600" },
      showManifesto: { type: Boolean, default: true },

      buttonText: { type: String, default: "Shop Now" },
      buttonRedirectUrl: { type: String, default: "/shop" },
      buttonStyle: { type: String, default: "solid" },
      buttonSize: { type: String, default: "md" },
      buttonColor: { type: String, default: "#ffffff" },
      buttonTextColor: { type: String, default: "#000000" },
      showButton: { type: Boolean, default: true },

      layoutTemplate: { type: String, default: "center" },
      bgType: { type: String, default: "color" },
      bgColor: { type: String, default: "#121212" },
      bgImage: { type: String, default: "" },
      bgVideo: { type: String, default: "" },

      mobileLayoutTemplate: { type: String, default: "center" },
      mobileTitleText: { type: String, default: "" },
      mobileTitleFontType: { type: String, default: "Outfit" },
      mobileTitleFontColor: { type: String, default: "#ffffff" },
      mobileTitleFontSize: { type: String, default: "2.5rem" },
      mobileTitleFontAlignment: { type: String, default: "center" },
      mobileTitleFontWeight: { type: String, default: "700" },
      showMobileHeroTitle: { type: Boolean, default: true },

      mobileManifestoText: { type: String, default: "" },
      mobileManifestoFontType: { type: String, default: "Outfit" },
      mobileManifestoFontColor: { type: String, default: "#ffffff" },
      mobileManifestoFontSize: { type: String, default: "0.85rem" },
      mobileManifestoFontAlignment: { type: String, default: "center" },
      mobileManifestoFontWeight: { type: String, default: "500" },
      showMobileHeroManifesto: { type: Boolean, default: true },

      mobileButtonText: { type: String, default: "Shop Now" },
      mobileButtonStyle: { type: String, default: "solid" },
      mobileButtonSize: { type: String, default: "sm" },
      mobileButtonColor: { type: String, default: "#ffffff" },
      mobileButtonTextColor: { type: String, default: "#000000" },
      showMobileHeroButton: { type: Boolean, default: true },

      elementAnimation: { type: String, default: "none" },
      elementAnimationDuration: { type: Number, default: 0.6 },
      elementAnimationDelay: { type: Number, default: 0.1 },
      slideAnimation: { type: String, default: "none" },
      slideAnimationDuration: { type: Number, default: 0.5 },

      titleAnimation: { type: Object, default: { type: "none", duration: 0.6, delay: 0.1, order: 1 } },
      manifestoAnimation: { type: Object, default: { type: "none", duration: 0.6, delay: 0.25, order: 2 } },
      buttonAnimation: { type: Object, default: { type: "none", duration: 0.6, delay: 0.4, order: 3 } }
    }],
    default: []
  },

  // Mobile-specific Hero Layout
  mobileHeroTemplate: { type: String, default: "center" },
  mobileHeroTitle: { type: String, default: "" },
  mobileHeroTitleFontType: { type: String, default: "Outfit" },
  mobileHeroTitleFontColor: { type: String, default: "#ffffff" },
  mobileHeroTitleFontSize: { type: String, default: "2.5rem" },
  mobileHeroTitleFontAlignment: { type: String, default: "center" },
  mobileHeroTitleFontWeight: { type: String, default: "700" },
  showMobileHeroTitle: { type: Boolean, default: true },

  mobileHeroManifesto: { type: String, default: "" },
  mobileHeroManifestoFontType: { type: String, default: "Outfit" },
  mobileHeroManifestoFontColor: { type: String, default: "#ffffff" },
  mobileHeroManifestoFontSize: { type: String, default: "0.85rem" },
  mobileHeroManifestoFontAlignment: { type: String, default: "center" },
  mobileHeroManifestoFontWeight: { type: String, default: "500" },
  showMobileHeroManifesto: { type: Boolean, default: true },

  mobileHeroButtonText: { type: String, default: "Shop Now" },
  mobileHeroButtonStyle: { type: String, default: "solid" },
  mobileHeroButtonSize: { type: String, default: "sm" },
  mobileHeroButtonColor: { type: String, default: "#ffffff" },
  mobileHeroButtonTextColor: { type: String, default: "#000000" },
  showMobileHeroButton: { type: Boolean, default: true },
  videoTitle: { type: String, default: "NEW ARRIVALS" },
  videoSubtitle: { type: String, default: "Explore our latest arrivals crafted with care and premium quality." },
  videoUrl: { type: String, default: "" },
  videoFallbackColor: { type: String, default: "#121212" },
  videoTitleFontType: { type: String, default: "Outfit" },
  videoTitleFontColor: { type: String, default: "#ffffff" },
  videoTitleFontSize: { type: String, default: "3.5rem" },
  videoTitleFontAlignment: { type: String, default: "center" },
  videoTitleFontWeight: { type: String, default: "700" },
  videoSubtitleFontType: { type: String, default: "Outfit" },
  videoSubtitleFontColor: { type: String, default: "#ffffff" },
  videoSubtitleFontSize: { type: String, default: "1.1rem" },
  videoSubtitleFontAlignment: { type: String, default: "center" },
  videoSubtitleFontWeight: { type: String, default: "500" },
  videoTemplate: { type: String, default: "center" },
  showVideoTitle: { type: Boolean, default: true },
  showVideoSubtitle: { type: Boolean, default: true },
  showVideoButton: { type: Boolean, default: true },
  videoButtonText: { type: String, default: "Shop Now" },
  videoButtonStyle: { type: String, default: "outline" },
  videoButtonSize: { type: String, default: "md" },
  videoButtonColor: { type: String, default: "#ffffff" },
  videoButtonTextColor: { type: String, default: "#000000" },
  videoBgType: { type: String, default: "video" },
  videoBgColor: { type: String, default: "#121212" },
  videoBgImage: { type: String, default: "" },

  // Mobile-specific Video Layout
  mobileVideoTemplate: { type: String, default: "center" },
  mobileVideoTitle: { type: String, default: "" },
  mobileVideoTitleFontType: { type: String, default: "Outfit" },
  mobileVideoTitleFontColor: { type: String, default: "#ffffff" },
  mobileVideoTitleFontSize: { type: String, default: "2.5rem" },
  mobileVideoTitleFontAlignment: { type: String, default: "center" },
  mobileVideoTitleFontWeight: { type: String, default: "700" },
  showMobileVideoTitle: { type: Boolean, default: true },

  mobileVideoSubtitle: { type: String, default: "" },
  mobileVideoSubtitleFontType: { type: String, default: "Outfit" },
  mobileVideoSubtitleFontColor: { type: String, default: "#ffffff" },
  mobileVideoSubtitleFontSize: { type: String, default: "0.85rem" },
  mobileVideoSubtitleFontAlignment: { type: String, default: "center" },
  mobileVideoSubtitleFontWeight: { type: String, default: "500" },
  showMobileVideoSubtitle: { type: Boolean, default: true },

  mobileVideoButtonText: { type: String, default: "Shop Now" },
  mobileVideoButtonStyle: { type: String, default: "outline" },
  videoAutoPlay: { type: Boolean, default: true },
  videoAutoPlaySpeed: { type: Number, default: 5 },
  videoSlides: {
    type: [{
      id: { type: String },
      titleText: { type: String, default: "NEW ARRIVALS" },
      titleFontType: { type: String, default: "Outfit" },
      titleFontColor: { type: String, default: "#ffffff" },
      titleFontSize: { type: String, default: "3.5rem" },
      titleFontAlignment: { type: String, default: "center" },
      titleFontWeight: { type: String, default: "700" },
      showTitle: { type: Boolean, default: true },

      manifestoText: { type: String, default: "Explore our latest arrivals crafted with care and premium quality." },
      manifestoFontType: { type: String, default: "Outfit" },
      manifestoFontColor: { type: String, default: "#ffffff" },
      manifestoFontSize: { type: String, default: "1.1rem" },
      manifestoFontAlignment: { type: String, default: "center" },
      manifestoFontWeight: { type: String, default: "500" },
      showManifesto: { type: Boolean, default: true },

      buttonText: { type: String, default: "Shop Now" },
      buttonRedirectUrl: { type: String, default: "/shop" },
      buttonStyle: { type: String, default: "outline" },
      buttonSize: { type: String, default: "md" },
      buttonColor: { type: String, default: "#ffffff" },
      buttonTextColor: { type: String, default: "#000000" },
      showButton: { type: Boolean, default: true },

      layoutTemplate: { type: String, default: "center" },
      bgType: { type: String, default: "video" },
      bgColor: { type: String, default: "#121212" },
      bgImage: { type: String, default: "" },
      bgVideo: { type: String, default: "" },

      mobileLayoutTemplate: { type: String, default: "center" },
      mobileTitleText: { type: String, default: "" },
      mobileTitleFontType: { type: String, default: "Outfit" },
      mobileTitleFontColor: { type: String, default: "#ffffff" },
      mobileTitleFontSize: { type: String, default: "2.5rem" },
      mobileTitleFontAlignment: { type: String, default: "center" },
      mobileTitleFontWeight: { type: String, default: "700" },
      showMobileHeroTitle: { type: Boolean, default: true },

      mobileManifestoText: { type: String, default: "" },
      mobileManifestoFontType: { type: String, default: "Outfit" },
      mobileManifestoFontColor: { type: String, default: "#ffffff" },
      mobileManifestoFontSize: { type: String, default: "0.85rem" },
      mobileManifestoFontAlignment: { type: String, default: "center" },
      mobileManifestoFontWeight: { type: String, default: "500" },
      showMobileHeroManifesto: { type: Boolean, default: true },

      mobileButtonText: { type: String, default: "Shop Now" },
      mobileButtonStyle: { type: String, default: "outline" },
      mobileButtonSize: { type: String, default: "sm" },
      mobileButtonColor: { type: String, default: "#ffffff" },
      mobileButtonTextColor: { type: String, default: "#000000" },
      showMobileHeroButton: { type: Boolean, default: true },

      titleContainer: { type: Object },
      manifestoContainer: { type: Object },
      buttonContainer: { type: Object },
      mobileTitleContainer: { type: Object },
      mobileManifestoContainer: { type: Object },
      mobileButtonContainer: { type: Object },

      elementAnimation: { type: String, default: "none" },
      elementAnimationDuration: { type: Number, default: 0.6 },
      elementAnimationDelay: { type: Number, default: 0.1 },
      slideAnimation: { type: String, default: "none" },
      slideAnimationDuration: { type: Number, default: 0.5 },

      titleAnimation: { type: Object, default: { type: "none", duration: 0.6, delay: 0.1, order: 1 } },
      manifestoAnimation: { type: Object, default: { type: "none", duration: 0.6, delay: 0.25, order: 2 } },
      buttonAnimation: { type: Object, default: { type: "none", duration: 0.6, delay: 0.4, order: 3 } }
    }],
    default: []
  },

  lifestyleAutoPlay: { type: Boolean, default: true },
  lifestyleAutoPlaySpeed: { type: Number, default: 5 },
  lifestyleSlides: {
    type: [{
      id: { type: String },
      titleText: { type: String, default: "Uncompromising Quality, Curated for You." },
      titleFontType: { type: String, default: "Outfit" },
      titleFontColor: { type: String, default: "#ffffff" },
      titleFontSize: { type: String, default: "2.5rem" },
      titleFontAlignment: { type: String, default: "center" },
      titleFontWeight: { type: String, default: "700" },
      showTitle: { type: Boolean, default: true },

      manifestoText: { type: String, default: "" },
      manifestoFontType: { type: String, default: "Outfit" },
      manifestoFontColor: { type: String, default: "#ffffff" },
      manifestoFontSize: { type: String, default: "1.1rem" },
      manifestoFontAlignment: { type: String, default: "center" },
      manifestoFontWeight: { type: String, default: "500" },
      showManifesto: { type: Boolean, default: false },

      buttonText: { type: String, default: "Shop Now" },
      buttonRedirectUrl: { type: String, default: "/shop" },
      buttonStyle: { type: String, default: "solid" },
      buttonSize: { type: String, default: "md" },
      buttonColor: { type: String, default: "#ffffff" },
      buttonTextColor: { type: String, default: "#000000" },
      showButton: { type: Boolean, default: true },

      layoutTemplate: { type: String, default: "center" },
      bgType: { type: String, default: "image" },
      bgColor: { type: String, default: "#000000" },
      bgImage: { type: String, default: "" },
      bgVideo: { type: String, default: "" },

      mobileLayoutTemplate: { type: String, default: "center" },
      mobileTitleText: { type: String, default: "" },
      mobileTitleFontType: { type: String, default: "Outfit" },
      mobileTitleFontColor: { type: String, default: "#ffffff" },
      mobileTitleFontSize: { type: String, default: "1.8rem" },
      mobileTitleFontAlignment: { type: String, default: "center" },
      mobileTitleFontWeight: { type: String, default: "700" },
      showMobileHeroTitle: { type: Boolean, default: true },

      mobileManifestoText: { type: String, default: "" },
      mobileManifestoFontType: { type: String, default: "Outfit" },
      mobileManifestoFontColor: { type: String, default: "#ffffff" },
      mobileManifestoFontSize: { type: String, default: "0.85rem" },
      mobileManifestoFontAlignment: { type: String, default: "center" },
      mobileManifestoFontWeight: { type: String, default: "500" },
      showMobileHeroManifesto: { type: Boolean, default: false },

      mobileButtonText: { type: String, default: "Shop Now" },
      mobileButtonStyle: { type: String, default: "solid" },
      mobileButtonSize: { type: String, default: "sm" },
      mobileButtonColor: { type: String, default: "#ffffff" },
      mobileButtonTextColor: { type: String, default: "#000000" },
      showMobileHeroButton: { type: Boolean, default: true },

      titleContainer: { type: Object },
      manifestoContainer: { type: Object },
      buttonContainer: { type: Object },
      mobileTitleContainer: { type: Object },
      mobileManifestoContainer: { type: Object },
      mobileButtonContainer: { type: Object },

      elementAnimation: { type: String, default: "none" },
      elementAnimationDuration: { type: Number, default: 0.6 },
      elementAnimationDelay: { type: Number, default: 0.1 },
      slideAnimation: { type: String, default: "none" },
      slideAnimationDuration: { type: Number, default: 0.5 },

      titleAnimation: { type: Object, default: { type: "none", duration: 0.6, delay: 0.1, order: 1 } },
      manifestoAnimation: { type: Object, default: { type: "none", duration: 0.6, delay: 0.25, order: 2 } },
      buttonAnimation: { type: Object, default: { type: "none", duration: 0.6, delay: 0.4, order: 3 } }
    }],
    default: []
  },

  primaryColor: { type: String, default: "#ffffff" },
  brandLogoType: { type: String, default: "text" },
  brandLogoValue: { type: String, default: "MY STORE" },
  showTicker: { type: Boolean, default: true },
  showTrustMarquee: { type: Boolean, default: true },
  trustMarqueeDirection: { type: String, default: "left" },
  trustMarqueeSpeed: { type: Number, default: 35 },
  trustMarqueeItems: {
    type: [{
      id: { type: String },
      title: { type: String },
      subtitle: { type: String },
      icon: { type: String, default: "shipping" }
    }],
    default: [
      { id: "shipping", title: "EXPRESS SHIPPING", subtitle: "Fast Dispatch", icon: "shipping" },
      { id: "security", title: "100% SECURE CHECKOUT", subtitle: "256-Bit SSL Encrypted", icon: "security" },
      { id: "authenticity", title: "100% GENUINE PRODUCTS", subtitle: "100% Original Guarantee", icon: "authenticity" },
      { id: "returns", title: "EASY 7-DAY RETURNS", subtitle: "Hassle-Free Policy", icon: "returns" },
      { id: "support", title: "24/7 CUSTOMER SUPPORT", subtitle: "Dedicated Assistance", icon: "support" }
    ]
  },
  showAnnouncement: { type: Boolean, default: true },
  showVideo: { type: Boolean, default: true },
  showLifestyle: { type: Boolean, default: true },
  faqs: {
    type: [{ question: String, answer: String }],
    default: []
  },
  // Account & Store Address
  storeAddress1: { type: String, default: "" },
  storeAddress2: { type: String, default: "" },
  storeCity: { type: String, default: "" },
  storeState: { type: String, default: "" },
  storePostalCode: { type: String, default: "" },
  storeLanguage: { type: String, default: "en" },

  // Payments & Checkout - Multi-Gateway Configuration
  activePaymentGateway: { type: String, default: "razorpay" }, // 'razorpay', 'stripe', 'paypal', 'phonepe', 'paytm'

  // Razorpay
  razorpayKeyId: { type: String, default: "" },
  razorpayKeySecret: { type: String, default: "" },
  razorpayMode: { type: String, default: "test" },

  // Stripe
  stripePublishableKey: { type: String, default: "" },
  stripeSecretKey: { type: String, default: "" },
  stripeMode: { type: String, default: "test" },

  // PayPal
  paypalClientId: { type: String, default: "" },
  paypalClientSecret: { type: String, default: "" },
  paypalMode: { type: String, default: "sandbox" },

  // PhonePe
  phonepeMerchantId: { type: String, default: "" },
  phonepeSaltKey: { type: String, default: "" },
  phonepeSaltIndex: { type: String, default: "1" },
  phonepeMode: { type: String, default: "uat" },

  // PayTM
  paytmMerchantId: { type: String, default: "" },
  paytmMerchantKey: { type: String, default: "" },
  paytmWebsite: { type: String, default: "WEBSTAGING" },
  paytmMode: { type: String, default: "staging" },
  codEnabled: { type: Boolean, default: true },
  codExtraFee: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  maxItemQuantity: { type: Number, default: 0 },
  customerAccounts: { type: String, default: "optional" },
  taxInclusive: { type: Boolean, default: false },
  taxRate: { type: Number, default: 0 },
  taxNumber: { type: String, default: "" },

  // Contact Info
  ownerEmail: { type: String, default: "" },
  ownerPhone: { type: String, default: "" },
  supportEmail: { type: String, default: "" },
  supportPhone: { type: String, default: "" },

  // Shipping
  freeShippingThreshold: { type: Number, default: 0 },
  standardShippingRate: { type: Number, default: 0 },
  expressShippingRate: { type: Number, default: 0 },
  estimatedDelivery: { type: String, default: "4-7 business days" },
  processingTime: { type: String, default: "1-2 business days" },

  // Notifications & Email
  brevoApiKey: { type: String, default: "" },
  senderEmail: { type: String, default: "" },
  senderName: { type: String, default: "" },
  adminNotifyEmail: { type: String, default: "" },
  notifyOrderConfirm: { type: Boolean, default: true },
  notifyOrderShipped: { type: Boolean, default: true },
  notifyOrderDelivered: { type: Boolean, default: true },
  notifyOrderRefund: { type: Boolean, default: true },

  // Integrations & Secrets
  googleClientId: { type: String, default: "523936375845-75tjhav8ce01o9mdk325iggb1glgpi21.apps.googleusercontent.com" },
  googleClientSecret: { type: String, default: "" },
  cloudinaryCloudName: { type: String, default: "" },
  cloudinaryApiKey: { type: String, default: "" },
  cloudinaryApiSecret: { type: String, default: "" },

  // SEO & Analytics
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  favicon: { type: String, default: "" },
  googleAnalyticsId: { type: String, default: "" },
  facebookPixelId: { type: String, default: "" },

  // Social
  twitterLink: { type: String, default: "#" },
  youtubeLink: { type: String, default: "#" },

  // Policies
  privacyPolicyText: { type: String, default: "" },
  termsOfServiceText: { type: String, default: "" }
}, { timestamps: true });

// Pre-save hook to encrypt sensitive gateway keys securely before persisting to Database
settingsSchema.pre("save", function () {
  const secretFields = [
    "razorpayKeySecret",
    "stripeSecretKey",
    "paypalClientSecret",
    "phonepeSaltKey",
    "paytmMerchantKey"
  ];

  secretFields.forEach((field) => {
    if (this.isModified(field) && this[field] && typeof this[field] === "string" && !isEncrypted(this[field])) {
      this[field] = encrypt(this[field]);
    }
  });
});

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
