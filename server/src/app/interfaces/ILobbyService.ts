import Lobby from "../../core/models/Lobby";
import {
  getLobbyByCodeContract,
  createEmptyLobbyWithCodeContract,
  addConnectionToLobbyContract,
  removeConnectionFromLobbyContract,
  deleteLobbyWithCodeContract,
} from "../contracts/ILobbyService";

export default interface ILobbyService {
  getLobbyByCode(dto: getLobbyByCodeContract): Promise<Lobby | null>;
  createEmptyLobbyWithCode(
    dto: createEmptyLobbyWithCodeContract
  ): Promise<Lobby>;
  addConnectionToLobby(dto: addConnectionToLobbyContract): Promise<Lobby>;
  removeConnectionToLobby(dto: removeConnectionFromLobbyContract): Promise<Lobby>;
  deleteLobby(dto: deleteLobbyWithCodeContract): Promise<boolean>;
}
