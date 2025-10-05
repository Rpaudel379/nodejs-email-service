import { IClient } from "@client/models/client.model";
import { UpdateClientSchemaDTO } from "@client/dto/client.dto";
import { AUTHENTICATION_TYPES } from "@assets/constants/variables";
import { webhookRequestSchema } from "../dto/webhook.dto";
import { AppError } from "@/common/utils/errors";

export const setIMAP = (
  imap: Pick<IClient, "imap">["imap"],
  updateIMAP: Pick<UpdateClientSchemaDTO, "imap">["imap"]
) => {
  imap.username = updateIMAP?.username || imap.username;
  imap.password = updateIMAP?.password || imap.password;
  imap.port = updateIMAP?.port || imap.port;
  imap.host = updateIMAP?.host || imap.host;
  imap.name = updateIMAP?.name || imap.name;
};

export const setSMTP = (
  smtp: Pick<IClient, "smtp">["smtp"],
  updateSMTP: Pick<UpdateClientSchemaDTO, "imap">["imap"]
) => {
  smtp.username = updateSMTP?.username || smtp.username;
  smtp.password = updateSMTP?.password || smtp.password;
  smtp.port = updateSMTP?.port || smtp.port;
  smtp.host = updateSMTP?.host || smtp.host;
  smtp.name = updateSMTP?.name || smtp.name;
};

export const setWebhook = (
  webhook: Pick<IClient, "webhook">["webhook"],
  updateWebhook: Pick<UpdateClientSchemaDTO, "webhook">["webhook"]
) => {
  if (updateWebhook?.newEmail) {
    webhook.newEmail = {
      url: updateWebhook?.newEmail?.url || webhook.newEmail!.url,
      method: updateWebhook?.newEmail?.method || webhook.newEmail!.method,
    };
  }

  if (updateWebhook?.replyEmail) {
    let replyEmail = updateWebhook.replyEmail;
    if (!Object.keys(replyEmail).length) {
      //? empty object means removing
      webhook.replyEmail = undefined;
    } else {
      const validatedField = webhookRequestSchema.safeParse(replyEmail);
      if (!validatedField.success) {
        const errors: Record<string, string> = {};
        for (const issue of validatedField.error.errors) {
          errors[`webhook.replyEmail.${issue.path[0]}`] = issue.message;
        }

        throw new AppError("schema validation failed", 400, errors);
      }
      webhook.replyEmail = validatedField.data;
    }
  }

  if (updateWebhook?.credentials) {
    if (updateWebhook.credentials.type === AUTHENTICATION_TYPES.BASIC) {
      webhook.credentials = {
        type: AUTHENTICATION_TYPES.BASIC,
        token: updateWebhook.credentials.token,
      };
    } else if (updateWebhook.credentials.type === AUTHENTICATION_TYPES.OAUTH2) {
      webhook.credentials = {
        type: AUTHENTICATION_TYPES.OAUTH2,
        clientId: updateWebhook.credentials.clientId,
        clientSecret: updateWebhook.credentials.clientSecret,
      };
    }
  }
};
