import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 12 bytes for GCM
const AUTH_TAG_LENGTH = 16;

// Derive a 32-byte key from process.env.PAYMENT_ENCRYPTION_KEY or fallback JWT_SECRET/server secret
const getEncryptionKey = () => {
  const secret = process.env.PAYMENT_ENCRYPTION_KEY || process.env.JWT_SECRET || "store_engine_default_secure_key_2026_x982";
  return crypto.createHash("sha256").update(secret).digest();
};

/**
 * Encrypts a plain text string into a formatted encrypted string: iv:authTag:encryptedHex
 * Returns original text if text is empty or already encrypted.
 */
export const encrypt = (text) => {
  if (!text || typeof text !== "string" || text.trim() === "") return "";
  if (isEncrypted(text)) return text; // Already encrypted

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt sensitive data");
  }
};

/**
 * Decrypts a formatted encrypted string (iv:authTag:encryptedHex) back to plain text.
 * Returns text as-is if not encrypted format (for backward compatibility).
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText || typeof encryptedText !== "string" || encryptedText.trim() === "") return "";
  if (!isEncrypted(encryptedText)) return encryptedText; // Plaintext fallback

  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(":");
    if (parts.length !== 3) return encryptedText;

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encryptedData = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return ""; // Return empty if decryption fails due to corrupted key/data
  }
};

/**
 * Checks if a given string matches the encrypted format (iv:authTag:encryptedHex)
 */
export const isEncrypted = (text) => {
  if (!text || typeof text !== "string") return false;
  const parts = text.split(":");
  return parts.length === 3 && parts[0].length === IV_LENGTH * 2 && parts[1].length === AUTH_TAG_LENGTH * 2;
};

/**
 * Masks a secret key for display in admin UI (e.g., rzp_test_... -> rzp_t...**** or ••••••••••••)
 */
export const maskSecret = (secret) => {
  if (!secret || typeof secret !== "string" || secret.trim() === "") return "";
  const plain = decrypt(secret);
  if (!plain) return "";
  if (plain.length <= 8) return "••••••••";
  return plain.slice(0, 4) + "••••••••" + plain.slice(-4);
};
