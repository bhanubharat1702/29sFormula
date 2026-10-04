import dns from "dns";
import crypto from "crypto";
import Store from "../models/Store.js";
import { DomainSettings, ReservedSubdomain, RESERVED_SUBDOMAINS } from "../models/Domain.js";
import { invalidateTenantCache } from "../middleware/tenantResolver.js";
import { getPlanDomainLimit, countCustomDomains } from "./superadmin/domainsController.js";

const DEFAULT_PLATFORM_DOMAIN = "29sformula.com";

/* ────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────── */

// Resolve the store document for the authenticated merchant.
// SECURITY: resolve ONLY from the authenticated token / server-resolved store.
// Never fall back to the client-supplied x-store-id / x-tenant-id headers here,
// otherwise a user could manage another tenant's domains by spoofing headers.
const resolveMerchantStore = async (req) => {
    const storeId = (req.user && req.user.storeId) || req.storeId || null;
    if (!storeId) return null;
    return Store.findById(storeId);
};

// Normalize a free-text brand name into a valid DNS subdomain label.
const slugifySubdomain = (input = "") => {
    return String(input)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")   // drop illegal chars
        .replace(/[\s_]+/g, "-")        // spaces / underscores -> hyphen
        .replace(/-+/g, "-")            // collapse hyphens
        .replace(/^-+|-+$/g, "")        // trim hyphens
        .slice(0, 63);                  // RFC 1035 max label length
};

// Basic but strict hostname validation (multi-label, TLD >= 2 chars).
const isValidDomain = (value = "") => {
    const d = String(value).toLowerCase().trim();
    if (!d || d.length > 253) return false;
    if (!d.includes(".")) return false;
    if (d.startsWith("http://") || d.startsWith("https://")) return false;
    return /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/.test(d);
};

const cleanDomainInput = (value = "") =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/^https?:\/\//, "")
        .replace(/\/.*$/, "")
        .replace(/\.$/, "");

// Returns true when the subdomain is a reserved system keyword (static + DB list).
const isReservedSubdomain = async (subdomain) => {
    const clean = String(subdomain || "").toLowerCase().trim();
    if (!clean) return true;
    if (RESERVED_SUBDOMAINS.includes(clean)) return true;
    const inDb = await ReservedSubdomain.findOne({ subdomain: clean }).lean().catch(() => null);
    return Boolean(inDb);
};

// Serialize one custom domain from store.domains[] for the merchant UI.
const serializeCustomDomain = (d, settings) => ({
    id: String(d._id),
    domain: d.domain,
    type: "custom",
    isPrimary: Boolean(d.isPrimary),
    dnsStatus: d.dnsStatus || "pending",
    sslStatus: d.sslStatus || "pending",
    verificationToken: d.verificationToken || "",
    targetCname: d.targetCname || settings?.cnameTargetHost || "store.29sformula.com",
    targetA: d.targetA || settings?.aRecordTargetIp || "192.0.2.1",
    dnsFailureReason: d.dnsFailureReason || "",
    isBlocked: Boolean(d.isBlocked),
    blockReason: d.blockReason || "",
    requiresManualApproval: Boolean(d.requiresManualApproval),
    approvedByAdmin: d.approvedByAdmin !== false,
    lastDnsCheckAt: d.lastDnsCheckAt || null,
    sslIssuedAt: d.sslIssuedAt || null,
    sslExpiresAt: d.sslExpiresAt || null,
    createdAt: d.createdAt || null
});

// Build the DNS setup instructions a merchant must apply at their registrar.
const buildDnsInstructions = (domain, targetCname, targetA, verificationToken) => ({
    domain,
    cnameRecord: { host: domain, type: "CNAME", value: targetCname },
    aRecord: { host: "@", type: "A", value: targetA },
    txtRecord: { host: `_platform-challenge.${domain}`, type: "TXT", value: verificationToken }
});

import { hasFeature } from "../utils/entitlement.js";

// Compute the merchant's custom-domain entitlement snapshot.
const buildEntitlement = async (store, settings) => {
    const plan = (store.plan || "starter").toLowerCase();
    const isEntitledByPlan = await hasFeature(store, "customDomain");
    const configuredLimit = getPlanDomainLimit(plan, settings);
    const limit = isEntitledByPlan ? Math.max(1, configuredLimit) : 0;
    const used = countCustomDomains(store);
    const featureEnabled = isEntitledByPlan;
    const entitled = featureEnabled && limit > 0;
    return {
        plan,
        limit,
        used,
        remaining: Math.max(0, limit - used),
        featureEnabled,
        entitled,
        canAdd: entitled && used < limit,
        upgradeRequired: !entitled || used >= limit,
        minPlanWithCustomDomain: "growth"
    };
};

