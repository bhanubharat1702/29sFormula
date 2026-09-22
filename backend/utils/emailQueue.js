import { Queue, Worker } from "bullmq";
import { sendEmail } from "./emailService.js";

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
      enableOfflineQueue: false,
      retryStrategy(times) {
        if (times > 3) return null;
        return 1000;
      }
    };
  } catch (e) {
    return {
      host: "127.0.0.1",
      port: 6379,
      maxRetriesPerRequest: null,
      enableOfflineQueue: false,
      retryStrategy(times) {
        if (times > 3) return null;
        return 1000;
      }
    };
  }
}

const connection = parseRedisUrl(REDIS_URL);

let emailQueue = null;
let emailWorker = null;
let isQueueActive = false;

if (process.env.NODE_ENV !== "test") {
  try {
    emailQueue = new Queue("emailQueue", {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000
        },
        removeOnComplete: 100,
        removeOnFail: 500
      }
    });

    emailQueue.on("error", (err) => {
      isQueueActive = false;
    });

    emailWorker = new Worker(
      "emailQueue",
      async (job) => {
        await sendEmail(job.data);
      },
      { connection }
    );

    emailWorker.on("error", (err) => {
      isQueueActive = false;
    });

    emailWorker.on("completed", (job) => {
      console.log(`Email job ${job.id} to ${job.data.to} completed successfully.`);
    });

    emailWorker.on("failed", (job, err) => {
      console.error(`Email job ${job?.id} to ${job?.data?.to} failed:`, err.message);
    });

    isQueueActive = true;
  } catch (err) {
    console.warn("BullMQ initialization warning - falling back to direct async execution:", err.message);
    isQueueActive = false;
  }
}

/**
 * Enqueue an email to be sent asynchronously via BullMQ.
 * Falls back to non-blocking setImmediate dispatch if BullMQ or Redis is offline/unavailable.
 * 
 * @param {Object} emailOptions - { to, subject, html, text }
 * @returns {Promise<{ enqueued: boolean, jobId?: string }>}
 */
export const queueEmail = async (emailOptions) => {
  if (isQueueActive && emailQueue) {
    try {
      const job = await emailQueue.add("send-email", emailOptions);
      return { enqueued: true, jobId: job.id };
    } catch (err) {
      console.warn("Failed to add job to BullMQ queue, falling back to setImmediate:", err.message);
    }
  }

  // Graceful Non-blocking Fallback
  setImmediate(() => {
    sendEmail(emailOptions).catch((err) => {
      console.error("Async fallback sendEmail failed:", err.message);
    });
  });

  return { enqueued: false, fallback: true };
};

export { emailQueue, emailWorker };
