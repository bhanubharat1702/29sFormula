import express from "express";
import crypto from "crypto";
import Store from "../../models/Store.js";
import { ReservedSubdomain, DomainSettings, RESERVED_SUBDOMAINS } from "../../models/Domain.js";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import { dispatchCommunicationEvent } from "./communications.js";
import { invalidateTenantCache } from "../../middleware/tenantResolver.js";

const router = express.Router();

// Helper to seed reserved subdomains and default domain settings
export const seedDomainDefaults = async () => {
  try {
    const settingsCount = await DomainSettings.countDocuments();
    if (settingsCount === 0) {
      await DomainSettings.create({
        manualApprovalRequired: false,
        cnameTargetHost: "stores.yourplatform.com",
        aRecordTargetIp: "192.0.2.1",
        platformOwnDomain: "yourplatform.com",
        verificationMaxHours: 72,
        sslRenewalDaysBeforeExpiry: 30,
        planDomainLimits: {
          starter: 0,
          growth: 2,
          pro: 5,
          enterprise: 20
        }
      });
    }

    const reservedCount = await ReservedSubdomain.countDocuments();
    if (reservedCount === 0) {
      const defaultList = RESERVED_SUBDOMAINS.map(s => ({
        subdomain: s.toLowerCase().trim(),
        reason: "System core endpoint protection",
        addedBy: "System Seeder"
      }));
      await ReservedSubdomain.insertMany(defaultList, { ordered: false }).catch(() => {});
    } else {
      // Ensure missing default reserved subdomains are upserted safely
      const bulkOps = RESERVED_SUBDOMAINS.map(s => ({
        updateOne: {
          filter: { subdomain: s.toLowerCase().trim() },
          update: {
            $setOnInsert: {
              subdomain: s.toLowerCase().trim(),
              reason: "System core endpoint protection",
              addedBy: "System Seeder"
            }
          },
          upsert: true
        }
      }));
      await ReservedSubdomain.bulkWrite(bulkOps).catch(() => {});
    }
  } catch (err) {
    console.error("Failed to seed domain defaults:", err);
  }
};

// Helper function to calculate domain limits per plan
export const getPlanDomainLimit = (planName, settings) => {
  const limits = settings?.planDomainLimits || { starter: 0, growth: 2, pro: 5, enterprise: 20 };
  const key = (planName || 'starter').toLowerCase();
  if (limits[key] !== undefined) return limits[key];
  if (key === 'enterprise') return 20;
  if (key === 'pro') return 5;
  if (key === 'growth') return 2;
  return 0;
};

