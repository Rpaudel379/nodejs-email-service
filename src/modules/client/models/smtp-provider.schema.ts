import { Schema } from "mongoose";

export interface ISMTPProvider {
  username: string;
  password: string;
  port: number;
  host: string;
  name: "gmail" | "outlook" | "zoho";
}

export interface SMTPProviderEntity extends Document, ISMTPProvider {}

export const smtpProviderSchema = new Schema<ISMTPProvider>({
  username: {
    type: String,
    required: [true, "username for smtp is required"],
  },
  password: {
    type: String,
    required: [true, "password for smtp is required"],
  },
  port: {
    type: Number,
    required: [true, "port for smtp is required"],
  },
  host: {
    type: String,
    required: [true, "host for smtp is required"],
  },
  name: {
    type: String,
    required: [true, "name for smtp is required"],
    enum: {
      values: ["gmail", "outlook", "zoho"],
      message: "{VALUE} is not supported",
    },
  },
});
