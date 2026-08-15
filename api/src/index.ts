import express from "express";
import { createServer } from "http";
import { Cron } from "./services/Cron";
import { Logger } from "./utils/Logger";
import { Websockets } from "./services/Websockets";
import { apiRouter } from "./api";
import { sendError } from "./utils/sendError";
import { securityHeaders } from "./middlewares/security";
import { cors } from "./middlewares/cors";
import { User, UserRole } from "./entities/User";
import { datasource } from "./datasource";
import * as argon2 from "argon2";
import * as path from "path";
import * as fs from "fs";

const port = process.env.PORT || 3300;

async function main() {
  try {
    // Validate JWT secrets on startup - app will NOT start if missing
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      Logger.error("auth", "Missing JWT secret, app cannot start");
      throw new Error("JWT_SECRET environment variable is required");
    }

    // Initialize database
    await datasource.initialize();

    // Create default user if needed
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const admin = await User.findOneBy({ email: process.env.ADMIN_EMAIL });
      if (!admin) {
        const newAdmin = new User();
        newAdmin.email = process.env.ADMIN_EMAIL;
        newAdmin.password = await argon2.hash(process.env.ADMIN_PASSWORD);
        newAdmin.role = UserRole.ADMIN;
        newAdmin.state = "active";
        await newAdmin.save();
        Logger.info("auth", "Default admin user has been created");
      }
    }

    // Run cron jobs
    Cron.startAll();

    // Prepare express API
    const app = express();
    
    // Trust proxy headers when running behind a reverse proxy (Traefik, Nginx, etc.)
    // This is needed for req.secure, req.headers['x-forwarded-proto'], etc. to work correctly
    app.set('trust proxy', true);
    
    app.use(express.json());

    // Apply CORS middleware before security headers
    app.use(cors);

    // Apply security headers to all requests
    app.use(securityHeaders);

    app.use("/api", apiRouter);

    // Serve static website from public folder if it exists (Vite/React app)
    const publicPath = path.join(__dirname, "..", "public");
    if (fs.existsSync(publicPath)) {
      app.use(express.static(publicPath));

      // For SPA routing: serve index.html for all unmatched routes
      app.get("*all", (req, res) => {
        res.sendFile(path.join(publicPath, "index.html"));
      });
    } else {
      // Default route
      app.get("/", (req, res) => {
        res.status(200).json({ message: "Hello World" });
      });
    }

    // 404 if needed
    app.use((req, res) => {
      sendError(res, 404, "not_found", ["not route matched"]);
    });

    // Prepare HTTP server
    const server = createServer(app);

    // Prepare websocket server
    const wsServer = new Websockets(server);
    wsServer.initialize();

    // Run
    server.listen(port, () => {
      Logger.info("server", `Server is running on port ${port}`);
    });
  } catch (error) {
    Logger.error("server", "Failed to start server", {
      error: (error as Error).message,
    });
    process.exit(1);
  }
}

main();
