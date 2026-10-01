/**
 * Helper function to check if a JWT token is expired or invalid.
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  if (token === "guest" || token === "demo") return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      // If token is simple non-JWT string, assume valid unless empty
      return false;
    }
    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(payloadBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    if (payload && typeof payload.exp === "number") {
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp <= currentTime;
    }
    return false;
  } catch {
    return true;
  }
}
