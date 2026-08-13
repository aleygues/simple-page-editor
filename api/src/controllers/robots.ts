import { Request, Response } from "express";
import { Page } from "../entities/Page";
import { Logger } from "../utils/Logger";

const BASE_URL = process.env.FRONTEND_URL || "https://asul-ultimate-website.example.com";

class RobotsController {
  async generateRobotsTxt(req: Request, res: Response): Promise<void> {
    try {
      const pages = await Page.find({
        where: { inSitemap: true },
        select: { slug: true },
      });

      // Build robots.txt content
      const disallowPaths = [
        "/api/*",
        "/signin",
        "/editor/*",
      ];

      const allowPaths = [
        "/",
        ...pages.map((page) => (page.slug === "home" ? "/" : `/${page.slug}`)),
      ];

      const robotsContent = `User-agent: *
Disallow: ${disallowPaths.join("\nDisallow: ")}
Allow: ${allowPaths.join("\nAllow: ")}

Sitemap: ${BASE_URL}/api/sitemap/

# Crawl-delay: 5
# Request-rate: 1/5s
# Visit-time: 0600-2200

# Bing
User-agent: Bingbot
Crawl-delay: 3

# Google
User-agent: Googlebot
Crawl-delay: 2

# Yandex
User-agent: Yandex
Crawl-delay: 2`;

      res.set("Content-Type", "text/plain");
      res.status(200).send(robotsContent);

      Logger.info("robots", "Robots.txt generated");
    } catch (error) {
      Logger.error("robots", "Failed to generate robots.txt", {
        error: (error as Error).message,
      });
      res.status(500).json({ error: "Failed to generate robots.txt" });
    }
  }
}

export const robotsController = new RobotsController();