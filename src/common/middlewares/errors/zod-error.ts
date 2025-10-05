import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "@utils/errors";

export const zodError = (
  error: unknown,
  _: Request,
  __: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    const message = "schema validation failed";
    const errors = formatZodErrors(error);
    return next(new AppError(message, 400, errors));
  }
  next(error);
};

const formatZodErrors = (error: z.ZodError) => {
  const errors: Record<string, string> = {};
  for (const issue of error.errors) {
    if (issue.path.length === 0) {
      errors["form"] = issue.message;
      break;
    }
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }

  return errors;
};
