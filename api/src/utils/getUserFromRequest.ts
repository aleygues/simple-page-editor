import Cookies from "cookies";
import express from "express";
import { verify } from "jsonwebtoken";
import { User } from "../entities/User";
import { IncomingMessage, ServerResponse } from "http";

export async function getUserFromRequest(
  req: IncomingMessage,
  res?: express.Response,
) {
  const cookies = new Cookies(req, res as unknown as ServerResponse);

  const token =
    cookies.get("token") ?? req.headers.authorization?.split(" ")[1];
  if (!token) {
    return null;
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET || "supersecret") as {
      userId: number;
    };
    if (!payload.userId) {
      return null;
    } else {
      const user = await User.findOneBy({ id: payload.userId });
      if (!user) {
        return null;
      }
      return user;
    }
  } catch {
    return null;
  }
}
