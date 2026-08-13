import { Request, Response, NextFunction } from "express";

/**
 * CORS middleware to allow cross-origin requests
 */
export function cors(req: Request, res: Response, next: NextFunction): Response | void {
  // Get the origin from the request
  const origin = req.headers.origin;
  
  // List of allowed origins
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3300",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3300",
    process.env.FRONTEND_URL || "http://localhost:5173",
  ];

  // Check if the origin is in the allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (origin) {
    // For development, allow all localhost origins
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  }

  // Allow credentials (cookies, authorization headers)
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
    return res.status(204).end();
  }

  return next();
}