/* ────────────────────────────────────────────────────────────────
 * Controllers
 * ──────────────────────────────────────────────────────────────── */

// GET /api/merchant/domains — full domain picture + entitlement for the merchant
export const listMerchantDomains = async (req, res) => {
    try {
        const store = await resolveMerchantStore(req);
        if (!store) return res.status(404).json({ error: "Merchant store not found for the authenticated user." });

        let settings = await DomainSettings.findOne().lean();
        if (!settings) {
            settings = { platformOwnDomain: DEFAULT_PLATFORM_DOMAIN, cnameTargetHost: "store.29sformula.com" };
        }

        const platformDomain = settings.platformOwnDomain || DEFAULT_PLATFORM_DOMAIN;
        const customDomains = (store.domains || [])
            .filter(d => d.type === "custom")
            .map(d => serializeCustomDomain(d, settings));

        // Legacy fallback: a scalar customDomain without a matching domains[] entry.
        if (store.customDomain && !customDomains.some(d => d.domain === store.customDomain)) {
            customDomains.push(serializeCustomDomain({
                _id: `${store._id}_legacy`,
                domain: store.customDomain,
                isPrimary: true,
                dnsStatus: "active",
                sslStatus: "active",
                verificationToken: "LEGACY_VERIFIED"
            }, settings));
        }

        const entitlement = await buildEntitlement(store, settings);

        // Auto-derive a sensible free subdomain from the merchant's brand/store name.
        const brandName = store.businessName || store.name || "";
        const suggestedSubdomain = slugifySubdomain(brandName);

        res.json({
            platformSubdomain: {
                label: store.subdomain,
                fullDomain: store.subdomain ? `${store.subdomain}.${platformDomain}` : "",
                status: store.subdomain ? "active" : "unassigned",
                isFree: true,
                brandName,
                suggestedSubdomain
            },
            customDomains,
            entitlement,
            settings: {
                platformOwnDomain: platformDomain,
                cnameTargetHost: settings.cnameTargetHost || "store.29sformula.com",
                aRecordTargetIp: settings.aRecordTargetIp || "192.0.2.1",
                manualApprovalRequired: Boolean(settings.manualApprovalRequired)
            }
        });
    } catch (err) {
        console.error("List Merchant Domains Error:", err);
        res.status(500).json({ error: "Failed to load domain settings." });
    }
};

// GET /api/merchant/domains/availability?subdomain=xyz — uniqueness/reservation check
export const checkSubdomainAvailability = async (req, res) => {
    try {
        const store = await resolveMerchantStore(req);
        if (!store) return res.status(404).json({ error: "Merchant store not found." });

        const requested = req.query.subdomain || req.query.label || store.name || "";
        const clean = slugifySubdomain(requested);

        if (!clean || clean.length < 3) {
            return res.json({
                subdomain: clean,
                available: false,
                reason: "Subdomain must be at least 3 characters (letters, numbers, hyphens)."
            });
        }

        const reserved = await isReservedSubdomain(clean);
        if (reserved) {
            return res.json({ subdomain: clean, available: false, reason: "This name is reserved by the platform." });
        }

        const isOwnCurrent = clean === store.subdomain;
        const taken = await Store.findOne({ subdomain: clean, _id: { $ne: store._id } }).lean();

        res.json({
            subdomain: clean,
            available: !taken || isOwnCurrent,
            isOwnCurrent,
            reason: taken && !isOwnCurrent ? "This subdomain is already assigned to another store." : ""
        });
    } catch (err) {
        console.error("Check Subdomain Availability Error:", err);
        res.status(500).json({ error: "Failed to check subdomain availability." });
    }
};

