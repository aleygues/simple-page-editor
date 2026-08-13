import { Router } from "express";
import { usersController } from "../controllers/users";
import { inputValidation } from "../utils/validation";
import { rateLimiter } from "../middlewares/rateLimiter";
import {
  UserInput,
  UserPasswordInput,
  UserTokenCreateInput,
  UserPasswordResetRequestInput,
  UserPasswordResetInput,
} from "../entities/User";

export const usersRouter = Router();

usersRouter.get("/me", usersController.getMe);
usersRouter.post("/", inputValidation(UserInput), usersController.create);
usersRouter.post(
  "/passwords",
  inputValidation(UserPasswordInput),
  usersController.createPassword,
);
usersRouter.post(
  "/tokens",
  rateLimiter,
  inputValidation(UserTokenCreateInput),
  usersController.createToken,
);
usersRouter.post(
  "/tokens/reset",
  rateLimiter,
  inputValidation(UserPasswordResetRequestInput),
  usersController.requestPasswordReset,
);
usersRouter.post(
  "/passwords/reset",
  inputValidation(UserPasswordResetInput),
  usersController.resetPassword,
);
usersRouter.delete("/tokens", usersController.logout);
