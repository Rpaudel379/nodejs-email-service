import { Id, Pagination } from "@utils/common.dto";
import { EmailRepository } from "@/modules/email/repositories/email.repository";
import { AppError } from "@/common/utils/errors";
import { ParsedMail } from "mailparser";

export class EmailService {
  private emailRepository = new EmailRepository();

  async saveEmail(parsedEmail: ParsedMail) {
    return (await this.emailRepository.saveEmail(parsedEmail)).toObject();
  }

  async findAllEmails(currentPage: number, pageLimit: number) {
    const skip = (currentPage - 1) * pageLimit;
    const emailsEntity = await this.emailRepository.findAllEmails(
      skip,
      pageLimit
    );

    const emails = emailsEntity.data.map((email) => email.toObject());

    const totalContent = emailsEntity.totalContent;
    const totalPages = Math.ceil(totalContent / pageLimit);

    const pagination: Pagination = {
      currentPage,
      totalPages,
      totalContent,
    };
    return { emails, pagination };
  }

  async findAllClientEmails(
    client_code: string,
    currentPage: number,
    pageLimit: number
  ) {
    const skip = (currentPage - 1) * pageLimit;
    const emailsEntity = await this.emailRepository.findAllClientEmails(
      client_code,
      skip,
      pageLimit
    );

    const emails = emailsEntity.data.map((email) => email.toObject());

    const totalContent = emailsEntity.totalContent;
    const totalPages = Math.ceil(totalContent / pageLimit);

    const pagination: Pagination = {
      currentPage,
      totalPages,
      totalContent,
    };
    return { emails, pagination };
  }

  async findEmailById(id: Id) {
    const emailEntity = await this.emailRepository.findEmailById(id);

    if (!emailEntity) {
      throw new AppError("Email not found", 404, {
        id: "email not found with the given id",
      });
    }

    return emailEntity.toObject();
  }

  async deleteEmailById(id: Id) {
    const emailEntity = await this.emailRepository.deleteEmailById(id);

    if (!emailEntity) {
      throw new AppError("Email not found", 404, {
        id: "email not found with the given id",
      });
    }

    return emailEntity.toObject();
  }
}
