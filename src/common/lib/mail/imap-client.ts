import { EventEmitter } from "events";

import Imap, { Config } from "imap";
import { Logger } from "pino";

export class ImapClient extends EventEmitter {
  private imap: Imap;
  private logger: Logger;
  private client_code: string;

  constructor(config: Config, logger: Logger, client_code: string) {
    super();
    this.logger = logger;
    this.client_code = client_code;
    this.imap = new Imap(config);

    this.registerIMAPEvents();
  }

  private registerIMAPEvents() {
    this.imap.on("error", (error: Error) => {
      this.logger.error({
        msg: `${this.client_code} - IMAP error: ${error.message}`,
        err: error,
      });
      this.logger.trace(error);
    });
    this.imap.once("end", () => {
      this.logger.info(`${this.client_code} - IMAP Connection Ended`);
    });
  }

  public async connect() {
    return new Promise((resolve, reject) => {
      this.logger.debug(`${this.client_code} - connecting to IMAP`);
      this.imap.connect();
      this.imap.once("ready", () => {
        this.logger.debug(
          `${this.client_code} - IMAP client connection is ready`
        );
        resolve(this.imap);
      });
      this.imap.once("error", (error: unknown) => {
        this.logger.error({
          msg: `${this.client_code} - IMAP client connection failed`,
          err: error,
        });
        this.logger.trace(error);
        reject(error);
      });
    });
  }

  private openInbox(cb: (err: Error, mailbox: Imap.Box) => void) {
    this.imap.openBox("INBOX", false, cb);
  }
  public watchMailBox() {
    this.openInbox((error, mailbox) => {
      try {
        if (error) {
          this.imap.emit("error", error);
          return;
        }

        this.logger.info(
          `${this.client_code} - watching live emails from INBOX`
        );
        this.imap.on("mail", (newMsgsCount: number) => {
          this.logger.info(
            `${this.client_code} - ${newMsgsCount} new email${
              newMsgsCount > 1 ? "s" : ""
            } incomming`
          );
          const fetch = this.imap.seq.fetch(
            `${mailbox.messages.total - (newMsgsCount - 1)}:${
              mailbox.messages.total
            }`,
            { bodies: [""] }
          );

          fetch.on("message", (message, seqno) => {
            message.on("body", (stream) => {
              this.emit("parse-mail", stream, seqno);
            });
          });

          fetch.once("error", (error) => {
            this.logger.error({
              msg: `${this.client_code} - email fetch error: ${error.message}`,
              err: error,
            });
            this.logger.trace(error);
          });
        });
      } catch (error) {
        this.logger.error({
          msg: `${this.client_code} - error watching mailbox`,
          err: error,
        });
        this.logger.trace(error);
      }
    });
  }

  /**
  run as a scheduler
  */
  public fetchUnseenInbox() {
    this.logger.info(`${this.client_code} - fetching unseen inbox mails`);

    this.openInbox((err) => {
      try {
        if (err) {
          this.imap.emit("error", err);
          return;
        }
        this.imap.search(["UNSEEN"], (error, uids) => {
          if (err) {
            this.logger.error({
              msg: `${this.client_code} - imap search error`,
              err: error,
            });
            this.logger.trace(error);
            return;
          }
          if (uids.length === 0) {
            this.logger.info(`${this.client_code} - nothing to fetch`);
            return;
          }
          const fetch = this.imap.fetch(uids, { bodies: [""] });

          fetch.on("message", (message, seqno) => {
            message.on("body", (stream) => {
              this.emit("parse-mail", stream, seqno);
            });
          });

          fetch.once("error", (error) => {
            this.logger.error({
              msg: `${this.client_code} - email fetch error: ${error.message}`,
              err: error,
            });
            this.logger.trace(error);
          });
        });
      } catch (error) {
        this.logger.error({
          msg: `${this.client_code} - error fetching unseen emails`,
          err: error,
        });
        this.logger.trace(error);
      }
    });
  }

  public markAsRead(seqno: number) {
    this.logger.info(
      `${this.client_code} - calling seqno:${seqno} to mark as read.`
    );
    try {
      this.imap.seq.addFlags(seqno, ["\\Seen"], (error) => {
        if (error) {
          this.logger.error({
            msg: `${this.client_code} - marking email as read error: ${error.message}`,
            seqno: seqno,
            err: error,
          });
          this.logger.trace(error);
        } else {
          this.logger.info({
            msg: `${this.client_code} - seqno marked as read`,
            seqno: seqno,
          });
        }
      });
    } catch (error) {
      this.logger.error({
        msg: `${this.client_code} - mark as read function error`,
        seqno: seqno,
        err: error,
      });
      this.logger.trace(error);
    }
  }

  public fetchMailFromSeqno(seqno: number) {
    this.logger.info(
      `${this.client_code} - fetching email from seqno: ${seqno}`
    );
    this.openInbox((err) => {
      try {
        if (err) {
          this.imap.emit("error", err);
          return;
        }
        const fetch = this.imap.seq.fetch(seqno, { bodies: [""] });

        fetch.on("message", (message, seqno) => {
          message.on("body", (stream) => {
            this.emit("parse-mail", stream, seqno);
          });
        });

        fetch.once("error", (error) => {
          this.logger.error({
            msg: `${this.client_code} - email fetch error: ${error.message}`,
            err: error,
          });
          this.logger.trace(error);
        });
      } catch (error) {
        this.logger.error({
          msg: `${this.client_code} - fetching email from seqno error`,
          err: error,
          seqno: seqno,
        });
        this.logger.trace(error);
      }
    });
  }
}
