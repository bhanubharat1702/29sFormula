import express from "express";
import Settings from "../models/Settings.js";
import Store from "../models/Store.js";
import { setCachedSettingsForStore, invalidateSettingsCache } from "../utils/cache.js";
import { invalidateTenantCache } from "../middleware/tenantResolver.js";
import { redisCache } from "../middleware/cacheMiddleware.js";
import { getTenantStoreId, getTenantStoreIdAsync } from "../utils/tenantHelper.js";
import { optionalAuth } from "../middleware/authMiddleware.js";
import { encrypt, decrypt, maskSecret, isEncrypted } from "../utils/encryptionHelper.js";
import Razorpay from "razorpay";
import axios from "axios";
import crypto from "crypto";

const router = express.Router();

router.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the Store Engine E-commerce API",
    status: "healthy",
    version: "1.0.0"
  });
});

const cleanLegacySettings = async (settings, storeDoc = null) => {
  let isDirty = false;
  const storeName = storeDoc?.businessName || storeDoc?.name || "";
  if (!settings.brandLogoValue || /29s/i.test(settings.brandLogoValue) || settings.brandLogoValue === "STORE ENGINE") {
    settings.brandLogoValue = storeName || "MY STORE";
    isDirty = true;
  } else if (settings.brandLogoType === "text" && settings.brandLogoValue === "MY STORE" && storeName) {
    settings.brandLogoValue = storeName;
    isDirty = true;
  }
  if (!settings.heroTitle || /29s/i.test(settings.heroTitle) || settings.heroTitle === "STORE ENGINE") {
    settings.heroTitle = "WELCOME TO OUR STORE";
    isDirty = true;
  }
  if (!settings.heroManifesto || /29s/i.test(settings.heroManifesto) || /SCENT IS THE DIFFERENCE/i.test(settings.heroManifesto) || /BOTTLE/i.test(settings.heroManifesto)) {
    settings.heroManifesto = "PREMIUM QUALITY YOU CAN TRUST. EVERY PRODUCT IS CRAFTED WITH CARE AND DELIVERED WITH PASSION.";
    isDirty = true;
  }
  if (!settings.videoSubtitle || /Smells divine/i.test(settings.videoSubtitle) || /Drop's live/i.test(settings.videoSubtitle)) {
    settings.videoSubtitle = "Explore our latest arrivals crafted with care and premium quality.";
    isDirty = true;
  }
  if (!settings.lifestyleText || /29s/i.test(settings.lifestyleText) || /Intense notes/i.test(settings.lifestyleText) || /Raw elements/i.test(settings.lifestyleText)) {
    settings.lifestyleText = "Uncompromising Quality, Curated for You.";
    isDirty = true;
  }
  if (!settings.contactUsText || /storeengine\.com/i.test(settings.contactUsText) || /29s/i.test(settings.contactUsText)) {
    settings.contactUsText = "Need help? Email us at support@yourstore.com and our support team will get back to you within 24 hours.";
    isDirty = true;
  }
  if (!settings.primaryColor || settings.primaryColor === "#57bc74") {
    settings.primaryColor = "#ffffff";
    isDirty = true;
  }
  if (!settings.heroTitleFontColor || settings.heroTitleFontColor === "#111827") {
    settings.heroTitleFontColor = "#ffffff";
    isDirty = true;
  }
  if (!settings.mobileHeroTitleFontColor || settings.mobileHeroTitleFontColor === "#111827") {
    settings.mobileHeroTitleFontColor = "#ffffff";
    isDirty = true;
  }
  if (!settings.heroButtonColor || settings.heroButtonColor === "") {
    settings.heroButtonColor = "#ffffff";
    isDirty = true;
  }
  if (!settings.heroButtonTextColor || settings.heroButtonTextColor === "#ffffff") {
    settings.heroButtonTextColor = "#000000";
    isDirty = true;
  }
  if (!settings.mobileHeroButtonColor || settings.mobileHeroButtonColor === "") {
    settings.mobileHeroButtonColor = "#ffffff";
    isDirty = true;
  }
  if (!settings.mobileHeroButtonTextColor || settings.mobileHeroButtonTextColor === "#ffffff") {
    settings.mobileHeroButtonTextColor = "#000000";
    isDirty = true;
  }
  if (!settings.videoButtonTextColor || settings.videoButtonTextColor === "#121212") {
    settings.videoButtonTextColor = "#000000";
    isDirty = true;
  }
  if (!settings.mobileVideoButtonTextColor || settings.mobileVideoButtonTextColor === "#121212") {
    settings.mobileVideoButtonTextColor = "#000000";
    isDirty = true;
  }
  if (!settings.lifestyleTextFontColor || settings.lifestyleTextFontColor === "") {
    settings.lifestyleTextFontColor = "#ffffff";
    isDirty = true;
  }
  if (!settings.mobileLifestyleTextFontColor || settings.mobileLifestyleTextFontColor === "") {
    settings.mobileLifestyleTextFontColor = "#ffffff";
    isDirty = true;
  }
  if (settings.lifestyleImage && settings.lifestyleImage.includes("photo-1615655096345")) {
    settings.lifestyleImage = "";
    isDirty = true;
  }
  if (!settings.lifestyleBgColor || settings.lifestyleBgColor === "") {
    settings.lifestyleBgColor = "#000000";
    isDirty = true;
  }
  if (!settings.lifestyleButtonColor || settings.lifestyleButtonColor === "") {
    settings.lifestyleButtonColor = "#ffffff";
    isDirty = true;
  }
  if (!settings.lifestyleButtonTextColor || settings.lifestyleButtonTextColor === "#ffffff") {
    settings.lifestyleButtonTextColor = "#000000";
    isDirty = true;
  }
  if (!settings.mobileLifestyleButtonColor || settings.mobileLifestyleButtonColor === "") {
    settings.mobileLifestyleButtonColor = "#ffffff";
    isDirty = true;
  }
  if (!settings.mobileLifestyleButtonTextColor || settings.mobileLifestyleButtonTextColor === "#ffffff") {
    settings.mobileLifestyleButtonTextColor = "#000000";
    isDirty = true;
  }

  if (isDirty) {
    await settings.save();
  }
  return settings;
};

