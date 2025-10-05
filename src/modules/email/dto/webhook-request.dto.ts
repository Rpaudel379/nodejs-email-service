import { IdSchema } from "@/common/utils/common.dto";
import z from "zod";

export const webhookDTO = z.object({
  external_id: IdSchema,
  subject: z.string().optional(),
  body: z.union([z.string(), z.boolean().default(false)]),
  email: z.any().optional(),
  name: z.string().optional(),
});

export type WebhookDTO = z.infer<typeof webhookDTO>;
