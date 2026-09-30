import DemoRequest from "../../models/DemoRequest.js";
import { dispatchCommunicationEvent } from "./communicationsController.js";

// GET /api/superadmin/demo-requests - Fetch all leads with SLA calculation
export const getDemoRequests = async (req, res) => {
  try {
    const { stage, status, search, priority, isSpam } = req.query;
    let query = {};

    if (stage && stage !== "all") {
      query.pipelineStage = stage;
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (priority && priority !== "all") {
      query.priority = priority;
    }
    if (isSpam !== undefined) {
      query.isSpam = isSpam === "true";
    }
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { storeName: regex },
        { ownerName: regex },
        { email: regex },
        { phone: regex },
        { currentWebsite: regex }
      ];
    }

    const requests = await DemoRequest.find(query).sort({ createdAt: -1 });

    const now = Date.now();
    const enrichedRequests = requests.map((reqDoc) => {
      const doc = reqDoc.toObject();
      if (!doc.pipelineStage || doc.pipelineStage === "New") {
        if (doc.status === "Contacted") doc.pipelineStage = "Contacted";
        else if (doc.status === "Approved") doc.pipelineStage = "Won";
        else if (doc.status === "Rejected") doc.pipelineStage = "Lost";
        else doc.pipelineStage = doc.pipelineStage || "New";
      }

      const createdTime = new Date(doc.createdAt).getTime();
      const isUncontacted = doc.pipelineStage === "New" || doc.status === "Pending";
      const hoursDiff = (now - createdTime) / (1000 * 60 * 60);
      doc.slaBreached = isUncontacted && hoursDiff >= 24;

      return doc;
    });

    res.json(enrichedRequests);
  } catch (err) {
    console.error("SuperAdmin Fetch Demo Requests Error:", err);
    res.status(500).json({ error: "Failed to fetch demo requests." });
  }
};

// GET /api/superadmin/demo-requests/analytics - CRM Analytics & Funnel Metrics
export const getCrmAnalytics = async (req, res) => {
  try {
    const allLeads = await DemoRequest.find();
    const totalLeads = allLeads.length;

    let wonCount = 0;
    let lostCount = 0;
    let pendingCount = 0;
    let demoScheduledCount = 0;
    let slaBreachesCount = 0;
    let totalTimeToConvertMs = 0;

    const sourceCounts = {};
    const lostReasonCounts = {};
    const stageCounts = {
      New: 0,
      Contacted: 0,
      "Demo Scheduled": 0,
      "Demo Done": 0,
      "Trial Started": 0,
      Won: 0,
      Lost: 0
    };

    const now = Date.now();

    allLeads.forEach((lead) => {
      const stage = lead.pipelineStage || (lead.status === "Approved" ? "Won" : lead.status === "Rejected" ? "Lost" : lead.status === "Contacted" ? "Contacted" : "New");
      if (stageCounts[stage] !== undefined) stageCounts[stage]++;

      if (stage === "Won" || lead.status === "Approved") {
        wonCount++;
        if (lead.convertedAt && lead.createdAt) {
          totalTimeToConvertMs += new Date(lead.convertedAt).getTime() - new Date(lead.createdAt).getTime();
        }
      } else if (stage === "Lost" || lead.status === "Rejected") {
        lostCount++;
        if (lead.lossReason) {
          lostReasonCounts[lead.lossReason] = (lostReasonCounts[lead.lossReason] || 0) + 1;
        }
      } else {
        pendingCount++;
      }

      if (stage === "Demo Scheduled") demoScheduledCount++;

      const source = lead.utmSource || "Direct / Landing Page";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;

      const hoursDiff = (now - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);
      if ((stage === "New" || lead.status === "Pending") && hoursDiff >= 24) {
        slaBreachesCount++;
      }
    });

    const conversionRate = totalLeads > 0 ? Number(((wonCount / totalLeads) * 100).toFixed(1)) : 0;
    const avgTimeToConvertDays = wonCount > 0 ? Number((totalTimeToConvertMs / (wonCount * 1000 * 60 * 60 * 24)).toFixed(1)) : 0;

    res.json({
      totalLeads,
      wonCount,
      lostCount,
      pendingCount,
      demoScheduledCount,
      slaBreachesCount,
      conversionRate,
      avgTimeToConvertDays,
      leadsBySource: sourceCounts,
      lostReasons: lostReasonCounts,
      funnelMetrics: stageCounts
    });
  } catch (err) {
    console.error("CRM Analytics Error:", err);
    res.status(500).json({ error: "Failed to fetch CRM analytics." });
  }
};

