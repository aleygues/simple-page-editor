import { Router } from "express";
import { pagesRouter } from "./routes/pages";
import { versionsRouter } from "./routes/versions";
import { usersRouter } from "./routes/users";
import { mediasRouter } from "./routes/medias";

export const apiRouter = Router();

apiRouter.use("/pages", pagesRouter);
apiRouter.use("/versions", versionsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/media", mediasRouter);
