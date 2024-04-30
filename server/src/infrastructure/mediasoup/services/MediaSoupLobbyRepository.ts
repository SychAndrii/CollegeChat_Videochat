import {
  Router,
  RtpCodecCapability,
  Worker,
  WebRtcTransportOptions,
} from "mediasoup/node/lib/types";

import {
  getLobbyByCodeContract,
  createEmptyLobbyWithCodeContract,
  addConnectionToLobbyContract,
  removeConnectionFromLobbyContract,
  deleteLobbyWithCodeContract
} from "../../../app/contracts/ILobbyService";
import ILobbyService from "../../../app/interfaces/ILobbyService";

import Lobby from "../../../core/models/Lobby";
import Connection from "../../../core/models/Connection";

import LobbyEnvironment from "../models/LobbyEnvironment";
const codecSettings: RtpCodecCapability[] = require("../codecSettings.json");
const transportOptions: WebRtcTransportOptions = require("../transportOptions.json");

class MediaSoupLobbyService implements ILobbyService {
  private worker: Worker;
  private lobbies: Map<string, LobbyEnvironment>;

  constructor(worker: Worker) {
    this.worker = worker;
    this.lobbies = new Map();
  }

  async getLobbyByCode(dto: getLobbyByCodeContract) {
    return this.lobbies.get(dto)?.lobby || null;
  }

  async deleteLobby(dto: deleteLobbyWithCodeContract) {
    const lobbyEnv = this.lobbies.get(dto)!;
    lobbyEnv.router.close();
    this.lobbies.delete(dto);
    return true;
  }

  async removeConnectionToLobby(dto: removeConnectionFromLobbyContract) {
    const lobbyEnv = this.lobbies.get(dto.lobby.code)!;
    const transports = lobbyEnv.transports.get(dto.connection.id);
    if (transports) {
      // Close the producer and consumer transports
      transports.producerTransport.close();
      transports.consumerTransport.close();

      // Remove the transports from the map
      lobbyEnv.transports.delete(dto.connection.id);
    }

    // Remove the connection from the lobby
    lobbyEnv.lobby.removeConnection(dto.connection.id);
    return lobbyEnv.lobby;
  }

  async createEmptyLobbyWithCode(
    dto: createEmptyLobbyWithCodeContract
  ): Promise<Lobby> {
    const router = await this.createRouter();
    const lobby = new Lobby(dto);

    const lobbyEnvironemnt = new LobbyEnvironment(lobby, router);
    this.lobbies.set(dto, lobbyEnvironemnt);

    return lobby;
  }

  async addConnectionToLobby(
    dto: addConnectionToLobbyContract
  ): Promise<Lobby> {
    const lobbyEnv = this.lobbies.get(dto.lobby.code)!;

    const connection = new Connection(dto.connection.name, dto.connection.id);
    lobbyEnv.lobby.addConnection(connection);

    const producerTransport = await this.createTransport(lobbyEnv.router);
    const consumerTransport = await this.createTransport(lobbyEnv.router);

    lobbyEnv.transports.set(connection.id, {
      producerTransport,
      consumerTransport,
    });

    return lobbyEnv.lobby;
  }

  private async createRouter() {
    const router = await this.worker.createRouter({
      mediaCodecs: codecSettings,
    });
    return router;
  }

  private async createTransport(router: Router) {
    return await router.createWebRtcTransport(transportOptions);
  }
}

export default MediaSoupLobbyService;
