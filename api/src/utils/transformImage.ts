import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import sharp, { FitEnum } from "sharp";
import {
  CACHE_PATH,
  CACHE_CLEANUP_THRESHOLD,
  MAX_CACHE_SIZE_BYTES,
  getCacheSize,
} from "./cacheConfig";
import { Logger } from "./Logger";

/**
 * Delete oldest files in cache until target size is reached
 * @param targetSize - Target size in bytes to free up to
 */
function freeUpCacheSpace(targetSize: number): void {
  try {
    const files = fs.readdirSync(CACHE_PATH).map((file) => {
      const filePath = path.join(CACHE_PATH, file);
      try {
        const stats = fs.statSync(filePath);
        return { file, filePath, birthtimeMs: stats.birthtimeMs, size: stats.size };
      } catch {
        return null;
      }
    }).filter((f): f is NonNullable<typeof f> => f !== null);

    // Sort by oldest first (birthtime)
    files.sort((a, b) => a.birthtimeMs - b.birthtimeMs);

    let currentSize = getCacheSize();
    for (const file of files) {
      if (currentSize <= targetSize) {
        break;
      }
      try {
        fs.unlinkSync(file.filePath);
        currentSize -= file.size;
        Logger.info("transformImage", "Deleted cache file to free up space", {
          file: file.file,
          size: file.size,
        });
      } catch (deleteError) {
        Logger.warn("transformImage", "Failed to delete cache file", {
          file: file.file,
          error: (deleteError as Error).message,
        });
      }
    }
  } catch (error) {
    Logger.error("transformImage", "Failed to free up cache space", {
      error: (error as Error).message,
    });
  }
}

export async function transformImage(args: {
  width?: number;
  height?: number;
  fit?: keyof FitEnum;
  path: string;
}): Promise<string> {
  if (!args.width && !args.height && !args.fit) {
    return args.path;
  }

  try {
    const key = createHash("sha256").update(JSON.stringify(args)).digest("hex");
    const imageCachePath = `${CACHE_PATH}/${key}.webp`;
    if (fs.existsSync(imageCachePath)) {
      return imageCachePath;
    }

    // Check if cache is full before creating new file
    const cacheSize = getCacheSize();
    const thresholdSize = MAX_CACHE_SIZE_BYTES * CACHE_CLEANUP_THRESHOLD;

    if (cacheSize >= thresholdSize) {
      Logger.warn("transformImage", "Cache near capacity, cleaning up old files", {
        currentSize: cacheSize,
        maxSize: MAX_CACHE_SIZE_BYTES,
        threshold: thresholdSize,
      });
      freeUpCacheSpace(MAX_CACHE_SIZE_BYTES * 0.8); // Free up to 80% of max
    }

    // Check again after cleanup
    const updatedCacheSize = getCacheSize();
    if (updatedCacheSize >= MAX_CACHE_SIZE_BYTES) {
      Logger.error("transformImage", "Cache is full, cannot create new file", {
        currentSize: updatedCacheSize,
        maxSize: MAX_CACHE_SIZE_BYTES,
      });
      return args.path; // Return original path if cache is full
    }

    await sharp(args.path)
      .resize({ width: args.width, height: args.height, fit: args.fit })
      .toFile(imageCachePath);

    return imageCachePath;
  } catch (error) {
    Logger.error("transformImage", "Failed to transform image", {
      error: (error as Error).message,
    });
    return args.path;
  }
}
