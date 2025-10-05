import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      /**
       * get only what is defined in the zod schema
       */
      const validatedBody = schema.parse(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      next(error);
    }
  };

export const validateIdParams =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      /**
       * get only what is defined in the zod schema
       */
      const validatedParams = schema.parse(req.params.id);
      req.params = { id: validatedParams };
      next();
    } catch (error) {
      next(error);
    }
  };

export const validateIdQuery =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validatedQuery = schema.parse(req.query.id);
      req.query = { id: validatedQuery };
      next();
    } catch (error) {
      next(error);
    }
  };
