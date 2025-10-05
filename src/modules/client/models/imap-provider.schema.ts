import { Schema } from "mongoose";

export interface IIMAPProvider {
  username: string;
  password: string;
  port: number;
  host: string;
  name: "gmail" | "outlook" | "zoho";
}

export interface IMAPProviderEntity extends Document, IIMAPProvider {}

export const imapProviderSchema = new Schema<IIMAPProvider>({
  username: {
    type: String,
    required: [true, "username for imap is required"],
  },
  password: {
    type: String,
    required: [true, "password for imap is required"],
  },
  port: {
    type: Number,
    required: [true, "port for imap is required"],
  },
  host: {
    type: String,
    required: [true, "host for imap is required"],
  },
  name: {
    type: String,
    required: [true, "name for imap is required"],
    enum: {
      values: ["gmail", "outlook", "zoho"],
      message: "{VALUE} is not supported",
    },
  },
});
