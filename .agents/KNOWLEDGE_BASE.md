# System Knowledge Base & Reference Manual

> **Note for AI Assistants & Developers**: This document contains the full reference of recent architectural implementations, database indexing fixes, SSL edge provisioning, storefront reactive state synchronization, and admin UI controls.

Refer to `SYSTEM_CHANGES_AND_ARCHITECTURE.md` in the workspace root for the full detailed reference guide.

## Summary of Recent Key Changes

### 1. SSL Domain Edge Provisioning & Polling
- **Backend Service**: `backend/services/edgeProviderService.js` (Cloudflare, Vercel, Mock).
- **Cron Poller**: `backend/cron/sslPollingCron.js` (polls `"pending"` domains every 10 mins).
- **Schemas**: `Domain.js` and `Store.js` updated with provider metadata fields.

### 2. Storefront Hero & Carousel Slides Sync
- **Page Sync**: `frontend/src/app/page.tsx` (`loadData`) updates `globalSettings` state with `heroSlides`, `videoSlides`, `lifestyleSlides`.
- **Event Hydration**: `window.dispatchEvent(new Event("settingsUpdated"))` triggers dynamic re-render on storefront upon admin save.

### 3. Admin Save Button State Management
- **State Tracker**: `admin/page.tsx` (`hasUnsavedChanges` & `normalizeSettingsSnapshot`).
- **Button Rule**: Disabled (`cursor: not-allowed`, `opacity: 0.6`) when no changes exist. Enabled when dirty. Resets to disabled upon successful save.

### 4. Products Query Optimization
- **Index Added**: `{ storeId: 1, _id: -1 }` on `Product` schema (`backend/models/Product.js`).
- **Impact**: Eliminates in-memory sorting and full collection scans for `/api/storefront/shop` and `/api/products`.
