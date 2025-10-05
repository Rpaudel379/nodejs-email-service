import { Messages } from "@assets/constants/messages";
import { sendResponse } from "@/common/utils/api-response";
import { ClientService } from "@client/services/client.service";
import { NextFunction, Request, Response } from "express";
import { CURRENT_PAGE, PAGE_LIMIT } from "@assets/constants/variables";

export class ClientController {
  private clientService = new ClientService();

  async createClient(req: Request, res: Response, next: NextFunction) {
    try {
      const newClient = await this.clientService.createClient(req.body);

      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.CREATED.CLIENT,
        newClient
      );
    } catch (error) {
      next(error);
    }
  }

  async getClientById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const client = await this.clientService.findClientById(id);

      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.FETCHED.CLIENT,
        client
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req: Request, res: Response, next: NextFunction) {
    try {
      // pagination queries
      const currentPage = parseInt(req.query.page as string) || CURRENT_PAGE;
      const pageLimit = parseInt(req.query.limit as string) || PAGE_LIMIT;

      const clients = await this.clientService.findAllClients(
        currentPage,
        pageLimit
      );

      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.FETCHED_ALL.CLIENT,
        clients.data,
        clients.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  async updateClientById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const client = await this.clientService.updateClientById(id, req.body);
      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.UPDATED.CLIENT,
        client
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteClientById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const client = await this.clientService.deleteClientById(id);
      sendResponse(
        res,
        200,
        Messages.STATUS.SUCCESS,
        Messages.DELETED.CLIENT,
        client
      );
    } catch (error) {
      next(error);
    }
  }
}
