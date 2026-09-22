import express from "express";
import Settings from "../models/Settings.js";
import { cachedSettings, setCachedSettings, invalidateSettingsCache } from "../utils/cache.js";
import { redisCache } from "../middleware/cacheMiddleware.js";

const router = express.Router();

router.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the 29s Formula Perfume E-commerce API",
    status: "healthy",
    version: "1.0.0"
  });
});

router.get("/api/settings", redisCache("settings", 300), async (req, res) => {
  try {
    if (cachedSettings) {
      return res.json(cachedSettings);
    }
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    setCachedSettings(settings);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.post("/api/settings", async (req, res) => {
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
    
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
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
    if (showTicker !== undefined) settings.showTicker = showTicker;
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

    // Gift Set Page Settings
    if (req.body.showGiftSetPage !== undefined) settings.showGiftSetPage = req.body.showGiftSetPage;
    if (req.body.giftSetHeaderBadge !== undefined) settings.giftSetHeaderBadge = req.body.giftSetHeaderBadge;
    if (req.body.giftSetHeaderTitle !== undefined) settings.giftSetHeaderTitle = req.body.giftSetHeaderTitle;
    if (req.body.giftSetHeaderSubtitle !== undefined) settings.giftSetHeaderSubtitle = req.body.giftSetHeaderSubtitle;
    if (req.body.giftSetHeaderTitleFontType !== undefined) settings.giftSetHeaderTitleFontType = req.body.giftSetHeaderTitleFontType;
    if (req.body.giftSetHeaderTitleFontSize !== undefined) settings.giftSetHeaderTitleFontSize = req.body.giftSetHeaderTitleFontSize;
    if (req.body.giftSetHeaderTitleFontColor !== undefined) settings.giftSetHeaderTitleFontColor = req.body.giftSetHeaderTitleFontColor;
    if (req.body.giftSetHeaderTitleFontWeight !== undefined) settings.giftSetHeaderTitleFontWeight = req.body.giftSetHeaderTitleFontWeight;
    if (req.body.giftSetHeaderTitleFontAlignment !== undefined) settings.giftSetHeaderTitleFontAlignment = req.body.giftSetHeaderTitleFontAlignment;
    if (req.body.giftSetHeaderSubtitleFontType !== undefined) settings.giftSetHeaderSubtitleFontType = req.body.giftSetHeaderSubtitleFontType;
    if (req.body.giftSetHeaderSubtitleFontSize !== undefined) settings.giftSetHeaderSubtitleFontSize = req.body.giftSetHeaderSubtitleFontSize;
    if (req.body.giftSetHeaderSubtitleFontColor !== undefined) settings.giftSetHeaderSubtitleFontColor = req.body.giftSetHeaderSubtitleFontColor;
    if (req.body.giftSetHeaderSubtitleFontWeight !== undefined) settings.giftSetHeaderSubtitleFontWeight = req.body.giftSetHeaderSubtitleFontWeight;
    if (req.body.giftSetHeaderBgType !== undefined) settings.giftSetHeaderBgType = req.body.giftSetHeaderBgType;
    if (req.body.giftSetHeaderBgColor !== undefined) settings.giftSetHeaderBgColor = req.body.giftSetHeaderBgColor;
    if (req.body.giftSetHeaderBgImage !== undefined) settings.giftSetHeaderBgImage = req.body.giftSetHeaderBgImage;
    if (req.body.giftSetHeaderBgVideo !== undefined) settings.giftSetHeaderBgVideo = req.body.giftSetHeaderBgVideo;
    if (req.body.giftSetBgType !== undefined) settings.giftSetBgType = req.body.giftSetBgType;
    if (req.body.giftSetBgColor !== undefined) settings.giftSetBgColor = req.body.giftSetBgColor;
    if (req.body.giftSetBgImage !== undefined) settings.giftSetBgImage = req.body.giftSetBgImage;
    if (req.body.giftSetBgGradient !== undefined) settings.giftSetBgGradient = req.body.giftSetBgGradient;
    if (req.body.giftSetSizes !== undefined) settings.giftSetSizes = req.body.giftSetSizes;
    if (req.body.giftSetDefaultSize !== undefined) settings.giftSetDefaultSize = req.body.giftSetDefaultSize;
    if (req.body.giftSetMaxFragrances !== undefined) settings.giftSetMaxFragrances = req.body.giftSetMaxFragrances;
    if (req.body.giftSetButtonText !== undefined) settings.giftSetButtonText = req.body.giftSetButtonText;
    if (req.body.giftSetButtonColor !== undefined) settings.giftSetButtonColor = req.body.giftSetButtonColor;
    if (req.body.giftSetButtonTextColor !== undefined) settings.giftSetButtonTextColor = req.body.giftSetButtonTextColor;
    if (req.body.giftSetButtonStyle !== undefined) settings.giftSetButtonStyle = req.body.giftSetButtonStyle;
    if (req.body.giftSetCardBorderColor !== undefined) settings.giftSetCardBorderColor = req.body.giftSetCardBorderColor;
    if (req.body.giftSetCardSelectedColor !== undefined) settings.giftSetCardSelectedColor = req.body.giftSetCardSelectedColor;
    if (req.body.giftSetAccentColor !== undefined) settings.giftSetAccentColor = req.body.giftSetAccentColor;

    await settings.save();

    // Update in-memory cache
    setCachedSettings(settings);

    // Delete old background video from Cloudinary if changed/removed
    if (videoUrl !== undefined && oldVideoUrl && oldVideoUrl !== videoUrl) {
      await deleteFromCloudinary(oldVideoUrl);
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to save page settings" });
  }
});

export default router;
