/**
 * Middleware to enforce store suspension boundaries.
 * Returns HTTP 451 (Unavailable For Legal Reasons) for storefront requests when the store is suspended.
 */
export const storefrontSuspensionGate = (req, res, next) => {
  // Always allow superadmin and auth endpoints so admins & merchants can access dashboard/auth
  if (req.path.startsWith("/api/superadmin") || req.path.startsWith("/api/auth")) {
    return next();
  }

  const isSuspended = Boolean(
    req.isStoreSuspended ||
    (req.store && (req.store.status === "suspended" || req.store.isActive === false))
  );

  if (isSuspended) {
    return res.status(451).json({
      isSuspended: true,
      error: "This online store is currently unavailable.",
      storeName: req.store?.name || req.store?.businessName || "Online Store",
      supportEmail: "support@29sformula.com"
    });
  }
  next();
};

/**
 * Middleware for merchant API routes.
 * Allows read-only status checks while blocking mutation endpoints (POST/PUT/DELETE) for suspended merchants.
 */
export const merchantApiSuspensionGate = (req, res, next) => {
  if (req.isStoreSuspended && req.method !== "GET") {
    return res.status(403).json({
      isSuspended: true,
      error: "Your merchant account is currently suspended. Modifications are locked.",
      suspensionReason: req.suspensionReason || "Account suspended by platform administrator.",
      suspendedAt: req.suspendedAt,
      supportEmail: "support@29sformula.com"
    });
  }
  next();
};
