import { Router } from "express";
import { pagesRouter } from "./routes/pages";
import { versionsRouter } from "./routes/versions";
import { usersRouter } from "./routes/users";
import { mediasRouter } from "./routes/medias";
import { faviconRouter } from "./routes/favicon";
import { componentsRouter } from "./routes/components";
import { sitemapRouter } from "./routes/sitemap";
import { robotsRouter } from "./routes/robots";
import { rssRouter } from "./routes/rss";

export const apiRouter = Router();

apiRouter.use("/pages", pagesRouter);
apiRouter.use("/components", componentsRouter);
apiRouter.use("/versions", versionsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/media", mediasRouter);
apiRouter.use("/favicon", faviconRouter);
apiRouter.use("/sitemap", sitemapRouter);
apiRouter.use("/robots", robotsRouter);
apiRouter.use("/rss", rssRouter);