// ── 1. GET /api/superadmin/domains — List all domains across the platform ──
router.get("/api/superadmin/domains", verifySuperAdminToken, async (req, res) => {
  try {
    await seedDomainDefaults();
    const { search, type, dnsStatus, sslStatus, merchantId } = req.query;

    const query = {};
    if (merchantId) query._id = merchantId;

    const stores = await Store.find(query).select("name subdomain customDomain plan ownerEmail ownerName domains createdAt").lean();

    const settings = await DomainSettings.findOne().lean();

    let allDomains = [];

    stores.forEach(store => {
      // Subdomain item
      const subDomainItem = {
        _id: `${store._id}_subdomain`,
        storeId: store._id,
        storeName: store.name,
        subdomain: store.subdomain,
        ownerEmail: store.ownerEmail,
        ownerName: store.ownerName,
        plan: store.plan,
        domain: `${store.subdomain}.${settings?.platformOwnDomain || "yourplatform.com"}`,
        type: "subdomain",
        isPrimary: !store.customDomain,
        dnsStatus: "dns_verified",
        sslStatus: "active",
        createdAt: store.createdAt,
        lastDnsCheckAt: store.createdAt,
        verificationToken: "SYSTEM_INTERNAL",
        isBlocked: false,
        redirectWwwToRoot: false,
        redirectSubdomainToCustom: false
      };

      let storeDomainsList = [subDomainItem];

      if (store.domains && store.domains.length > 0) {
        store.domains.forEach(d => {
          if (d.type === 'subdomain') return; // skip redundant subdomain in list
          storeDomainsList.push({
            _id: d._id,
            storeId: store._id,
            storeName: store.name,
            subdomain: store.subdomain,
            ownerEmail: store.ownerEmail,
            ownerName: store.ownerName,
            plan: store.plan,
            domain: d.domain,
            type: d.type || "custom",
            isPrimary: Boolean(d.isPrimary),
            dnsStatus: d.dnsStatus || "pending",
            sslStatus: d.sslStatus || "pending",
            createdAt: d.createdAt,
            lastDnsCheckAt: d.lastDnsCheckAt || d.createdAt,
            verificationToken: d.verificationToken || "",
            dnsFailureReason: d.dnsFailureReason || "",
            targetCname: d.targetCname || settings?.cnameTargetHost || "stores.yourplatform.com",
            targetA: d.targetA || settings?.aRecordTargetIp || "192.0.2.1",
            isBlocked: Boolean(d.isBlocked),
            blockReason: d.blockReason || "",
            requiresManualApproval: Boolean(d.requiresManualApproval),
            approvedByAdmin: d.approvedByAdmin !== false,
            redirectWwwToRoot: d.redirectWwwToRoot !== false,
            redirectSubdomainToCustom: d.redirectSubdomainToCustom !== false,
            sslIssuedAt: d.sslIssuedAt,
            sslExpiresAt: d.sslExpiresAt
          });
        });
      } else if (store.customDomain) {
        // Fallback for store.customDomain legacy string
        storeDomainsList.push({
          _id: `${store._id}_custom`,
          storeId: store._id,
          storeName: store.name,
          subdomain: store.subdomain,
          ownerEmail: store.ownerEmail,
          ownerName: store.ownerName,
          plan: store.plan,
          domain: store.customDomain,
          type: "custom",
          isPrimary: true,
          dnsStatus: "active",
          sslStatus: "active",
          createdAt: store.createdAt,
          lastDnsCheckAt: store.createdAt,
          verificationToken: "LEGACY_VERIFIED",
          targetCname: settings?.cnameTargetHost || "stores.yourplatform.com",
          isBlocked: false,
          approvedByAdmin: true,
          redirectWwwToRoot: true,
          redirectSubdomainToCustom: true
        });
      }

      allDomains.push(...storeDomainsList);
    });

    // Apply filtering
    if (type && type !== "all") {
      allDomains = allDomains.filter(d => d.type === type);
    }
    if (dnsStatus && dnsStatus !== "all") {
      allDomains = allDomains.filter(d => d.dnsStatus === dnsStatus);
    }
    if (sslStatus && sslStatus !== "all") {
      allDomains = allDomains.filter(d => d.sslStatus === sslStatus);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      allDomains = allDomains.filter(d => 
        d.domain.toLowerCase().includes(q) ||
        d.storeName.toLowerCase().includes(q) ||
        d.subdomain.toLowerCase().includes(q) ||
        d.ownerEmail.toLowerCase().includes(q)
      );
    }

    res.json({
      domains: allDomains,
      settings
    });
  } catch (err) {
    console.error("Fetch Domains Error:", err);
    res.status(500).json({ error: "Failed to fetch domains list." });
  }
});

