import { EmailEntity } from "@/modules/email/models/email.model";
import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPConnection from "nodemailer/lib/smtp-connection";
import { emailTemplate } from "@utils/mail/email-template";
import { Logger } from "pino";

export class SMTPClient {
  private mailer: Transporter;
  private config: SMTPConnection.Options;
  private logger: Logger;
  private client_code: string;

  constructor(
    config: SMTPConnection.Options,
    logger: Logger,
    client_code: string
  ) {
    this.logger = logger;
    this.config = config;
    this.client_code = client_code;
    this.mailer = nodemailer.createTransport(config);
  }

  public async connect() {
    return new Promise((resolve, reject) => {
      this.logger.debug(
        `${this.client_code} - connecting to SMTP (nodemailer)`
      );
      this.mailer.verify((error, success) => {
        if (error) {
          this.logger.error({
            msg: `${this.client_code} - SMTP client (nodemailer) connection failed`,
            err: error,
          });
          this.logger.trace(error);
          reject(error);
        } else {
          this.logger.debug(
            `${this.client_code} - SMTP client connection is ready`
          );
          resolve(success);
        }
      });
    });
  }

  public async sendEmail(prevMail: EmailEntity, body: string) {
    // reply only function not for sending new mail
    const replyTo = prevMail.from?.text || "";
    const subject = prevMail.subject?.startsWith("Re:")
      ? prevMail.subject
      : `Re: ${prevMail.subject}`;

    const replyText = emailTemplate(prevMail, body);

    const mailOptions: Mail.Options = {
      from: this.config.auth?.user,
      to: replyTo,
      subject: subject,
      html: replyText,
      replyTo: this.config.auth?.user,
      // maintains email threads and history of mails
      inReplyTo: prevMail.messageId,
      // maintains email threads and history of mails
      references: [
        ...(prevMail.references || []),
        prevMail.messageId || "",
      ].join(" "),
      attachments: [],
    };

    try {
      // reply the mail
      const info = await this.mailer.sendMail({
        ...mailOptions,
      });

      this.logger.info({
        msg: `${this.client_code} - mail sent to ${prevMail.from?.text}`,
        info,
      });
      return true;
    } catch (error) {
      this.logger.error({
        msg: `${this.client_code} - failed to send mail to ${prevMail.from?.text}`,
        err: error,
      });
      this.logger.trace(error);
      return false;
    }
  }
}
