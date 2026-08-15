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
  // Check if the request is secure (HTTPS) - in production, only set secure flag if using HTTPS
  // For reverse proxies (like Traefik, Nginx), check X-Forwarded-Proto and X-Forwarded-Ssl headers
  const isSecureConnection = 
    req.secure || 
    (req.headers["x-forwarded-proto"]?.toString().toLowerCase() === "https") ||
    (req.headers["x-forwarded-scheme"]?.toString().toLowerCase() === "https") ||
    (req.headers["x-forwarded-ssl"]?.toString().toLowerCase() === "on");
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && isSecureConnection,
    sameSite: "strict" as const,
  };

  // Set token cookie (shorter duration)
  cookies.set("token", token, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  });
}
