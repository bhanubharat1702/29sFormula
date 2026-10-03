# Project Functional Issues Audit (Compared to Real-World SaaS)

This document outlines the critical functional gaps in the current multi-tenant e-commerce platform. When compared to real-world SaaS applications (like Shopify, WooCommerce, or Vercel), these areas require immediate architectural attention before the platform can function perfectly in a production environment.

---

## 1. Payment Gateways & Checkout Verification (Merchant-to-Customer)
### The Issues:
* **Dummy Verifications:** The non-Razorpay gateways (Stripe, PayPal, PhonePe, Paytm) rely on the frontend sending an `initData` object to the `/api/orders/payment/verify` route, which blindly marks the order as paid. The backend does not actually fetch the Intent/Transaction status directly from the gateway's API.
* **No Async Webhooks:** There are no webhook listeners for any payment gateways. If a customer's browser crashes immediately after paying (before redirecting to the success page), the order remains permanently stuck as "Payment Pending".
* **Disconnected Admin Refunds:** Clicking "Refund" in the Merchant Admin panel simply updates the `refundStatus` string in MongoDB and sends a notification email. It **does not** communicate with Stripe/PayPal to actually reverse the charge, forcing the merchant to do double data-entry.

### How Big Brands Handle It:
* Require Server-to-Server signature verification (HMAC) or SDK validation for all captured funds.
* Use webhooks as the ultimate source of truth for order status.
* Integrate the gateway's refund API directly into the admin dashboard actions.

### How to Fix in Detail:
1. **Webhooks Implementation**: Create endpoints like `POST /api/webhooks/stripe` and `POST /api/webhooks/paypal`. Use the provider's SDK to verify the incoming webhook signature. Update the `Order` status to `Paid` only when `checkout.session.completed` or `payment_intent.succeeded` is received.
2. **Server-Side Verification**: In `/api/orders/payment/verify`, instead of trusting the frontend payload, use `stripe.paymentIntents.retrieve(intentId)` or the PayPal Orders API to fetch the actual status from the provider before marking the DB order as paid.
3. **Refund Integration**: Update the admin refund controller. Before updating MongoDB, make a call to `stripe.refunds.create({ payment_intent: order.paymentIntentId })` or Razorpay's `instance.payments.refund()`. Wrap the DB update and API call in a `try-catch` block so if the API fails, the DB is not updated.

---

## 2. SaaS Subscription Billing & Enforcements (Platform-to-Merchant)
### The Issues:
* **No Actual Subscription Engine:** Merchants select plans (Starter, Growth, Pro, Enterprise), but there is no integration with Stripe Billing, Chargebee, or LemonSqueezy to actually charge their credit cards monthly. It is purely cosmetic data on the `Store` model.
* **Missing Plan Enforcement:** Despite having different tiers, the backend routes (e.g., `productRoutes.js`) do not enforce quotas. A merchant on the "Starter" plan can theoretically upload an unlimited number of products or consume unlimited bandwidth.

### How Big Brands Handle It:
* A dedicated billing microservice synchronizes the merchant's plan limits via Stripe Webhooks.
* API middleware actively intercepts and blocks requests that exceed the merchant's active plan quotas.

### How to Fix in Detail:
1. **Stripe Billing Integration**: Set up Stripe Billing. When a merchant signs up, create a Stripe Customer. Provide a Stripe Checkout Session for them to subscribe to a 'Growth' or 'Pro' plan.
2. **Webhook Sync**: Add a webhook at `POST /api/webhooks/billing` to listen for `invoice.payment_succeeded` and `customer.subscription.deleted`. Update the `Store` model's `plan` and `subscriptionStatus` fields based on these events, ensuring they only get Pro features if they actually pay.
3. **Plan Quota Middleware**: Create a `planEnforcer` middleware. For example, if `req.method === 'POST'` on `/api/products`, count the merchant's current products. If they are on the "Starter" plan and have >= 10 products, return a `403 Forbidden` response prompting an upgrade.

---

## 3. Superadmin Analytics & BI (Mocked Data)
### The Issues:
* **Fake Snapshots:** The `seedAnalyticsDemoMetrics` function populates the Superadmin dashboard with entirely fabricated historical data for MRR, Churn, and Funnel metrics.
* **Hardcoded Live Math:** In `analyticsController.js`, `computeLiveAnalyticsData` calculates MRR by arbitrarily assigning a dollar value (e.g., $29, $79, $299) based on the string value of `store.plan`. It does not calculate actual revenue from successful subscription invoices.

### How Big Brands Handle It:
* Use a data warehouse or direct queries against a ledger of actual generated invoices/receipts to calculate MRR and Churn accurately.

