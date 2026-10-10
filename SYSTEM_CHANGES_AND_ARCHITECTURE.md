# System Architecture & Change History Documentation

> **Notice for AI Assistants & Developers**:
> Refer to this authoritative document whenever investigating issues, extending functionality, or refactoring features related to SSL Domain Provisioning, Storefront Settings Synchronization, Admin Save Controls, or Storefront Product Performance.

---

## Table of Contents
1. [Overview & Core Architecture](#1-overview--core-architecture)
2. [Feature 1: SSL Domain Provisioning & Live Status Polling](#feature-1-ssl-domain-provisioning--live-status-polling)
3. [Feature 2: Storefront Hero & Carousel Slides Synchronization](#feature-2-storefront-hero--carousel-slides-synchronization)
4. [Feature 3: Admin Save Button Dirty-State & Persistence Controls](#feature-3-admin-save-button-dirty-state--persistence-controls)
5. [Feature 4: All Products Page Database Performance Optimization](#feature-4-all-products-page-database-performance-optimization)
6. [Troubleshooting & Verification Guide](#troubleshooting--verification-guide)

---

## 1. Overview & Core Architecture

The system is a multi-tenant E-Commerce platform built with:
- **Frontend**: Next.js (React TSX, App Router)
- **Backend**: Node.js / Express with MongoDB (Mongoose ORM)
- **Caching & State**: `localStorage` caching with cross-tab and custom DOM event listeners (`settingsUpdated`).

---

## Feature 1: SSL Domain Provisioning & Live Status Polling

### 1.1 Problem Statement
Previously, when a merchant verified DNS ownership of a custom domain, the backend hardcoded `sslStatus: "active"` and assigned a fake 90-day expiry date without actually issuing a TLS/SSL certificate via an edge provider.

### 1.2 Implemented Solution
We built an Edge Provider Adapter architecture that makes real API calls to provision TLS certificates and poll live SSL status.

#### Key Components:
1. **Edge Provider Service Layer** (`backend/services/edgeProviderService.js`):
   - Implements abstract interface supporting Cloudflare for SaaS, Vercel Domains, and a Mock Adapter for automated test environments.
   - Handles custom domain registration, hostname status checks, and deletion requests via provider API calls.

2. **Database Schema Enhancements** (`backend/models/Domain.js` & `backend/models/Store.js`):
   - Added `sslProvider` (`"cloudflare"`, `"vercel"`, `"mock"`), `sslProviderHostnameId`, `sslLastPolledAt`, and `sslFailureReason`.

3. **Domain Verification Controllers** (`backend/controllers/merchantDomainController.js` & `backend/controllers/superadmin/domainsController.js`):
   - Upon successful DNS record verification, calls `edgeProviderService.provisionCustomDomain()`.
   - Sets initial SSL status to `"pending"` or `"active"` based on live edge response.

4. **Background SSL Status Poller** (`backend/cron/sslPollingCron.js`):
   - Background cron task running every 10 minutes (or manually triggered via POST `/api/merchant/domain/verify-ssl`).
   - Polls active provider API status for domains with `"pending"` SSL status until active.

---

## Feature 2: Storefront Hero & Carousel Slides Synchronization

### 2.1 Problem Statement
When a merchant configured multi-slide Hero or Video carousels in the Admin Customizer, saved changes were stored in database settings but failed to render on the storefront home page (`app/page.tsx`), showing only 1 default slide.

### 2.2 Implemented Solution
1. **State Hydration** (`frontend/src/app/page.tsx`):
   - Updated `loadData()` function in `app/page.tsx` to set fetched `heroSlides`, `videoSlides`, and `lifestyleSlides` into `globalSettings` state:
     ```typescript
     setGlobalSettings((prev: any) => ({ ...prev, heroSlides: data.heroSlides }));
     ```
2. **Local Cache & Event Reactivity** (`frontend/src/app/admin/page.tsx` & `app/page.tsx`):
   - Admin save action caches slide arrays in `localStorage` (`settings_heroSlides`, etc.) and dispatches `window.dispatchEvent(new Event("settingsUpdated"))`.
   - `app/page.tsx` listens for `settingsUpdated` and `storage` events to dynamically update layout without full browser refreshes.

---

## Feature 3: Admin Save Button Dirty-State & Persistence Controls

### 3.1 Problem Statement
The "Save Changes" button in Admin subtabs was either remaining enabled permanently or getting stuck when no changes were made. Additionally, modal save prompts were causing double-confirmation friction.

### 3.2 Implemented Solution
1. **Comprehensive Deep State Normalization** (`frontend/src/app/admin/page.tsx`):
   - Updated `normalizeSettingsSnapshot()` and `hasUnsavedChanges` to track all settings fields (Hero/Video/Lifestyle slides, Ticker, Store Identity, Currencies, Tax rates, Payment Gateways, and Shipping policies).
2. **Strict Inactive / Active Button Logic**:
   - Button uses `disabled={!hasUnsavedChanges || loadingSettings}`.
   - When no changes are present, button is styled as inactive (`opacity: 0.6`, `cursor: not-allowed`).
   - When a setting is modified, `hasUnsavedChanges` becomes `true` and button activates.
   - Upon successful POST to `/api/settings`, `originalSettings` is updated to the new snapshot, automatically resetting the Save button to inactive.

---

## Feature 4: All Products Page Database Performance Optimization

### 4.1 Problem Statement
The All Products listing page (`/shop` and `/api/products` / `/api/storefront/shop`) experienced slow load times due to unindexed sorting during multi-tenant product queries.

### 4.2 Implemented Solution
1. **MongoDB Compound Indexing** (`backend/models/Product.js`):
   - Added compound B-Tree index:
     ```javascript
     productSchema.index({ storeId: 1, _id: -1 });
     ```
   - Allows MongoDB to execute tenant product filtering and descending ID pagination directly from index memory without performing full collection scans or in-memory sorts.

---

## Troubleshooting & Verification Guide

### Quick Health Check Commands
- **Verify TypeScript Build**:
  ```bash
  cd frontend && npx tsc --noEmit
  ```
- **Check Git Status**:
  ```bash
  git status
  ```

---
*Document maintained automatically for AI Agent reference.*
