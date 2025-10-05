import { z } from "zod";

export const imapSchemaDTO = z.object(
  {
    username: z.string({ required_error: "imap username is required" }),
    password: z.string({ required_error: "imap password is required" }),
    port: z.coerce.number({
      required_error: "imap port number is required",
      invalid_type_error: "imap port must be a valid number",
    }),
    host: z.string({ required_error: "imap host is required" }),
    name: z.enum(["gmail", "outlook", "zoho"], {
      invalid_type_error: "invalid imap provider name type",
      required_error: "imap provider name is required",
    }),
  },
  { required_error: "imap configurations is required" }
);

export type IMAPSchemaDTO = z.infer<typeof imapSchemaDTO>;
