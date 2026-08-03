import Cookies from "cookies";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

export async function updateToken(userId: number, req: Request, res: Response) {
  const secret = process.env.JWT_SECRET!;

  const payload = {
    userId,
  };

  const token = sign(payload, secret, {
    expiresIn: (process.env.JWT_DURATION as `${number}${"d" | "h"}`) || "1d",
  });

  const cookies = new Cookies(req, res);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  // Set token cookie (shorter duration)
  cookies.set("token", token, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  });
}
