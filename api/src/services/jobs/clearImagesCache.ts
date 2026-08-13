import fs from "fs";
import path from "path";
import {
  CACHE_PATH,
  CACHE_DURATION_MS,
  MAX_CACHE_SIZE_BYTES,
  getCacheSize,
} from "../../utils/cacheConfig";
import { Logger } from "../../utils/Logger";

/**
 * Delete oldest files in cache until target size is reached
 * @param targetSize - Target size in bytes to free up to
 */
function freeUpCacheSpace(targetSize: number): number {
  try {
    if (!fs.existsSync(CACHE_PATH)) {
      return 0;
    }

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

    let deletedCount = 0;
    let currentSize = getCacheSize();
    for (const file of files) {
      if (currentSize <= targetSize) {
        break;
      }
      try {
        fs.unlinkSync(file.filePath);
        currentSize -= file.size;
        deletedCount++;
        Logger.debug("clearImagesCache", "Deleted cache file", {
          file: file.file,
          size: file.size,
        });
      } catch (deleteError) {
        Logger.warn("clearImagesCache", "Failed to delete cache file", {
          file: file.file,
          error: (deleteError as Error).message,
        });
      }
    }
    return deletedCount;
  } catch {
    return 0;
  }
}

export function clearImagesCache(): void {
  try {
    if (!fs.existsSync(CACHE_PATH)) {
      return;
    }

    const now = Date.now();
    const files = fs.readdirSync(CACHE_PATH);
    let deletedByAge = 0;

    // First pass: delete files older than CACHE_DURATION
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(CACHE_PATH, file);
      try {
        const stats = fs.statSync(filePath);
        if (now - stats.birthtimeMs > CACHE_DURATION_MS) {
          fs.unlinkSync(filePath);
          deletedByAge++;
        }
      } catch {
        // Ignore errors for individual files
      }
    }

    // Second pass: check if cache is still too large and delete oldest files
    const cacheSize = getCacheSize();
    if (cacheSize > MAX_CACHE_SIZE_BYTES) {
      Logger.warn("clearImagesCache", "Cache exceeds max size, cleaning up oldest files", {
        currentSize: cacheSize,
        maxSize: MAX_CACHE_SIZE_BYTES,
      });
      const deletedBySize = freeUpCacheSpace(MAX_CACHE_SIZE_BYTES * 0.8);
      Logger.info("clearImagesCache", "Cleanup completed", {
        deletedByAge,
        deletedBySize,
        finalSize: getCacheSize(),
      });
    } else {
      Logger.debug("clearImagesCache", "Cache cleanup by age completed", {
        deletedByAge,
        currentSize: cacheSize,
      });
    }
  } catch (error) {
    Logger.error("clearImagesCache", "Failed to clear image cache", {
      error: (error as Error).message,
    });
  }
}
