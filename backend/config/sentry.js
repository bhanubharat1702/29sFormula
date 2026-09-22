import * as Sentry from "@sentry/node";

export const initSentry = (app) => {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn || process.env.NODE_ENV === "test") {
    return;
  }

  Sentry.init({
    dsn: dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
  });

  if (app) {
    Sentry.setupExpressErrorHandler(app);
  }
};

export const captureException = (error, context = {}) => {
  if (process.env.SENTRY_DSN && process.env.NODE_ENV !== "test") {
    Sentry.captureException(error, context);
  }
};

export default Sentry;
