import cron from "node-cron";
import Store from "../models/Store.js";
import { DomainSettings } from "../models/Domain.js";
import { pollSslCertificateStatus } from "../services/edgeProviderService.js";
import { invalidateTenantCache } from "../middleware/tenantResolver.js";
import { runWithoutTenant } from "../utils/tenantContext.js";

/**
 * Poll Edge Provider for pending/issuing SSL certificates across all active custom domains
 */
export const runSslStatusPolling = async () => {
    return runWithoutTenant(async () => {
        try {
            const settings = await DomainSettings.findOne().lean();
            const providerOptions = {
                provider: settings?.edgeProvider || "cloudflare",
                cloudflareZoneId: settings?.cloudflareZoneId,
                cloudflareApiToken: settings?.cloudflareApiToken,
                vercelProjectId: settings?.vercelProjectId,
                vercelTeamId: settings?.vercelTeamId,
                vercelAuthToken: settings?.vercelAuthToken
            };

            // Find all stores with domains that are currently issuing, pending, or dns_verified
            const stores = await Store.find({
                "domains": {
                    $elemMatch: {
                        type: "custom",
                        $or: [
                            { sslStatus: "issuing" },
                            { sslStatus: "pending" },
                            { dnsStatus: "dns_verified" }
                        ]
                    }
                }
            });

            let updatedCount = 0;

            for (const store of stores) {
                let modified = false;

                for (const target of (store.domains || [])) {
                    if (target.type === "custom" && (target.sslStatus === "issuing" || target.sslStatus === "pending" || target.dnsStatus === "dns_verified")) {
                        // Skip if blocked or not admin-approved
                        if (target.isBlocked) continue;
                        if (target.requiresManualApproval && target.approvedByAdmin === false) continue;

                        const opts = {
                            ...providerOptions,
                            provider: target.sslProvider || providerOptions.provider
                        };

                        const pollRes = await pollSslCertificateStatus(target.domain, target, opts);

                        if (pollRes.success && pollRes.sslStatus !== target.sslStatus) {
                            target.sslStatus = pollRes.sslStatus;
                            if (pollRes.sslIssuedAt) target.sslIssuedAt = pollRes.sslIssuedAt;
                            if (pollRes.sslExpiresAt) target.sslExpiresAt = pollRes.sslExpiresAt;
                            target.sslFailureReason = pollRes.sslFailureReason || "";
                            target.sslLastPolledAt = new Date();

                            if (pollRes.sslStatus === "active") {
                                target.dnsStatus = "active";
                            } else if (pollRes.sslStatus === "failed") {
                                target.dnsFailureReason = pollRes.sslFailureReason || "SSL issuance failed at Edge Provider.";
                            }

                            modified = true;
                            updatedCount++;
                        }
                    }
                }

                if (modified) {
                    await store.save();
                    invalidateTenantCache(store._id);
                }
            }

            if (updatedCount > 0) {
                console.log(`[SSL Polling Cron] Updated SSL status for ${updatedCount} custom domain(s).`);
            }
        } catch (err) {
            console.error("[SSL Polling Cron] Error during SSL status polling:", err);
        }
    });
};

/**
 * Start the SSL polling cron job (runs every 5 minutes)
 */
export const startSslPollingCron = () => {
    cron.schedule("*/5 * * * *", runSslStatusPolling);
    console.log("SSL status polling cron job scheduled (runs every 5 minutes).");
};
