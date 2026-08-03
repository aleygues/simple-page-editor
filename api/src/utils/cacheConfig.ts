import path from "path";
import { mkdirSync } from "fs";
import { Logger } from "./Logger";

export const CACHE_PATH =
  process.env.CACHE_PATH || path.join(process.cwd(), "data", "cache");
export const CACHE_DURATION_MS =
  Number(process.env.CACHE_DURATION) * 1000 || 24 * 60 * 60 * 1000;

try {
  // create cache folder if it doesn't exist
  mkdirSync(CACHE_PATH, { recursive: true });
  Logger.debug("cacheConfig", "Cache directory ensured");
} catch (error) {
  Logger.error("cacheConfig", "Failed to create cache directory", {
    error: (error as Error).message,
  });
}
