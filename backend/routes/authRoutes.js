import express from "express";
import User from "../models/User.js";
import { sendEmail } from "../utils/emailService.js";

const router = express.Router();

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    await sendEmail({
      to: userEmail,
      subject: "Welcome to 29sFORMULA! 🎉",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; padding: 40px 30px; border: 1px solid #e5e5e5; border-radius: 4px; background-color: #fafafa;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="letter-spacing: 2px; font-weight: 300; margin: 0; color: #000;">29sFORMULA</h1>
            <p style="text-transform: uppercase; letter-spacing: 1.5px; font-size: 11px; color: #666; margin-top: 5px;">Fine Artisan Perfumery</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin-bottom: 30px;" />
          <h2 style="color: #222; text-align: center; font-weight: 400; letter-spacing: 1px;">Welcome to Our World of Fragrance</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #444;">Dear ${userName},</p>
          <p style="font-size: 15px; line-height: 1.6; color: #444;">We are delighted to welcome you to the inner circle of <strong>29sFORMULA</strong>. Our philosophy is rooted in crafting exquisite, long-lasting perfumes that leave an unforgettable impression.</p>
          <p style="font-size: 15px; line-height: 1.6; color: #444;">As a member, you now have exclusive access to our luxury collections, new signature scent drops, and personalized fragrance recommendations.</p>
          <p style="font-size: 15px; line-height: 1.6; color: #444;">Here’s where your fragrance journey begins:</p>
          <ul style="font-size: 15px; line-height: 1.6; color: #444; padding-left: 20px;">
            <li style="margin-bottom: 10px;">Discover our artisanal Extrait de Parfums.</li>
            <li style="margin-bottom: 10px;">Find the perfect signature scent for every occasion.</li>
            <li style="margin-bottom: 10px;">Enjoy seamless luxury shopping and fast delivery.</li>
          </ul>
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://29sformula.com/shop" style="display: inline-block; padding: 14px 35px; background-color: #000; color: #fff; text-decoration: none; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;">Discover the Collection</a>
          </div>
          <p style="font-size: 15px; line-height: 1.6; color: #444;">Should you need assistance selecting a scent or tracking a package, simply reply to this email. Our fragrance concierges are always at your service.</p>
          <br>
          <p style="font-size: 15px; line-height: 1.6; color: #444;">Warm regards,<br><strong>The 29sFORMULA Team</strong></p>
        </div>
      `,
    });
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};


router.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const newUser = new User({
      name: name.trim(),
      email: trimmedEmail,
      password: password,
      isGoogleUser: false
    });

    await newUser.save();
    
    // Send welcome email asynchronously
    sendWelcomeEmail(trimmedEmail, newUser.name);
    
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isGoogleUser: false
    });
  } catch (error) {
    console.error("Manual registration failed:", error);
    res.status(500).json({ error: "Failed to register account" });
  }
});

router.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    if (user.isGoogleUser) {
      return res.status(400).json({ error: "This email is registered using Google Sign-In. Please sign in with Google." });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isGoogleUser: false
    });
  } catch (error) {
    console.error("Manual login failed:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

router.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: "Google token credential is required" });
    }

    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`;
    const verifyRes = await fetch(googleVerifyUrl);
    
    if (!verifyRes.ok) {
      const errText = await verifyRes.text();
      console.error("Google token verification failed:", errText);
      return res.status(400).json({ error: "Failed to verify Google token credential." });
    }

    const payload = await verifyRes.json();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: "Google account does not provide an email address." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      user = new User({
        name: name || "Google User",
        email: trimmedEmail,
        googleId,
        isGoogleUser: true,
        profilePicture: picture
      });
      await user.save();
      
      // Send welcome email asynchronously
      sendWelcomeEmail(trimmedEmail, user.name);
    } else {
      if (!user.isGoogleUser) {
        user.isGoogleUser = true;
        user.googleId = googleId;
      }
      // Always update to the latest profile picture from Google
      if (picture) {
        user.profilePicture = picture;
      }
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isGoogleUser: true,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error("Google login failed:", error);
    res.status(500).json({ error: "Failed to verify Google credentials" });
  }
});

// Request Password Reset OTP
router.post("/api/auth/request-reset-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(404).json({ error: "No account found with this email address." });
    }

    if (user.isGoogleUser) {
      return res.status(400).json({ error: "This account uses Google Sign-In. Please sign in with Google." });
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Import Otp model dynamically or at top
    const Otp = (await import("../models/Otp.js")).default;
    await Otp.findOneAndUpdate(
      { email: trimmedEmail },
      { otp: otpCode, createdAt: Date.now() },
      { upsert: true, returnDocument: 'after' }
    );

    // Send email via Brevo
    const { sendEmail } = await import("../utils/emailService.js");
    await sendEmail({
      to: trimmedEmail,
      subject: "Password Reset Code - 29sFORMULA",
      text: `Hello ${user.name || 'User'},\n\nYour 6-digit password reset verification code is: ${otpCode}\nThis code will expire in 5 minutes.\n\nIf you did not request a password reset, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
          <p style="color: #555; font-size: 16px;">Hello ${user.name || 'User'},</p>
          <p style="color: #555; font-size: 16px;">Use the 6-digit verification code below to reset your password. This code expires in 5 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 15px 30px; font-size: 28px; font-weight: bold; background-color: #f4f4f4; border-radius: 8px; letter-spacing: 4px; color: #111;">
              ${otpCode}
            </span>
          </div>
          <p style="color: #777; font-size: 14px; text-align: center;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `
    });

    res.json({ success: true, message: "Verification code sent to your email." });
  } catch (error) {
    console.error("Error requesting password reset OTP:", error);
    res.status(500).json({ error: error.message || "Failed to send reset verification code." });
  }
});

// Reset Password with OTP
router.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP, and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const Otp = (await import("../models/Otp.js")).default;
    const otpRecord = await Otp.findOne({ email: trimmedEmail, otp: otp.trim() });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(404).json({ error: "Account not found." });
    }

    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: "Password updated successfully. You can now log in." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password." });
  }
});

export default router;
