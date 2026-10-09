import { SavedReport } from "../models/Analytics.js";
import { computeLiveAnalyticsData } from "../controllers/superadmin/analyticsController.js";
import { queueEmail } from "../utils/emailQueue.js";
import { runWithoutTenant } from "../utils/tenantContext.js";

/**
 * Generates structured HTML content for scheduled analytics reports.
 * 
 * @param {Object} report - SavedReport document
 * @param {Object} metrics - Computed live analytics metrics
 * @returns {string} HTML string
 */
export const generateReportHtml = (report, metrics) => {
  let metricsSummaryHtml = "";

  if (metrics) {
    Object.keys(metrics).forEach((key) => {
      const val = metrics[key];
      if (typeof val === "object" && val !== null) {
        if (Array.isArray(val)) {
          metricsSummaryHtml += `
            <div style="margin-top: 15px;">
              <h4 style="color: #4f46e5; margin-bottom: 8px; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background-color: #f3f4f6; text-align: left;">
                    <th style="padding: 8px; border: 1px solid #e5e7eb;">Item</th>
                    <th style="padding: 8px; border: 1px solid #e5e7eb;">Value / Count</th>
                    <th style="padding: 8px; border: 1px solid #e5e7eb;">Percentage / Rate</th>
                  </tr>
                </thead>
                <tbody>
                  ${val.slice(0, 8).map(item => `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.plan || item.country || item.stage || item.feature || item.storeName || item.reason || item.cohort || "Item"}</td>
                      <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">${item.mrr !== undefined ? `$${item.mrr}` : item.gmv !== undefined ? `$${item.gmv}` : item.count ?? item.usagePercent ?? item.revenue ?? ""}</td>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.percentage !== undefined ? `${item.percentage}%` : item.conversion !== undefined ? `${item.conversion}%` : "-"}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>`;
        } else {
          metricsSummaryHtml += `
            <div style="margin-top: 10px; background: #f9fafb; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb;">
              <strong style="color: #374151; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}:</strong>
              <div style="font-size: 12px; color: #4b5563; margin-top: 4px;">
                ${Object.entries(val).map(([k, v]) => `<span style="margin-right: 12px;">${k}: <strong>${v}</strong></span>`).join("")}
              </div>
            </div>`;
        }
      } else {
        metricsSummaryHtml += `
          <div style="padding: 10px; background: #eef2ff; border-radius: 6px; margin-top: 8px; border: 1px solid #c7d2fe;">
            <span style="color: #374151; font-weight: 600; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}:</span>
            <span style="float: right; font-weight: bold; color: #4f46e5;">${val}</span>
          </div>`;
      }
    });
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${report.name}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
      <div style="max-width: 650px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #111827; margin: 0 0 6px 0;">📊 Scheduled BI Report: ${report.name}</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">${report.description || 'Automated platform executive metrics breakdown.'}</p>
        </div>

        <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 12px 15px; margin-bottom: 20px; font-size: 13px; color: #334155;">
          <strong>Report Group:</strong> ${String(report.reportGroup).toUpperCase()}<br/>
          <strong>Frequency:</strong> ${report.scheduleFrequency}<br/>
          <strong>Filter Date Range:</strong> ${report.filters?.dateRange || '30d'} | <strong>Plan:</strong> ${report.filters?.plan || 'all'} | <strong>Country:</strong> ${report.filters?.country || 'all'}
        </div>

        <h3 style="color: #1f2937; margin-bottom: 10px;">Executive Summary & Metrics</h3>
        ${metricsSummaryHtml}

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
          Sent automatically by Multi-Tenant E-Commerce Platform Superadmin Engine.
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Executes a single scheduled report by fetching data and dispatching emails to recipients.
 * 
 * @param {string} reportId - ObjectId of SavedReport
 * @param {Object} [options] - { force: boolean }
 * @returns {Promise<Object>} Execution summary
 */
export const executeAndSendScheduledReport = async (reportId, options = {}) => {
  return runWithoutTenant(async () => {
    const report = await SavedReport.findById(reportId);
    if (!report) {
      throw new Error(`Scheduled Report with ID ${reportId} not found.`);
    }

    if (!options.force && !report.isScheduled) {
      throw new Error(`Report "${report.name}" is not configured for automatic scheduling.`);
    }

    const recipients = report.emailRecipients && report.emailRecipients.length > 0 
      ? report.emailRecipients 
      : ["admin@platform.com"];

    try {
      // 1. Compute live BI analytics data based on report filters
      const metrics = await computeLiveAnalyticsData({
        group: report.reportGroup,
        dateRange: report.filters?.dateRange || "30d",
        planFilter: report.filters?.plan || "all",
        countryFilter: report.filters?.country || "all"
      });

      // 2. Generate HTML report email content
      const htmlContent = generateReportHtml(report, metrics);
      const subject = `[Scheduled Report] ${report.name} (${new Date().toLocaleDateString()})`;

      // 3. Dispatch emails to all configured recipients
      const dispatchResults = [];
      for (const recipient of recipients) {
        const queueRes = await queueEmail({
          to: recipient,
          subject,
          html: htmlContent,
          text: `Scheduled BI Report: ${report.name}. Please open HTML view to read metrics.`
        });
        dispatchResults.push({ recipient, ...queueRes });
      }

      // 4. Update lastSentAt timestamp and clear errors
      report.lastSentAt = new Date();
      report.lastError = null;
      await report.save();

      console.log(`[ReportProcessor] Successfully executed and dispatched scheduled report "${report.name}" (${report._id}) to ${recipients.length} recipients.`);

      return {
        success: true,
        reportId: report._id,
        name: report.name,
        recipientsCount: recipients.length,
        dispatchedAt: report.lastSentAt,
        details: dispatchResults
      };
    } catch (err) {
      console.error(`[ReportProcessor] Failed to execute scheduled report "${report.name}" (${report._id}):`, err);
      report.lastError = err.message || "Execution error";
      await report.save().catch(() => {});
      throw err;
    }
  });
};
