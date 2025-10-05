import { Response } from "express";
import { AppError } from "@utils/errors";

export const devError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
  });
};
