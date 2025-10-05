import { z, ZodSchema } from "zod";

export const DTOMapper = <T extends ZodSchema>(
  schema: T,
  data: unknown
): z.infer<T> => {
  return schema.parse(data);
};
