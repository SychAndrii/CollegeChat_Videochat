import LobbyService from "../services/LobbyService";
import LobbyClient from "../LobbyClient";

import {
  ConnectTransportClientDTO,
  JoinLobbyClientDTO,
  PauseProducerClientDTO,
  ResumeProducerClientDTO,
  SetupPersonalConsumerClientDTO,
  SharePersonalProducerClientDTO,
} from "../contracts/client";

class LobbyController {
  private lobbyService: LobbyService;
  private lobbyClient: LobbyClient;

  constructor(lobbyService: LobbyService, lobbyClient: LobbyClient) {
    this.lobbyService = lobbyService;
    this.lobbyClient = lobbyClient;
  }

  async getLobbyRtpCapabilities() {
    try {
      const lobbyCode = this.lobbyClient.getLobbyCode()!;

      const lobbyDTO = {
        lobbyCode,
      };

      const capabilities = await this.lobbyService.getLobbyRtpCapabilities(
        lobbyDTO
      );
      this.lobbyClient.sendToClient(
        "getLobbyRtpCapabilitiesSuccess",
        capabilities
      );
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error getting capabilities: " + err.message,
      });
    }
  }

  async joinLobby(data: JoinLobbyClientDTO) {
    try {
      const connectionID = this.lobbyClient.getConnectionID();

      const lobbyDTO = {
        ...data,
        connectionID: connectionID,
      };

      const domainData = await this.lobbyService.joinLobby(lobbyDTO);

      this.lobbyClient.joinLobby(data.lobbyCode);
      this.lobbyClient.broadcastToLobby(
        "newConnection",
        JSON.stringify(domainData)
      );
      this.lobbyClient.sendToClient("joinLobbySuccess");
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error joining lobby: " + err.message,
      });
    }
  }

  async createProducerTransport() {
    try {
      const lobbyCode = this.lobbyClient.getLobbyCode()!;
      const connectionID = this.lobbyClient.getConnectionID();

      const lobbyDTO = {
        connectionID,
        lobbyCode,
      };

      const producerTransportParameters =
        await this.lobbyService.createProducerTransport(lobbyDTO);

      this.lobbyClient.sendToClient(
        "createProducerTransportSuccess",
        producerTransportParameters
      );
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error creating producer transport: " + err.message,
      });
    }
  }

  async createConsumerTransport() {
    try {
      const lobbyCode = this.lobbyClient.getLobbyCode()!;
      const connectionID = this.lobbyClient.getConnectionID();

      const lobbyDTO = {
        connectionID,
        lobbyCode,
      };

      const consumerTransportParameters =
        await this.lobbyService.createConsumerTransport(lobbyDTO);

      this.lobbyClient.sendToClient(
        "createConsumerTransportSuccess",
        consumerTransportParameters
      );
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error creating consumer transport: " + err.message,
      });
    }
  }

  async connectProducerTransport(data: ConnectTransportClientDTO) {
    try {
      const lobbyCode = this.lobbyClient.getLobbyCode()!;
      const connectionID = this.lobbyClient.getConnectionID();
      const lobbyDTO = {
        ...data,
        connectionID,
        lobbyCode,
      };

      await this.lobbyService.connectProducerTransport(lobbyDTO);
      this.lobbyClient.sendToClient("connectProducerTransportSuccess");
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error connecting to producer transport: " + err.message,
      });
    }
  }

  async connectConsumerTransport(data: ConnectTransportClientDTO) {
    try {
      const lobbyCode = this.lobbyClient.getLobbyCode()!;
      const connectionID = this.lobbyClient.getConnectionID();

      const lobbyDTO = {
        ...data,
        connectionID,
        lobbyCode,
      };

      await this.lobbyService.connectConsumerTransport(lobbyDTO);
      this.lobbyClient.sendToClient("connectConsumerTransportSuccess");
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error connecting to consumer transport: " + err.message,
      });
    }
  }

  async sharePersonalProducer(data: SharePersonalProducerClientDTO) {
    try {
      const connectionID = this.lobbyClient.getConnectionID();
      const lobbyCode = this.lobbyClient.getLobbyCode()!;

      const lobbyDTO = {
        ...data,
        connectionID,
        lobbyCode,
      };

      const { newProducerID, existingProducerIDs } =
        await this.lobbyService.createNewProducer(lobbyDTO);

      this.lobbyClient.broadcastToLobby("receiveExternalProducer", {
        producerID: newProducerID,
      });
      this.lobbyClient.sendToClient(
        "sharePersonalProducerSuccess",
        existingProducerIDs
      );
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error creating a producer: " + err.message,
      });
    }
  }

  async setupPersonalConsumer(data: SetupPersonalConsumerClientDTO) {
    try {
      const connectionID = this.lobbyClient.getConnectionID();
      const lobbyCode = this.lobbyClient.getLobbyCode()!;

      const lobbyDTO = {
        ...data,
        connectionID,
        lobbyCode,
      };

      const consumerParameters = await this.lobbyService.createNewConsumer(
        lobbyDTO
      );
      this.lobbyClient.sendToClient(
        "setupPersonalConsumer",
        consumerParameters
      );
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error setting up a consumer: " + err.message,
      });
    }
  }

  async pauseProducer(data: PauseProducerClientDTO) {
    try {
      const lobbyCode = this.lobbyClient.getLobbyCode()!;
      const connectionID = this.lobbyClient.getConnectionID();

      const lobbyDTO = {
        ...data,
        connectionID,
        lobbyCode,
      };

      await this.lobbyService.pauseProducer(lobbyDTO);

      this.lobbyClient.broadcastToLobby("producerStopped", {
        producerID: data.producerID,
      });
      this.lobbyClient.sendToClient("stopProducerSuccess");
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error stopping up a producer: " + err.message,
      });
    }
  }

  async resumeProducer(data: ResumeProducerClientDTO) {
    try {
      const lobbyCode = this.lobbyClient.getLobbyCode()!;
      const connectionID = this.lobbyClient.getConnectionID();

      const lobbyDTO = {
        ...data,
        connectionID,
        lobbyCode,
      };

      await this.lobbyService.resumeProducer(lobbyDTO);

      this.lobbyClient.broadcastToLobby("producerResumed", {
        producerID: data.producerID,
      });
      this.lobbyClient.sendToClient("resumeProducerSuccess");
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error resuming up a producer: " + err.message,
      });
    }
  }

  async leaveLobby() {
    try {
      const lobbyCode = this.lobbyClient.getLobbyCode()!;
      const connectionID = this.lobbyClient.getConnectionID();

      const lobbyDTO = {
        connectionID,
        lobbyCode,
      };

      await this.lobbyService.leaveLobby(lobbyDTO);

      this.lobbyClient.leaveLobby();
      this.lobbyClient.broadcastToLobby("disconnect", {
        connectionID: connectionID,
      });
      this.lobbyClient.sendToClient("leaveLobbySuccess");
    } catch (error) {
      const err = error as Error;
      this.lobbyClient.sendToClient("error", {
        message: "Error leaving lobby: " + err.message,
      });
    }
  }
}

export default LobbyController;
