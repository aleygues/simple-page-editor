import { Request, Response, NextFunction } from "express";

/**
 * Security middleware to add security headers to all responses
 */
export function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy (formerly Feature-Policy)
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()",
  );

  // Cache control for sensitive pages
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");

  // Strict Transport Security (HSTS) - only enable in production with HTTPS
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  // Content Security Policy
  // Allow scripts from self, style from self and unsafe-inline (for CSS-in-JS)
  // Allow images from self and data:
  // Allow unsafe-eval for MDX which requires it for dynamic code evaluation
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'self';",
  );

  next();
}
