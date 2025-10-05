import { Messages } from "@/common/assets/constants/messages";
import { NODE_ENV } from "@/common/assets/constants/variables";
import { AppError, devError, prodError } from "@utils/errors";
import { NextFunction, Request, Response } from "express";

export const globalError = (
  err: AppError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || Messages.STATUS.ERROR;
  res?.log.error({
    msg: `${err.message}`,
    err: err,
  });
  res?.log.trace(err);
  if (NODE_ENV === "development") {
    devError(err, res);
  } else if (NODE_ENV === "production") {
    prodError(err, res);
  }
};
