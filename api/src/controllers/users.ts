import { Request, Response } from "express";
import {
  UserInput,
  User,
  UserTokenCreateInput,
  UserPasswordInput,
} from "../entities/User";
import Cookies from "cookies";
import { Logger } from "../utils/Logger";
import { sendError } from "../utils/sendError";
import { Email } from "../services/Email";
import { updateToken } from "../utils/updateToken";
import { getUserFromRequest } from "../utils/getUserFromRequest";
import * as argon2 from "argon2";

class UsersController {
  async create(req: Request, res: Response): Promise<void> {
    const input = req.body.validatedEntity as UserInput;
    const newUser = await input.getValidatedEntity();

    // Generate validation token
    const { token } = newUser.generatePasswordToken();

    await newUser.save();

    // Send validation email
    try {
      await Email.sendValidationEmail(newUser.email, token);
    } catch (emailError) {
      Logger.error(
        "users",
        "Failed to send validation email, but user was created",
        {
          userId: newUser.id,
          error: (emailError as Error).message,
        },
      );
      // User is still created, email sending failed
    }

    Logger.info("users", "User created, validation email sent", {
      id: newUser.id,
    });
    res.status(201).json({
      ...newUser,
      password: undefined,
      validationToken: undefined,
      validationTokenExpiresAt: undefined,
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.id as string);
    const input = req.body.validatedEntity as UserInput;
    const user = await User.findOne({ where: { id: userId } });
  }

  async createPassword(req: Request, res: Response): Promise<void> {
    const input = req.body.validatedEntity as UserPasswordInput;

    const user = await User.findOne({
      where: { passwordToken: input.passwordToken },
    });

    if (!user) {
      Logger.warn("users", "Invalid password token", {
        token: input.passwordToken,
      });
      return sendError(res, 404, "invalid token", ["Invalid password token"]);
    }

    try {
      const validatedInput = await input.getValidatedEntity();
      validatedInput.save();

      Logger.info("users", "User account validated", { userId: user.id });
      res.status(204).send();
    } catch {
      Logger.warn("users", "Expired validation token", { userId: user.id });
      return sendError(res, 400, "expired token", [
        "Password token has expired",
      ]);
    }
  }

  async createToken(req: Request, res: Response): Promise<void> {
    const input = req.validatedEntity as UserTokenCreateInput;
    const user = await User.findOne({ where: { email: input.email } });

    if (!user) {
      Logger.warn("users", "Invalid login attempt", {
        email: input.email,
      });
      return sendError(res, 401, "invalid credentials", [
        "Invalid email or password",
      ]);
    }

    if (
      !user.password ||
      !(await argon2.verify(user.password, input.password))
    ) {
      Logger.warn("users", "Invalid login attempt", {
        email: input.email,
      });
      return sendError(res, 401, "invalid credentials", [
        "Invalid email or password",
      ]);
    }

    // Check if user account is validated
    if (user.state !== "active") {
      Logger.warn("users", "Login attempt with unactive account", {
        email: input.email,
      });
      return sendError(res, 403, "account not active", [
        "This account is pending or blocked",
      ]);
    }

    const token = await updateToken(user.id, req, res);

    Logger.info("users", "User logged in", { userId: user.id });
    res.status(200).json({
      token,
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const cookies = new Cookies(req, res);
    cookies.set("token", "", { expires: new Date(0) });
    Logger.info("users", "User logged out");
    res.status(204).send();
  }

  async getMe(req: Request, res: Response): Promise<void> {
    const user = await getUserFromRequest(req);
    res.json(user);
  }
}

export const usersController = new UsersController();
