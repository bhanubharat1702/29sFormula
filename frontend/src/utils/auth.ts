/**
 * Centralized authentication utility for handling merchant & customer session teardown.
 * Completely clears all token, session, and tenant storage entries, expires auth cookies,
 * and forces a clean page redirect.
 */
export const clearAuthSession = (redirectUrl = "/login") => {
  if (typeof window === "undefined") return;

  try {
    // Clear all localStorage auth tokens & sessions
    localStorage.removeItem("adminSession");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userSession");
    localStorage.removeItem("merchantStoreId");
    localStorage.removeItem("storeId");
    localStorage.removeItem("lastActivityTime");
    localStorage.removeItem("admin_custom_categories");
    localStorage.removeItem("admin_deleted_default_categories");

    // Clear sessionStorage
    sessionStorage.clear();

    // Expire auth cookies if set
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        }
      }
    }
  } catch (e) {
    console.error("Error clearing auth session:", e);
  }

  // Force hard redirect to target page
  window.location.href = redirectUrl;
};
