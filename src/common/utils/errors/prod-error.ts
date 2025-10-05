import { Response } from "express";
import { AppError } from "@utils/errors";
import { Messages } from "@/common/assets/constants/messages";

export const prodError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  } else {
    res.status(500).json({
      status: Messages.STATUS.ERROR,
      message: Messages.EXTRA.SOMETHING_WENT_WRONG,
    });
  }
};