// POST /api/merchant/domains/subdomain — assign / change the free platform subdomain
export const assignPlatformSubdomain = async (req, res) => {
    try {
        const store = await resolveMerchantStore(req);
        if (!store) return res.status(404).json({ error: "Merchant store not found." });

        const raw = req.body.subdomain || req.body.label || store.name || "";
        const clean = slugifySubdomain(raw);

        if (!clean || clean.length < 3) {
            return res.status(400).json({ error: "Subdomain must be at least 3 characters (letters, numbers, hyphens)." });
        }

        if (clean === store.subdomain) {
            return res.json({ message: "This is already your active subdomain.", subdomain: clean });
        }

        if (await isReservedSubdomain(clean)) {
            return res.status(400).json({ error: `Subdomain '${clean}' is a reserved system keyword.` });
        }

        const taken = await Store.findOne({ subdomain: clean, _id: { $ne: store._id } }).lean();
        if (taken) {
            return res.status(409).json({ error: `Subdomain '${clean}' is already assigned to another store. Please choose another.` });
        }

        const previous = store.subdomain;
        store.subdomain = clean;

        // Keep the aggregate subdomain-type record in sync so the super-admin
        // domain list and tenant resolver never expose a stale hostname.
        const subSettings = await DomainSettings.findOne().lean();
        const platformDomain = (subSettings && subSettings.platformOwnDomain) || DEFAULT_PLATFORM_DOMAIN;
        const newSubdomainHost = `${clean}.${platformDomain}`;
        if (!store.domains) store.domains = [];
        const existingSubRecord = store.domains.find(d => d.type === "subdomain");
        if (existingSubRecord) {
            existingSubRecord.domain = newSubdomainHost;
        } else {
            store.domains.push({
                domain: newSubdomainHost,
                type: "subdomain",
                isPrimary: !store.customDomain,
                dnsStatus: "dns_verified",
                sslStatus: "active"
            });
        }

        store.auditTrail.push({
            action: "Platform Subdomain Changed",
            performedBy: req.user?.email || "Merchant",
            details: `Subdomain changed from '${previous}' to '${clean}'.`
        });

        await store.save();
        invalidateTenantCache(store._id);

        res.json({
            message: `Your free platform subdomain is now set to '${clean}'.`,
            subdomain: clean
        });
    } catch (err) {
        console.error("Assign Subdomain Error:", err);
        res.status(500).json({ error: err.message || "Failed to assign subdomain." });
    }
};

// POST /api/merchant/domains — connect a custom brand domain (plan-gated)
export const addMerchantDomain = async (req, res) => {
    try {
        const store = await resolveMerchantStore(req);
        if (!store) return res.status(404).json({ error: "Merchant store not found." });

        const rawDomain = req.body.domain || "";
        const cleanDomain = cleanDomainInput(rawDomain);

        if (!isValidDomain(cleanDomain)) {
            return res.status(400).json({ error: "Please provide a valid domain name (e.g. www.mybrand.com)." });
        }

        let settings = await DomainSettings.findOne().lean();
        if (!settings) {
            settings = { platformOwnDomain: DEFAULT_PLATFORM_DOMAIN, cnameTargetHost: "store.29sformula.com", aRecordTargetIp: "192.0.2.1" };
        }

        // Plan entitlement gate — the actual "conditions controlled by super admin".
        const entitlement = await buildEntitlement(store, settings);
        if (!entitlement.entitled) {
            return res.status(403).json({
                error: entitlement.featureEnabled
                    ? `Your ${entitlement.plan.toUpperCase()} plan does not include a custom brand domain. Upgrade to the GROWTH plan or higher to connect your own domain.`
                    : "Custom brand domains are disabled for your store. Please contact support.",
                upgradeRequired: true,
                entitlement
            });
        }
        if (entitlement.used >= entitlement.limit) {
            return res.status(403).json({
                error: `Custom domain limit reached! Your ${entitlement.plan.toUpperCase()} plan allows ${entitlement.limit} custom domain(s). Please upgrade to add more.`,
                upgradeRequired: true,
                entitlement
            });
        }

        const platformDomain = settings.platformOwnDomain || DEFAULT_PLATFORM_DOMAIN;
        if (cleanDomain === platformDomain || cleanDomain.endsWith(`.${platformDomain}`)) {
            return res.status(400).json({ error: `'${cleanDomain}' belongs to the platform and cannot be connected as a custom domain.` });
        }

        // Prevent this hostname (or its sub-host) colliding with any other store.
        const existingStore = await Store.findOne({
            $or: [{ customDomain: cleanDomain }, { "domains.domain": cleanDomain }]
        }).lean();
        if (existingStore) {
            return res.status(409).json({ error: `Domain '${cleanDomain}' is already connected to another store.` });
        }

        // Idempotency: never allow the same store to connect a domain twice,
        // which previously created duplicate pending records and orphan entries.
        const alreadyOwned = store.customDomain === cleanDomain
            || (store.domains || []).some(d => String(d.domain).toLowerCase() === cleanDomain);
        if (alreadyOwned) {
            return res.status(409).json({ error: `Domain '${cleanDomain}' is already connected to your store.` });
        }

        const verificationToken = `verify-${crypto.randomBytes(16).toString("hex")}`;
        const targetCname = settings.cnameTargetHost || "store.29sformula.com";
        const targetA = settings.aRecordTargetIp || "192.0.2.1";
        const requiresApproval = Boolean(settings.manualApprovalRequired);
        const isFirstCustom = entitlement.used === 0;

        const newDomain = {
            domain: cleanDomain,
            type: "custom",
            isPrimary: isFirstCustom,
            dnsStatus: "pending",
            sslStatus: "pending",
            verificationToken,
            targetCname,
            targetA,
            redirectWwwToRoot: true,
            redirectSubdomainToCustom: true,
            requiresManualApproval: requiresApproval,
            approvedByAdmin: !requiresApproval,
            isBlocked: false,
            lastDnsCheckAt: new Date(),
            dnsFailureReason: "Awaiting CNAME/A record and TXT ownership token verification."
        };

        // Re-check collision right before atomic update to prevent race conditions
        const finalCheck = await Store.findOne({
            _id: { $ne: store._id },
            $or: [{ customDomain: cleanDomain }, { "domains.domain": cleanDomain }]
        }).lean();
        if (finalCheck) {
            return res.status(409).json({ error: `Domain '${cleanDomain}' is already connected to another store.` });
        }

        const updatedStore = await Store.findOneAndUpdate(
            {
                _id: store._id,
                "domains.domain": { $ne: cleanDomain }
            },
            {
                $push: {
                    domains: newDomain,
                    auditTrail: {
                        action: "Custom Domain Added",
                        performedBy: req.user?.email || "Merchant",
                        details: `Merchant added custom domain '${cleanDomain}'.`
                    }
                },
                ...(isFirstCustom ? { customDomain: cleanDomain } : {})
            },
            { new: true }
        );

        if (!updatedStore) {
            return res.status(409).json({ error: `Domain '${cleanDomain}' is already connected to your store.` });
        }

        invalidateTenantCache(store._id);

        res.status(201).json({
            message: `Domain '${cleanDomain}' added. Apply the DNS records below to verify ownership.`,
            domain: serializeCustomDomain(newDomain, settings),
            dnsInstructions: buildDnsInstructions(cleanDomain, targetCname, targetA, verificationToken),
            entitlement: buildEntitlement(store, settings)
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: "Domain is already connected to another store." });
        }
        console.error("Add Merchant Domain Error:", err);
        res.status(500).json({ error: err.message || "Failed to add domain." });
    }
};

