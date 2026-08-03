import { Router } from "express";
import { usersController } from "../controllers/users";
import { inputValidation } from "../utils/validation";
import {
  UserInput,
  UserPasswordInput,
  UserTokenCreateInput,
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
  inputValidation(UserTokenCreateInput),
  usersController.createToken,
);
usersRouter.delete("/tokens", usersController.logout);
