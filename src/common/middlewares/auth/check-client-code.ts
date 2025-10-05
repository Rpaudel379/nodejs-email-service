import { AppError } from "@/common/utils/errors";
import { NextFunction, Request, Response } from "express";

export const checkClientCode = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientCode = req.headers["client_code"]?.toString();
    if (!clientCode || !req.emailService) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
      throw new AppError("Valid client code required", 401, {
        req: "Valid client code is required to access this API",
      });
    }

    req.log.setBindings({ client_code: clientCode });
    next();
  } catch (error) {
    next(error);
  }
};
