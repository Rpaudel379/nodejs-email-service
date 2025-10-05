import { ImapClient } from "@lib/mail/imap-client";
import { Attachment, ParsedMail, simpleParser } from "mailparser";
import { SMTPClient } from "@lib/mail/smtp-client";
import { Email, EmailEntity } from "@/modules/email/models/email.model";
import { webhookDTO } from "@/modules/email/dto/webhook-request.dto";

import { isIgnoringEmail } from "@utils/mail/ignore-emails";
import { ClientDTO } from "@/modules/client/dto/client.dto";
import { imapFormat, smtpFormat } from "../utils/client/format-db-to-config";
import { Logger } from "pino";

export class EmailService {
  private imapClient: ImapClient;
  private smtpClient: SMTPClient;
  private client: ClientDTO;
  private logger: Logger;

  constructor(clientDTO: ClientDTO, logger: Logger) {
    this.client = clientDTO;
    this.logger = logger;

    this.imapClient = new ImapClient(
      imapFormat(clientDTO.imap),
      logger,
      clientDTO.client_code
    );
    this.smtpClient = new SMTPClient(
      smtpFormat(clientDTO.smtp),
      logger,
      clientDTO.client_code
    );
    this.registerImapClientEvents();
    this.parseEmail = this.parseEmail.bind(this);

    logger.info({
      msg: `${this.client.client_code} - Client configurations loaded from database`,
    });
  }

  private registerImapClientEvents() {
    this.imapClient.on("parse-mail", (stream, seqno) =>
      this.parseEmail(stream, seqno)
    );
  }

  async init() {
    try {
      await Promise.all([this.imapClient.connect(), this.smtpClient.connect()]);
      this.logger.info(`${this.client.client_code} - Email service is ready.`);
    } catch (error) {
      this.logger.fatal({
        msg: `${this.client.client_code} - mail service initialization error`,
        err: error,
      });
      this.logger.trace(error);
      process.exit(1);
    }
  }

  public async sendEmail(mail: EmailEntity, body: string) {
    return this.smtpClient.sendEmail(mail, body);
  }

  public watchInbox() {
    this.imapClient.watchMailBox();
  }

  public fetchUnseenInbox() {
    this.imapClient.fetchUnseenInbox();
  }

  public fetchMailFromSeqno(seqno: number) {
    this.imapClient.fetchMailFromSeqno(seqno);
  }

  private async parseEmail(stream: NodeJS.ReadableStream, seqno: number) {
    try {
      this.logger.debug(
        `${this.client.client_code} - parsing email for seqno: ${seqno}`
      );
      const parsedEmail = await simpleParser(stream as never);
      this.logger.info(
        `${this.client.client_code} - email parsed successfully for seqno: ${seqno}`
      );
      if (isIgnoringEmail(parsedEmail.from)) {
        return;
      }

      const formdata = new FormData();

      if (parsedEmail.attachments?.length) {
        this.appendAttachments(formdata, parsedEmail.attachments);
      }

      parsedEmail.attachments = [];

      this.dumpToDatabase(parsedEmail, seqno, formdata);
    } catch (error) {
      this.logger.error({
        msg: `${this.client.client_code} - email parsing error`,
        seqno: seqno,
        err: error,
      });
      this.logger.trace(error);
    }
  }

  private async appendAttachments(
    formdata: FormData,
    attachments: Attachment[]
  ) {
    attachments.forEach((attachment) => {
      const blob = new Blob([attachment.content], {
        type: attachment.contentType,
      });
      formdata.append("files[]", blob, attachment.filename);
    });
  }

  private async dumpToDatabase(
    parsedEmail: ParsedMail,
    seqno: number,
    formdata: FormData
  ) {
    try {
      const savedEmail = new Email({
        ...parsedEmail,
        attachments: [],
        client_code: this.client.client_code,
      });
      await savedEmail.save();
      this.logger.info({
        msg: `${this.client.client_code} - parsed email successfully dumped to database`,
        id: savedEmail.id,
        seqno: seqno,
      });

      this.sendWebHook(savedEmail, seqno, formdata);
    } catch (error) {
      this.logger.error({
        msg: `${this.client.client_code} - failed to dump email to the database`,
        seqno: seqno,
        err: error,
      });
      this.logger.trace(error);
    }
  }

