import { useState } from 'react';
import { DashboardStats } from '../types';

export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  
  // 1. Explicit admin token
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    return { Authorization: `Bearer ${adminToken}` };
  }

  // 2. User session if user is admin
  const sessionStr = localStorage.getItem("userSession");
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      if (session?.token && (session.isAdmin || session.role === "admin")) {
        return { Authorization: `Bearer ${session.token}` };
      }
    } catch (e) {}
  }

  return {};
};

export const ensureAdminToken = async (forceRefresh = false): Promise<Record<string, string>> => {
  if (!forceRefresh) {
    const headers = getAuthHeaders();
    if (headers.Authorization) return headers;
  }

  if (typeof window !== "undefined") {
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
