import mongoose from "mongoose";

/**
 * Verifies that the client making the request owns the target order.
 * Prevents IDOR / BOLA vulnerabilities (where attackers attempt to modify orders belonging to other customers).
 * 
 * Validates ownership using:
 * 1. Matching Customer ID (from user session or headers)
 * 2. Matching Customer Email (from request body or headers)
 * 3. Matching Customer Phone (from request body or headers)
 */
export const verifyOrderOwnership = (order, req) => {
  if (!order) return false;

  const headers = req?.headers || {};
  const requestEmail = (
    req?.body?.email || 
    req?.body?.customerEmail || 
    req?.query?.email || 
    headers['x-user-email'] || 
    ""
  ).toLowerCase().trim();

  const requestPhone = (
    req?.body?.phone || 
    req?.body?.customerPhone || 
    req?.query?.phone || 
    headers['x-user-phone'] || 
    ""
  ).trim();

  const requestUserId = (
    req?.body?.userId || 
    req?.body?.customerId || 
    headers['x-user-id'] || 
    ""
  ).trim();

  // Extract order details
  const orderEmail = (order.customerEmail || "").toLowerCase().trim();
  const orderPhone = (order.customerPhone || "").trim();
  const orderCustomerId = order.customerId ? order.customerId.toString() : "";

  // 1. Verify by User / Customer ID
  if (requestUserId && orderCustomerId && requestUserId === orderCustomerId) {
    return true;
  }

  // 2. Verify by Email match
  if (requestEmail && orderEmail && requestEmail === orderEmail) {
    return true;
  }

  // 3. Verify by Phone match
  if (requestPhone && orderPhone && requestPhone === orderPhone) {
    return true;
  }

  return false;
};