// GET /api/superadmin/demo-requests/export - Export CSV
export const exportCrmCsv = async (req, res) => {
  try {
    const requests = await DemoRequest.find().sort({ createdAt: -1 });

    let csvContent = "Store Name,Owner Name,Email,Phone,Current Website,Category,Monthly Orders,UTM Source,Stage,Priority,Score,Assigned Owner,Created At\n";

    requests.forEach((r) => {
      const storeName = `"${(r.storeName || "").replace(/"/g, '""')}"`;
      const ownerName = `"${(r.ownerName || "").replace(/"/g, '""')}"`;
      const email = `"${(r.email || "").replace(/"/g, '""')}"`;
      const phone = `"${(r.phone || "").replace(/"/g, '""')}"`;
      const website = `"${(r.currentWebsite || "").replace(/"/g, '""')}"`;
      const category = `"${(r.businessType || "").replace(/"/g, '""')}"`;
      const orders = `"${(r.monthlyOrders || "").replace(/"/g, '""')}"`;
      const source = `"${(r.utmSource || "").replace(/"/g, '""')}"`;
      const stage = `"${r.pipelineStage || r.status || "New"}"`;
      const priority = `"${r.priority || "Medium"}"`;
      const score = r.leadScore || 50;
      const owner = `"${r.assignedOwner?.name || "Unassigned"}"`;
      const date = `"${r.createdAt ? new Date(r.createdAt).toISOString() : ""}"`;

      csvContent += `${storeName},${ownerName},${email},${phone},${website},${category},${orders},${source},${stage},${priority},${score},${owner},${date}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="demo_requests_crm.csv"');
    res.send(csvContent);
  } catch (err) {
    console.error("Export CRM CSV Error:", err);
    res.status(500).json({ error: "Failed to export CSV." });
  }
};

// PUT /api/superadmin/demo-requests/:id/stage - Update pipeline stage
export const updateLeadStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, notes } = req.body;

    const lead = await DemoRequest.findById(id);
    if (!lead) return res.status(404).json({ error: "Lead request not found." });

    const oldStage = lead.pipelineStage || lead.status;
    lead.pipelineStage = stage;

    if (stage === "Won") lead.status = "Approved";
    else if (stage === "Lost") lead.status = "Rejected";
    else if (stage === "Contacted") {
      lead.status = "Contacted";
      lead.lastContactedAt = new Date();
    } else {
      lead.status = "Pending";
    }

    lead.timeline.push({
      action: "Pipeline Stage Changed",
      details: `Stage updated from "${oldStage}" to "${stage}"${notes ? `. Note: ${notes}` : ""}`,
      performedBy: req.adminUser?.name || "Super Admin",
      timestamp: new Date()
    });

    await lead.save();
    res.json({ message: `Lead stage updated to ${stage}`, request: lead });
  } catch (err) {
    console.error("Update Stage Error:", err);
    res.status(500).json({ error: "Failed to update pipeline stage." });
  }
};

// PUT /api/superadmin/demo-requests/:id/assign - Assign lead owner
export const assignLeadOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerName, ownerEmail, ownerId } = req.body;

    const lead = await DemoRequest.findById(id);
    if (!lead) return res.status(404).json({ error: "Lead request not found." });

    lead.assignedOwner = {
      id: ownerId || "",
      name: ownerName || "Unassigned",
      email: ownerEmail || ""
    };

    lead.timeline.push({
      action: "Owner Assigned",
      details: `Lead assigned to ${ownerName || "Unassigned"}`,
      performedBy: req.adminUser?.name || "Super Admin",
      timestamp: new Date()
    });

    await lead.save();
    res.json({ message: "Owner assigned successfully.", request: lead });
  } catch (err) {
    console.error("Assign Owner Error:", err);
    res.status(500).json({ error: "Failed to assign owner." });
  }
};

// PUT /api/superadmin/demo-requests/:id/priority - Update lead priority
export const updateLeadPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const lead = await DemoRequest.findById(id);
    if (!lead) return res.status(404).json({ error: "Lead request not found." });

    lead.priority = priority;
    lead.timeline.push({
      action: "Priority Changed",
      details: `Priority set to ${priority}`,
      performedBy: req.adminUser?.name || "Super Admin",
      timestamp: new Date()
    });

    await lead.save();
    res.json({ message: `Priority set to ${priority}`, request: lead });
  } catch (err) {
    console.error("Priority Error:", err);
    res.status(500).json({ error: "Failed to update priority." });
  }
};

// POST /api/superadmin/demo-requests/:id/notes - Add note to timeline
export const addLeadNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { noteText, followUpReminder } = req.body;

    if (!noteText) return res.status(400).json({ error: "Note content is required." });

    const lead = await DemoRequest.findById(id);
    if (!lead) return res.status(404).json({ error: "Lead request not found." });

    const author = req.adminUser?.name || "Super Admin";
    lead.notesHistory.push({ text: noteText, author, createdAt: new Date() });
    lead.notes = noteText;

    if (followUpReminder) {
      lead.followUpReminder = new Date(followUpReminder);
    }

    lead.timeline.push({
      action: "Note Added",
      details: `Note: "${noteText}"${followUpReminder ? ` (Follow-up set for ${new Date(followUpReminder).toLocaleDateString()})` : ""}`,
      performedBy: author,
      timestamp: new Date()
    });

    await lead.save();
    res.json({ message: "Note added successfully.", request: lead });
  } catch (err) {
    console.error("Add Note Error:", err);
    res.status(500).json({ error: "Failed to add note." });
  }
};

// POST /api/superadmin/demo-requests/:id/schedule-demo - Schedule meeting
export const scheduleDemoMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, meetingUrl, notes } = req.body;

    if (!date) return res.status(400).json({ error: "Demo date/time is required." });

    const lead = await DemoRequest.findById(id);
    if (!lead) return res.status(404).json({ error: "Lead request not found." });

    lead.scheduledDemo = {
      date: new Date(date),
      meetingUrl: meetingUrl || "https://calendly.com/ecommerce-demo",
      notes: notes || ""
    };
    lead.pipelineStage = "Demo Scheduled";
    lead.status = "Contacted";
    lead.lastContactedAt = new Date();

    lead.timeline.push({
      action: "Demo Scheduled",
      details: `Demo scheduled for ${new Date(date).toLocaleString()} (${meetingUrl || "Calendly"})`,
      performedBy: req.adminUser?.name || "Super Admin",
      timestamp: new Date()
    });

    await lead.save();
    res.json({ message: "Demo scheduled successfully.", request: lead });
  } catch (err) {
    console.error("Schedule Demo Error:", err);
    res.status(500).json({ error: "Failed to schedule demo." });
  }
};

// POST /api/superadmin/demo-requests/:id/send-email - Send email with pre-configured template
export const sendLeadEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { templateType, customSubject, customBody } = req.body;

    const lead = await DemoRequest.findById(id);
    if (!lead) return res.status(404).json({ error: "Lead request not found." });

    let templateName = "Acknowledgement";
    if (templateType === "demo_confirmation") templateName = "Demo Confirmation";
    else if (templateType === "follow_up") templateName = "Follow-up Reminder";
    else if (templateType === "rejection") templateName = "Polite Recline / Rejection";

    lead.lastContactedAt = new Date();
    if (lead.pipelineStage === "New") {
      lead.pipelineStage = "Contacted";
      lead.status = "Contacted";
    }

    // Unify CRM email with Communications module pipeline and delivery logs
    const commResult = await dispatchCommunicationEvent({
      category: templateType || "acknowledgement",
      recipientEmail: lead.email,
      storeId: lead.convertedStoreId || null,
      storeName: lead.storeName || "Prospect Lead",
      variables: {
        store_name: lead.storeName || "Your Store",
        owner_name: lead.ownerName || "Merchant",
        email: lead.email,
        phone: lead.phone || ""
      },
      customSubject: customSubject?.trim() || undefined,
      customBody: customBody?.trim() || undefined
    });

    lead.timeline.push({
      action: "Email Sent via Communications Pipeline",
      details: `Sent "${templateName}" email to ${lead.email}${customSubject ? `. Subject: "${customSubject}"` : ""}${commResult?.logId ? ` (Log ID: ${commResult.logId})` : ""}`,
      performedBy: req.adminUser?.name || "Super Admin",
      timestamp: new Date()
    });

    await lead.save();
    res.json({
      message: `Email template "${templateName}" dispatched via Communications module & logged to Delivery Logs! Sent to ${lead.email}`,
      request: lead,
      deliveryLogId: commResult?.logId || null
    });
  } catch (err) {
    console.error("Send Email Error:", err);
    res.status(500).json({ error: "Failed to send email." });
  }
};

// POST /api/superadmin/demo-requests/:id/mark-lost - Mark lead lost with reason
export const markLeadLost = async (req, res) => {
  try {
    const { id } = req.params;
    const { lossReason, lossNotes } = req.body;

    if (!lossReason) return res.status(400).json({ error: "Loss reason is required." });

    const lead = await DemoRequest.findById(id);
    if (!lead) return res.status(404).json({ error: "Lead request not found." });

    lead.pipelineStage = "Lost";
    lead.status = "Rejected";
    lead.lossReason = lossReason;
    lead.lossNotes = lossNotes || "";

    lead.timeline.push({
      action: "Marked Lost",
      details: `Lead marked as Lost. Reason: ${lossReason}${lossNotes ? ` (${lossNotes})` : ""}`,
      performedBy: req.adminUser?.name || "Super Admin",
      timestamp: new Date()
    });

    await lead.save();
    res.json({ message: "Lead marked as Lost.", request: lead });
  } catch (err) {
    console.error("Mark Lost Error:", err);
    res.status(500).json({ error: "Failed to mark lead as lost." });
  }
};

// POST /api/superadmin/demo-requests/:id/mark-spam - Toggle Spam Flag
export const toggleLeadSpam = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await DemoRequest.findById(id);
    if (!lead) return res.status(404).json({ error: "Lead request not found." });

    lead.isSpam = !lead.isSpam;
    lead.timeline.push({
      action: lead.isSpam ? "Flagged as Spam" : "Unflagged Spam",
      details: lead.isSpam ? "Lead marked as spam/fraud" : "Spam flag removed",
      performedBy: req.adminUser?.name || "Super Admin",
      timestamp: new Date()
    });

    await lead.save();
    res.json({ message: lead.isSpam ? "Lead flagged as spam." : "Lead unflagged from spam.", request: lead });
  } catch (err) {
    console.error("Mark Spam Error:", err);
    res.status(500).json({ error: "Failed to update spam status." });
  }
};

// DELETE /api/superadmin/demo-requests/:id - Delete lead
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DemoRequest.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Lead request not found." });
    res.json({ message: "Lead request deleted successfully." });
  } catch (err) {
    console.error("Delete Lead Error:", err);
    res.status(500).json({ error: "Failed to delete lead." });
  }
};