// POST /api/merchant/domains/recheck — verify DNS + (simulate) SSL issuance
export const recheckMerchantDomain = async (req, res) => {
    try {
        const store = await resolveMerchantStore(req);
        if (!store) return res.status(404).json({ error: "Merchant store not found." });

        const cleanDomain = cleanDomainInput(req.body.domain || "");
        if (!cleanDomain) return res.status(400).json({ error: "Domain is required." });

        const target = (store.domains || []).find(d => d.domain === cleanDomain);
        if (!target) return res.status(404).json({ error: `Domain '${cleanDomain}' is not connected to your store.` });
        if (target.isBlocked) return res.status(403).json({ error: "This domain is blocked by the platform. Please contact support." });

        target.lastDnsCheckAt = new Date();

        // Real DNS checks — TXT ownership token and/or CNAME pointing at the platform.
        let txtOk = false;
        let cnameOk = false;
        let lookupError = "";

        try {
            const txtRecords = await dns.promises.resolveTxt(`_platform-challenge.${cleanDomain}`);
            const flat = txtRecords.map(parts => parts.join(""));
            txtOk = target.verificationToken ? flat.includes(target.verificationToken) : flat.length > 0;
        } catch (e) {
            lookupError = `TXT lookup failed (${e.code || e.message}).`;
        }

        try {
            const cnames = await dns.promises.resolveCname(cleanDomain);
            const expected = (target.targetCname || "").toLowerCase();
            cnameOk = cnames.some(c => String(c).toLowerCase().replace(/\.$/, "") === expected.replace(/\.$/, ""));
        } catch (e) {
            lookupError = `${lookupError} CNAME lookup failed (${e.code || e.message}).`.trim();
        }

        const ownershipVerified = txtOk || cnameOk;

        // A domain configured for manual approval must NOT be auto-activated by
        // the merchant's own re-check; it only becomes servable after a platform
        // admin approves it. Otherwise the super-admin gate is trivially bypassed.
        const awaitingApproval = ownershipVerified
            && target.requiresManualApproval
            && target.approvedByAdmin === false;

        if (ownershipVerified && !awaitingApproval) {
            target.dnsStatus = "active";
            target.sslStatus = "active";
            target.dnsFailureReason = "";
            target.sslIssuedAt = new Date();
            target.sslExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        } else if (awaitingApproval) {
            target.dnsStatus = "dns_verified";
            target.sslStatus = "pending";
            target.dnsFailureReason = "DNS verified. Awaiting platform admin approval before activation.";
        } else {
            target.dnsStatus = "pending";
            target.sslStatus = "pending";
            target.dnsFailureReason = txtOk === false && cnameOk === false
                ? `DNS records not detected yet. ${lookupError}`.trim()
                : "Ownership not verified yet. Please confirm your DNS records have propagated.";
        }

        store.auditTrail.push({
            action: "Domain Recheck",
            performedBy: req.user?.email || "Merchant",
            details: `DNS recheck for '${cleanDomain}'. Result: ${target.dnsStatus}.`
        });

        await store.save();
        invalidateTenantCache(store._id);

        res.json({
            message: awaitingApproval
                ? `'${cleanDomain}' ownership verified. It will go live once a platform admin approves it.`
                : ownershipVerified
                    ? `'${cleanDomain}' verified successfully. SSL is now active.`
                    : `'${cleanDomain}' is not verified yet. Apply the DNS records and try again after propagation.`,
            verified: ownershipVerified,
            awaitingApproval,
            domain: serializeCustomDomain(target, null),
            dnsInstructions: buildDnsInstructions(
                cleanDomain,
                target.targetCname,
                target.targetA,
                target.verificationToken
            )
        });
    } catch (err) {
        console.error("Recheck Merchant Domain Error:", err);
        res.status(500).json({ error: "Failed to recheck domain." });
    }
};

