import type { EmailService } from "@common/services/email-service";
import pino from "pino";

declare global {
  namespace Express {
    interface Request {
      emailService: EmailService;
    }
    interface IncomingMessage {
      id: ReqId;
      log: pino.Logger;
      allLogs: pino.Logger[];
    }

    interface ServerResponse {
      err?: Error | undefined;
    }

    interface OutgoingMessage {
      [startTime]: number;
      log: pino.Logger;
      allLogs: pino.Logger[];
    }
  }
}
