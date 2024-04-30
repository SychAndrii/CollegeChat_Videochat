import {
  DisconnectFromLobbyContract,
  GetLobbyContract,
  ConnectToLobbyContract,
} from "../contracts/LobbyManagement";
import ILobbyService from "../interfaces/ILobbyService";

class LobbyManagement {
  private lobbyService: ILobbyService;
  constructor(repo: ILobbyService) {
    this.lobbyService = repo;
  }

  async disconnectFromLobby(dto: DisconnectFromLobbyContract) {
    const existingLobby = await this.getLobbyByCode(dto.lobby.code);

    if (!existingLobby) {
      throw new Error("Lobby does not exist.");
    }

    const updatedLobby = await this.lobbyService.removeConnectionToLobby(dto);
    if(updatedLobby.getConnections().length === 0) {
      await this.lobbyService.deleteLobby(dto.lobby.code);
    }
  }

  async connectToLobby(dto: ConnectToLobbyContract) {
    const existingLobby = await this.getLobbyByCode(dto.lobby.code);

    if (!existingLobby) {
      await this.lobbyService.createEmptyLobbyWithCode(dto.lobby.code);
    }

    await this.lobbyService.addConnectionToLobby(dto);
  }

  async getLobbyByCode(dto: GetLobbyContract) {
    const existingLobby = await this.lobbyService.getLobbyByCode(dto);
    return existingLobby;
  }
}

export default LobbyManagement;
