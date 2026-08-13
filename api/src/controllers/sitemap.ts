import { Request, Response } from "express";
import { Page } from "../entities/Page";
import { Logger } from "../utils/Logger";

const BASE_URL = process.env.FRONTEND_URL || "/";

class SitemapController {
  async generateSitemap(req: Request, res: Response): Promise<void> {
    try {
      const pages = await Page.find({
        where: { inSitemap: true },
        select: { slug: true, updatedAt: true },
        order: { updatedAt: "DESC" },
      });

      // Build sitemap XML
      const urls = pages.map((page) => {
        // The web URL of a page is its slug, except for "/" URL that matches the "home" slug
        const path = page.slug === "home" ? "/" : `/${page.slug}`;
        const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString() : new Date().toISOString();
        
        // Calculate priority based on page importance (home page gets highest priority)
        const priority = page.slug === "home" ? "1.0" : "0.8";
        
        // Calculate change frequency based on how recently the page was updated
        const daysSinceUpdate = page.updatedAt 
          ? Math.floor((new Date().getTime() - new Date(page.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
          : 30;
        const changefreq = daysSinceUpdate < 7 
          ? "daily"
          : daysSinceUpdate < 30 
            ? "weekly" 
            : "monthly";
        
        return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      });

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join("\n")}
</urlset>`;

      res.set("Content-Type", "application/xml");
      res.status(200).send(sitemapXml);

      Logger.info("sitemap", "Sitemap generated", { urlCount: urls.length });
    } catch (error) {
      Logger.error("sitemap", "Failed to generate sitemap", {
        error: (error as Error).message,
      });
      res.status(500).json({ error: "Failed to generate sitemap" });
    }
  }
}

export const sitemapController = new SitemapController();
