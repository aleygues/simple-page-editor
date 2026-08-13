import { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/Logger";
import { sendError } from "../utils/sendError";

// Rate limiter state - exported so it can be accessed by the cleanup job
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

const MAX_LOGIN_ATTEMPTS = 10; // Max attempts per window
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Cleans up expired rate limiter entries
 * Called periodically by the cron service
 */
export function cleanupRateLimiterState(): void {
  const now = Date.now();
  let removedCount = 0;
  
  for (const [ip, attempts] of loginAttempts.entries()) {
    if (now > attempts.resetTime) {
      loginAttempts.delete(ip);
      removedCount++;
    }
  }
  
  if (removedCount > 0) {
    Logger.info("rateLimiter", "Cleaned up expired entries", { removedCount });
  }
}

/**
 * Get the current rate limiter state (for testing/debugging)
 */
export function getRateLimiterState(): Map<string, { count: number; resetTime: number }> {
  return new Map(loginAttempts);
}

/**
 * Rate limiter middleware for login attempts
 * Limits requests per IP address to prevent brute force attacks
 */
export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const now = Date.now();

  // Check if IP exists in the map
  const attempts = loginAttempts.get(ip);

  if (!attempts || now > attempts.resetTime) {
    // First attempt or window expired - reset the counter
    loginAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  // Increment the count
  attempts.count++;
  loginAttempts.set(ip, attempts);

  if (attempts.count <= MAX_LOGIN_ATTEMPTS) {
    return next();
  }

  // Rate limit exceeded
  const remainingTimeMs = attempts.resetTime - now;
  const remainingMinutes = Math.ceil(remainingTimeMs / (1000 * 60));

  Logger.warn("rateLimiter", "Rate limit exceeded", {
    ip,
    attempts: attempts.count,
    remainingMinutes,
    path: req.path,
  });

  sendError(res, 429, "too many requests", [
    `Too many login attempts. Try again in ${remainingMinutes} minutes.`,
  ]);
}
