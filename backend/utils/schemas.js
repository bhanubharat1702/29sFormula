import { z } from "zod";

const requiredString = (msg) =>
  z.string({ message: msg })
    .trim()
    .min(1, msg);

// Auth Schemas
export const registerSchema = z.object({
  name: requiredString("Name, email, and password are required"),
  email: z.string({ message: "Name, email, and password are required" })
    .trim()
    .email("Please provide a valid email address"),
  password: z.string({ message: "Name, email, and password are required" })
    .min(6, "Password must be at least 6 characters")
});

export const loginSchema = z.object({
  email: z.string({ message: "Email and password are required" })
    .trim()
    .refine((val) => val.toLowerCase() === "admin" || z.string().email().safeParse(val).success, {
      message: "Please enter a valid email address"
    }),
  password: requiredString("Email and password are required")
});

export const sendOtpSchema = z.object({
  email: z.string({ message: "Email is required." })
    .trim()
    .email("Please provide a valid email address")
});

export const verifyOtpSchema = z.object({
  email: z.string({ message: "Email and OTP are required" })
    .trim()
    .email("Invalid email address"),
  otp: requiredString("Email and OTP are required")
});

export const resetPasswordSchema = z.object({
  email: z.string({ message: "Email, OTP, and new password are required." })
    .trim()
    .email("Invalid email address"),
  otp: requiredString("Email, OTP, and new password are required."),
  newPassword: z.string({ message: "Email, OTP, and new password are required." })
    .min(6, "Password must be at least 6 characters long.")
});

// Discount Schemas
export const createDiscountSchema = z.object({
  code: requiredString("Code and value are required."),
  type: z.enum(["percentage", "fixed"]).optional().default("percentage"),
  value: z.union([z.number(), z.string().transform((v) => Number(v))], { message: "Code and value are required." })
    .refine((v) => !isNaN(v) && v >= 0, { message: "Code and value are required." }),
  minOrderAmount: z.union([z.number(), z.string().transform((v) => Number(v))])
    .optional()
    .default(0)
});

export const validateDiscountQuerySchema = z.object({
  code: requiredString("Discount code is required"),
  subtotal: z.string().optional()
});

// Review Schemas
export const createReviewSchema = z.object({
  productId: requiredString("productId, author, rating, and comment are required."),
  author: requiredString("productId, author, rating, and comment are required."),
  rating: z.union([z.number(), z.string().transform((v) => Number(v))], { message: "productId, author, rating, and comment are required." })
    .refine((v) => !isNaN(v) && v >= 1 && v <= 5, { message: "Rating must be between 1 and 5." }),
  comment: requiredString("productId, author, rating, and comment are required."),
  title: z.string().optional().default(""),
  location: z.string().optional().default("IN"),
  images: z.array(z.string()).optional().default([])
});
