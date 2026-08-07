import { Router } from "express";
import { faviconController } from "../controllers/favicon";

export const faviconRouter = Router();

faviconRouter.get("/", faviconController.get);
