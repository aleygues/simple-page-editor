import fs from "fs";
import path from "path";
import { CACHE_PATH, CACHE_DURATION_MS } from "../../utils/cacheConfig";
import { Logger } from "../../utils/Logger";

export function clearImagesCache(): void {
  try {
    if (!fs.existsSync(CACHE_PATH)) {
      return;
    }

    const now = Date.now();
    const files = fs.readdirSync(CACHE_PATH);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(CACHE_PATH, file);
      const stats = fs.statSync(filePath);

      if (now - stats.birthtimeMs > CACHE_DURATION_MS) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    Logger.error("clearImagesCache", "Failed to clear image cache", {
      error: (error as Error).message,
    });
  }
}
