import Store from "../models/Store.js";
import SupportAccessGrant from "../models/SupportAccessGrant.js";
import { recordAuditLog } from "../services/auditLogService.js";
import { getTenantStoreId } from "../utils/tenantHelper.js";
import { DEFAULT_SUPPORT_DURATION_HOURS } from "../utils/impersonation.js";

const MAX_DURATION_HOURS = 168; // 7 days hard ceiling

const getClientMeta = (req) => ({
    ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
    country: req.headers["cf-ipcountry"] || "India",
    userAgent: req.headers["user-agent"] || ""
});

/**
 * A request is only allowed to grant/revoke consent when it originates from a
 * real merchant owner session — NOT from an impersonation session. This
 * prevents a Super Admin from self-granting consent to obtain persistent access.
 */
const assertMerchantOwner = (req, res) => {
    if (req.user?.isImpersonated) {
        res.status(403).json({
            error: "Impersonation sessions cannot grant or revoke support access consent."
        });
        return false;
    }
    const isOwner = Boolean(
        req.user?.role === "owner" || req.user?.isOwner === true
    );
    if (!isOwner) {
        res.status(403).json({
            error: "Only the merchant store owner can manage support access consent."
        });
        return false;
    }
    return true;
};

/**
 * POST /api/admin/support-access
 * Merchant explicitly grants temporary support access to platform Super Admins.
 * Body: { durationHours?: number, reason?: string, scopes?: string[], assignedSuperAdminEmail?: string }
 */
export const grantSupportAccess = async (req, res) => {
    try {
        if (!assertMerchantOwner(req, res)) return;

        const storeId = getTenantStoreId(req);
        if (!storeId) {
            return res.status(400).json({ error: "Unable to determine the store for this request." });
        }

        const {
            durationHours = DEFAULT_SUPPORT_DURATION_HOURS,
            reason = "Merchant-initiated support access",
            scopes = ["support"],
            assignedSuperAdminEmail = ""
        } = req.body || {};

        const parsedDuration = Number(durationHours);
        if (!Number.isFinite(parsedDuration) || parsedDuration < 1 || parsedDuration > MAX_DURATION_HOURS) {
            return res.status(400).json({
                error: `durationHours must be between 1 and ${MAX_DURATION_HOURS}.`
            });
        }

        const store = await Store.findById(storeId).setOptions({ skipTenantFilter: true }).lean();
        if (!store) return res.status(404).json({ error: "Store not found." });

        const now = new Date();
        const expiresAt = new Date(now.getTime() + parsedDuration * 60 * 60 * 1000);

        // Revoke any previously active grants for this store so only one is ever live.
        await SupportAccessGrant.updateMany(
            { storeId, status: "active" },
            { $set: { status: "revoked", revokedAt: now, revokedByEmail: (req.user?.email || "").toLowerCase() } }
        ).setOptions({ skipTenantFilter: true });

        const grant = await SupportAccessGrant.create({
            storeId,
            storeName: store.name,
            grantedByUserId: req.user?.id || req.user?._id || null,
            grantedByName: req.user?.name || store.ownerName || "",
            grantedByEmail: (req.user?.email || store.ownerEmail || "").toLowerCase(),
            status: "active",
            reason,
            durationHours: parsedDuration,
            scopes: Array.isArray(scopes) && scopes.length ? scopes : ["support"],
            assignedSuperAdminEmail: assignedSuperAdminEmail
                ? String(assignedSuperAdminEmail).toLowerCase().trim()
                : "",
            grantedAt: now,
            expiresAt
        });

        await recordAuditLog({
            ...getClientMeta(req),
            adminUser: req.user?.name || store.ownerName || "Merchant Owner",
            adminEmail: (req.user?.email || store.ownerEmail || "").toLowerCase(),
            role: "Merchant Owner",
            action: "Grant Support Access",
            actionCategory: "security",
            target: store.name,
            targetId: String(store._id),
            storeId: store._id,
            storeName: store.name,
            reason,
            afterValue: {
                grantId: String(grant._id),
                durationHours: parsedDuration,
                expiresAt: expiresAt.toISOString(),
                scopes: grant.scopes
            }
        });

        res.status(201).json({
            message: `Support access granted for ${parsedDuration} hour(s). It expires automatically at ${expiresAt.toISOString()}.`,
            grant: {
                id: grant._id,
                status: grant.status,
                reason: grant.reason,
                scopes: grant.scopes,
                grantedAt: grant.grantedAt,
                expiresAt: grant.expiresAt
            }
        });
    } catch (err) {
        console.error("Grant Support Access Error:", err);
        res.status(500).json({ error: "Failed to grant support access." });
    }
};

