import { NODE_ENV } from "@/common/assets/constants/variables";
import { redact } from "@/common/configs/logger/logger";
import { join } from "path";
import pino from "pino";

export function _createLogger(forHttp = false) {
  const targets: pino.TransportTargetOptions[] = [
    {
      target: "pino-roll",
      level: NODE_ENV === "development" ? "trace" : "info",
      options: {
        file: join("logs", "log"),
        frequency: "daily",
        mkdir: true,
        dateFormat: "yyyy-MM-dd",
        extension: ".log",
      },
    },
  ];
  if (!forHttp) {
    targets.push({
      target: "pino-pretty",
      level: NODE_ENV === "development" ? "trace" : "info",
    });
  }
  const transport = pino.transport({
    targets,
  });

  return pino(
    {
      level: NODE_ENV === "development" ? "trace" : "info",
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: {
        paths: redact,
        censor: "************",
      },
    },
    transport
  );
}

export const logger = _createLogger();
export const httpLogger = _createLogger(true);
