import mongoose from "mongoose";

const timelineItemSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String, default: "" },
  performedBy: { type: String, default: "System" },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const noteItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: "Super Admin" },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const demoRequestSchema = new mongoose.Schema({
  // Core Contact & Business Information
  storeName: { type: String, required: true, trim: true },
  ownerName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  subdomain: { type: String, default: "", lowercase: true, trim: true },
  businessType: { type: String, default: "Retail" },
  currentWebsite: { type: String, default: "", trim: true },
  monthlyOrders: { type: String, enum: ["< 50", "50-500", "500-2000", "2000+", ""], default: "< 50" },
  message: { type: String, default: "" },
  preferredTime: { type: String, default: "Morning (9 AM - 12 PM)" },
  utmSource: { type: String, default: "Direct / Landing Page" },

  // Pipeline Stage & Status
  // Pipeline Stages: New -> Contacted -> Demo Scheduled -> Demo Done -> Trial Started -> Won / Lost
  status: {
    type: String,
    enum: ["New", "Pending", "Contacted", "Demo Scheduled", "Demo Done", "Trial Started", "Won", "Lost", "Approved", "Rejected"],
    default: "New"
  },
  pipelineStage: {
    type: String,
    enum: ["New", "Contacted", "Demo Scheduled", "Demo Done", "Trial Started", "Won", "Lost"],
    default: "New"
  },

  // Scoring & Priority
  leadScore: { type: Number, default: 50 },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },

  // Team Assignment
  assignedOwner: {
    id: { type: String, default: "" },
    name: { type: String, default: "Unassigned" },
    email: { type: String, default: "" }
  },

  // Demo Schedule
  scheduledDemo: {
    date: { type: Date, default: null },
    meetingUrl: { type: String, default: "" },
    notes: { type: String, default: "" }
  },

  // Loss Tracking
  lossReason: {
    type: String,
    enum: ["Price / Budget", "Competitor", "No Response", "Feature Gap", "Timing / Delayed", "Other", ""],
    default: ""
  },
  lossNotes: { type: String, default: "" },

  // Spam & Fraud Protection
  isSpam: { type: Boolean, default: false },
  isDuplicate: { type: Boolean, default: false },

  // Reminders & Audit History
  followUpReminder: { type: Date, default: null },
  notes: { type: String, default: "" },
  notesHistory: [noteItemSchema],
  timeline: [timelineItemSchema],
  convertedStoreId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", default: null },
  convertedAt: { type: Date, default: null },
  lastContactedAt: { type: Date, default: null }
}, { timestamps: true });

const DemoRequest = mongoose.models.DemoRequest || mongoose.model("DemoRequest", demoRequestSchema);

export default DemoRequest;
