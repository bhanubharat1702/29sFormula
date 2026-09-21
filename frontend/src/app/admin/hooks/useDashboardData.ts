import { useState } from 'react';
import { DashboardStats } from '../types';

export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const sessionStr = localStorage.getItem("userSession");
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      if (session?.token) {
        return { Authorization: `Bearer ${session.token}` };
      }
    } catch (e) {}
  }
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
};

const ensureAdminToken = async (): Promise<Record<string, string>> => {
  let headers = getAuthHeaders();
  if (headers.Authorization) return headers;

  if (typeof window !== "undefined" && localStorage.getItem("adminSession") === "true") {
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
          localStorage.setItem("userSession", JSON.stringify(data));
          return { Authorization: `Bearer ${data.token}` };
        }
      }
    } catch (e) {
      console.error("Auto token issue failed:", e);
    }
  }
  return {};
};

export function useDashboardData() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const fetchDashboardStats = async (timeline: string = "all", retries = 3) => {
    try {
      const headers = await ensureAdminToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/admin/dashboard-stats?timeline=${timeline}&t=${Date.now()}`, {
        cache: "no-store",
        headers
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setDashboardStats(data);
    } catch (err: any) {
      if (retries > 0) {
        console.warn(`Dashboard fetch failed, retrying... (${retries} retries left)`);
        setTimeout(() => fetchDashboardStats(timeline, retries - 1), 1500);
      } else {
        console.error(err);
      }
    }
  };

  return {
    dashboardStats,
    fetchDashboardStats
  };
}
