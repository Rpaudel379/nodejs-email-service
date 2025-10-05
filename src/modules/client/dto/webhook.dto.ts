import { AUTHENTICATION_TYPES } from "@assets/constants/variables";
import { z } from "zod";

const basicAuthSchemaDTO = z.object({
  type: z.literal(AUTHENTICATION_TYPES.BASIC),
  token: z.string({ required_error: "Token is required" }),
});

const oauth2SchemaDTO = z.object({
  type: z.literal(AUTHENTICATION_TYPES.OAUTH2),
  clientId: z.string({ required_error: "Client id required" }),
  clientSecret: z.string({ required_error: "Client secret is required" }),
});

const credentialsSchemaDTO = z.discriminatedUnion(
  "type",
  [basicAuthSchemaDTO, oauth2SchemaDTO],
  {
    required_error: "Webhook credentials is required",
    invalid_type_error:
      "Webhook credentials must be an object with valid fields",
  }
);

export const webhookRequestSchema = z.object(
  {
    url: z.string({ required_error: "Endpoint url is required" }),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"], {
      invalid_type_error: "HTTP method must be a valid http method",
      required_error: "HTTP method is required",
    }),
  },
  {
    required_error: "new email property is required",
  }
);

export const webhookSchemaDTO = z.object(
  {
    credentials: credentialsSchemaDTO,
    newEmail: webhookRequestSchema,
    replyEmail: webhookRequestSchema.optional(),
  },
  { required_error: "Webhook configurations is required" }
);

export type WebhookSchemaDTO = z.infer<typeof webhookSchemaDTO>;
