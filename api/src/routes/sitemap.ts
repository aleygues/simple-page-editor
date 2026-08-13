import { Router } from "express";
import { sitemapController } from "../controllers/sitemap";

export const sitemapRouter = Router();

sitemapRouter.get("/", sitemapController.generateSitemap);