### How to Fix in Detail:
1. **Remove Mock Data**: Delete the `seedAnalyticsDemoMetrics` function so the Superadmin dashboard stops displaying fabricated data.
2. **Subscription Ledger**: Create a `SubscriptionInvoice` MongoDB model that logs actual payments received from merchants via the Stripe Billing webhooks.
3. **Accurate MRR Calculation**: Update `computeLiveAnalyticsData` to aggregate the sum of `amount_paid` from `SubscriptionInvoice` over the past 30 days, rather than arbitrarily mapping the string `store.plan` to a hardcoded dollar amount.

---

## 4. Multi-Tenant Asset Storage (Cloudinary Security)
### The Issues:
* **Shared Storage Folder:** In `uploadRoutes.js`, every uploaded image across all merchants is saved to a single hardcoded Cloudinary folder (`folder: "store-engine"`). 
* **Insecure Deletion API:** The `/api/upload/delete` endpoint accepts any Cloudinary URL and attempts to delete it without validating if the currently authenticated merchant actually owns the image. **Tenant A can maliciously delete Tenant B's store logo.**
* **No Storage Quotas:** Because assets are not grouped by `storeId`, the platform cannot calculate or limit how many gigabytes of storage a specific merchant is consuming.

### How Big Brands Handle It:
* Assets are strictly scoped into sub-folders like `tenant_<storeId>/assets/`.
* The deletion endpoint requires the asset ID, looks up the owner in the DB, and only issues the delete command if `asset.storeId === req.storeId`.

### How to Fix in Detail:
1. **Tenant-Scoped Folders**: In `uploadRoutes.js`, dynamically set the Cloudinary upload folder using the merchant's context: `folder: \`store-engine/tenant_${req.storeId}\``.
2. **Database Asset Tracking**: Create an `Asset` MongoDB model `({ url, publicId, storeId })`. When a file is uploaded, save its metadata to this collection.
3. **Secure Deletion**: Modify `/api/upload/delete`. Require the user to pass the `assetId`. Look up the asset in the database. If `asset.storeId !== req.storeId`, throw a 403 error. Only then, call Cloudinary's `destroy(asset.publicId)`.

---

## 5. Custom Domain SSL Provisioning (Faked)
### The Issues:
* **Fake SSL Status:** In `merchantDomainController.js`, when a merchant correctly verifies DNS ownership (via CNAME or TXT record), the backend simply hardcodes `sslStatus = "active"` and `sslExpiresAt = Date.now() + 90 days`. 
* **No Actual Certificates:** The platform never actually talks to Let's Encrypt (via ACME) or a reverse proxy API (like Cloudflare for SaaS or AWS API Gateway) to physically generate and attach a TLS certificate for the domain.

### How Big Brands Handle It:
* The backend triggers a queue job that interfaces with Let's Encrypt (using a library like `greenlock`) or an infrastructure provider to provision, validate, and renew real SSL certificates dynamically.

### How to Fix in Detail:
1. **Infrastructure Integration**: Choose an edge provider (e.g., Cloudflare for SaaS, Vercel Domains API, or AWS API Gateway). 
2. **API Provisioning**: In `merchantDomainController.js` during `recheckMerchantDomain`, if DNS ownership passes, make an API call to the edge provider (e.g., `POST /client/v4/zones/{zone}/custom_hostnames` for Cloudflare) to physically provision the SSL certificate.
3. **Status Polling**: Set up a background job to poll the edge provider for the actual SSL certificate status and update `sslStatus` to "active" only when the provider confirms the certificate is fully deployed and securing traffic.

---

## 6. Missing Background Task Runners
### The Issues:
* **Orphaned Scheduled Jobs:** The Superadmin analytics panel allows saving "Scheduled Reports" (e.g., send weekly emails). However, there is no CRON job, BullMQ worker, or background process implemented to actually read these schedules and dispatch the emails.

### How Big Brands Handle It:
* Implement a robust task queue (Redis + BullMQ) that runs separately from the Express HTTP server to handle cron schedules, email dispatching, and background data synchronization.

### How to Fix in Detail:
1. **Redis & BullMQ Setup**: Install `bullmq` and connect it to a Redis instance. Create a dedicated worker file (e.g., `workers/reportWorker.js`) that runs independently of the main Express app.
2. **Cron Job Definition**: Use BullMQ's repeatable jobs feature (or `node-cron`) to run a function every hour. This function should query `SavedReport.find({ isScheduled: true })`.
3. **Execution Logic**: For each scheduled report whose time has elapsed, execute the analytics aggregation query, generate the CSV or PDF, and dispatch it via the Email Service (e.g., Brevo) to the `emailRecipients` list.
