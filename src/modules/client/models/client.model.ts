import mongoose, { HydratedDocument, model } from "mongoose";
import { imapProviderSchema, IIMAPProvider } from "./imap-provider.schema";
import { smtpProviderSchema, ISMTPProvider } from "./smtp-provider.schema";
import { IWebhook, webhookSchema } from "./web-hook.schema";
import { AppError } from "@common/utils/errors";

export interface IClient {
  client_code: string;
  imap: IIMAPProvider;
  smtp: ISMTPProvider;
  webhook: IWebhook;
}

const clientSchema = new mongoose.Schema<IClient>(
  {
    client_code: {
      type: String,
      lowercase: true,
      required: [true, "client_code is required"],
      unique: true,
    },
    imap: {
      type: imapProviderSchema,
      required: [true, "imap credentials is required"],
    },
    smtp: {
      type: smtpProviderSchema,
      required: [true, "smtp credentials is required"],
    },
    webhook: {
      type: webhookSchema,
      required: [true, "webhook credentials is required"],
    },
  },
  { timestamps: true }
);

clientSchema.pre("save", async function (next) {
  const client = this;
  // client code once created cannot be modified
  if (!this.isNew && client.isModified("client_code")) {
    throw new AppError("Forbidden Action", 403, {
      client_code: "Client code cannot be modified after creation.",
    });
  }
  next();
});

export type ClientEntity = HydratedDocument<IClient>;
export const Client = model<IClient>("Client", clientSchema);
