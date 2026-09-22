import { ZodError } from "zod";

/**
 * Middleware factory for validating Express request payloads against a Zod schema.
 * @param {import('zod').ZodSchema} schema - Zod schema to parse against
 * @param {'body' | 'query' | 'params'} [source='body'] - Request object property to validate
 */
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source] || {};
      const parsed = schema.parse(dataToValidate);
      if (source === "body") {
        req.body = parsed;
      } else if (req[source] && typeof req[source] === "object") {
        Object.assign(req[source], parsed);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const firstMessage = err.issues[0]?.message || "Validation Error";
        return res.status(400).json({
          error: firstMessage,
          details: err.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        });
      }
      next(err);
    }
  };
};
