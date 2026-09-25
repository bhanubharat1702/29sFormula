import rateLimit from "express-rate-limit";

// Moderate limits on general API: 100 req/min per IP
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  validate: false,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    error: "Too many requests, please try again after a minute."
  },
  statusCode: 429
});

// Strict limits on login/auth routes: 5 req/min per IP
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    error: "Too many login attempts, please try again after a minute."
  },
  statusCode: 429
});

// Strict limits on OTP routes: 5 req / 5 min per IP/email
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  skip: () => process.env.NODE_ENV === "test",
  keyGenerator: (req) => {
    const identifier = req.body?.email || req.body?.phone || req.query?.email || "";
    const ip = req.ip || req.headers['x-forwarded-for'] || "127.0.0.1";
    return identifier ? `${ip}_${identifier.toLowerCase().trim()}` : ip;
  },
  message: {
    error: "Too many OTP requests. Maximum 5 requests allowed per 5 minutes. Please try again after 5 minutes."
  },
  statusCode: 429
});

