import { NextFunction, Request, Response } from "express";
import { AppError } from "@utils/errors";
import { Messages } from "@assets/constants/messages";

export const notFoundMiddleware = (
  _: Request,
  __: Response,
  next: NextFunction
): void => {
  const message = Messages.EXTRA.API_NOT_FOUND;
  const errors = {
    req: Messages.EXTRA.API_NOT_FOUND,
  };
  return next(new AppError(message, 404, errors));
};
