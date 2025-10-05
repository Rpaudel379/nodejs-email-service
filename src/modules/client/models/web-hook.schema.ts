import { Schema } from "mongoose";

interface ICredentialsBase {
  type: "basic" | "oauth2";
}

interface IBasicAuthCredentials extends ICredentialsBase {
  type: "basic";
  token: string;
}

interface IOAuth2Credentials extends ICredentialsBase {
  type: "oauth2";
  clientId: string;
  clientSecret: string;
}

type IWebhookRequest =
  | {
      url: string;
      method: string;
    }
  | undefined;

type Credentials = IBasicAuthCredentials | IOAuth2Credentials;

export interface IWebhook {
  credentials: Credentials;
  newEmail: IWebhookRequest;
  replyEmail: IWebhookRequest;
}

const credentialsBaseSchema = new Schema<ICredentialsBase>(
  {
    type: {
      type: String,
      enum: ["basic", "oauth2"],
      required: [true, "Authentication type is required"],
    },
  },
  { discriminatorKey: "type", _id: false }
);

const basicAuthSchema = new Schema<IBasicAuthCredentials>(
  {
    token: { type: String, required: [true, "Token is required"] },
  },
  { _id: false }
);

const oauth2Schema = new Schema<IOAuth2Credentials>(
  {
    clientId: { type: String, required: [true, "clientId is required"] },
    clientSecret: {
      type: String,
      required: [true, "clientSecret is required"],
    },
  },
  { _id: false }
);

const webhookRequestSchema = new Schema<IWebhookRequest>(
  {
    url: {
      type: String,
      required: [true, "URL is required"],
    },
    method: {
      type: String,
      required: [true, "HTTP method is required"],
    },
  },
  { _id: false }
);

export const webhookSchema = new Schema<IWebhook>({
  newEmail: {
    type: webhookRequestSchema,
    required: [true, "New Email property is required"],
  },
  replyEmail: {
    type: webhookRequestSchema,
  },
  credentials: {
    type: credentialsBaseSchema,
    required: [true, "Credentials is required"],
  },
});

webhookSchema
  .path<Schema.Types.Subdocument>("credentials")
  .discriminator("basic", basicAuthSchema);
webhookSchema
  .path<Schema.Types.Subdocument>("credentials")
  .discriminator("oauth2", oauth2Schema);
