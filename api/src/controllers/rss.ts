import { Request, Response } from "express";
import { Page } from "../entities/Page";
import { Logger } from "../utils/Logger";

const BASE_URL = process.env.FRONTEND_URL || "https://asul-ultimate-website.example.com";
const SITE_NAME = process.env.SITE_NAME || "ASUL Ultimate Website";
const SITE_DESCRIPTION = process.env.SITE_DESCRIPTION || "Simple page editor for creating and managing MDX content";

class RssController {
  async generateRssFeed(req: Request, res: Response): Promise<void> {
    try {
      const pages = await Page.find({
        where: { inSitemap: true },
        select: { id: true, title: true, slug: true, description: true, updatedAt: true },
        order: { updatedAt: "DESC" },
        take: 50, // Limit to 50 most recent pages for RSS
      });

      // Build RSS feed XML
      const items = pages.map((page) => {
        const path = page.slug === "home" ? "/" : `/${page.slug}`;
        const url = `${BASE_URL}${path}`;
        const pubDate = page.updatedAt ? new Date(page.updatedAt).toUTCString() : new Date().toUTCString();
        
        // Sanitize content for XML
        const title = escapeXml(page.title);
        const description = escapeXml(page.description || SITE_DESCRIPTION);
        
        return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>${url}</guid>
    </item>`;
      }).join("\n");

      const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${escapeXml(SITE_NAME)}]]></title>
    <link>${BASE_URL}</link>
    <description><![CDATA[${escapeXml(SITE_DESCRIPTION)}]]></description>
    <language>en-us</language>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/api/rss/" rel="self" type="application/rss+xml" />
    <ttl>60</ttl>
${items}
  </channel>
</rss>`;

      res.set("Content-Type", "application/rss+xml");
      res.status(200).send(rssXml);

      Logger.info("rss", "RSS feed generated", { itemCount: pages.length });
    } catch (error) {
      Logger.error("rss", "Failed to generate RSS feed", {
        error: (error as Error).message,
      });
      res.status(500).json({ error: "Failed to generate RSS feed" });
    }
  }
}

// Simple XML escaping function
function escapeXml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const rssController = new RssController();