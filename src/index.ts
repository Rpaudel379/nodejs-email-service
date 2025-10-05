import { connectDB } from "@common/services/db";
import { EmailService } from "@common/services/email-service";
import loader from "./loader";
import { logger } from "@utils/log/logger";
import { ClientService } from "@client/services/client.service";
import { type Logger } from "pino";

(async () => {
  process.on("exit", (code) => {
    logger.info(`process.exit() method is fired with code: ${code}`);
  });

  process.on("uncaughtException", (error) => {
    logger.error({ msg: `Uncaught Exception: ${error.message}`, err: error });
    logger.trace(error);
    process.exit(1);
  });
  try {
    await connectDB();
    const clients = (await new ClientService().findAllClients(1, 10)).data;

    const services: Record<string, { emailService: EmailService }> = {};

    await Promise.all(
      clients.map(async (client) => {
        const clientLogger = logger.child({ client_code: client.client_code });
        const emailService = new EmailService(client, clientLogger);
        await emailService.init();
        emailService.watchInbox();
        services[client.client_code] = { emailService };
      })
    );

    loader({ services });
  } catch (error) {
    logger.fatal({
      msg: `Error starting the server`,
      err: error,
    });
    logger.trace(error);
    process.exit(1);
  }
})();
