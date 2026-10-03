"use client";

import { useEffect } from "react";
import { clearAuthSession } from "@/utils/auth";

export default function SessionTracker() {
  useEffect(() => {
    // Only run if there is an active session
    const checkAndReset = () => {
      const hasAdmin = localStorage.getItem("adminSession") === "true";
      const hasUser = !!localStorage.getItem("userSession");
      if (hasAdmin || hasUser) {
        localStorage.setItem("lastActivityTime", Date.now().toString());
      }
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, checkAndReset);
    });

    const checkInterval = setInterval(() => {
      const hasAdmin = localStorage.getItem("adminSession") === "true";
      const hasUser = !!localStorage.getItem("userSession");
      
      if (!hasAdmin && !hasUser) return;

      const lastActivity = localStorage.getItem("lastActivityTime");
      const thirtyMinutes = 30 * 60 * 1000;

      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed > thirtyMinutes) {
          if (window.location.pathname !== "/login") {
            clearAuthSession("/login?expired=true");
          } else {
            clearAuthSession("/login");
          }
        }
      }
    }, 10000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, checkAndReset);
      });
      clearInterval(checkInterval);
    };
  }, []);

  return null;
}
