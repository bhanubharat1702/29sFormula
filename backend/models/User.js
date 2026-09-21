import mongoose from "mongoose";

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  profilePicture: { type: String },
  phone: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
