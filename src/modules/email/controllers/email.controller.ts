import { sendResponse } from "@utils/api-response";
import { EmailService } from "@modules/email/services/email.service";
import { NextFunction, Request, Response } from "express";
import { Messages } from "@assets/constants/messages";
import { CURRENT_PAGE, PAGE_LIMIT } from "@/common/assets/constants/variables";

export class EmailController {
  private emailService = new EmailService();

  async saveEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const email = await this.emailService.saveEmail(req.body);

      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.CREATED.EMAIL,
        email
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllEmails(req: Request, res: Response, next: NextFunction) {
    try {
      // pagination queries
      const currentPage = parseInt(req.query.page as string) || CURRENT_PAGE;
      const pageLimit = parseInt(req.query.limit as string) || PAGE_LIMIT;

      const emails = await this.emailService.findAllEmails(
        currentPage,
        pageLimit
      );
      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.FETCHED_ALL.EMAIL,
        emails.emails,
        emails.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllClientEmails(req: Request, res: Response, next: NextFunction) {
    try {
      const clientCode = req.headers["client_code"]?.toString() ?? "";

      // pagination queries
      const currentPage = parseInt(req.query.page as string) || CURRENT_PAGE;
      const pageLimit = parseInt(req.query.limit as string) || PAGE_LIMIT;

      const emails = await this.emailService.findAllClientEmails(
        clientCode,
        currentPage,
        pageLimit
      );

      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.FETCHED_ALL.CLIENT_EMAIL,
        emails.emails,
        emails.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  async getEmailById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const email = await this.emailService.findEmailById(id);

      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.FETCHED.EMAIL,
        email
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteEmailById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const email = await this.emailService.deleteEmailById(id);

      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.DELETED.EMAIL,
        email
      );
    } catch (error) {
      next(error);
    }
  }

  async sendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.query.id;
      const isJson = req.headers["content-type"] === "application/json";
      const body = req.body;

      const emailBody = isJson ? body.body : body;
      const email = await this.emailService.findEmailById(id as string);

      //? dont wait for the response
      req.emailService.sendEmail(email, emailBody);
      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.EMAIL_SERVICE.SENT,
        null
      );
    } catch (error) {
      next(error);
    }
  }
}
