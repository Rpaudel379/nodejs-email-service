import { ClientDTO } from "@/modules/client/dto/client.dto";
import type { Config } from "imap";
import type SMTPConnection from "nodemailer/lib/smtp-connection";

export const imapFormat = (imap: Pick<ClientDTO, "imap">["imap"]): Config => {
  const imap_config: Config = {
    user: imap.username,
    password: imap.password,
    port: imap.port,
    host: imap.host,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
      servername: imap.host,
    },
    keepalive: {
      forceNoop: true,
    },
  };

  return imap_config;
};

export const smtpFormat = (
  smtp: Pick<ClientDTO, "smtp">["smtp"]
): SMTPConnection.Options => {
  const smtp_config: SMTPConnection.Options = {
    auth: {
      user: smtp.username,
      pass: smtp.password,
    },
    port: smtp.port,
    host: smtp.host,
    secure: false,
  };

  return smtp_config;
};
