import { createHash } from "crypto";
import fs from "fs";
import sharp, { FitEnum } from "sharp";
import { CACHE_PATH } from "./cacheConfig";
import { Logger } from "./Logger";

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
