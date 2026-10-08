"use client";

import { useEffect } from "react";

export default function DynamicStoreHead() {
  useEffect(() => {
    const updateHead = (data?: any) => {
      let storeName = "";
      let logoUrl = "";

      if (data) {
        storeName = data.storeDetails?.businessName || data.storeDetails?.name || data.metaTitle || (data.brandLogoType === "text" && data.brandLogoValue && !data.brandLogoValue.startsWith("http") ? data.brandLogoValue : "");
        
        const isImageLogo = data.brandLogoType === "image" || (data.brandLogoValue && (data.brandLogoValue.startsWith("http") || data.brandLogoValue.startsWith("/") || data.brandLogoValue.startsWith("data:")));
        logoUrl = data.favicon || (isImageLogo ? data.brandLogoValue : "");

        if (storeName) localStorage.setItem("settings_storeBusinessName", storeName);
        if (data.brandLogoValue) localStorage.setItem("settings_brandLogoValue", data.brandLogoValue);
        if (data.brandLogoType) localStorage.setItem("settings_brandLogoType", data.brandLogoType);
        if (logoUrl) localStorage.setItem("settings_favicon", logoUrl);
      } else {
        // Fallback to cached localStorage values
        const cachedStoreName = localStorage.getItem("settings_storeBusinessName");
        const cachedLogoValue = localStorage.getItem("settings_brandLogoValue");
        const cachedLogoType = localStorage.getItem("settings_brandLogoType");
        const cachedFavicon = localStorage.getItem("settings_favicon");

        const isImageLogo = cachedLogoType === "image" || (cachedLogoValue && (cachedLogoValue.startsWith("http") || cachedLogoValue.startsWith("/") || cachedLogoValue.startsWith("data:")));
        
        storeName = cachedStoreName || (cachedLogoType === "text" && cachedLogoValue && !cachedLogoValue.startsWith("http") ? cachedLogoValue : "");
        logoUrl = cachedFavicon || (isImageLogo ? cachedLogoValue || "" : "");
      }

      // Update document title if store name is set
      if (storeName && storeName.trim() !== "") {
        document.title = storeName.trim();
      }

      // Update favicon if logo URL is set
      if (logoUrl && logoUrl.trim() !== "") {
        const url = logoUrl.trim();
        
        // Find existing icon link tags or create them
        const iconRels = ["icon", "shortcut icon", "apple-touch-icon"];
        iconRels.forEach((rel) => {
          let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement;
          if (!link) {
            link = document.createElement("link");
            link.rel = rel;
            document.head.appendChild(link);
          }
          link.href = url;
        });
      }
    };

    // 1. Immediately apply cached values to prevent layout/title flash
    updateHead();

    // 2. Fetch fresh settings from backend API
    const fetchSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
        const res = await fetch(`${apiUrl}/api/settings`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          updateHead(data);
        }
      } catch (err) {
        console.warn("Could not fetch store settings for dynamic head:", err);
      }
    };

    fetchSettings();

    // 3. Listen for setting updates across tabs / admin changes
    const handleSettingsUpdated = () => {
      fetchSettings();
    };

    window.addEventListener("settingsUpdated", handleSettingsUpdated);
    window.addEventListener("storage", handleSettingsUpdated);

    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdated);
      window.removeEventListener("storage", handleSettingsUpdated);
    };
  }, []);

  return null;
}
