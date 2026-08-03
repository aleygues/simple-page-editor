import express from "express";
import { sendError } from "../utils/sendError";
import { getUserFromRequest } from "../utils/getUserFromRequest";
import { UserRole } from "../entities/User";
import { Logger } from "../utils/Logger";
import { updateToken } from "../utils/updateToken";

export function authorization(roleOrRoles: UserRole | UserRole[]) {
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];

  return async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const user = await getUserFromRequest(req, res);

    if (!user) {
      Logger.warn("authorization", "Unauthorized access attempt, user is null");
      return sendError(res, 403, "unauthorized", ["Unauthorized"]);
    }

    if (roles.includes(user.role) === false) {
      Logger.error(
        "authorization",
        `user ${user.id} does not has the roles ${roles.join(", ")}`,
      );
      return sendError(res, 403, "unauthorized", ["Wrong role"]);
    }

    // at this point, we should update the token
    await updateToken(user.id, req, res);

    req.user = user;
    next();
  };
}
