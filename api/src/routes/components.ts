import { Router } from "express";
import { componentsController } from "../controllers/components";
import { authorization } from "../middlewares/authorization";
import { UserRole } from "../entities/User";
import {
  ComponentCreateInput,
  ComponentUpdateInput,
} from "../entities/Component";
import { inputValidation } from "../utils/validation";

export const componentsRouter = Router();

componentsRouter.get("/", componentsController.getAllComponents);
componentsRouter.post(
  "/",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  inputValidation(ComponentCreateInput),
  componentsController.create,
);
componentsRouter.patch(
  "/:id",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  inputValidation(ComponentUpdateInput),
  componentsController.update,
);
componentsRouter.delete(
  "/:id",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  componentsController.delete,
);
componentsRouter.get("/:tagOrId", componentsController.getByTagOrId);
