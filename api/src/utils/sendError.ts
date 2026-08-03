import express from "express";
import { Logger, LogLevel } from "./Logger";

export function sendError(
  res: express.Response,
  status: number,
  key: string,
  info: string[],
): void {
  Logger.error(key, "Error response", { status, info });
  res.status(status).json({
    error: {
      key,
      info,
    },
  });
}
