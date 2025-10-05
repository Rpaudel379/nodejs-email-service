import { z } from "zod";
import { imapSchemaDTO } from "@client/dto/imap.dto";
import { smtpSchemaDTO } from "@client/dto/smtp.dto";
import { webhookSchemaDTO } from "@client/dto/webhook.dto";
import { IdSchema } from "@utils/common.dto";

export const clientSchemaDTO = z.object(
  {
    client_code: z.string({
      required_error: "a short client code is required",
    }),
    imap: imapSchemaDTO,
    smtp: smtpSchemaDTO,
    webhook: webhookSchemaDTO,
  },
  {
    invalid_type_error: "This field must an object",
    required_error: "This field is required",
  }
);

export type ClientSchemaDTO = z.infer<typeof clientSchemaDTO>;

export const clientDTO = clientSchemaDTO.merge(
  z.object({
    id: IdSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
  })
);

export type ClientDTO = z.infer<typeof clientDTO>;

export const updateClientSchemaDTO = clientSchemaDTO.deepPartial();

export type UpdateClientSchemaDTO = z.infer<typeof updateClientSchemaDTO>;
