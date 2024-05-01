import { Socket } from "socket.io";
import LobbyService from "../services/LobbyService";
import {
  JoinLobbyDTO,
  GetRtpCapabilitiesDTO,
  ConnectTransportDTO,
  CreateTransportDTO,
  SharePersonalProducerDTO,
  SetupPersonalConsumerDTO,
  StopProducerDTO,
  ResumeProducerDTO,
  LeaveLobbyDTO,
} from "../contracts/client";

class LobbyController {
  private lobbyService: LobbyService;

  constructor(lobbyService: LobbyService) {
    this.lobbyService = lobbyService;
  }

  async getLobbyRtpCapabilities(socket: Socket, data: GetRtpCapabilitiesDTO) {
    try {
      const capabilities = await this.lobbyService.getLobbyRtpCapabilities(
        data
      );
      socket.emit("getLobbyRtpCapabilitiesSuccess", capabilities);
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error getting capabilities: " + err.message,
      });
    }
  }

  async joinLobby(socket: Socket, data: JoinLobbyDTO) {
    try {
      const domainData = await this.lobbyService.joinLobby(data);
      socket.join(data.lobbyCode);
      socket
        .to(data.lobbyCode)
        .emit("connectionAttempt", JSON.stringify(domainData));

      socket.emit("joinLobbySuccess");
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error joining lobby: " + err.message,
      });
    }
  }

  async createProducerTransport(socket: Socket, data: CreateTransportDTO) {
    try {
      const producerTransportParameters =
        await this.lobbyService.createProducerTransport(data);

      socket.emit(
        "createProducerTransportSuccess",
        producerTransportParameters
      );
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error creating producer transport: " + err.message,
      });
    }
  }

  async createConsumerTransport(socket: Socket, data: CreateTransportDTO) {
    try {
      const consumerTransportParameters =
        await this.lobbyService.createConsumerTransport(data);

      socket.emit(
        "createConsumerTransportSuccess",
        consumerTransportParameters
      );
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error creating consumer transport: " + err.message,
      });
    }
  }

  async connectProducerTransport(socket: Socket, data: ConnectTransportDTO) {
    try {
      await this.lobbyService.connectProducerTransport(data);
      socket.emit("connectProducerTransportSuccess");
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error connecting to producer transport: " + err.message,
      });
    }
  }

  async connectConsumerTransport(socket: Socket, data: ConnectTransportDTO) {
    try {
      await this.lobbyService.connectConsumerTransport(data);
      socket.emit("connectConsumerTransportSuccess");
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error connecting to consumer transport: " + err.message,
      });
    }
  }

  async sharePersonalProducer(socket: Socket, data: SharePersonalProducerDTO) {
    try {
      const { newProducerID, existingProducerIDs } =
        await this.lobbyService.createNewProducer(data);

      socket
        .to(data.lobbyCode)
        .emit("receiveExternalProducer", { producerID: newProducerID });

      socket.emit("sharePersonalProducerSuccess", existingProducerIDs);
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error creating a producer: " + err.message,
      });
    }
  }

  async setupPersonalConsumer(socket: Socket, data: SetupPersonalConsumerDTO) {
    try {
      const consumerParameters = await this.lobbyService.createNewConsumer(
        data
      );
      socket.emit("setupPersonalConsumer", consumerParameters);
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error setting up a consumer: " + err.message,
      });
    }
  }

  async stopProducer(socket: Socket, data: StopProducerDTO) {
    try {
      await this.lobbyService.stopProducer(data);
      socket
        .to(data.lobbyCode)
        .emit("producerStopped", { producerID: data.producerID });

      socket.emit("stopProducerSuccess");
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error stopping up a producer: " + err.message,
      });
    }
  }

  async resumeProducer(socket: Socket, data: ResumeProducerDTO) {
    try {
      await this.lobbyService.resumeProducer(data);
      socket
        .to(data.lobbyCode)
        .emit("producerResumed", { producerID: data.producerID });

      socket.emit("resumeProducerSuccess");
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error resuming up a producer: " + err.message,
      });
    }
  }

  async leaveLobby(socket: Socket, data: LeaveLobbyDTO) {
    try {
      await this.lobbyService.leaveLobby(data);
      socket.leave(data.lobbyCode);
      socket
        .to(data.lobbyCode)
        .emit("disconnect");

      socket.emit("leaveLobbySuccess");
    } catch (error) {
      const err = error as Error;
      socket.emit("error", {
        message: "Error leaving lobby: " + err.message,
      });
    }
  }
}

export default LobbyController;
