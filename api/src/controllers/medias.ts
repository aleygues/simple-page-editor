import express, { Request, Response } from "express";
import multer from "multer";
import { sendError } from "../utils/sendError";
import { Media } from "../entities/Media";
import sharp, { FitEnum } from "sharp";
import { format } from "date-fns";
import { transformImage } from "../utils/transformImage";
import { mkdirSync } from "fs";
import { Logger } from "../utils/Logger";
import { User } from "../entities/User";

const uploadPath = process.env.UPLOADS_PATH || "./app-data/uploads";
mkdirSync(uploadPath, { recursive: true });
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = upload.single("media");

class MediasController {
  async create(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      Logger.warn("medias", "No file uploaded");
      return sendError(res, 400, "missing file", ["No file uploaded"]);
    }

    const newFilename = `${format(new Date(), "yyyy-MM-dd_HH-mm-ss_SSS")}.webp`;
    const newPath = `${uploadPath}/${newFilename}`;

    await sharp(req.file.buffer)
      .resize({
        width: 3840,
        height: 2060,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toFile(newPath);

    const newMedia = new Media();
    newMedia.name = req.file.originalname;
    newMedia.path = newPath;
    newMedia.mimetype = "image/webp";
    newMedia.createdBy = req.user as User;
    console.log(newMedia);
    await newMedia.save();

    Logger.info("medias", "Media created", { id: newMedia.id });
    res.status(201).json(newMedia);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const fileId = Number(req.params.id);
    const media = await Media.findOne({
      where: { id: fileId },
      relations: { createdBy: true },
    });

    if (!media) {
      Logger.warn("medias", "Media not found", { id: fileId });
      return sendError(res, 404, "not found", ["Media not found"]);
    }

    if (media.createdBy.id !== (req.user as User).id) {
      Logger.warn("medias", "Access denied", {
        mediaId: fileId,
        userId: (req.user as User).id,
      });
      return sendError(res, 403, "access denied", [
        "You are not allowed to delete this media",
      ]);
    }

    await media.remove();
    Logger.info("medias", "Media deleted", { id: fileId });
    res.status(204).send();
  }

  async getById(req: Request, res: Response): Promise<void> {
    const fileId = Number(req.params.id);
    const media = await Media.findOneBy({ id: fileId });

    if (!media) {
      Logger.warn("medias", "Media not found", { id: fileId });
      return sendError(res, 404, "not found", ["Media not found"]);
    }
    console.log(req.query);
    const width = req.query.width ? Number(req.query.width) : undefined;
    const height = req.query.height ? Number(req.query.height) : undefined;

    const fitArray: string[] = [
      "contain",
      "cover",
      "fill",
      "inside",
      "outside",
    ];
    const fit = fitArray.includes(req.query.fit as string)
      ? (req.query.fit as keyof FitEnum)
      : undefined;

    const args = {
      path: media.path,
      width,
      height,
      fit,
    };

    Logger.info("medias", "Media retrieved", { id: fileId });
    const transformedPath = await transformImage(args);
    return res.sendFile(transformedPath, {
      root: transformedPath.startsWith("/") ? undefined : process.cwd(),
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const madias = await Media.find({
      relations: { createdBy: true },
    });
    res.status(200).json(madias);
  }
}

export const mediasController = new MediasController();