  private async sendWebHook(
    savedEmail: EmailEntity,
    seqno: number,
    formdata: FormData
  ) {
    const webhook = this.client.webhook;
    try {
      const validatedMail = webhookDTO.parse({
        ...savedEmail,
        external_id: savedEmail.id,
        body: savedEmail.textAsHtml,
        email: savedEmail.from?.value[0].address,
        name: savedEmail.from?.value[0].name,
      });

      Object.entries(validatedMail).forEach(([k, v]) => {
        formdata.append(k, v);
      });

      const token =
        webhook.credentials.type === "basic" && webhook.credentials.token;

      if (!savedEmail.references || savedEmail.references.length === 0) {
        // new email
        const response = await fetch(`${webhook.newEmail.url}`, {
          method: webhook.newEmail.method,
          body: formdata,
          headers: {
            Accept: "application/json",
            Authorization: `Basic ${token}`,
          },
        });

        this.logger.info({
          msg: `${this.client.client_code} - fetch request sent to the webhook for new email`,
          webhookURL: `${webhook.newEmail.url}`,
          httpMethod: webhook.newEmail.method,
          id: validatedMail.external_id,
          seqno: seqno,
        });

        const data = await response.json();

        if (response.ok) {
          this.logger.info({
            msg: `${this.client.client_code} - success response from webhook endpoint for new email`,
            webhookURL: `${webhook.newEmail.url}`,
            httpMethod: webhook.newEmail.method,
            id: validatedMail.external_id,
            seqno: seqno,
            success_response: data,
          });
          // at last mark this email as read on the email server
          this.imapClient.markAsRead(seqno);
        } else {
          this.logger.warn({
            msg: `${this.client.client_code} - failed response from webhook endpoint for new email`,
            webhookURL: `${webhook.newEmail.url}`,
            httpMethod: webhook.newEmail.method,
            id: validatedMail.external_id,
            seqno: seqno,
            failed_response: data,
          });
        }
      } else {
        // existing reply email

        // check if reply email endpoint is present in the database
        if (!webhook.replyEmail) return;

        const response = await fetch(`${webhook.replyEmail.url}`, {
          method: webhook.replyEmail.method,
          body: formdata,
          headers: {
            Accept: "application/json",
            Authorization: `Basic ${token}`,
          },
        });

        this.logger.info({
          msg: `${this.client.client_code} - fetch request sent to the webhook for existing email`,
          webhookURL: `${webhook.replyEmail.url}`,
          httpMethod: webhook.replyEmail.method,
          id: validatedMail.external_id,
          seqno: seqno,
        });

        const data = await response.json();

        if (response.ok) {
          this.logger.info({
            msg: `${this.client.client_code} - success response from webhook endpoint for existing email`,
            webhookURL: `${webhook.replyEmail.url}`,
            httpMethod: webhook.replyEmail.method,
            id: validatedMail.external_id,
            seqno: seqno,
            success_response: data,
          });
          // at last mark this email as read on the email server
          this.imapClient.markAsRead(seqno);
        } else {
          this.logger.warn({
            msg: `${this.client.client_code} - failed response from webhook endpoint for existing email`,
            webhookURL: `${webhook.replyEmail.url}`,
            httpMethod: webhook.replyEmail.method,
            id: validatedMail.external_id,
            seqno: seqno,
            failed_response: data,
          });
        }
      }
    } catch (error) {
      this.logger.error({
        msg: "Webhook request (fetch) error for ",
        webhook,
        id: savedEmail.id,
        seqno: seqno,
        err: error,
      });
      this.logger.trace(error);
    }
  }
}
