import { ClientRepository } from "@client/repositories/client.repository";
import {
  ClientDTO,
  clientDTO,
  ClientSchemaDTO,
  UpdateClientSchemaDTO,
} from "@client/dto/client.dto";
import { ClientEntity } from "@client/models/client.model";
import { DTOMapper } from "@/common/utils/dto/dto-mapper";
import {
  Id,
  PaginatedDTO,
  PaginatedEntity,
  Pagination,
} from "@utils/common.dto";
import { AppError } from "@/common/utils/errors";

export class ClientService {
  private clientRepository = new ClientRepository();

  async createClient(clientSchema: ClientSchemaDTO) {
    const clientEntity: ClientEntity = await this.clientRepository.saveClient(
      clientSchema
    );

    const newClient = DTOMapper(clientDTO, clientEntity);

    return newClient;
  }

  async findAllClients(
    currentPage: number,
    pageLimit: number
  ): Promise<PaginatedDTO<ClientDTO[]>> {
    const skip = (currentPage - 1) * pageLimit;
    const clientsEntity: PaginatedEntity<ClientEntity[]> =
      await this.clientRepository.getAllClients(skip, pageLimit);

    // DTO mapper
    const clients = clientsEntity.data.map((clientEntity) =>
      DTOMapper(clientDTO, clientEntity)
    );

    // pagination logic
    const totalContent = clientsEntity.totalContent;
    const totalPages = Math.ceil(totalContent / pageLimit);

    const pagination: Pagination = {
      currentPage,
      totalPages,
      totalContent,
    };

    return { data: clients, pagination };
  }

  async findClientById(id: Id) {
    const clientEntity: ClientEntity | null =
      await this.clientRepository.getClientById(id);

    if (!clientEntity) {
      throw new AppError("Client not found", 404, {
        id: "client not found with the given id",
      });
    }

    const client = DTOMapper(clientDTO, clientEntity);
    return client;
  }

  async updateClientById(id: Id, updateClientSchema: UpdateClientSchemaDTO) {
    const clientEntity = await this.clientRepository.updateClientById(
      id,
      updateClientSchema
    );
    if (!clientEntity) {
      throw new AppError("Client not found", 404, {
        id: "client not found with the given id",
      });
    }

    const client = DTOMapper(clientDTO, clientEntity);
    return client;
  }

  async deleteClientById(id: Id) {
    const clientEntity = await this.clientRepository.deleteClientById(id);
    if (!clientEntity) {
      throw new AppError("Client not found", 404, {
        id: "client not found with the given id",
      });
    }

    const client = DTOMapper(clientDTO, clientEntity);
    return client;
  }
}