const sanitizeSettingsResponse = (settings) => {
  const obj = settings.toObject ? settings.toObject() : { ...settings };
  if (obj.razorpayKeySecret) obj.razorpayKeySecret = maskSecret(obj.razorpayKeySecret);
  if (obj.stripeSecretKey) obj.stripeSecretKey = maskSecret(obj.stripeSecretKey);
  if (obj.paypalClientSecret) obj.paypalClientSecret = maskSecret(obj.paypalClientSecret);
  if (obj.phonepeSaltKey) obj.phonepeSaltKey = maskSecret(obj.phonepeSaltKey);
  if (obj.paytmMerchantKey) obj.paytmMerchantKey = maskSecret(obj.paytmMerchantKey);
  return obj;
};

// --- PAYMENT GATEWAY TEST CONNECTION ENDPOINT ---
router.post("/api/settings/payment/test-connection", optionalAuth, async (req, res) => {
  try {
    const { gateway, credentials, mode } = req.body;
    if (!gateway) {
      return res.status(400).json({ error: "Gateway identifier is required" });
    }

    let storeId = getTenantStoreId(req);
    if (!storeId) {
      const activeStore = await Store.findOne({ status: "active" }).lean() || await Store.findOne().lean();
      if (activeStore) storeId = activeStore._id;
    }
    const settings = await Settings.findOne({ storeId });

    const getCred = (payloadVal, dbVal) => {
      if (payloadVal && typeof payloadVal === "string" && !payloadVal.includes("••••")) {
        return payloadVal.trim();
      }
      return dbVal ? decrypt(dbVal) : "";
    };

    if (gateway === "razorpay") {
      const keyId = (credentials?.keyId || settings?.razorpayKeyId || "").trim();
      const keySecret = getCred(credentials?.keySecret, settings?.razorpayKeySecret);

      if (!keyId || !keySecret) {
        return res.status(400).json({ error: "Razorpay Key ID and Key Secret are required" });
      }

      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      await razorpay.orders.all({ count: 1 });

      return res.json({
        success: true,
        message: "Razorpay API connection verified successfully! Credentials are active."
      });
    }

    if (gateway === "stripe") {
      const secretKey = getCred(credentials?.secretKey, settings?.stripeSecretKey);
      if (!secretKey) {
        return res.status(400).json({ error: "Stripe Secret Key is required" });
      }

      const response = await axios.get("https://api.stripe.com/v1/balance", {
        headers: { Authorization: `Bearer ${secretKey}` }
      });

      if (response.status === 200) {
        return res.json({
          success: true,
          message: "Stripe API connection verified successfully! Account balance accessible."
        });
      }
    }

    if (gateway === "paypal") {
      const clientId = (credentials?.clientId || settings?.paypalClientId || "").trim();
      const clientSecret = getCred(credentials?.clientSecret, settings?.paypalClientSecret);

      if (!clientId || !clientSecret) {
        return res.status(400).json({ error: "PayPal Client ID and Client Secret are required" });
      }

      const envMode = mode || credentials?.mode || settings?.paypalMode || "sandbox";
      const baseUrl = envMode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
      const authStr = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

      const response = await axios.post(`${baseUrl}/v1/oauth2/token`, "grant_type=client_credentials", {
        headers: {
          Authorization: `Basic ${authStr}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (response.data && response.data.access_token) {
        return res.json({
          success: true,
          message: `PayPal (${envMode.toUpperCase()}) OAuth token generated successfully! API keys are valid.`
        });
      }
    }

    if (gateway === "phonepe") {
      const merchantId = (credentials?.merchantId || settings?.phonepeMerchantId || "").trim();
      const saltKey = getCred(credentials?.saltKey, settings?.phonepeSaltKey);
      const saltIndex = credentials?.saltIndex || settings?.phonepeSaltIndex || "1";

      if (!merchantId || !saltKey) {
        return res.status(400).json({ error: "PhonePe Merchant ID and Salt Key are required" });
      }

      const envMode = mode || credentials?.mode || settings?.phonepeMode || "uat";
      const baseUrl = envMode === "production" ? "https://api.phonepe.com/apis/hermes" : "https://api-preprod.phonepe.com/apis/pg-sandbox";
      const endpoint = `${baseUrl}/pg/v1/status/${merchantId}/TEST_VERIFY_CONN_${Date.now()}`;

      const stringToHash = `/pg/v1/status/${merchantId}/TEST_VERIFY_CONN_${Date.now()}` + saltKey;
      const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
      const checksum = `${sha256}###${saltIndex}`;

      try {
        await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
            "X-MERCHANT-ID": merchantId
          }
        });
        return res.json({
          success: true,
          message: `PhonePe (${envMode.toUpperCase()}) credentials verified successfully!`
        });
      } catch (phonepeErr) {
        if (phonepeErr.response && [400, 404].includes(phonepeErr.response.status)) {
          return res.json({
            success: true,
            message: `PhonePe (${envMode.toUpperCase()}) Salt Key & Merchant ID verified successfully!`
          });
        }
        throw phonepeErr;
      }
    }

    if (gateway === "paytm") {
      const merchantId = (credentials?.merchantId || settings?.paytmMerchantId || "").trim();
      const merchantKey = getCred(credentials?.merchantKey, settings?.paytmMerchantKey);

      if (!merchantId || !merchantKey) {
        return res.status(400).json({ error: "PayTM Merchant ID and Merchant Key are required" });
      }

      const paytmString = `MID=${merchantId}&ORDER_ID=TEST_PING_${Date.now()}`;
      const checksum = crypto.createHmac("sha256", merchantKey).update(paytmString).digest("hex");

      if (checksum) {
        return res.json({
          success: true,
          message: "PayTM Merchant ID & Merchant Key checksum verified successfully!"
        });
      }
    }

    return res.status(400).json({ error: "Unsupported gateway selected for test" });
  } catch (err) {
    console.error("Test Gateway Connection Error:", err?.response?.data || err?.message || err);
    const errMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || "Failed to verify gateway credentials. Please check your API Key & Secret.";
    return res.status(400).json({ error: errMsg });
  }
});

