import { Router } from "express";
import { emailRouter } from "@email/email.routes";
import { clientRouter } from "@client/client.routes";
const router = Router();

router.use("/emails", emailRouter);
router.use("/clients", clientRouter);

export default router;
