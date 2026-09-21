import mongoose from "mongoose";

/**
 * Extracts, sanitizes, and computes standard offset and cursor pagination parameters.
 * Supports:
 * - `page` (1-indexed offset page number)
 * - `limit` (max records per page, default 20, max 100)
 * - `cursor` (raw ObjectId string for cursor-based streaming)
 */
export const getPaginationParams = (req, defaultLimit = 20, maxLimit = 100) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;

  let cursor = null;
  if (req.query.cursor) {
    const rawCursor = String(req.query.cursor).trim();
    if (mongoose.Types.ObjectId.isValid(rawCursor)) {
      cursor = new mongoose.Types.ObjectId(rawCursor);
    }
  }

  const isExplicitPagination = 
    req.query.page !== undefined || 
    req.query.limit !== undefined || 
    req.query.cursor !== undefined || 
    req.query.paginate === "true";

  return { page, limit, skip, cursor, isExplicitPagination };
};

/**
 * Constructs standard pagination envelope object containing items and metadata.
 */
export const buildPaginatedResponse = (data, total, page, limit, nextCursor = null) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextCursor
    }
  };
};

/**
 * Attaches HTTP pagination headers to response.
 */
export const setPaginationHeaders = (res, total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;
  res.setHeader("X-Total-Count", total);
  res.setHeader("X-Page", page);
  res.setHeader("X-Limit", limit);
  res.setHeader("X-Total-Pages", totalPages);
};
