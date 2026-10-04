import axios from 'axios';

/**
 * Detect shopper country code from request edge headers or fallback IP lookup.
 * Returns 2-letter uppercase ISO country code (e.g., "US", "IN", "CA").
 */
export const detectShopperCountry = async (req) => {
  // 1. Explicit override via query parameter (e.g. ?country=US) or custom client header
  const explicitCountry = req.query?.country || req.headers['x-user-country'];
  if (explicitCountry && typeof explicitCountry === 'string' && explicitCountry.trim().length === 2) {
    return explicitCountry.trim().toUpperCase();
  }

  // 2. Edge Proxy Headers (Vercel, Cloudflare, AWS CloudFront, Fastly, Nginx)
  const edgeHeaderCountry = 
    req.headers['x-vercel-ip-country'] ||
    req.headers['cf-ipcountry'] ||
    req.headers['cloudfront-viewer-country'] ||
    req.headers['x-country-code'] ||
    req.headers['x-appengine-country'];

  if (edgeHeaderCountry && typeof edgeHeaderCountry === 'string' && edgeHeaderCountry.trim().length === 2) {
    const code = edgeHeaderCountry.trim().toUpperCase();
    if (code !== 'XX' && code !== 'T1') {
      return code;
    }
  }

  // 3. Fallback: Parse Client IP Address
  const clientIp = 
    (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : null) ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    req.ip;

  // Localhost or private IP fallback
  if (!clientIp || clientIp === '::1' || clientIp === '127.0.0.1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.')) {
    return 'IN'; // Default dev fallback
  }

  // Lightweight GeoIP lookup for public client IP
  try {
    const response = await axios.get(`https://ipapi.co/${clientIp}/country/`, { timeout: 2000 });
    if (response.data && typeof response.data === 'string' && response.data.trim().length === 2) {
      return response.data.trim().toUpperCase();
    }
  } catch (err) {
    // Silent fallback if external geoip service is unreachable or rate limited
  }

  return 'IN';
};
