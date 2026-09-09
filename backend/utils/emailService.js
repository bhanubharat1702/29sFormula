import dotenv from "dotenv";

dotenv.config();

/**
 * Send email using Brevo (Sendinblue) HTTP REST API
 * Works 100% reliably on Render/cloud platforms without SMTP port blocking, IPv6 issues, or domain locks.
 * Allows sending emails to ANY recipient email address.
 * 
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Optional plain text content
 * @returns {Promise<Object>}
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("BREVO_API_KEY is not set in environment variables.");
    throw new Error("Email service API key is not configured.");
  }

  const senderEmail = process.env.EMAIL_USER || "29sformula@gmail.com";
  const senderName = "29sFORMULA";

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: to
          }
        ],
        subject: subject,
        htmlContent: html,
        ...(text && { textContent: text })
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo API error response:", data);
      throw new Error(data.message || data.error || "Failed to send email via Brevo.");
    }

    console.log(`Email sent successfully via Brevo to ${to}. Message ID:`, data.messageId);
    return data;
  } catch (error) {
    console.error("Error in sendEmail helper (Brevo):", error);
    throw error;
  }
};
