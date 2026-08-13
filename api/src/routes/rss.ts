import { Router } from "express";
import { rssController } from "../controllers/rss";

export const rssRouter = Router();

rssRouter.get("/", rssController.generateRssFeed);