/**
 * GET /api/admin/support-access
 * Merchant views current consent status + history.
 */
export const getSupportAccessStatus = async (req, res) => {
    try {
        if (!assertMerchantOwner(req, res)) return;

        const storeId = getTenantStoreId(req);
        if (!storeId) {
            return res.status(400).json({ error: "Unable to determine the store for this request." });
        }

        const now = new Date();
        const grants = await SupportAccessGrant.find({ storeId })
            .sort({ createdAt: -1 })
            .limit(20)
            .setOptions({ skipTenantFilter: true })
            .lean();

        const activeGrant = grants.find(
            (g) => g.status === "active" && new Date(g.expiresAt).getTime() > now.getTime()
        ) || null;

        res.json({
            hasActiveGrant: Boolean(activeGrant),
            activeGrant: activeGrant
                ? {
                    id: activeGrant._id,
                    reason: activeGrant.reason,
                    scopes: activeGrant.scopes,
                    grantedAt: activeGrant.grantedAt,
                    expiresAt: activeGrant.expiresAt,
                    usageCount: activeGrant.usageCount || 0,
                    grantedByEmail: activeGrant.grantedByEmail
                }
                : null,
            history: grants.map((g) => ({
                id: g._id,
                status:
                    g.status === "active" && new Date(g.expiresAt).getTime() <= now.getTime()
                        ? "expired"
                        : g.status,
                reason: g.reason,
                scopes: g.scopes,
                grantedAt: g.grantedAt,
                expiresAt: g.expiresAt,
                revokedAt: g.revokedAt,
                usageCount: g.usageCount || 0
            }))
        });
    } catch (err) {
        console.error("Get Support Access Status Error:", err);
        res.status(500).json({ error: "Failed to fetch support access status." });
    }
};

/**
 * DELETE /api/admin/support-access/:grantId?  (or /api/admin/support-access to revoke all)
 * Merchant revokes active support consent immediately.
 */
export const revokeSupportAccess = async (req, res) => {
    try {
        if (!assertMerchantOwner(req, res)) return;

        const storeId = getTenantStoreId(req);
        if (!storeId) {
            return res.status(400).json({ error: "Unable to determine the store for this request." });
        }

        const { grantId } = req.params;
        const filter = { storeId, status: "active" };
        if (grantId) filter._id = grantId;

        const now = new Date();
        const result = await SupportAccessGrant.updateMany(
            filter,
            {
                $set: {
                    status: "revoked",
                    revokedAt: now,
                    revokedByEmail: (req.user?.email || "").toLowerCase()
                }
            }
        ).setOptions({ skipTenantFilter: true });

        const store = await Store.findById(storeId).setOptions({ skipTenantFilter: true }).lean();

        await recordAuditLog({
            ...getClientMeta(req),
            adminUser: req.user?.name || store?.ownerName || "Merchant Owner",
            adminEmail: (req.user?.email || store?.ownerEmail || "").toLowerCase(),
            role: "Merchant Owner",
            action: "Revoke Support Access",
            actionCategory: "security",
            target: store?.name || "Store",
            targetId: String(storeId),
            storeId,
            storeName: store?.name || "",
            reason: "Merchant revoked support access consent",
            afterValue: { revokedCount: result.modifiedCount || 0, revokedAt: now.toISOString() }
        });

        res.json({
            message: result.modifiedCount
                ? `Support access revoked for ${result.modifiedCount} active grant(s).`
                : "No active support access grant was found to revoke.",
            revokedCount: result.modifiedCount || 0
        });
    } catch (err) {
        console.error("Revoke Support Access Error:", err);
        res.status(500).json({ error: "Failed to revoke support access." });
    }
};
