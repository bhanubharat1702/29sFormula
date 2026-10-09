import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import cron from "node-cron";
import { SavedReport } from "../models/Analytics.js";
import { executeAndSendScheduledReport } from "../services/reportProcessor.js";
import { runWithoutTenant } from "../utils/tenantContext.js";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

function parseRedisUrl(urlStr) {
  try {
    const url = new URL(urlStr);
    return {
      host: url.hostname || "127.0.0.1",
      port: Number(url.port) || 6379,
      username: url.username || undefined,
      password: url.password || undefined,
      maxRetriesPerRequest: null,
      enableOfflineQueue: false
    };
  } catch (e) {
    return {
      host: "127.0.0.1",
      port: 6379,
      maxRetriesPerRequest: null,
      enableOfflineQueue: false
    };
  }
}

const connection = parseRedisUrl(REDIS_URL);

let reportQueue = null;
let reportWorker = null;
let isReportQueueActive = false;

const pingRedis = async (urlStr) => {
  return new Promise((resolve) => {
    try {
      const client = new Redis(urlStr, {
        connectTimeout: 1000,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        retryStrategy: () => null
      });
      client.on("error", () => {
        try { client.disconnect(); } catch (e) {}
        resolve(false);
      });
      client.ping().then((res) => {
        try { client.disconnect(); } catch (e) {}
        resolve(res === "PONG");
      }).catch(() => {
        try { client.disconnect(); } catch (e) {}
        resolve(false);
      });
    } catch (e) {
      resolve(false);
    }
  });
};

export const initReportQueue = async () => {
  if (process.env.NODE_ENV === "test") return;

  const isRedisUp = await pingRedis(REDIS_URL);
  if (!isRedisUp) {
    console.warn("[ReportWorker] Redis is offline or unreachable. Scheduled reports will run via node-cron fallback.");
    isReportQueueActive = false;
    return;
  }

  try {
    reportQueue = new Queue("scheduledReportQueue", {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000
        },
        removeOnComplete: 100,
        removeOnFail: 500
      }
    });

    reportQueue.on("error", (err) => {
      console.warn("[ReportWorker] Report queue error:", err.message);
      isReportQueueActive = false;
    });

    reportWorker = new Worker(
      "scheduledReportQueue",
      async (job) => {
        if (job.name === "execute-report" && job.data?.reportId) {
          console.log(`[ReportWorker] Processing BullMQ job ${job.id} for report ${job.data.reportId}...`);
          await executeAndSendScheduledReport(job.data.reportId, { force: job.data.force });
        } else if (job.name === "check-all-scheduled-reports") {
          console.log(`[ReportWorker] Processing BullMQ job ${job.id} to check all scheduled reports...`);
          await processScheduledReports();
        }
      },
      { connection }
    );

    reportWorker.on("error", (err) => {
      console.warn("[ReportWorker] Report worker error:", err.message);
      isReportQueueActive = false;
    });

    reportWorker.on("completed", (job) => {
      console.log(`[ReportWorker] Job ${job.id} (${job.name}) completed successfully.`);
    });

    reportWorker.on("failed", (job, err) => {
      console.error(`[ReportWorker] Job ${job?.id} (${job?.name}) failed:`, err.message);
    });

    isReportQueueActive = true;
    console.log("[ReportWorker] Scheduled Report queue & worker initialized successfully with Redis.");
  } catch (err) {
    console.warn("[ReportWorker] BullMQ initialization warning - falling back to direct cron execution:", err.message);
    isReportQueueActive = false;
  }
};

// Initialize report queue asynchronously on startup
initReportQueue();

/**
 * Checks whether a scheduled report is due for execution based on its frequency and lastSentAt timestamp.
 * 
 * @param {Object} report - SavedReport document
 * @returns {boolean}
 */
