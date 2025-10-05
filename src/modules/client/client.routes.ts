import { validateBody, validateIdParams } from "@middlewares/index";
import { Router } from "express";
import { clientSchemaDTO, updateClientSchemaDTO } from "@client/dto/client.dto";
import { ClientController } from "@client/controllers/client.controller";
import { IdSchema } from "@/common/utils/common.dto";

const clientController = new ClientController();
export const clientRouter = Router();

// these all routes needs authorization
// todo authorization to access these apis
clientRouter.post(
  "/",
  // validateBody(clientSchemaDTO),
  validateBody(clientSchemaDTO),
  clientController.createClient.bind(clientController)
);
clientRouter.get("/", clientController.getAllClients.bind(clientController));
clientRouter.get("/:id", clientController.getClientById.bind(clientController));
clientRouter.patch(
  "/:id",
  validateIdParams(IdSchema),
  validateBody(updateClientSchemaDTO),
  clientController.updateClientById.bind(clientController)
);

clientRouter.delete(
  "/:id",
  validateIdParams(IdSchema),
  clientController.deleteClientById.bind(clientController)
);
