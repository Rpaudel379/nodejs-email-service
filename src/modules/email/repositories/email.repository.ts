import { Id, PaginatedEntity } from "@utils/common.dto";
import { Email, EmailEntity } from "../models/email.model";
import { ParsedMail } from "mailparser";

export class EmailRepository {
  /**
   * saves mail to the database
   */
  async saveEmail(parsedEmail: ParsedMail): Promise<EmailEntity> {
    return await new Email(parsedEmail).save();
  }

  /**
   * fetches all emails
   * @returns EmailEntity[]
   */
  async findAllEmails(
    skip: number,
    pageLimit: number
  ): Promise<PaginatedEntity<EmailEntity[]>> {
    const emails = await Email.find()
      .skip(skip)
      .limit(pageLimit)
      .sort({ updatedAt: -1 });

    const totalContent = await Email.countDocuments();
    return { data: emails, totalContent };
  }

  /**
   * fetches all client based emails
   * @returns EmailEntity[]
   */
  async findAllClientEmails(
    client_code: string,
    skip: number,
    pageLimit: number
  ): Promise<PaginatedEntity<EmailEntity[]>> {
    const emails = await Email.find({ client_code })
      .skip(skip)
      .limit(pageLimit)
      .sort({ updatedAt: -1 });

    const totalContent = await Email.countDocuments({ client_code });

    return { data: emails, totalContent };
  }

  /**
   * fetches email by id
   */
  async findEmailById(id: Id): Promise<EmailEntity | null> {
    return await Email.findById(id);
  }

  /**
   * deletes email by id
   * @returns EmailEntity[]
   */
  async deleteEmailById(id: Id): Promise<EmailEntity | null> {
    return await Email.findByIdAndDelete(id);
  }
}
