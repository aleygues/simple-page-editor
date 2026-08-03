import { Router } from "express";
import { pagesController } from "../controllers/pages";
import { authorization } from "../middlewares/authorization";
import { UserRole } from "../entities/User";
import { PageCreateInput, PageUpdateInput } from "../entities/Page";
import { inputValidation } from "../utils/validation";

export const pagesRouter = Router();

pagesRouter.get("/", pagesController.getAllPages);
pagesRouter.post(
  "/",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  inputValidation(PageCreateInput),
  pagesController.create,
);
pagesRouter.patch(
  "/:id",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  inputValidation(PageUpdateInput),
  pagesController.update,
);
pagesRouter.delete(
  "/:id",
  authorization([UserRole.CONTRIBUTOR, UserRole.ADMIN]),
  pagesController.delete,
);
pagesRouter.get("/:slugOrId", pagesController.getBySlugOrId);
