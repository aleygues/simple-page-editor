import { Request, Response } from "express";
import {
  Version,
  VersionCreateInput,
  VersionUpdateInput,
} from "../entities/Version";
import { validate } from "class-validator";
import { getUniqueSlug } from "../utils/getUniqueSlug";
import { Logger } from "../utils/Logger";
import { User } from "../entities/User";
import { sendError } from "../utils/sendError";

class VersionsController {
  async create(req: Request, res: Response): Promise<void> {
    const newVersion = await (
      req.validatedEntity as VersionCreateInput
    ).getEntity(req.user as User);

    const errors = await validate(newVersion);
    if (errors.length === 0) {
      await newVersion.save();
      Logger.info("Versions", "Version created", { id: newVersion.id });
      res.status(201).json(newVersion);
    } else {
      Logger.warn("Versions", "Validation errors", {
        errors: errors.map((e) => e.constraints),
      });
      res.status(400).json({ errors: errors.map((e) => e.constraints) });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const verison = await Version.findOne({
      where: { id: Number(req.params.id) },
    });

    if (!verison) {
      Logger.warn("Versions", "Version not found", { id: req.params.id });
      return sendError(res, 404, "not found", ["Version not found"]);
    }

    const updatedVersion = await (
      req.validatedEntity as VersionUpdateInput
    ).getEntity(verison, req.user as User);

    const errors = await validate(updatedVersion);
    if (errors.length === 0) {
      await updatedVersion.save();
      Logger.info("Versions", "Version updated", { id: updatedVersion.id });
      res.status(201).json(updatedVersion);
    } else {
      Logger.warn("Versions", "Validation errors", {
        errors: errors.map((e) => e.constraints),
      });
      res.status(400).json({ errors: errors.map((e) => e.constraints) });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const version = await Version.findOne({
      where: { id: Number(req.params.id) },
    });
    if (!version) {
      Logger.warn("Versions", "Version not found", { id: req.params.id });
      return sendError(res, 404, "not found", ["Version not found"]);
    }
    Logger.info("Versions", "Version retrieved", { id: version.id });
    res.status(200).json(version);
  }
}

export const versionsController = new VersionsController();
