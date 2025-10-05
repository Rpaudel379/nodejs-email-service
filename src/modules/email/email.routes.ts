import { Router } from "express";
import { validateIdParams, validateIdQuery } from "@middlewares/index";
import { IdSchema } from "@/common/utils/common.dto";
import { EmailController } from "@modules/email/controllers/email.controller";
import { checkClientCode } from "@/common/middlewares/auth/check-client-code";

const emailController = new EmailController();
export const emailRouter = Router();

emailRouter.post(
  "/send",
  checkClientCode,
  validateIdQuery(IdSchema),
  emailController.sendEmail.bind(emailController)
);

emailRouter.get("/", emailController.getAllEmails.bind(emailController));
emailRouter.get(
  "/client",
  checkClientCode,
  emailController.getAllClientEmails.bind(emailController)
);
emailRouter.get(
  "/:id",
  validateIdParams(IdSchema),
  emailController.getEmailById.bind(emailController)
);

// email creation and deletion not used
emailRouter.delete(
  "/:id",
  validateIdParams(IdSchema),
  emailController.deleteEmailById.bind(emailController)
);
