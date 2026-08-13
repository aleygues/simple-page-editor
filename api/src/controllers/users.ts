import { Request, Response } from "express";
import {
  UserInput,
  User,
  UserTokenCreateInput,
  UserPasswordInput,
  UserPasswordResetRequestInput,
  UserPasswordResetInput,
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

    // Always log login attempts (without revealing if user exists)
    Logger.info("users", "Login attempt", {
      email: input.email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Check if user exists
    if (!user) {
      Logger.warn("users", "Invalid login attempt - user not found", {
        email: input.email,
        ip: req.ip,
      });
      return sendError(res, 401, "invalid credentials", [
        "Invalid email or password",
      ]);
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      const remainingMinutes = Math.ceil(
        ((user.lockedUntil?.getTime() || 0) - Date.now()) / (1000 * 60),
      );
      Logger.warn("users", "Login attempt on locked account", {
        userId: user.id,
        email: input.email,
        remainingMinutes,
        ip: req.ip,
      });
      return sendError(res, 403, "account locked", [
        `Account locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`,
      ]);
    }

    // Check if user account is validated
    if (user.state !== "active") {
      Logger.warn("users", "Login attempt with unactive account", {
        userId: user.id,
        email: input.email,
        state: user.state,
        ip: req.ip,
      });
      return sendError(res, 403, "account not active", [
        "This account is pending or blocked",
      ]);
    }

    // Verify password - argon2.verify is timing-attack safe
    if (
      !user.password ||
      !(await argon2.verify(user.password, input.password))
    ) {
      // Record failed attempt
      user.recordFailedLogin();
      await user.save();

      Logger.warn("users", "Invalid login attempt - wrong password", {
        userId: user.id,
        email: input.email,
        failedAttempts: user.failedLoginAttempts,
        ip: req.ip,
      });

      return sendError(res, 401, "invalid credentials", [
        "Invalid email or password",
      ]);
    }

    // Reset failed login attempts on successful login
    user.resetFailedLogins();
    await user.save();

    const token = await updateToken(user.id, req, res);

    Logger.info("users", "User logged in successfully", {
      userId: user.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
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

  async requestPasswordReset(req: Request, res: Response): Promise<void> {
    const input = req.validatedEntity as UserPasswordResetRequestInput;
    const user = await User.findOne({ where: { email: input.email } });

    if (!user) {
      // Don't reveal if user exists or not for security
      Logger.warn("users", "Password reset requested for non-existent email", {
        email: input.email,
        ip: req.ip,
      });
      res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
      return;
    }

    // Generate reset token
    const { token } = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email (and log token to terminal)
    try {
      await Email.sendPasswordResetEmail(user.email, token);
    } catch (emailError) {
      Logger.error("users", "Failed to send password reset email", {
        userId: user.id,
        error: (emailError as Error).message,
      });
      // Still return success to prevent email enumeration
      res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
      return;
    }

    Logger.info("users", "Password reset email sent successfully", {
      userId: user.id,
      email: user.email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const input = req.validatedEntity as UserPasswordResetInput;
    const user = await User.findOne({
      where: { passwordToken: input.passwordToken },
    });

    if (!user) {
      Logger.warn("users", "Invalid password reset token", {
        token: input.passwordToken,
        ip: req.ip,
      });
      return sendError(res, 404, "invalid token", [
        "Invalid password reset token",
      ]);
    }

    // Check if token is expired
    if (
      !user.passwordTokenExpiresAt ||
      user.passwordTokenExpiresAt < new Date()
    ) {
      Logger.warn("users", "Expired password reset token", {
        userId: user.id,
        ip: req.ip,
      });
      return sendError(res, 400, "expired token", [
        "Password reset token has expired. Please request a new one.",
      ]);
    }

    // Update password
    user.password = await argon2.hash(input.password);
    user.passwordToken = undefined;
    user.passwordTokenExpiresAt = undefined;
    await user.save();

    Logger.info("users", "Password reset successfully", {
      userId: user.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(204).send();
  }
}

export const usersController = new UsersController();