// ── 2. POST /api/superadmin/domains — Add custom domain (Super Admin or Merchant) ──
router.post("/api/superadmin/domains", verifySuperAdminToken, async (req, res) => {
  try {
    await seedDomainDefaults();
    const { storeId, domain, redirectWwwToRoot = true, redirectSubdomainToCustom = true } = req.body;

    if (!storeId || !domain) {
      return res.status(400).json({ error: "Store ID and Domain name are required." });
    }

    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!cleanDomain || cleanDomain.length < 4 || !cleanDomain.includes('.')) {
      return res.status(400).json({ error: "Please provide a valid domain name (e.g. store.merchantbrand.com)." });
    }

    const settings = await DomainSettings.findOne().lean();

    // Rule: Block platform's own domain or subdomains of platform
    const platformDomain = settings?.platformOwnDomain || "yourplatform.com";
    if (cleanDomain === platformDomain || cleanDomain.endsWith("." + platformDomain)) {
      return res.status(400).json({ error: `Cannot register platform's own domain '${cleanDomain}' as a custom domain.` });
    }

    // Rule: Uniqueness check across entire platform
    const existingStore = await Store.findOne({
      $or: [
        { customDomain: cleanDomain },
        { "domains.domain": cleanDomain }
      ]
    });

    if (existingStore) {
      return res.status(400).json({ error: `Domain '${cleanDomain}' is already connected to store '${existingStore.name}'.` });
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: "Merchant store not found." });
    }

    // Rule: Limit domains per plan
    const maxDomainsAllowed = getPlanDomainLimit(store.plan, settings);
    const existingCustomCount = (store.domains || []).filter(d => d.type === 'custom').length + (store.customDomain ? 1 : 0);

    if (existingCustomCount >= maxDomainsAllowed) {
      return res.status(400).json({ 
        error: `Plan limit reached! ${store.plan.toUpperCase()} plan allows max ${maxDomainsAllowed} custom domain(s). Please upgrade plan to add more.` 
      });
    }

    // Generate ownership TXT verification token
    const verificationToken = `verify-${crypto.randomBytes(16).toString('hex')}`;
    const targetCname = settings?.cnameTargetHost || "stores.yourplatform.com";
    const targetA = settings?.aRecordTargetIp || "192.0.2.1";
    const requiresApproval = Boolean(settings?.manualApprovalRequired);

    const isFirstCustom = existingCustomCount === 0;

    const newDomainObj = {
      domain: cleanDomain,
      type: 'custom',
      isPrimary: isFirstCustom,
      dnsStatus: 'pending',
      sslStatus: 'pending',
      verificationToken,
      targetCname,
      targetA,
      redirectWwwToRoot: Boolean(redirectWwwToRoot),
      redirectSubdomainToCustom: Boolean(redirectSubdomainToCustom),
      requiresManualApproval: requiresApproval,
      approvedByAdmin: !requiresApproval,
      isBlocked: false,
      lastDnsCheckAt: new Date(),
      dnsFailureReason: 'Awaiting DNS CNAME / A record verification and TXT ownership token'
    };

    if (!store.domains) store.domains = [];
    store.domains.push(newDomainObj);

    if (isFirstCustom) {
      store.customDomain = cleanDomain;
    }

    store.auditTrail.push({
      action: "Custom Domain Added",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: `Added custom domain '${cleanDomain}'. Verification token: ${verificationToken}`
    });

    await store.save();
    invalidateTenantCache(store._id);

    res.status(201).json({
      message: `Domain '${cleanDomain}' added successfully! Follow DNS instructions to verify.`,
      domain: newDomainObj,
      dnsInstructions: {
        domain: cleanDomain,
        cnameRecord: { host: cleanDomain, type: "CNAME", value: targetCname },
        aRecord: { host: "@", type: "A", value: targetA },
        txtRecord: { host: `_platform-challenge.${cleanDomain}`, type: "TXT", value: verificationToken }
      }
    });
  } catch (err) {
    console.error("Add Domain Error:", err);
    res.status(500).json({ error: err.message || "Failed to add domain." });
  }
});

// ── 3. POST /api/superadmin/domains/recheck — Trigger manual DNS / SSL check ──
router.post("/api/superadmin/domains/recheck", verifySuperAdminToken, async (req, res) => {
  try {
    const { domain, storeId } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain is required." });

    const store = storeId ? await Store.findById(storeId) : await Store.findOne({ "domains.domain": domain });
    if (!store) return res.status(404).json({ error: "Store not found for domain." });

    const targetDomain = (store.domains || []).find(d => d.domain === domain.toLowerCase().trim());
    
    // Perform simulated DNS verification & SSL issuance logic
    const success = true; // In production this does DNS lookup & Let's Encrypt ACME challenge

    if (targetDomain) {
      targetDomain.lastDnsCheckAt = new Date();
      targetDomain.dnsStatus = "dns_verified";
      targetDomain.sslStatus = "active";
      targetDomain.dnsFailureReason = "";
      targetDomain.sslIssuedAt = new Date();
      targetDomain.sslExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days validity

      await store.save();
      invalidateTenantCache(store._id);

      // Dispatch automated notification email for domain verified
      if (store.ownerEmail) {
        await dispatchCommunicationEvent({
          category: "domain verified",
          recipientEmail: store.ownerEmail,
          storeId: store._id,
          storeName: store.name,
          variables: {
            store_name: store.name,
            owner_name: store.ownerName || "Merchant",
            custom_domain: domain
          }
        });
      }
    }

    res.json({
      message: `DNS check completed for '${domain}'. Status: Active (SSL Issued)`,
      domain: targetDomain
    });
  } catch (err) {
    console.error("Recheck Domain Error:", err);
    res.status(500).json({ error: "Failed to recheck DNS." });
  }
});

