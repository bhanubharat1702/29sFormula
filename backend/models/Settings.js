import mongoose from "mongoose";

// Define Settings Schema
const settingsSchema = new mongoose.Schema({
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
    default: "EVERY BOTTLE IS PREPARED WITH CARE. DUE TO SEASONAL DEMAND, PROCESSING MAY TAKE UP TO 5-7 DAYS BEFORE DISPATCH." 
  },
  heroTitle: { type: String, default: "29sFORMULA" },
  heroTitleFontType: { type: String, default: "Outfit" },
  heroTitleFontColor: { type: String, default: "#111827" },
  heroTitleFontSize: { type: String, default: "4.5rem" },
  heroTitleFontAlignment: { type: String, default: "center" },
  heroTitleFontWeight: { type: String, default: "700" },
  heroManifesto: { 
    type: String, 
    default: "SCENT IS THE DIFFERENCE YOU FEEL AND NEVER FAKE. EVERY 29S FORMULA BOTTLE IS CRAFTED BY HANDS THAT CARE, NOT MACHINES THAT RUSH." 
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
  heroButtonColor: { type: String, default: "" },
  heroButtonTextColor: { type: String, default: "#ffffff" },
            videoTitle: { type: String, default: "NEW ARRIVALS" },
  videoSubtitle: { type: String, default: "Drop's live. Smells divine. Feels better." },
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
  videoButtonTextColor: { type: String, default: "#121212" },
  videoBgType: { type: String, default: "video" },
  videoBgColor: { type: String, default: "#121212" },
  videoBgImage: { type: String, default: "" },

  lifestyleText: { type: String, default: "Intense notes, Raw elements. This is 29sFORMULA." },
  lifestyleImage: { type: String, default: "https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80" },
  primaryColor: { type: String, default: "#57bc74" },
  brandLogoType: { type: String, default: "text" },
  brandLogoValue: { type: String, default: "29sFORMULA" },
  showTicker: { type: Boolean, default: true },
  showAnnouncement: { type: Boolean, default: true },
  showVideo: { type: Boolean, default: true },
  showLifestyle: { type: Boolean, default: true },
  faqs: {
    type: [{ question: String, answer: String }],
    default: []
  },
  googleClientId: { type: String, default: "753896502014-yourmockclientid.apps.googleusercontent.com" },
  // Product Preview Page Settings
  showProductReviews: { type: Boolean, default: true },
  showProductExploreMore: { type: Boolean, default: true },
  showProductFaq: { type: Boolean, default: true },
  usageGuideText: { 
    type: String, 
    default: "Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes." 
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
    default: "Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours."
  },
  returnPolicyText: {
    type: String,
    default: "We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund."
  },
  
  supportText: { type: String, default: "For support inquiries, please contact us." },
  careersText: { type: String, default: "Join our team! Check out our open positions." },
  tradeEnquiryText: { type: String, default: "For trade and wholesale inquiries, contact our B2B team." },
  aboutUsText: { type: String, default: "We are 29sFORMULA, redefining luxury." },
  
  instagramLink: { type: String, default: "#" },
  facebookLink: { type: String, default: "#" },
  contactLink: { type: String, default: "#" },
  shippingPolicyText: {
    type: String,
    default: "We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days."
  },

  // Gift Set Page Settings
  showGiftSetPage: { type: Boolean, default: true },
  giftSetHeaderBadge: { type: String, default: "CURATE · GIFT · DELIGHT" },
  giftSetHeaderTitle: { type: String, default: "Build Your Gift Set" },
  giftSetHeaderSubtitle: { type: String, default: "Pick any 3 fragrances in the same size" },
  giftSetHeaderTitleFontType: { type: String, default: "Outfit" },
  giftSetHeaderTitleFontSize: { type: String, default: "3.5rem" },
  giftSetHeaderTitleFontColor: { type: String, default: "#111827" },
  giftSetHeaderTitleFontWeight: { type: String, default: "800" },
  giftSetHeaderTitleFontAlignment: { type: String, default: "center" },
  giftSetHeaderSubtitleFontType: { type: String, default: "Outfit" },
  giftSetHeaderSubtitleFontSize: { type: String, default: "1.1rem" },
  giftSetHeaderSubtitleFontColor: { type: String, default: "#6b7280" },
  giftSetHeaderSubtitleFontWeight: { type: String, default: "500" },
  giftSetHeaderBgType: { type: String, default: "color" },
  giftSetHeaderBgColor: { type: String, default: "#ffffff" },
  giftSetHeaderBgImage: { type: String, default: "" },
  giftSetHeaderBgVideo: { type: String, default: "" },
  giftSetBgType: { type: String, default: "color" },
  giftSetBgColor: { type: String, default: "#faf5ff" },
  giftSetBgImage: { type: String, default: "" },
  giftSetBgGradient: { type: String, default: "linear-gradient(135deg, #faf5ff 0%, #f0e7ff 100%)" },
  giftSetSizes: {
    type: [{ size: String, label: String, description: String }],
    default: [
      { size: "20 ml", label: "Discovery Set", description: "Pocket perfection for travel" },
      { size: "50 ml", label: "Classic Trio", description: "The most popular signature box" },
      { size: "100 ml", label: "Grand Vault", description: "Ultimate statement fragrance collection" }
    ]
  },
  giftSetDefaultSize: { type: String, default: "50 ml" },
  giftSetMaxFragrances: { type: Number, default: 3 },
  giftSetButtonText: { type: String, default: "Add Gift Box to Cart" },
  giftSetButtonColor: { type: String, default: "#111827" },
  giftSetButtonTextColor: { type: String, default: "#ffffff" },
  giftSetButtonStyle: { type: String, default: "solid" },
  giftSetCardBorderColor: { type: String, default: "#e2e8f0" },
  giftSetCardSelectedColor: { type: String, default: "#111827" },
  giftSetAccentColor: { type: String, default: "#111827" }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
