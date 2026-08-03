import { Router } from "express";
import { mediasController, uploadMiddleware } from "../controllers/medias";
import { authorization } from "../middlewares/authorization";
import { UserRole } from "../entities/User";

export const mediasRouter = Router();

mediasRouter.get(
  "/",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  mediasController.getAll,
);
mediasRouter.post(
  "/",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  uploadMiddleware,
  mediasController.create,
);
mediasRouter.delete(
  "/:id",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  mediasController.delete,
);
mediasRouter.get("/:id", mediasController.getById);
