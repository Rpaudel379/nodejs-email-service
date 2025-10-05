import {
  BASIC_AUTH_PASSWORD,
  BASIC_AUTH_USERNAME,
} from "@/common/assets/constants/variables";
import { AppError } from "@/common/utils/errors";
import { NextFunction, Request, Response } from "express";

/**
 * Basic Authentication Middleware to protect API routes
 * @param req Request - Express
 * @param res Response - Express
 * @param next NextFunction - Express
 */
export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
      throw new AppError("Authentication required", 401, {
        req: "Authentication is required to access this API",
      });
    }

    // extract and decode credentials
    const [name, token] = authHeader.split(" ");
    if (name !== "Basic" || !token) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');

      throw new AppError("Invalid authentication", 401, {
        req: "Authentication token must start with `Basic`",
      });
    }
    const credentials = Buffer.from(token, "base64").toString("ascii");
    const [username, password] = credentials.split(":");

    if (username === BASIC_AUTH_USERNAME && password === BASIC_AUTH_PASSWORD) {
      next();
    } else {
      res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
      throw new AppError("Invalid token", 401, {
        req: "The token that was provided is invalid",
      });
    }
  } catch (error) {
    next(error);
  }
};