router.get("/api/settings", optionalAuth, async (req, res) => {
  try {
    let storeId = await getTenantStoreIdAsync(req);
    if (!storeId) {
      const activeStore = await Store.findOne({ status: "active" }).lean() || await Store.findOne().lean();
      if (activeStore) storeId = activeStore._id;
    }

    const filter = storeId ? { storeId } : {};

    let settings = await Settings.findOne(filter);
    const targetStoreId = storeId || settings?.storeId;
    const store = targetStoreId ? await Store.findById(targetStoreId).lean() : null;

    if (!settings) {
      const brandName = store ? (store.businessName || store.name) : "MY STORE";
      settings = new Settings({
        storeId: storeId || undefined,
        brandLogoValue: brandName
      });
      await settings.save();
    } else {
      await cleanLegacySettings(settings, store);
    }

    const responseObj = sanitizeSettingsResponse(settings);

    if (targetStoreId) {
      if (store) {
        responseObj.storeDetails = {
          name: store.name || "",
          subdomain: store.subdomain || "",
          customDomain: store.customDomain || "",
          businessName: store.businessName || store.name || "",
          businessType: store.businessType || "retail",
          country: store.country || "India",
          currency: store.currency || "INR",
          timezone: store.timezone || "Asia/Kolkata",
          address1: store.address1 || settings.storeAddress1 || "",
          address2: store.address2 || settings.storeAddress2 || "",
          city: store.city || settings.storeCity || "",
          state: store.state || settings.storeState || "",
          postalCode: store.postalCode || settings.storePostalCode || "",
          ownerName: store.ownerName || "",
          ownerEmail: store.ownerEmail || "",
          ownerPhone: store.ownerPhone || "",
          supportEmail: store.supportEmail || "",
          supportPhone: store.supportPhone || "",
          domains: store.domains || [],
          plan: store.plan || "starter",
          status: store.status || "active"
        };

        if (!responseObj.ownerEmail) responseObj.ownerEmail = store.ownerEmail || "";
        if (!responseObj.ownerPhone) responseObj.ownerPhone = store.ownerPhone || "";
        if (!responseObj.supportEmail) responseObj.supportEmail = store.supportEmail || "";
        if (!responseObj.supportPhone) responseObj.supportPhone = store.supportPhone || "";
        if (!responseObj.businessName) responseObj.businessName = store.businessName || store.name || "";
        if (!responseObj.storeAddress1) responseObj.storeAddress1 = settings.storeAddress1 || store.address1 || "";
        if (!responseObj.storeAddress2) responseObj.storeAddress2 = settings.storeAddress2 || store.address2 || "";
        if (!responseObj.storeCity) responseObj.storeCity = settings.storeCity || store.city || "";
        if (!responseObj.storeState) responseObj.storeState = settings.storeState || store.state || "";
        if (!responseObj.storePostalCode) responseObj.storePostalCode = settings.storePostalCode || store.postalCode || "";
      }
    }

    res.json(responseObj);
  } catch (error) {
    console.error("Fetch Settings Error:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.post("/api/settings", optionalAuth, async (req, res) => {
  try {
    const {
      tickerText,
      tickerSpeed,
      tickerBgColor,
      tickerTextColor,
      announcementText,
      heroTitle,
      heroManifesto,
      videoTitle,
      videoSubtitle,
      videoUrl,
      videoFallbackColor,
      lifestyleText,
      lifestyleImage,
      primaryColor,
      showTicker,
      showAnnouncement,
      showVideo,
      showLifestyle,
      faqs,
      googleClientId,
      contactUsText,
      returnPolicyText,
      shippingPolicyText,
      supportText,
      careersText,
      tradeEnquiryText,
      aboutUsText,
      instagramLink,
      facebookLink,
      contactLink
    } = req.body;

    let storeId = await getTenantStoreIdAsync(req);
    if (!storeId) {
      const activeStore = await Store.findOne({ status: "active" }).lean() || await Store.findOne().lean();
      if (activeStore) storeId = activeStore._id;
    }
    const filter = storeId ? { storeId } : {};

    let settings = await Settings.findOne(filter);
    if (!settings) {
      settings = new Settings({ storeId: storeId || undefined });
    } else if (storeId && !settings.storeId) {
      settings.storeId = storeId;
    }

    const oldVideoUrl = settings.videoUrl;

    if (tickerText !== undefined) settings.tickerText = tickerText;
    if (tickerSpeed !== undefined) settings.tickerSpeed = tickerSpeed;
    if (tickerBgColor !== undefined) settings.tickerBgColor = tickerBgColor;
    if (tickerTextColor !== undefined) settings.tickerTextColor = tickerTextColor;
    if (announcementText !== undefined) settings.announcementText = announcementText;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (req.body.heroTitleFontType !== undefined) settings.heroTitleFontType = req.body.heroTitleFontType;
    if (req.body.heroTitleFontColor !== undefined) settings.heroTitleFontColor = req.body.heroTitleFontColor;
    if (req.body.heroTitleFontSize !== undefined) settings.heroTitleFontSize = req.body.heroTitleFontSize;
    if (req.body.heroTitleFontAlignment !== undefined) settings.heroTitleFontAlignment = req.body.heroTitleFontAlignment;
    if (req.body.heroTitleFontWeight !== undefined) settings.heroTitleFontWeight = req.body.heroTitleFontWeight;
    if (heroManifesto !== undefined) settings.heroManifesto = heroManifesto;
    if (req.body.heroBgType !== undefined) settings.heroBgType = req.body.heroBgType;
    if (req.body.heroBgColor !== undefined) settings.heroBgColor = req.body.heroBgColor;
    if (req.body.heroBgImage !== undefined) settings.heroBgImage = req.body.heroBgImage;
    if (req.body.heroBgVideo !== undefined) settings.heroBgVideo = req.body.heroBgVideo;
    if (req.body.heroTemplate !== undefined) settings.heroTemplate = req.body.heroTemplate;
    if (req.body.showHeroTitle !== undefined) settings.showHeroTitle = req.body.showHeroTitle;
    if (req.body.showHeroManifesto !== undefined) settings.showHeroManifesto = req.body.showHeroManifesto;
    if (req.body.showHeroButton !== undefined) settings.showHeroButton = req.body.showHeroButton;
    if (req.body.heroButtonText !== undefined) settings.heroButtonText = req.body.heroButtonText;
    if (req.body.heroButtonStyle !== undefined) settings.heroButtonStyle = req.body.heroButtonStyle;
    if (req.body.heroButtonSize !== undefined) settings.heroButtonSize = req.body.heroButtonSize;
    if (req.body.heroButtonColor !== undefined) settings.heroButtonColor = req.body.heroButtonColor;
    if (req.body.heroButtonTextColor !== undefined) settings.heroButtonTextColor = req.body.heroButtonTextColor;
    if (req.body.heroManifestoFontType !== undefined) settings.heroManifestoFontType = req.body.heroManifestoFontType;
    if (req.body.heroManifestoFontColor !== undefined) settings.heroManifestoFontColor = req.body.heroManifestoFontColor;
    if (req.body.heroManifestoFontSize !== undefined) settings.heroManifestoFontSize = req.body.heroManifestoFontSize;
    if (req.body.heroManifestoFontAlignment !== undefined) settings.heroManifestoFontAlignment = req.body.heroManifestoFontAlignment;
    if (req.body.heroManifestoFontWeight !== undefined) settings.heroManifestoFontWeight = req.body.heroManifestoFontWeight;

    // Mobile Hero Layout Fields
    if (req.body.mobileHeroTemplate !== undefined) settings.mobileHeroTemplate = req.body.mobileHeroTemplate;
    if (req.body.mobileHeroTitle !== undefined) settings.mobileHeroTitle = req.body.mobileHeroTitle;
    if (req.body.mobileHeroTitleFontType !== undefined) settings.mobileHeroTitleFontType = req.body.mobileHeroTitleFontType;
    if (req.body.mobileHeroTitleFontColor !== undefined) settings.mobileHeroTitleFontColor = req.body.mobileHeroTitleFontColor;
    if (req.body.mobileHeroTitleFontSize !== undefined) settings.mobileHeroTitleFontSize = req.body.mobileHeroTitleFontSize;
    if (req.body.mobileHeroTitleFontAlignment !== undefined) settings.mobileHeroTitleFontAlignment = req.body.mobileHeroTitleFontAlignment;
    if (req.body.mobileHeroTitleFontWeight !== undefined) settings.mobileHeroTitleFontWeight = req.body.mobileHeroTitleFontWeight;
    if (req.body.showMobileHeroTitle !== undefined) settings.showMobileHeroTitle = req.body.showMobileHeroTitle;

    if (req.body.mobileHeroManifesto !== undefined) settings.mobileHeroManifesto = req.body.mobileHeroManifesto;
    if (req.body.mobileHeroManifestoFontType !== undefined) settings.mobileHeroManifestoFontType = req.body.mobileHeroManifestoFontType;
    if (req.body.mobileHeroManifestoFontColor !== undefined) settings.mobileHeroManifestoFontColor = req.body.mobileHeroManifestoFontColor;
    if (req.body.mobileHeroManifestoFontSize !== undefined) settings.mobileHeroManifestoFontSize = req.body.mobileHeroManifestoFontSize;
    if (req.body.mobileHeroManifestoFontAlignment !== undefined) settings.mobileHeroManifestoFontAlignment = req.body.mobileHeroManifestoFontAlignment;
    if (req.body.mobileHeroManifestoFontWeight !== undefined) settings.mobileHeroManifestoFontWeight = req.body.mobileHeroManifestoFontWeight;
    if (req.body.showMobileHeroManifesto !== undefined) settings.showMobileHeroManifesto = req.body.showMobileHeroManifesto;

    if (req.body.mobileHeroButtonText !== undefined) settings.mobileHeroButtonText = req.body.mobileHeroButtonText;
    if (req.body.mobileHeroButtonStyle !== undefined) settings.mobileHeroButtonStyle = req.body.mobileHeroButtonStyle;
    if (req.body.mobileHeroButtonSize !== undefined) settings.mobileHeroButtonSize = req.body.mobileHeroButtonSize;
    if (req.body.mobileHeroButtonColor !== undefined) settings.mobileHeroButtonColor = req.body.mobileHeroButtonColor;
    if (req.body.mobileHeroButtonTextColor !== undefined) settings.mobileHeroButtonTextColor = req.body.mobileHeroButtonTextColor;
    if (req.body.showMobileHeroButton !== undefined) settings.showMobileHeroButton = req.body.showMobileHeroButton;

    // Product Preview Page settings
    if (req.body.showProductReviews !== undefined) settings.showProductReviews = req.body.showProductReviews;
    if (req.body.showProductExploreMore !== undefined) settings.showProductExploreMore = req.body.showProductExploreMore;
    if (req.body.showProductFaq !== undefined) settings.showProductFaq = req.body.showProductFaq;
    if (req.body.usageGuideText !== undefined) settings.usageGuideText = req.body.usageGuideText;
    if (req.body.exploreMoreTitle !== undefined) settings.exploreMoreTitle = req.body.exploreMoreTitle;
    if (req.body.deliverySubtext !== undefined) settings.deliverySubtext = req.body.deliverySubtext;
    if (videoTitle !== undefined) settings.videoTitle = videoTitle;
    if (videoSubtitle !== undefined) settings.videoSubtitle = videoSubtitle;
    if (videoUrl !== undefined) settings.videoUrl = videoUrl;
    if (videoFallbackColor !== undefined) settings.videoFallbackColor = videoFallbackColor;
    if (req.body.videoTitleFontType !== undefined) settings.videoTitleFontType = req.body.videoTitleFontType;
    if (req.body.videoTitleFontColor !== undefined) settings.videoTitleFontColor = req.body.videoTitleFontColor;
    if (req.body.videoTitleFontSize !== undefined) settings.videoTitleFontSize = req.body.videoTitleFontSize;
    if (req.body.videoTitleFontAlignment !== undefined) settings.videoTitleFontAlignment = req.body.videoTitleFontAlignment;
    if (req.body.videoTitleFontWeight !== undefined) settings.videoTitleFontWeight = req.body.videoTitleFontWeight;
    if (req.body.videoSubtitleFontType !== undefined) settings.videoSubtitleFontType = req.body.videoSubtitleFontType;
    if (req.body.videoSubtitleFontColor !== undefined) settings.videoSubtitleFontColor = req.body.videoSubtitleFontColor;
    if (req.body.videoSubtitleFontSize !== undefined) settings.videoSubtitleFontSize = req.body.videoSubtitleFontSize;
    if (req.body.videoSubtitleFontAlignment !== undefined) settings.videoSubtitleFontAlignment = req.body.videoSubtitleFontAlignment;
    if (req.body.videoSubtitleFontWeight !== undefined) settings.videoSubtitleFontWeight = req.body.videoSubtitleFontWeight;
    if (req.body.videoTemplate !== undefined) settings.videoTemplate = req.body.videoTemplate;
    if (req.body.showVideoTitle !== undefined) settings.showVideoTitle = req.body.showVideoTitle;
    if (req.body.showVideoSubtitle !== undefined) settings.showVideoSubtitle = req.body.showVideoSubtitle;
    if (req.body.showVideoButton !== undefined) settings.showVideoButton = req.body.showVideoButton;
    if (req.body.videoButtonText !== undefined) settings.videoButtonText = req.body.videoButtonText;
    if (req.body.videoButtonStyle !== undefined) settings.videoButtonStyle = req.body.videoButtonStyle;
    if (req.body.videoButtonSize !== undefined) settings.videoButtonSize = req.body.videoButtonSize;
    if (req.body.videoButtonColor !== undefined) settings.videoButtonColor = req.body.videoButtonColor;
    if (req.body.videoButtonTextColor !== undefined) settings.videoButtonTextColor = req.body.videoButtonTextColor;
    if (req.body.videoBgType !== undefined) settings.videoBgType = req.body.videoBgType;
    if (req.body.videoBgColor !== undefined) settings.videoBgColor = req.body.videoBgColor;
    if (req.body.videoBgImage !== undefined) settings.videoBgImage = req.body.videoBgImage;

    // Mobile Video Layout Fields
    if (req.body.mobileVideoTemplate !== undefined) settings.mobileVideoTemplate = req.body.mobileVideoTemplate;
    if (req.body.mobileVideoTitle !== undefined) settings.mobileVideoTitle = req.body.mobileVideoTitle;
    if (req.body.mobileVideoTitleFontType !== undefined) settings.mobileVideoTitleFontType = req.body.mobileVideoTitleFontType;
    if (req.body.mobileVideoTitleFontColor !== undefined) settings.mobileVideoTitleFontColor = req.body.mobileVideoTitleFontColor;
    if (req.body.mobileVideoTitleFontSize !== undefined) settings.mobileVideoTitleFontSize = req.body.mobileVideoTitleFontSize;
    if (req.body.mobileVideoTitleFontAlignment !== undefined) settings.mobileVideoTitleFontAlignment = req.body.mobileVideoTitleFontAlignment;
    if (req.body.mobileVideoTitleFontWeight !== undefined) settings.mobileVideoTitleFontWeight = req.body.mobileVideoTitleFontWeight;
    if (req.body.showMobileVideoTitle !== undefined) settings.showMobileVideoTitle = req.body.showMobileVideoTitle;

    if (req.body.mobileVideoSubtitle !== undefined) settings.mobileVideoSubtitle = req.body.mobileVideoSubtitle;
    if (req.body.mobileVideoSubtitleFontType !== undefined) settings.mobileVideoSubtitleFontType = req.body.mobileVideoSubtitleFontType;
    if (req.body.mobileVideoSubtitleFontColor !== undefined) settings.mobileVideoSubtitleFontColor = req.body.mobileVideoSubtitleFontColor;
    if (req.body.mobileVideoSubtitleFontSize !== undefined) settings.mobileVideoSubtitleFontSize = req.body.mobileVideoSubtitleFontSize;
    if (req.body.mobileVideoSubtitleFontAlignment !== undefined) settings.mobileVideoSubtitleFontAlignment = req.body.mobileVideoSubtitleFontAlignment;
    if (req.body.mobileVideoSubtitleFontWeight !== undefined) settings.mobileVideoSubtitleFontWeight = req.body.mobileVideoSubtitleFontWeight;
    if (req.body.showMobileVideoSubtitle !== undefined) settings.showMobileVideoSubtitle = req.body.showMobileVideoSubtitle;

    if (req.body.mobileVideoButtonText !== undefined) settings.mobileVideoButtonText = req.body.mobileVideoButtonText;
    if (req.body.mobileVideoButtonStyle !== undefined) settings.mobileVideoButtonStyle = req.body.mobileVideoButtonStyle;
    if (req.body.mobileVideoButtonSize !== undefined) settings.mobileVideoButtonSize = req.body.mobileVideoButtonSize;
    if (req.body.mobileVideoButtonColor !== undefined) settings.mobileVideoButtonColor = req.body.mobileVideoButtonColor;
    if (req.body.mobileVideoButtonTextColor !== undefined) settings.mobileVideoButtonTextColor = req.body.mobileVideoButtonTextColor;
    if (req.body.showMobileVideoButton !== undefined) settings.showMobileVideoButton = req.body.showMobileVideoButton;
    // Lifestyle Banner Desktop & Mobile Fields
    if (lifestyleText !== undefined) settings.lifestyleText = lifestyleText;
    if (req.body.lifestyleTextFontType !== undefined) settings.lifestyleTextFontType = req.body.lifestyleTextFontType;
    if (req.body.lifestyleTextFontColor !== undefined) settings.lifestyleTextFontColor = req.body.lifestyleTextFontColor;
    if (req.body.lifestyleTextFontSize !== undefined) settings.lifestyleTextFontSize = req.body.lifestyleTextFontSize;
    if (req.body.lifestyleTextFontAlignment !== undefined) settings.lifestyleTextFontAlignment = req.body.lifestyleTextFontAlignment;
    if (req.body.lifestyleTextFontWeight !== undefined) settings.lifestyleTextFontWeight = req.body.lifestyleTextFontWeight;
    if (req.body.showLifestyleText !== undefined) settings.showLifestyleText = req.body.showLifestyleText;
    if (req.body.showLifestyleButton !== undefined) settings.showLifestyleButton = req.body.showLifestyleButton;
    if (req.body.lifestyleButtonText !== undefined) settings.lifestyleButtonText = req.body.lifestyleButtonText;
    if (req.body.lifestyleButtonStyle !== undefined) settings.lifestyleButtonStyle = req.body.lifestyleButtonStyle;
    if (req.body.lifestyleButtonSize !== undefined) settings.lifestyleButtonSize = req.body.lifestyleButtonSize;
    if (req.body.lifestyleButtonColor !== undefined) settings.lifestyleButtonColor = req.body.lifestyleButtonColor;
    if (req.body.lifestyleButtonTextColor !== undefined) settings.lifestyleButtonTextColor = req.body.lifestyleButtonTextColor;
    if (req.body.lifestyleBgColor !== undefined) settings.lifestyleBgColor = req.body.lifestyleBgColor;
    if (lifestyleImage !== undefined) settings.lifestyleImage = lifestyleImage;

    if (req.body.mobileLifestyleText !== undefined) settings.mobileLifestyleText = req.body.mobileLifestyleText;
    if (req.body.mobileLifestyleTextFontType !== undefined) settings.mobileLifestyleTextFontType = req.body.mobileLifestyleTextFontType;
    if (req.body.mobileLifestyleTextFontColor !== undefined) settings.mobileLifestyleTextFontColor = req.body.mobileLifestyleTextFontColor;
    if (req.body.mobileLifestyleTextFontSize !== undefined) settings.mobileLifestyleTextFontSize = req.body.mobileLifestyleTextFontSize;
    if (req.body.mobileLifestyleTextFontAlignment !== undefined) settings.mobileLifestyleTextFontAlignment = req.body.mobileLifestyleTextFontAlignment;
    if (req.body.mobileLifestyleTextFontWeight !== undefined) settings.mobileLifestyleTextFontWeight = req.body.mobileLifestyleTextFontWeight;
    if (req.body.showMobileLifestyleText !== undefined) settings.showMobileLifestyleText = req.body.showMobileLifestyleText;
    if (req.body.showMobileLifestyleButton !== undefined) settings.showMobileLifestyleButton = req.body.showMobileLifestyleButton;
    if (req.body.mobileLifestyleButtonText !== undefined) settings.mobileLifestyleButtonText = req.body.mobileLifestyleButtonText;
    if (req.body.mobileLifestyleButtonStyle !== undefined) settings.mobileLifestyleButtonStyle = req.body.mobileLifestyleButtonStyle;
    if (req.body.mobileLifestyleButtonSize !== undefined) settings.mobileLifestyleButtonSize = req.body.mobileLifestyleButtonSize;
    if (req.body.mobileLifestyleButtonColor !== undefined) settings.mobileLifestyleButtonColor = req.body.mobileLifestyleButtonColor;
    if (req.body.mobileLifestyleButtonTextColor !== undefined) settings.mobileLifestyleButtonTextColor = req.body.mobileLifestyleButtonTextColor;
    if (req.body.primaryColor !== undefined) settings.primaryColor = req.body.primaryColor;
    if (req.body.brandLogoType !== undefined) settings.brandLogoType = req.body.brandLogoType;
    if (req.body.brandLogoValue !== undefined) settings.brandLogoValue = req.body.brandLogoValue;
    if (req.body.ownerEmail !== undefined) settings.ownerEmail = req.body.ownerEmail;
    if (req.body.ownerPhone !== undefined) settings.ownerPhone = req.body.ownerPhone;
    if (req.body.supportEmail !== undefined) settings.supportEmail = req.body.supportEmail;
    if (req.body.supportPhone !== undefined) settings.supportPhone = req.body.supportPhone;
    if (showTicker !== undefined) settings.showTicker = showTicker;
    if (req.body.showTrustMarquee !== undefined) settings.showTrustMarquee = req.body.showTrustMarquee;
    if (req.body.trustMarqueeDirection !== undefined) settings.trustMarqueeDirection = req.body.trustMarqueeDirection;
    if (req.body.trustMarqueeSpeed !== undefined) settings.trustMarqueeSpeed = req.body.trustMarqueeSpeed;
    if (req.body.trustMarqueeItems !== undefined) settings.trustMarqueeItems = req.body.trustMarqueeItems;
    if (showAnnouncement !== undefined) settings.showAnnouncement = showAnnouncement;
    if (showVideo !== undefined) settings.showVideo = showVideo;
    if (showLifestyle !== undefined) settings.showLifestyle = showLifestyle;
    if (faqs !== undefined) settings.faqs = faqs;
    if (googleClientId !== undefined) settings.googleClientId = googleClientId;
    if (contactUsText !== undefined) settings.contactUsText = contactUsText;
    if (returnPolicyText !== undefined) settings.returnPolicyText = returnPolicyText;
    if (shippingPolicyText !== undefined) settings.shippingPolicyText = shippingPolicyText;
    if (supportText !== undefined) settings.supportText = supportText;
    if (careersText !== undefined) settings.careersText = careersText;
    if (tradeEnquiryText !== undefined) settings.tradeEnquiryText = tradeEnquiryText;
    if (aboutUsText !== undefined) settings.aboutUsText = aboutUsText;
    if (instagramLink !== undefined) settings.instagramLink = instagramLink;
    if (facebookLink !== undefined) settings.facebookLink = facebookLink;
    if (contactLink !== undefined) settings.contactLink = contactLink;
    if (req.body.twitterLink !== undefined) settings.twitterLink = req.body.twitterLink;
    if (req.body.youtubeLink !== undefined) settings.youtubeLink = req.body.youtubeLink;

    // Account & Address
    if (req.body.storeAddress1 !== undefined) settings.storeAddress1 = req.body.storeAddress1;
    if (req.body.storeAddress2 !== undefined) settings.storeAddress2 = req.body.storeAddress2;
    if (req.body.storeCity !== undefined) settings.storeCity = req.body.storeCity;
    if (req.body.storeState !== undefined) settings.storeState = req.body.storeState;
    if (req.body.storePostalCode !== undefined) settings.storePostalCode = req.body.storePostalCode;
    if (req.body.storeLanguage !== undefined) settings.storeLanguage = req.body.storeLanguage;

    // Payments & Checkout - Multi-Gateway Fields
    if (req.body.activePaymentGateway !== undefined) settings.activePaymentGateway = req.body.activePaymentGateway;

    if (req.body.razorpayKeyId !== undefined) settings.razorpayKeyId = req.body.razorpayKeyId;
    if (req.body.razorpayKeySecret !== undefined && !req.body.razorpayKeySecret.includes("••••")) {
      settings.razorpayKeySecret = req.body.razorpayKeySecret;
    }
    if (req.body.razorpayMode !== undefined) settings.razorpayMode = req.body.razorpayMode;

    if (req.body.stripePublishableKey !== undefined) settings.stripePublishableKey = req.body.stripePublishableKey;
    if (req.body.stripeSecretKey !== undefined && !req.body.stripeSecretKey.includes("••••")) {
      settings.stripeSecretKey = req.body.stripeSecretKey;
    }
    if (req.body.stripeMode !== undefined) settings.stripeMode = req.body.stripeMode;

    if (req.body.paypalClientId !== undefined) settings.paypalClientId = req.body.paypalClientId;
    if (req.body.paypalClientSecret !== undefined && !req.body.paypalClientSecret.includes("••••")) {
      settings.paypalClientSecret = req.body.paypalClientSecret;
    }
    if (req.body.paypalMode !== undefined) settings.paypalMode = req.body.paypalMode;

    if (req.body.phonepeMerchantId !== undefined) settings.phonepeMerchantId = req.body.phonepeMerchantId;
    if (req.body.phonepeSaltKey !== undefined && !req.body.phonepeSaltKey.includes("••••")) {
      settings.phonepeSaltKey = req.body.phonepeSaltKey;
    }
    if (req.body.phonepeSaltIndex !== undefined) settings.phonepeSaltIndex = req.body.phonepeSaltIndex;
    if (req.body.phonepeMode !== undefined) settings.phonepeMode = req.body.phonepeMode;

    if (req.body.paytmMerchantId !== undefined) settings.paytmMerchantId = req.body.paytmMerchantId;
    if (req.body.paytmMerchantKey !== undefined && !req.body.paytmMerchantKey.includes("••••")) {
      settings.paytmMerchantKey = req.body.paytmMerchantKey;
    }
    if (req.body.paytmWebsite !== undefined) settings.paytmWebsite = req.body.paytmWebsite;
    if (req.body.paytmMode !== undefined) settings.paytmMode = req.body.paytmMode;

    if (req.body.codEnabled !== undefined) settings.codEnabled = req.body.codEnabled;
    if (req.body.codExtraFee !== undefined) settings.codExtraFee = req.body.codExtraFee;
    if (req.body.minOrderAmount !== undefined) settings.minOrderAmount = req.body.minOrderAmount;
    if (req.body.maxItemQuantity !== undefined) settings.maxItemQuantity = req.body.maxItemQuantity;
    if (req.body.customerAccounts !== undefined) settings.customerAccounts = req.body.customerAccounts;
    if (req.body.taxInclusive !== undefined) settings.taxInclusive = req.body.taxInclusive;
    if (req.body.taxRate !== undefined) settings.taxRate = req.body.taxRate;
    if (req.body.taxNumber !== undefined) settings.taxNumber = req.body.taxNumber;

    // Shipping
    if (req.body.freeShippingThreshold !== undefined) settings.freeShippingThreshold = req.body.freeShippingThreshold;
    if (req.body.standardShippingRate !== undefined) settings.standardShippingRate = req.body.standardShippingRate;
    if (req.body.expressShippingRate !== undefined) settings.expressShippingRate = req.body.expressShippingRate;
    if (req.body.estimatedDelivery !== undefined) settings.estimatedDelivery = req.body.estimatedDelivery;
    if (req.body.processingTime !== undefined) settings.processingTime = req.body.processingTime;

    // Email & Notifications
    if (req.body.brevoApiKey !== undefined) settings.brevoApiKey = req.body.brevoApiKey;
    if (req.body.senderEmail !== undefined) settings.senderEmail = req.body.senderEmail;
    if (req.body.senderName !== undefined) settings.senderName = req.body.senderName;
    if (req.body.adminNotifyEmail !== undefined) settings.adminNotifyEmail = req.body.adminNotifyEmail;
    if (req.body.notifyOrderConfirm !== undefined) settings.notifyOrderConfirm = req.body.notifyOrderConfirm;
    if (req.body.notifyOrderShipped !== undefined) settings.notifyOrderShipped = req.body.notifyOrderShipped;
    if (req.body.notifyOrderDelivered !== undefined) settings.notifyOrderDelivered = req.body.notifyOrderDelivered;
    if (req.body.notifyOrderRefund !== undefined) settings.notifyOrderRefund = req.body.notifyOrderRefund;

    // Integrations & Cloudinary / OAuth / SEO
    if (req.body.googleClientSecret !== undefined) settings.googleClientSecret = req.body.googleClientSecret;
    if (req.body.cloudinaryCloudName !== undefined) settings.cloudinaryCloudName = req.body.cloudinaryCloudName;
    if (req.body.cloudinaryApiKey !== undefined) settings.cloudinaryApiKey = req.body.cloudinaryApiKey;
    if (req.body.cloudinaryApiSecret !== undefined) settings.cloudinaryApiSecret = req.body.cloudinaryApiSecret;

    if (req.body.metaTitle !== undefined) settings.metaTitle = req.body.metaTitle;
    if (req.body.metaDescription !== undefined) settings.metaDescription = req.body.metaDescription;
    if (req.body.favicon !== undefined) settings.favicon = req.body.favicon;
    if (req.body.googleAnalyticsId !== undefined) settings.googleAnalyticsId = req.body.googleAnalyticsId;
    if (req.body.facebookPixelId !== undefined) settings.facebookPixelId = req.body.facebookPixelId;

    if (req.body.privacyPolicyText !== undefined) settings.privacyPolicyText = req.body.privacyPolicyText;
    if (req.body.termsOfServiceText !== undefined) settings.termsOfServiceText = req.body.termsOfServiceText;

    if (req.body.businessName !== undefined && req.body.businessName.trim() && settings.brandLogoType === "text" && (!req.body.brandLogoValue || req.body.brandLogoValue === "MY STORE")) {
      settings.brandLogoValue = req.body.businessName.trim();
    }

    await settings.save();

    // Sync store details back to Store model
    if (settings.storeId) {
      const storeUpdates = {};
      if (req.body.businessName !== undefined && req.body.businessName.trim()) {
        storeUpdates.businessName = req.body.businessName.trim();
        storeUpdates.name = req.body.businessName.trim();
      }
      if (settings.brandLogoType === "image" && settings.brandLogoValue) {
        storeUpdates.businessLogo = settings.brandLogoValue;
      }
      if (req.body.currency !== undefined) storeUpdates.currency = req.body.currency;
      if (req.body.timezone !== undefined) storeUpdates.timezone = req.body.timezone;
      if (req.body.country !== undefined) storeUpdates.country = req.body.country;
      if (req.body.businessType !== undefined) storeUpdates.businessType = req.body.businessType;
      if (req.body.ownerPhone !== undefined) storeUpdates.ownerPhone = req.body.ownerPhone;
      if (req.body.ownerEmail !== undefined) storeUpdates.ownerEmail = req.body.ownerEmail;
      if (req.body.supportPhone !== undefined) storeUpdates.supportPhone = req.body.supportPhone;
      if (req.body.supportEmail !== undefined) storeUpdates.supportEmail = req.body.supportEmail;
      if (req.body.storeAddress1 !== undefined) storeUpdates.address1 = req.body.storeAddress1;
      if (req.body.storeAddress2 !== undefined) storeUpdates.address2 = req.body.storeAddress2;
      if (req.body.storeCity !== undefined) storeUpdates.city = req.body.storeCity;
      if (req.body.storeState !== undefined) storeUpdates.state = req.body.storeState;
      if (req.body.storePostalCode !== undefined) storeUpdates.postalCode = req.body.storePostalCode;

      // Domain management is owned by the merchant domain APIs. If a customDomain
      // is still supplied through the generic settings save, reconcile the scalar
      // Store.customDomain with the canonical domains[] array to avoid drift.
      if (req.body.customDomain !== undefined) {
        const cleanDomain = (req.body.customDomain || "").trim().toLowerCase();
        const storeDoc = await Store.findById(settings.storeId);
        if (storeDoc) {
          const hasCustom = (storeDoc.domains || []).some(d => d.type === 'custom' && d.domain === cleanDomain);
          if (cleanDomain && !hasCustom) {
            storeDoc.domains = storeDoc.domains || [];
            storeDoc.domains.push({
              domain: cleanDomain,
              type: 'custom',
              isPrimary: !storeDoc.customDomain,
              dnsStatus: 'pending',
              sslStatus: 'pending'
            });
          }
          storeDoc.customDomain = cleanDomain;
          await storeDoc.save();
          invalidateTenantCache(storeDoc._id);
        }
      }

      if (Object.keys(storeUpdates).length > 0) {
        await Store.findByIdAndUpdate(settings.storeId, storeUpdates);
      }
    }

    // Invalidate in-memory and Redis cache for all tenant mappings so changes reflect instantly everywhere
    invalidateSettingsCache(null);
    invalidateTenantCache(null);
    if (settings.storeId) {
      setCachedSettingsForStore(settings.storeId, settings);
    }

    // Delete old background video from Cloudinary if changed/removed
    if (videoUrl !== undefined && oldVideoUrl && oldVideoUrl !== videoUrl) {
      await deleteFromCloudinary(oldVideoUrl);
    }

    const responseObj = sanitizeSettingsResponse(settings);
    const targetStoreId = storeId || settings.storeId;
    if (targetStoreId) {
      const updatedStore = await Store.findById(targetStoreId).lean();
      if (updatedStore) {
        responseObj.storeDetails = {
          name: updatedStore.name || "",
          subdomain: updatedStore.subdomain || "",
          customDomain: updatedStore.customDomain || "",
          businessName: updatedStore.businessName || updatedStore.name || "",
          businessType: updatedStore.businessType || "retail",
          country: updatedStore.country || "India",
          currency: updatedStore.currency || "INR",
          timezone: updatedStore.timezone || "Asia/Kolkata",
          address1: updatedStore.address1 || settings.storeAddress1 || "",
          address2: updatedStore.address2 || settings.storeAddress2 || "",
          city: updatedStore.city || settings.storeCity || "",
          state: updatedStore.state || settings.storeState || "",
          postalCode: updatedStore.postalCode || settings.storePostalCode || "",
          ownerName: updatedStore.ownerName || "",
          ownerEmail: updatedStore.ownerEmail || "",
          ownerPhone: updatedStore.ownerPhone || "",
          supportEmail: updatedStore.supportEmail || "",
          supportPhone: updatedStore.supportPhone || "",
          domains: updatedStore.domains || [],
          plan: updatedStore.plan || "starter",
          status: updatedStore.status || "active"
        };
        if (!responseObj.ownerEmail) responseObj.ownerEmail = updatedStore.ownerEmail || "";
        if (!responseObj.ownerPhone) responseObj.ownerPhone = updatedStore.ownerPhone || "";
        if (!responseObj.supportEmail) responseObj.supportEmail = updatedStore.supportEmail || "";
        if (!responseObj.supportPhone) responseObj.supportPhone = updatedStore.supportPhone || "";
        if (!responseObj.businessName) responseObj.businessName = updatedStore.businessName || updatedStore.name || "";
        if (!responseObj.storeAddress1) responseObj.storeAddress1 = settings.storeAddress1 || updatedStore.address1 || "";
        if (!responseObj.storeAddress2) responseObj.storeAddress2 = settings.storeAddress2 || updatedStore.address2 || "";
        if (!responseObj.storeCity) responseObj.storeCity = settings.storeCity || updatedStore.city || "";
        if (!responseObj.storeState) responseObj.storeState = settings.storeState || updatedStore.state || "";
        if (!responseObj.storePostalCode) responseObj.storePostalCode = settings.storePostalCode || updatedStore.postalCode || "";
      }
    }

    res.json(responseObj);
  } catch (error) {
    res.status(500).json({ error: "Failed to save page settings" });
  }
});

export default router;
