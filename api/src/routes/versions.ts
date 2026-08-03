import { Router } from "express";
import { versionsController } from "../controllers/versions";
import { authorization } from "../middlewares/authorization";
import { UserRole } from "../entities/User";
import { inputValidation } from "../utils/validation";
import { VersionCreateInput, VersionUpdateInput } from "../entities/Version";

export const versionsRouter = Router();

versionsRouter.post(
  "/",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  inputValidation(VersionCreateInput),
  versionsController.create,
);
versionsRouter.patch(
  "/:id",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  inputValidation(VersionUpdateInput),
  versionsController.update,
);
/* versionsRouter.delete(
  "/:id",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  versionsController.delete,
); */
versionsRouter.get("/:id", versionsController.getById);
