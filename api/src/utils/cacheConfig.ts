import path from "path";
import { mkdirSync, statfsSync } from "fs";
import { Logger } from "./Logger";

export const CACHE_PATH =
  process.env.CACHE_PATH || path.join(process.cwd(), "data", "cache");
export const CACHE_DURATION_MS =
  Number(process.env.CACHE_DURATION) * 1000 || 24 * 60 * 60 * 1000;

// Max cache size in bytes (default: 1 GB)
export const MAX_CACHE_SIZE_BYTES =
  Number(process.env.MAX_CACHE_SIZE_BYTES) || 1 * 1024 * 1024 * 1024;

// Safety margin - when cache reaches this percentage of max, start cleaning up
export const CACHE_CLEANUP_THRESHOLD = 0.9; // 90%

try {
  // create cache folder if it doesn't exist
  mkdirSync(CACHE_PATH, { recursive: true });
  Logger.debug("cacheConfig", "Cache directory ensured", {
    path: CACHE_PATH,
    maxSizeBytes: MAX_CACHE_SIZE_BYTES,
  });
} catch (error) {
  Logger.error("cacheConfig", "Failed to create cache directory", {
    error: (error as Error).message,
  });
}

/**
 * Get current cache directory size in bytes
 */
export function getCacheSize(): number {
  try {
    const stats = statfsSync(CACHE_PATH);
    return stats.blocks * stats.bsize;
  } catch {
    return 0;
  }
}
