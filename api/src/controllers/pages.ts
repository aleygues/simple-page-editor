import { Request, Response } from "express";
import { Page, PageCreateInput, PageUpdateInput } from "../entities/Page";
import { validate } from "class-validator";
import { Logger } from "../utils/Logger";
import { User } from "../entities/User";
import { sendError } from "../utils/sendError";

class PagesController {
  async create(req: Request, res: Response): Promise<void> {
    console.log(req.validatedEntity);
    const newPage = await (req.validatedEntity as PageCreateInput).getEntity(
      req.user as User,
    );

    const errors = await validate(newPage);
    if (errors.length === 0) {
      await newPage.save();
      Logger.info("pages", "Page created", { id: newPage.id });
      res.status(201).json(newPage);
    } else {
      Logger.warn("pages", "Validation errors", {
        errors: errors.map((e) => e.constraints),
      });
      res.status(400).json({ errors: errors.map((e) => e.constraints) });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const page = await Page.findOne({
      where: { id: Number(req.params.id) },
    });

    if (!page) {
      Logger.warn("Pages", "Page not found", { id: req.params.id });
      return sendError(res, 404, "not found", ["Page not found"]);
    }

    const updatedPage = await (
      req.validatedEntity as PageUpdateInput
    ).getEntity(page, req.user as User);

    const errors = await validate(updatedPage);
    if (errors.length === 0) {
      await updatedPage.save();
      Logger.info("pages", "Page updated", { id: updatedPage.id });
      res.status(201).json(updatedPage);
    } else {
      Logger.warn("pages", "Validation errors", {
        errors: errors.map((e) => e.constraints),
      });
      res.status(400).json({ errors: errors.map((e) => e.constraints) });
    }
  }

  async getBySlugOrId(req: Request, res: Response): Promise<void> {
    const id = /^[0-9]+$/.test(req.params.slugOrId as string)
      ? Number(req.params.slugOrId)
      : undefined;
    const page = await Page.findOne({
      where: id ? { id } : { slug: req.params.slugOrId as string },
      relations: { currentVersion: true },
    });
    if (!page) {
      Logger.warn("pages", "Page not found", { slug: req.params.slug });
      return sendError(res, 404, "not found", ["Page not found"]);
    }
    Logger.info("pages", "Page retrieved", { slug: req.params.slug });
    res.status(200).json(page);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const page = await Page.findOne({
      where: { id: Number(req.params.id) },
    });

    if (!page) {
      Logger.warn("Pages", "Page not found", { id: req.params.id });
      return sendError(res, 404, "not found", ["Page not found"]);
    }

    await page.remove();

    Logger.info("pages", "Page deleted", { id: req.params.id });
    res.status(204).send();
  }

  async getAllPages(req: Request, res: Response): Promise<void> {
    const pages = await Page.find({
      relations: { currentVersion: true },
    });
    res.status(200).json(pages);
  }
}

export const pagesController = new PagesController();
