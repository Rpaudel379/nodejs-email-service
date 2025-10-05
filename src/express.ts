import express from "express";
import routes from "@/routes";
import { globalError, mongoError, zodError } from "@middlewares/errors";
import { notFoundMiddleware } from "@middlewares/not-found";
import { sendResponse } from "@utils/api-response";
import { Messages } from "@assets/constants/messages";
import { basicAuth } from "@middlewares/auth/basic-auth";
import { PORT } from "@assets/constants/variables";

import { ExpressProps } from "@/common/types/props.type.";
import { pinoHttp } from "pino-http";
import { logger as defaultLogger, httpLogger } from "./common/utils/log/logger";

export default ({ services }: ExpressProps) => {
  const app = express();
  app.use(express.json());
  app.use(pinoHttp({ logger: httpLogger }));

  // parsed html text
  app.use(express.text({ type: "text/html" }));

  // routes
  app.get("/", (_, res) => {
    sendResponse(res, 200, Messages.STATUS.SUCCESS, "email trigger app", {
      info: "Welcome to the app",
    });
  });

  app.use((req, _, next) => {
    const clientCode = req.headers?.["client_code"]?.toString() ?? "";
    const { emailService } = services[clientCode] ?? {};
    if (emailService) {
      req.emailService = emailService;
    }
    next();
  });

  app.use("/api/v1", basicAuth, routes);
  app.use("*", notFoundMiddleware);

  app.use(zodError);
  app.use(mongoError);
  app.use(globalError);
  app.listen(PORT, () => {
    defaultLogger.info(`server running on port ${PORT || 8080}`);
  });
};
