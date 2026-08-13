import { cleanupRateLimiterState } from "../../middlewares/rateLimiter";
import { Logger } from "../../utils/Logger";

/**
 * Cron job to clean up expired rate limiter entries
 * Runs every 15 minutes to remove stale IP tracking data
 */
export function cleanupRateLimiter(): void {
  try {
    cleanupRateLimiterState();
    Logger.debug("cleanupRateLimiter", "Rate limiter cleanup completed");
  } catch (error) {
    Logger.error("cleanupRateLimiter", "Failed to cleanup rate limiter state", {
      error: (error as Error).message,
    });
  }
}