// PUT /api/merchant/domains/set-primary — choose which custom domain is canonical
export const setPrimaryMerchantDomain = async (req, res) => {
    try {
        const store = await resolveMerchantStore(req);
        if (!store) return res.status(404).json({ error: "Merchant store not found." });

        const cleanDomain = cleanDomainInput(req.body.domain || "");
        const target = (store.domains || []).find(d => d.type === "custom" && d.domain === cleanDomain);
        if (!target) return res.status(404).json({ error: `Custom domain '${cleanDomain}' is not connected to your store.` });

        (store.domains || []).forEach(d => {
            if (d.type === "custom") d.isPrimary = (d.domain === cleanDomain);
        });
        store.customDomain = cleanDomain;

        store.auditTrail.push({
            action: "Primary Domain Changed",
            performedBy: req.user?.email || "Merchant",
            details: `Primary custom domain set to '${cleanDomain}'.`
        });

        await store.save();
        invalidateTenantCache(store._id);

        res.json({ message: `Primary domain set to '${cleanDomain}'.`, domain: cleanDomain });
    } catch (err) {
        console.error("Set Primary Merchant Domain Error:", err);
        res.status(500).json({ error: "Failed to set primary domain." });
    }
};

// DELETE /api/merchant/domains — disconnect a custom domain
export const removeMerchantDomain = async (req, res) => {
    try {
        const store = await resolveMerchantStore(req);
        if (!store) return res.status(404).json({ error: "Merchant store not found." });

        const cleanDomain = cleanDomainInput(req.body.domain || req.query.domain || "");
        if (!cleanDomain) return res.status(400).json({ error: "Domain is required." });

        const existed = (store.domains || []).some(d => d.type === "custom" && d.domain === cleanDomain);
        if (!existed && store.customDomain !== cleanDomain) {
            return res.status(404).json({ error: `Domain '${cleanDomain}' is not connected to your store.` });
        }

        store.domains = (store.domains || []).filter(d => !(d.type === "custom" && d.domain === cleanDomain));

        if (store.customDomain === cleanDomain) {
            const nextCustom = store.domains.find(d => d.type === "custom");
            store.customDomain = nextCustom ? nextCustom.domain : "";
            if (nextCustom) nextCustom.isPrimary = true;
        }

        store.auditTrail.push({
            action: "Custom Domain Removed",
            performedBy: req.user?.email || "Merchant",
            details: `Merchant removed custom domain '${cleanDomain}'.`
        });

        await store.save();
        invalidateTenantCache(store._id);

        res.json({ message: `Domain '${cleanDomain}' removed successfully.` });
    } catch (err) {
        console.error("Remove Merchant Domain Error:", err);
        res.status(500).json({ error: "Failed to remove domain." });
    }
};
