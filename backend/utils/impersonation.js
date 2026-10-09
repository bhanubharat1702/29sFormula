import jwt from "jsonwebtoken";
import SupportAccessGrant from "../models/SupportAccessGrant.js";

/**
 * Shared utilities for consented, audited Super Admin impersonation.
 *
 * Design:
 *  - A merchant creates a SupportAccessGrant (explicit consent, time-limited).
 *  - A Super Admin exchanges that grant for a short-lived impersonation JWT that
 *    carries a DUAL IDENTITY payload: impersonator + tenant claims.
 *  - The token is passed via a dedicated header (x-impersonation-token) so the
 *    merchant-session path is never silently replaced.
 *  - Every request made with an impersonation token is attributed to the Super
 *    Admin "on behalf of" the merchant in the audit log.
 */

export const IMPERSONATION_HEADER = "x-impersonation-token";
export const DEFAULT_SUPPORT_DURATION_HOURS = 24;
export const IMPERSONATION_TOKEN_TTL = "1h";

export const getJwtSecret = () =>
    process.env.JWT_SECRET || "ecommerce_secret_jwt_key_2026";

/**
 * Extract an impersonation token from the request (dedicated header only).
 */
export const getImpersonationTokenFromRequest = (req) => {
    if (!req || !req.headers) return null;
    const raw = req.headers[IMPERSONATION_HEADER];
    if (!raw) return null;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const token = String(value).startsWith("Bearer ")
        ? String(value).slice(7)
        : String(value);
    return token.trim() || null;
};

/**
 * Verify and decode an impersonation JWT. Returns null when invalid/expired
 * or when the token is not actually an impersonation token.
 */
export const verifyImpersonationToken = (token) => {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        if (!decoded || decoded.isImpersonated !== true) return null;
        if (!decoded.impersonator || !decoded.tenant) return null;
        return decoded;
    } catch (err) {
        return null;
    }
};

/**
 * Locate an active, unexpired, unrevoked consent grant for a store.
 * Optionally restricted to a specific Super Admin email.
 */
export const findUsableSupportGrant = async (storeId, superAdminEmail = "") => {
    if (!storeId) return null;
    const now = new Date();
    const orConditions = [
        { assignedSuperAdminEmail: "" },
        { assignedSuperAdminEmail: null }
    ];
    if (superAdminEmail) {
        orConditions.push({ assignedSuperAdminEmail: String(superAdminEmail).toLowerCase().trim() });
    }

    const grant = await SupportAccessGrant.findOne({
        storeId,
        status: "active",
        expiresAt: { $gt: now },
        $or: orConditions
    })
        .sort({ createdAt: -1 })
        .setOptions({ skipTenantFilter: true });

    return grant || null;
};

/**
 * Build the dual-identity impersonation claims for the JWT payload.
 * Example payload: { impersonator: "superadmin_id", tenant: "merchant_id", ... }
 */
export const buildImpersonationClaims = ({
    superAdmin,
    store,
    grant
}) => {
    const superAdminEmail = (superAdmin?.email || "").toLowerCase().trim();
    return {
        // Dual identity — explicit and unambiguous
        impersonator: superAdmin?.id || superAdmin?._id || "super_admin_master_id",
        impersonatorEmail: superAdminEmail,
        impersonatorName: superAdmin?.name || "Platform Super Admin",
        tenant: String(store._id),
        tenantName: store.name,
        tenantSubdomain: store.subdomain,
        grantId: grant?._id ? String(grant._id) : null,

        // Merchant-side identity so existing admin APIs keep working
        id: store.ownerId ? String(store.ownerId) : `impersonated_owner_${store._id}`,
        email: (store.ownerEmail || "").toLowerCase(),
        role: "owner",
        isOwner: true,
        isAdmin: true,
        storeId: String(store._id),
        subdomain: store.subdomain,

        // Flags consumed by middleware & audit
        isImpersonated: true,
        impersonationScopes: Array.isArray(grant?.scopes) ? grant.scopes : ["support"]
    };
};

/**
 * Record that a consent grant was used by a Super Admin.
 */
export const markGrantUsed = async (grant, superAdmin, ipAddress = "") => {
    if (!grant) return;
    try {
        grant.lastUsedAt = new Date();
        grant.usageCount = (grant.usageCount || 0) + 1;
        grant.usedBySuperAdmins.push({
            email: (superAdmin?.email || "").toLowerCase().trim(),
            superAdminId: superAdmin?.id || superAdmin?._id || "",
            usedAt: new Date(),
            ipAddress
        });
        await grant.save({ skipTenantFilter: true });
    } catch (err) {
        console.error("Failed to mark support grant as used:", err.message);
    }
};

/**
 * True when the decoded user payload represents an impersonation session.
 */
export const isImpersonationSession = (user) =>
    Boolean(user && user.isImpersonated === true && user.impersonator && user.tenant);