export const isReportDue = (report) => {
  if (!report || !report.isScheduled) return false;
  if (!report.lastSentAt) return true;

  const now = Date.now();
  const lastSent = new Date(report.lastSentAt).getTime();
  const diffMs = now - lastSent;

  const freq = (report.scheduleFrequency || "weekly").toLowerCase();

  if (freq === "daily") {
    return diffMs >= 23 * 60 * 60 * 1000;
  } else if (freq === "monthly") {
    return diffMs >= 28 * 24 * 60 * 60 * 1000;
  } else {
    return diffMs >= 6 * 24 * 60 * 60 * 1000;
  }
};

/**
 * Queries all scheduled reports and processes due reports.
 * 
 * @param {Object} [options] - { force: boolean }
 * @returns {Promise<{ checked: number, processed: number, results: Array }>}
 */
export const processScheduledReports = async (options = {}) => {
  return runWithoutTenant(async () => {
    try {
      console.log("[ReportWorker] Checking scheduled reports for execution...");
      const reports = await SavedReport.find({ isScheduled: true }).lean();

      let processedCount = 0;
      const results = [];

      for (const report of reports) {
        if (options.force || isReportDue(report)) {
          console.log(`[ReportWorker] Report "${report.name}" (${report._id}) is due for dispatch (Frequency: ${report.scheduleFrequency}).`);
          
          if (isReportQueueActive && reportQueue) {
            try {
              const job = await reportQueue.add("execute-report", { reportId: String(report._id), force: options.force });
              results.push({ reportId: report._id, name: report.name, enqueued: true, jobId: job.id });
              processedCount++;
              continue;
            } catch (queueErr) {
              console.warn(`[ReportWorker] Queue add failed for report ${report._id}, falling back to direct execution:`, queueErr.message);
            }
          }

          // Direct Execution Fallback if BullMQ queue is not available
          try {
            const execRes = await executeAndSendScheduledReport(report._id, { force: options.force });
            results.push({ reportId: report._id, name: report.name, executedDirectly: true, result: execRes });
            processedCount++;
          } catch (execErr) {
            console.error(`[ReportWorker] Direct execution error for report ${report._id}:`, execErr.message);
            results.push({ reportId: report._id, name: report.name, error: execErr.message });
          }
        }
      }

      console.log(`[ReportWorker] Scheduled reports check finished. ${processedCount}/${reports.length} reports processed.`);
      return { checked: reports.length, processed: processedCount, results };
    } catch (err) {
      console.error("[ReportWorker] Critical error processing scheduled reports:", err);
      throw err;
    }
  });
};

/**
 * Enqueues a specific scheduled report for immediate background processing via BullMQ.
 * 
 * @param {string} reportId 
 * @param {boolean} [force=true] 
 */
export const triggerScheduledReportJob = async (reportId, force = true) => {
  if (isReportQueueActive && reportQueue) {
    try {
      const job = await reportQueue.add("execute-report", { reportId: String(reportId), force });
      return { enqueued: true, jobId: job.id };
    } catch (err) {
      console.warn("[ReportWorker] BullMQ queue trigger failed, falling back to direct execution:", err.message);
    }
  }

  // Direct Execution Fallback
  const result = await executeAndSendScheduledReport(reportId, { force });
  return { enqueued: false, fallback: true, result };
};

/**
 * Initializes scheduled report cron & BullMQ workers.
 */
export const startReportScheduler = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      await processScheduledReports();
    } catch (err) {
      console.error("[ReportWorker] Hourly cron execution failed:", err);
    }
  });

  if (isReportQueueActive && reportQueue) {
    try {
      reportQueue.add(
        "check-all-scheduled-reports",
        {},
        {
          repeat: {
            cron: "0 * * * *"
          }
        }
      );
    } catch (e) {
      console.warn("[ReportWorker] Could not register BullMQ repeatable job:", e.message);
    }
  }

  console.log("Scheduled Report background worker initialized (checks every hour at minute 0).");
};

export { reportQueue, reportWorker };