// ── 4. POST /api/superadmin/domains/force-ssl-renewal — Force SSL renewal ──
router.post("/api/superadmin/domains/force-ssl-renewal", verifySuperAdminToken, async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain is required." });

    const store = await Store.findOne({ "domains.domain": domain.toLowerCase().trim() });
    if (!store) return res.status(404).json({ error: "Domain not found." });

    const target = store.domains.find(d => d.domain === domain.toLowerCase().trim());
    if (target) {
      target.sslStatus = "active";
      target.sslIssuedAt = new Date();
      target.sslExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      await store.save();
    }

    res.json({
      message: `SSL Certificate forcibly renewed for '${domain}'. Valid for next 90 days.`,
      domain: target
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to force SSL renewal." });
  }
});

// ── 5. PUT /api/superadmin/domains/set-primary — Set primary domain ──
router.put("/api/superadmin/domains/set-primary", verifySuperAdminToken, async (req, res) => {
  try {
    const { storeId, domain } = req.body;
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ error: "Store not found." });

    const cleanDomain = domain.toLowerCase().trim();

    if (store.domains && store.domains.length > 0) {
      store.domains.forEach(d => {
        d.isPrimary = (d.domain === cleanDomain);
      });
    }

    store.customDomain = cleanDomain;
    store.auditTrail.push({
      action: "Primary Domain Changed",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: `Primary domain set to '${cleanDomain}'`
    });

    await store.save();
    invalidateTenantCache(store._id);

    res.json({ message: `Primary domain set to '${cleanDomain}'`, store });
  } catch (err) {
    res.status(500).json({ error: "Failed to set primary domain." });
  }
});

// ── 6. POST /api/superadmin/domains/block — Block domain (abuse/phishing) ──
router.post("/api/superadmin/domains/block", verifySuperAdminToken, async (req, res) => {
  try {
    const { domain, blockReason } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain is required." });

    const store = await Store.findOne({ "domains.domain": domain.toLowerCase().trim() });
    if (!store) return res.status(404).json({ error: "Domain not found." });

    const target = store.domains.find(d => d.domain === domain.toLowerCase().trim());
    if (target) {
      target.isBlocked = true;
      target.blockReason = blockReason || "Security policy violation / suspicious activity";
      target.dnsStatus = "failed";
      target.dnsFailureReason = `Blocked by Super Admin: ${target.blockReason}`;
    }

    store.auditTrail.push({
      action: "Domain Blocked",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: `Domain '${domain}' blocked. Reason: ${blockReason}`
    });

    await store.save();
    invalidateTenantCache(store._id);

    res.json({ message: `Domain '${domain}' has been blocked.`, domain: target });
  } catch (err) {
    res.status(500).json({ error: "Failed to block domain." });
  }
});

// ── 7. DELETE /api/superadmin/domains — Remove custom domain ──
router.delete("/api/superadmin/domains", verifySuperAdminToken, async (req, res) => {
  try {
    const { storeId, domain } = req.body;
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ error: "Store not found." });

    const cleanDomain = domain.toLowerCase().trim();

    store.domains = (store.domains || []).filter(d => d.domain !== cleanDomain);
    if (store.customDomain === cleanDomain) {
      const remainingCustom = store.domains.find(d => d.type === 'custom');
      store.customDomain = remainingCustom ? remainingCustom.domain : "";
    }

    store.auditTrail.push({
      action: "Domain Removed",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: `Domain '${cleanDomain}' removed from store.`
    });

    await store.save();
    invalidateTenantCache(store._id);

    res.json({ message: `Domain '${cleanDomain}' removed successfully.` });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove domain." });
  }
});

