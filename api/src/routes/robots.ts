import { Router } from "express";
import { robotsController } from "../controllers/robots";

export const robotsRouter = Router();

robotsRouter.get("/", robotsController.generateRobotsTxt);