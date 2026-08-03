import express from "express";
import { createServer } from "http";
import { Cron } from "./services/Cron";
import { Logger } from "./utils/Logger";
import { Websockets } from "./services/Websockets";
import { apiRouter } from "./api";
import { sendError } from "./utils/sendError";
import { User, UserRole } from "./entities/User";
import { datasource } from "./datasource";
import * as argon2 from "argon2";

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
    app.use(express.json());
    app.use("/api", apiRouter);
    // Default route
    app.get("/", (req, res) => {
      res.status(200).json({ message: "Hello World" });
    });
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
