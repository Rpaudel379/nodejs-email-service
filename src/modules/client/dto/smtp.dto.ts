import { z } from "zod";

export const smtpSchemaDTO = z.object(
  {
    username: z.string({ required_error: "smtp username is required" }),
    password: z.string({ required_error: "smtp password is required" }),
    port: z.coerce.number({
      required_error: "smtp port number is required",
      invalid_type_error: "smtp port must be a valid number",
    }),
    host: z.string({ required_error: "smtp host is required" }),
    name: z.enum(["gmail", "outlook", "zoho"], {
      invalid_type_error: "invalid smtp provider name type ",
      required_error: "imap provider name is required",
    }),
  },
  { required_error: "smtp configurations is required" }
);

export type SMTPSchemaDTO = z.infer<typeof smtpSchemaDTO>;
