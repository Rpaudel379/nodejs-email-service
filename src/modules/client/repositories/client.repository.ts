import { Id, PaginatedEntity } from "@utils/common.dto";
import { ClientSchemaDTO, UpdateClientSchemaDTO } from "@client/dto/client.dto";
import { Client, ClientEntity } from "@client/models/client.model";
import { setIMAP, setSMTP, setWebhook } from "@client/utils/update-client";

export class ClientRepository {
  /**
   * saves new client to the database
   * @param clientSchema
   * @returns
   */
  async saveClient(clientSchema: ClientSchemaDTO): Promise<ClientEntity> {
    return await new Client(clientSchema).save();
  }

  /**
   * fetches all client infos by id
   * @returns ClientEntity[]
   */
  async getAllClients(
    skip: number,
    pageLimit: number
  ): Promise<PaginatedEntity<ClientEntity[]>> {
    const clients: ClientEntity[] = await Client.find()
      .skip(skip)
      .limit(pageLimit)
      .sort({ updatedAt: -1 });
    const totalContent = await Client.countDocuments();

    return { data: clients, totalContent };
  }

  /**
   * fetches client info by id
   * @param id mongodb objectId
   * @returns ClientEntity[] | null
   */
  async getClientById(id: Id): Promise<ClientEntity | null> {
    return await Client.findById(id);
  }

  /**
   * @param id mongodb objectId
   * @param updateClientSchema from zod (deepPartial to create schema)
   * @returns ClientEntity
   * @description cannot use `findByIdAndUpdate()` to partially update the subdocuments as it will override the subdocuments with the request field removing all other fields
   */
  async updateClientById(
    id: Id,
    updateClientSchema: UpdateClientSchemaDTO
  ): Promise<ClientEntity | null> {
    const client = await Client.findById(id);
    if (!client) {
      return null;
    }

    client.client_code = updateClientSchema.client_code || client.client_code;

    if (updateClientSchema.imap) {
      setIMAP(client.imap, updateClientSchema.imap);
    }

    if (updateClientSchema.smtp) {
      setSMTP(client.smtp, updateClientSchema.smtp);
    }

    if (updateClientSchema.webhook) {
      setWebhook(client.webhook, updateClientSchema.webhook);
    }
    await client.save();
    return client;
  }

  async deleteClientById(id: Id): Promise<ClientEntity | null> {
    return await Client.findByIdAndDelete(id);
  }
}
