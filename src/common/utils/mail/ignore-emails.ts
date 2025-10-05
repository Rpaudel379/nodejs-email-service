import { EmailAddress, type AddressObject } from "mailparser";

const ignoringEmails = new Set<string>();
ignoringEmails.add("mailer-daemon@googlemail.com");
ignoringEmails.add("noreply@zoho.com");
ignoringEmails.add("");

const extractEmail = (value: EmailAddress[]) => {
  if (!value[0].address) return "";
  return value[0].address;
};

export const isIgnoringEmail = (from: AddressObject | undefined) => {
  if (!from) {
    return true;
  }

  const email = extractEmail(from.value);
  return ignoringEmails.has(email);
};
