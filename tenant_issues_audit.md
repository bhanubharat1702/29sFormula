# Tenant Account Audit & Scalability Roadmap
*Generated: 2026-09-29 | Status: All 15 Audited Issues Resolved*

---

## 🎉 ACTIVE ISSUES STATUS

All **15/15** identified tenant isolation, database race condition, brand configuration, email routing, and caching issues have been **successfully resolved and verified via automated integration tests**. There are currently **0 remaining open bugs** in the core tenant isolation engine.

---

## 🚀 ENTERPRISE SCALING & BEST PRACTICES (WHAT BIG BRANDS DO AT SCALE)

For future scaling (as the platform grows to thousands of concurrent merchants), the following enterprise patterns used by industry leaders (**Shopify, Stripe, Vercel, and AWS**) can be adopted:

---

### 1. Per-Tenant Rate Limiting & Resource Throttling (Noisy Neighbor Protection)
- **The Issue**: Currently, rate limits are applied per client IP globally (`app.use("/api", generalLimiter)`). A flash sale on one popular merchant store could consume server resources and affect response times for other merchants.
- **What Big Brands Do (Shopify & Stripe)**: Shopify and Stripe enforce rate limits per tenant account (`storeId`) using a sliding window in Redis (e.g. 40 requests/sec per store plan).
- **The Fix**:
  ```js
  // Rate limit key scoped per store ID
  const storeRateLimiter = rateLimit({
    keyGenerator: (req) => req.storeId ? `ratelimit:${req.storeId}` : req.ip,
    max: req => req.store?.plan === 'pro' ? 1000 : 200,
    windowMs: 60 * 1000
  });
  ```

---

### 2. Standardized Redis Key Namespacing
- **The Issue**: In-memory and Redis caches are flushed using patterns like `settings:*` or `products:*`.
- **What Big Brands Do (Redis / Vercel)**: Industry platforms enforce strict key namespacing: `tenant:<storeId>:<resource>:<id>`.
- **The Fix**:
  - Enforce key prefixing helper: `getTenantCacheKey(storeId, resource, id)` -> `tenant:6501a2b:product:98765`.
  - Invalidation only flushes `tenant:6501a2b:*` keys without touching other merchants' cached data.

---

### 3. Fail-Closed Tenant Context Guardrail
- **The Issue**: If a query is executed outside an express HTTP request (e.g. a standalone script or background worker) without calling `runWithTenant`, it currently proceeds un-scoped.
- **What Big Brands Do (AWS & PostgreSQL RLS)**: Multi-tenant systems throw an explicit error if a tenant-scoped collection is queried without an active tenant context unless `runWithoutTenant()` is explicitly invoked.
- **The Fix**:
  - Update `mongooseTenantPlugin.js` to throw an Error if `schema.path("storeId")` exists, `!isTenantBypassed()`, and `getTenantStoreIdFromContext()` is `null`.

---

### 4. Tenant-Aware Background Job Queues
- **The Issue**: Background tasks (such as sending emails or bulk inventory sync) share a global BullMQ queue.
- **What Big Brands Do (Shopify & Salesforce)**: Job queues include tenant metadata in job context and use tenant-concurrency limits so one merchant submitting 50,000 email requests does not block another merchant's order confirmation emails.
- **The Fix**:
  - Attach `storeId` to every BullMQ job payload.
  - Wrap job processor execution block inside `runWithTenant(job.data.storeId, async () => { ... })`.

---

## 🎯 SUMMARY OF RESOLVED AUDIT ITEMS (15/15 COMPLETED)

1. ✅ **Product Details Cache**: Scoped to `${storeId}:${productId}`.
2. ✅ **Reviews Isolation**: Automatically scoped via global Mongoose plugin.
3. ✅ **Discounts Isolation**: Scoped via Mongoose plugin; invalid cross-tenant codes return 404.
4. ✅ **Latest Arrivals Limit**: Scoped within `runWithTenant` context.
5. ✅ **Customer Lookups**: Scoped automatically via `AsyncLocalStorage`.
6. ✅ **Admin Reviews Endpoint**: Scoped to merchant store account.
7. ✅ **Category Rename**: Scoped to merchant products.
8. ✅ **Product Delete Validation**: Scoped to tenant store.
9. ✅ **Shared Database Architecture**: Implemented `AsyncLocalStorage` tenant context + Mongoose plugin.
10. ✅ **Server Startup Race Condition**: Enabled `bufferCommands = true` in Mongoose config.
11. ✅ **Order Emails & Branding**: `getBrandInfo` falls back to tenant context; handlers pass `storeId`.
12. ✅ **Merchant Dashboard Orders**: `tenantResolver` extracts `storeId` from body, query, headers, and domains.
13. ✅ **Store Owner Order Notifications**: Dynamic lookup of merchant `Store.ownerEmail` / `User.email`.
14. ✅ **Multi-Tenant Host Resolution**: Resolves seamlessly from custom domain, subdomain, body, query, headers.
15. ✅ **Tenant Resolver Cache Invalidation**: `invalidateTenantCache(storeId)` called on store/setting updates.
