import Settings from "../models/Settings.js";
import { cachedSettings } from "./cache.js";

export const getBrandInfo = async () => {
  try {
    let settings = cachedSettings;
    if (!settings) {
      settings = await Settings.findOne({});
    }
    const brandName = settings?.brandLogoValue || settings?.heroTitle || "Store";
    const brandTagline = settings?.videoSubtitle || "Official Online Store";
    const primaryColor = settings?.primaryColor || "#111827";
    const contactText = settings?.contactUsText || "Need help? Reply to this email and our support team will assist you.";
    const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const frontendUrl = rawFrontendUrl.replace(/\/$/, "");

    return {
      brandName,
      brandTagline,
      primaryColor,
      contactText,
      frontendUrl
    };
  } catch (err) {
    const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return {
      brandName: "Store",
      brandTagline: "Official Online Store",
      primaryColor: "#111827",
      contactText: "Need help? Reply to this email and our support team will assist you.",
      frontendUrl: rawFrontendUrl.replace(/\/$/, "")
    };
  }
};
