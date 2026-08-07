import { Request, Response } from "express";

export class FaviconController {
  async get(req: Request, res: Response): Promise<void> {
    const faviconPath = process.env.FAVICON_PATH || "./public/favicon.ico";
    res.redirect(faviconPath);
  }
}

export const faviconController = new FaviconController();
