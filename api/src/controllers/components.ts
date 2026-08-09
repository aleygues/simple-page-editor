import { Request, Response } from "express";
import {
  Component,
  ComponentCreateInput,
  ComponentUpdateInput,
} from "../entities/Component";
import { validate } from "class-validator";
import { Logger } from "../utils/Logger";
import { User } from "../entities/User";
import { sendError } from "../utils/sendError";

class ComponentsController {
  async create(req: Request, res: Response): Promise<void> {
    const newComponent = await (
      req.validatedEntity as ComponentCreateInput
    ).getEntity(req.user as User);

    const errors = await validate(newComponent);
    if (errors.length === 0) {
      await newComponent.save();
      Logger.info("pages", "Component created", { id: newComponent.id });
      res.status(201).json(newComponent);
    } else {
      Logger.warn("pages", "Validation errors", {
        errors: errors.map((e) => e.constraints),
      });
      res.status(400).json({ errors: errors.map((e) => e.constraints) });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const page = await Component.findOne({
      where: { id: Number(req.params.id) },
    });

    if (!page) {
      Logger.warn("Components", "Component not found", { id: req.params.id });
      return sendError(res, 404, "not found", ["Component not found"]);
    }

    const updatedComponent = await (
      req.validatedEntity as ComponentUpdateInput
    ).getEntity(page, req.user as User);

    const errors = await validate(updatedComponent);
    if (errors.length === 0) {
      await updatedComponent.save();
      Logger.info("pages", "Component updated", { id: updatedComponent.id });
      res.status(201).json(updatedComponent);
    } else {
      Logger.warn("pages", "Validation errors", {
        errors: errors.map((e) => e.constraints),
      });
      res.status(400).json({ errors: errors.map((e) => e.constraints) });
    }
  }

  async getByTagOrId(req: Request, res: Response): Promise<void> {
    const id = /^[0-9]+$/.test(req.params.tagOrId as string)
      ? Number(req.params.tagOrId)
      : undefined;
    const page = await Component.findOne({
      where: id ? { id } : { tag: req.params.tagOrId as string },
      relations: { currentVersion: true },
    });
    if (!page) {
      Logger.warn("pages", "Component not found", { slug: req.params.slug });
      return sendError(res, 404, "not found", ["Component not found"]);
    }
    Logger.info("pages", "Component retrieved", { slug: req.params.slug });
    res.status(200).json(page);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const page = await Component.findOne({
      where: { id: Number(req.params.id) },
    });

    if (!page) {
      Logger.warn("Components", "Component not found", { id: req.params.id });
      return sendError(res, 404, "not found", ["Component not found"]);
    }

    await page.remove();

    Logger.info("pages", "Component deleted", { id: req.params.id });
    res.status(204).send();
  }

  async getAllComponents(req: Request, res: Response): Promise<void> {
    const pages = await Component.find({
      relations: { currentVersion: true, createdBy: true },
    });
    res.status(200).json(pages);
  }
}

export const componentsController = new ComponentsController();
