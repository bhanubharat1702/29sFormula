import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

/**
 * Send email using Resend API (HTTP HTTPS REST API - works 100% on Render/cloud platforms without SMTP port blocking)
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Optional plain text content
 * @returns {Promise<Object>}
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const fromSender = process.env.RESEND_FROM_EMAIL || "29sFORMULA <onboarding@resend.dev>";
    
    const data = await resend.emails.send({
      from: fromSender,
      to,
      subject,
      html,
      ...(text && { text }),
    });

    if (data.error) {
      console.error("Resend API error response:", data.error);
      throw new Error(data.error.message || "Failed to send email via Resend.");
    }

    console.log(`Email sent successfully via Resend to ${to}. Message ID:`, data.data?.id);
    return data;
  } catch (error) {
    console.error("Error in sendEmail helper:", error);
    throw error;
  }
};