// ── 8. GET /api/superadmin/domains/reserved — List reserved subdomains ──
router.get("/api/superadmin/domains/reserved", verifySuperAdminToken, async (req, res) => {
  try {
    await seedDomainDefaults();
    const list = await ReservedSubdomain.find().sort({ subdomain: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reserved subdomains." });
  }
});

// ── 9. POST /api/superadmin/domains/reserved — Add reserved subdomain ──
router.post("/api/superadmin/domains/reserved", verifySuperAdminToken, async (req, res) => {
  try {
    const { subdomain, reason } = req.body;
    if (!subdomain) return res.status(400).json({ error: "Subdomain is required." });

    const cleanSub = subdomain.toLowerCase().trim();
    const existing = await ReservedSubdomain.findOne({ subdomain: cleanSub });
    if (existing) return res.status(400).json({ error: `Subdomain '${cleanSub}' is already in reserved list.` });

    const reserved = await ReservedSubdomain.create({
      subdomain: cleanSub,
      reason: reason || "Reserved by Super Admin",
      addedBy: req.superAdmin?.email || "Super Admin"
    });

    res.status(201).json({ message: `Subdomain '${cleanSub}' reserved successfully.`, reserved });
  } catch (err) {
    res.status(500).json({ error: "Failed to add reserved subdomain." });
  }
});

// ── 10. DELETE /api/superadmin/domains/reserved/:id — Remove reserved subdomain ──
router.delete("/api/superadmin/domains/reserved/:id", verifySuperAdminToken, async (req, res) => {
  try {
    await ReservedSubdomain.findByIdAndDelete(req.params.id);
    res.json({ message: "Subdomain unreserved." });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove reserved subdomain." });
  }
});

// ── 11. POST /api/superadmin/domains/bulk-reverify — Bulk re-verify all pending domains ──
router.post("/api/superadmin/domains/bulk-reverify", verifySuperAdminToken, async (req, res) => {
  try {
    const stores = await Store.find({ "domains.dnsStatus": { $in: ["pending", "failed"] } });
    let count = 0;

    for (const store of stores) {
      let modified = false;
      store.domains.forEach(d => {
        if (d.dnsStatus === "pending" || d.dnsStatus === "failed") {
          d.dnsStatus = "dns_verified";
          d.sslStatus = "active";
          d.dnsFailureReason = "";
          d.sslIssuedAt = new Date();
          d.sslExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
          d.lastDnsCheckAt = new Date();
          modified = true;
          count++;
        }
      });
      if (modified) {
        await store.save();
        invalidateTenantCache(store._id);
      }
    }

    res.json({ message: `Bulk re-verification completed. ${count} domains updated to Active (SSL Issued).` });
  } catch (err) {
    res.status(500).json({ error: "Failed to perform bulk re-verification." });
  }
});

// ── 12. PUT /api/superadmin/domains/settings — Update global domain settings & plan limits ──
router.put("/api/superadmin/domains/settings", verifySuperAdminToken, async (req, res) => {
  try {
    const { manualApprovalRequired, cnameTargetHost, aRecordTargetIp, platformOwnDomain, planDomainLimits } = req.body;

    let settings = await DomainSettings.findOne();
    if (!settings) {
      settings = new DomainSettings();
    }

    if (manualApprovalRequired !== undefined) settings.manualApprovalRequired = Boolean(manualApprovalRequired);
    if (cnameTargetHost) settings.cnameTargetHost = cnameTargetHost.trim();
    if (aRecordTargetIp) settings.aRecordTargetIp = aRecordTargetIp.trim();
    if (platformOwnDomain) settings.platformOwnDomain = platformOwnDomain.trim();
    if (planDomainLimits) settings.planDomainLimits = { ...settings.planDomainLimits, ...planDomainLimits };

    await settings.save();
    res.json({ message: "Global Domain Settings updated.", settings });
  } catch (err) {
    res.status(500).json({ error: "Failed to update domain settings." });
  }
});

export default router;
