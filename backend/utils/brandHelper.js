import Settings from "../models/Settings.js";
import Store from "../models/Store.js";
import { getCachedSettingsForStore, setCachedSettingsForStore } from "./cache.js";
import { getTenantStoreIdFromContext } from "./tenantContext.js";

export const getBrandInfo = async (storeId = null) => {
  try {
    const activeStoreId = storeId || getTenantStoreIdFromContext();
    let settings = getCachedSettingsForStore(activeStoreId);
    if (!settings) {
      if (activeStoreId) {
        settings = await Settings.findOne({ storeId: activeStoreId }).lean();
      }
      if (!settings) {
        settings = await Settings.findOne({}).lean();
      }
      if (settings && activeStoreId) {
        setCachedSettingsForStore(activeStoreId, settings);
      }
    }

    // Fetch store model to get exact businessName
    let storeNameFromModel = "";
    if (activeStoreId) {
      const storeDoc = await Store.findById(activeStoreId).lean();
      if (storeDoc) {
        storeNameFromModel = storeDoc.businessName || storeDoc.name || "";
      }
    }

    const brandLogoType = settings?.brandLogoType || "text";
    const brandLogoValue = settings?.brandLogoValue || storeNameFromModel || "";
    const isUrl = brandLogoValue && (brandLogoValue.startsWith("http") || brandLogoValue.startsWith("/") || brandLogoValue.startsWith("data:"));
    
    // Determine brand logo image URL and clean brand text name set by merchant
    const brandLogoUrl = (brandLogoType === "image" || isUrl) ? brandLogoValue : null;
    let brandName = storeNameFromModel || "Store";
    if (brandLogoType === "text" && brandLogoValue && !isUrl) {
      brandName = brandLogoValue;
    } else if (storeNameFromModel) {
      brandName = storeNameFromModel;
    }

    const brandTagline = settings?.videoSubtitle || "Official Online Store";
    const primaryColor = settings?.primaryColor || "#111827";
    const contactText = settings?.contactUsText || "Need help? Reply to this email and our support team will assist you.";
    const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const frontendUrl = rawFrontendUrl.replace(/\/$/, "");

    // Helper HTML for email headers: shows logo image if set by admin, else brand text
    const headerHtml = brandLogoUrl
      ? `<img src="${brandLogoUrl}" alt="${brandName}" style="max-height:50px; max-width:220px; object-fit:contain; vertical-align:middle;" />`
      : `<h1 style="margin:0; letter-spacing:3px; font-weight:600; color:#ffffff; font-size:22px; text-transform:uppercase;">${brandName}</h1>`;

    return {
      brandName,
      brandLogoUrl,
      headerHtml,
      brandTagline,
      primaryColor,
      contactText,
      frontendUrl
    };
  } catch (err) {
    const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return {
      brandName: "Store",
      brandLogoUrl: null,
      headerHtml: `<h1 style="margin:0; letter-spacing:3px; font-weight:600; color:#ffffff; font-size:22px; text-transform:uppercase;">STORE</h1>`,
      brandTagline: "Official Online Store",
      primaryColor: "#111827",
      contactText: "Need help? Reply to this email and our support team will assist you.",
      frontendUrl: rawFrontendUrl.replace(/\/$/, "")
    };
  }
};
