import { NextFunction, Request, Response } from "express";
import { Error as MongoError } from "mongoose";
import { AppError } from "@utils/errors";

export const mongoError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = "database validation failed";
  const errors: Record<string, string> = {};

  if (error instanceof MongoError.ValidationError) {
    Object.entries(error.errors).forEach(([path, err]) => {
      errors[path] = err.message;
    });

    return next(new AppError(message, 400, errors));
  }

  if (error instanceof MongoError.CastError) {
    console.log(error);
    if (error.kind === "ObjectId") {
      errors["id"] = "invalid id";
    } else {
      errors[error.path] = `This is an invalid type for ${error.kind}`;
    }
    return next(new AppError(message, 400, errors));
  }

  if (error.name === "MongoServerError") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 11000) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const keyValue = (error as any).keyValue;
      Object.keys(keyValue).forEach((field) => {
        errors[field] = `${keyValue[field]} already exists`;
      });

      return next(new AppError(message, 400, errors));
    }
  }

  next(error);
};
