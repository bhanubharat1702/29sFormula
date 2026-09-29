import mongoose from "mongoose";

// Define Settings Schema
const settingsSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", index: true },
  tickerText: { 
    type: String, 
    default: "7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | 7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | 7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | " 
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
  mobileVideoButtonSize: { type: String, default: "sm" },
  mobileVideoButtonColor: { type: String, default: "#ffffff" },
  mobileVideoButtonTextColor: { type: String, default: "#000000" },
  showMobileVideoButton: { type: Boolean, default: true },

  lifestyleText: { type: String, default: "Uncompromising Quality, Curated for You." },
  lifestyleTextFontType: { type: String, default: "Outfit" },
  lifestyleTextFontColor: { type: String, default: "#ffffff" },
  lifestyleTextFontSize: { type: String, default: "2.5rem" },
  lifestyleTextFontAlignment: { type: String, default: "center" },
  lifestyleTextFontWeight: { type: String, default: "700" },
  showLifestyleText: { type: Boolean, default: true },
  showLifestyleButton: { type: Boolean, default: true },
  lifestyleButtonText: { type: String, default: "Shop Now" },
  lifestyleButtonStyle: { type: String, default: "solid" },
  lifestyleButtonSize: { type: String, default: "md" },
  lifestyleButtonColor: { type: String, default: "#ffffff" },
  lifestyleButtonTextColor: { type: String, default: "#000000" },
  lifestyleImage: { type: String, default: "https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80" },

  mobileLifestyleText: { type: String, default: "" },
  mobileLifestyleTextFontType: { type: String, default: "Outfit" },
  mobileLifestyleTextFontColor: { type: String, default: "#ffffff" },
  mobileLifestyleTextFontSize: { type: String, default: "1.8rem" },
  mobileLifestyleTextFontAlignment: { type: String, default: "center" },
  mobileLifestyleTextFontWeight: { type: String, default: "700" },
  showMobileLifestyleText: { type: Boolean, default: true },
  showMobileLifestyleButton: { type: Boolean, default: true },
  mobileLifestyleButtonText: { type: String, default: "Shop Now" },
  mobileLifestyleButtonStyle: { type: String, default: "solid" },
  mobileLifestyleButtonSize: { type: String, default: "sm" },
  mobileLifestyleButtonColor: { type: String, default: "#ffffff" },
  mobileLifestyleButtonTextColor: { type: String, default: "#000000" },
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
  googleClientId: { type: String, default: "523936375845-75tjhav8ce01o9mdk325iggb1glgpi21.apps.googleusercontent.com" },
  // Product Preview Page Settings
  showProductReviews: { type: Boolean, default: true },
  showProductExploreMore: { type: Boolean, default: true },
  showProductFaq: { type: Boolean, default: true },
  usageGuideText: { 
    type: String, 
    default: "Handcrafted with precision. Refer to our USAGE GUIDE for additional details." 
  },
  exploreMoreTitle: { 
    type: String, 
    default: "Don't Stop. Explore More." 
  },
  deliverySubtext: {
    type: String,
    default: "TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT."
  },
  contactUsText: { 
    type: String, 
    default: "Need help? Email us at support@yourstore.com and our support team will get back to you within 24 hours."
  },
  returnPolicyText: {
    type: String,
    default: "We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund."
  },
  
  supportText: { type: String, default: "For support inquiries, please contact us." },
  careersText: { type: String, default: "Join our team! Check out our open positions." },
  tradeEnquiryText: { type: String, default: "For trade and wholesale inquiries, contact our B2B team." },
  aboutUsText: { type: String, default: "We deliver quality products with exceptional customer service." },
  
  instagramLink: { type: String, default: "#" },
  facebookLink: { type: String, default: "#" },
  contactLink: { type: String, default: "#" },
  shippingPolicyText: {
    type: String,
    default: "We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days."
  },
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
