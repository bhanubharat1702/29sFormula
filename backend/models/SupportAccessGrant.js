import mongoose from "mongoose";

/**
 * SupportAccessGrant
 * ------------------
 * Explicit, time-limited consent record created by a MERCHANT (store owner)
 * that authorises platform Super Admins to impersonate their tenant for
 * support/troubleshooting only.
 *
 * Design principles:
 *  - No persistent backdoor: every grant has a hard `expiresAt`.
 *  - Merchant-controlled: only the store owner may grant/revoke.
 *  - Auditable: grant, use and revoke are all recorded.
 *  - Least privilege: optional scopes restrict what support can do.
 *
 * NOTE: This schema intentionally includes a `storeId` field so the global
 * mongooseTenantPlugin scopes it to the active tenant context.
 */
const supportAccessGrantSchema = new mongoose.Schema(
    {
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true
        },
        storeName: { type: String, default: "" },

        // Who consented (the merchant)
        grantedByUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        grantedByName: { type: String, default: "" },
        grantedByEmail: { type: String, default: "", lowercase: true, trim: true },

        // Consent lifecycle
        status: {
            type: String,
            enum: ["active", "revoked", "expired"],
            default: "active",
            index: true
        },
        reason: { type: String, default: "Merchant-initiated support access" },
        durationHours: { type: Number, default: 24, min: 1, max: 168 },

        // Optional least-privilege scope. Empty array = full store admin support.
        scopes: {
            type: [String],
            default: ["support"]
        },

        // Restrict support access to a specific Super Admin, when provided.
        assignedSuperAdminEmail: { type: String, default: "", lowercase: true, trim: true },

        grantedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true, index: true },

        revokedAt: { type: Date, default: null },
        revokedByEmail: { type: String, default: "" },

        lastUsedAt: { type: Date, default: null },
        usageCount: { type: Number, default: 0 },

        // Detailed trail of which Super Admins used this consent.
        usedBySuperAdmins: [
            {
                email: { type: String, default: "" },
                superAdminId: { type: String, default: "" },
                usedAt: { type: Date, default: Date.now },
                ipAddress: { type: String, default: "" }
            }
        ],

        // Snapshot of the storefront/support context at grant time (audit aid)
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
    },
    { timestamps: true }
);

supportAccessGrantSchema.index({ storeId: 1, status: 1, expiresAt: 1 });
supportAccessGrantSchema.index({ grantedByEmail: 1, createdAt: -1 });

/**
 * Helper: is this grant currently usable?
 */
supportAccessGrantSchema.methods.isUsable = function () {
    if (this.status !== "active") return false;
    if (!this.expiresAt) return false;
    return this.expiresAt.getTime() > Date.now();
};

const SupportAccessGrant =
    mongoose.models.SupportAccessGrant ||
    mongoose.model("SupportAccessGrant", supportAccessGrantSchema);

export default SupportAccessGrant;
