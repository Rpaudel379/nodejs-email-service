import { ParsedMail } from "mailparser";
import mongoose, { Document } from "mongoose";

export interface EmailEntity extends Document, ParsedMail {}

const emailSchema = new mongoose.Schema<EmailEntity>(
  {},
  { strict: false, timestamps: true }
);

export const Email = mongoose.model<EmailEntity>("EmailDump", emailSchema);
