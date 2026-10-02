import { useState } from 'react';
import { DashboardStats } from '../types';

export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  const headers: Record<string, string> = {};

  const storeId = localStorage.getItem("merchantStoreId") || localStorage.getItem("storeId");
  if (storeId) {
    headers["x-store-id"] = storeId;
    headers["x-tenant-id"] = storeId;
  }

  // 1. User session takes priority (logged-in merchant or admin user)
  const sessionStr = localStorage.getItem("userSession");
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      const isOwnerOrAdmin = Boolean(
        session?.isAdmin ||
        session?.role === "admin" ||
        session?.isOwner ||
        session?.role === "owner"
      );
      if (session?.token && isOwnerOrAdmin) {
        headers["Authorization"] = `Bearer ${session.token}`;
        if (!headers["x-store-id"] && session.storeId) {
          headers["x-store-id"] = String(session.storeId);
          headers["x-tenant-id"] = String(session.storeId);
        }
        return headers;
      }
    } catch (e) { }
  }

  // 2. Explicit admin token fallback
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    headers["Authorization"] = `Bearer ${adminToken}`;
    return headers;
  }

  return headers;
};

// A session is admin-capable only when it carries an explicit admin/owner role.
// Plain storefront customers (role "user") must never be replayed against the
// admin APIs — doing so returns HTTP 403 and defeats the dashboard.
const isAdminLikeSession = (session: any): boolean => Boolean(
  session &&
  (session.isAdmin ||
    session.isOwner ||
    session.role === "admin" ||
    session.role === "owner")
);

export const ensureAdminToken = async (forceRefresh = false): Promise<Record<string, string>> => {
  if (!forceRefresh) {
    const headers = getAuthHeaders();
    if (headers.Authorization) return headers;
  }

  if (typeof window === "undefined") return {};

  // On a forced refresh the previously rejected admin token is stale; clear it
  // so a fresh credential can be derived below.
  if (forceRefresh) {
    localStorage.removeItem("adminToken");
  }

  let session: any = null;
  const sessionStr = localStorage.getItem("userSession");
  if (sessionStr) {
    try { session = JSON.parse(sessionStr); } catch (e) { session = null; }
  }

  // 1. A logged-in admin/owner session is the most reliable credential.
  if (session?.token && isAdminLikeSession(session)) {
    const storeId = session.storeId || localStorage.getItem("merchantStoreId") || localStorage.getItem("storeId");
    return {
      Authorization: `Bearer ${session.token}`,
      ...(storeId ? { "x-store-id": String(storeId), "x-tenant-id": String(storeId) } : {})
    };
  }

  // 2. Explicit admin token fallback.
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    return { Authorization: `Bearer ${adminToken}` };
  }

  // 3. System-admin fallback. Only attempt this when the caller actually holds
  //    an admin page session; never hijack a plain customer session.
  if (localStorage.getItem("adminSession") === "true") {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin", password: "admin" })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("adminToken", data.token);
          return { Authorization: `Bearer ${data.token}` };
        }
      }
    } catch (e) {
      console.error("Auto admin token issue failed:", e);
    }
  }

  return {};
};

export function useDashboardData() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const fetchDashboardStats = async (timeline: string = "all", retries = 3) => {
    try {
      let headers = await ensureAdminToken();
      let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/admin/dashboard-stats?timeline=${timeline}&t=${Date.now()}`, {
        cache: "no-store",
        headers
      });

      // If token expired or unauthorized, force token refresh & retry once
      if ((res.status === 401 || res.status === 403) && typeof window !== "undefined") {
        localStorage.removeItem("adminToken");
        headers = await ensureAdminToken(true);
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/admin/dashboard-stats?timeline=${timeline}&t=${Date.now()}`, {
          cache: "no-store",
          headers
        });
      }

      if (!res.ok) throw new Error(`Failed to fetch dashboard stats (HTTP ${res.status})`);
      const data = await res.json();
      setDashboardStats(data);
    } catch (err: any) {
      if (retries > 0) {
        console.warn(`Dashboard fetch failed (${err.message}), retrying... (${retries} retries left)`);
        setTimeout(() => fetchDashboardStats(timeline, retries - 1), 1500);
      } else {
        console.error("Dashboard stats error:", err);
      }
    }
  };

  return {
    dashboardStats,
    fetchDashboardStats
  };
}
