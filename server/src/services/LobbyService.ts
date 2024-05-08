import {
  Router,
  RtpCodecCapability,
  Worker,
  WebRtcTransportOptions,
} from "mediasoup/node/lib/types";

import LobbyEnvironment from "../models/LobbyEnvironment";
import DomainConnectionData from "../models/DomainConnectionData";

import {
  ConnectTransportDTO,
  CreateNewConsumerDTO,
  CreateNewProducerDTO,
  CreateTransportDTO,
  GetExistingLobbyProducersDTO,
  GetRtpCapabilitiesDTO,
  JoinLobbyDTO,
  LeaveLobbyDTO,
  PauseProducerDTO,
  ResumeProducerDTO,
} from "../contracts/LobbyService";

const codecSettings: RtpCodecCapability[] = require("../settings/codecSettings.json");
const transportOptions: WebRtcTransportOptions = require("../settings/transportOptions.json");

class LobbyService {
  private worker: Worker;
  private lobbies: Map<string, LobbyEnvironment>;

  constructor(worker: Worker) {
    this.worker = worker;
    this.lobbies = new Map();
  }

  async getLobbyRtpCapabilities({ lobbyCode }: GetRtpCapabilitiesDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(lobbyCode);
    return lobbyEnv.router.rtpCapabilities;
  }

  async getOtherLobbyProducers({ lobbyCode, connectionID }: GetExistingLobbyProducersDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(lobbyCode);

    const existingProducers: {
      producerID: string;
      kind: "audio" | "video";
    }[] = [];

    lobbyEnv.connections.forEach((conn) => {
      if (conn.id !== connectionID) {
        conn.mediasoup.producers.forEach((producer) => {
          existingProducers.push({
            producerID: producer.id,
            kind: producer.kind,
          });
        });
      }
    });

    return { existingProducers };
  }

  async createNewConsumer(dto: CreateNewConsumerDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(dto.lobbyCode);
    const connection = lobbyEnv.connections.get(dto.connectionID);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const consumerTransport = connection.mediasoup.consumerTransport;
    if (!consumerTransport) {
      throw new Error(
        "Producer transport you are trying to connect to was not created on the server"
      );
    }
    if (consumerTransport.id !== dto.transportID) {
      throw new Error(
        "Producer transport you are trying to connect has different id"
      );
    }

    const consumer = await consumerTransport.consume({
      producerId: dto.producerID,
      rtpCapabilities: dto.rtpCapabilities,
      paused: true,
    });

    connection.mediasoup.consumers.push(consumer);

    return {
      id: consumer.id,
      producerId: dto.producerID,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
    };
  }

  async createNewProducer({
    kind,
    rtpParameters,
    transportID,
    connectionID,
    lobbyCode,
  }: CreateNewProducerDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(lobbyCode);
    const connection = lobbyEnv.connections.get(connectionID);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const producerTransport = connection.mediasoup.consumerTransport;
    if (!producerTransport) {
      throw new Error(
        "Producer transport you are trying to connect to was not created on the server"
      );
    }
    if (producerTransport.id !== transportID) {
      throw new Error(
        "Producer transport you are trying to connect has different id"
      );
    }

    const newProducer = await producerTransport.produce({
      kind,
      rtpParameters,
    });

    connection.mediasoup.producers.push(newProducer);

    // Collect IDs of all other existing producers except the new one
    let existingProducerIDs: string[] = [];

    lobbyEnv.connections.forEach((conn) => {
      conn.mediasoup.producers.forEach((producer) => {
        if (producer.id !== newProducer.id) {
          existingProducerIDs.push(producer.id);
        }
      });
    });

    return {
      newProducerID: newProducer.id,
      existingProducerIDs,
    };
  }

  async connectConsumerTransport({
    lobbyCode,
    connectionID,
    transportID,
    dtlsParameters,
  }: ConnectTransportDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(lobbyCode);
    const connection = lobbyEnv.connections.get(connectionID);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const consumerTransport = connection.mediasoup.consumerTransport;
    if (!consumerTransport) {
      throw new Error(
        "Consumer transport you are trying to connect to was not created on the server"
      );
    }
    if (consumerTransport.id !== transportID) {
      throw new Error(
        "Consumer transport you are trying to connect has different id"
      );
    }

    await consumerTransport.connect({ dtlsParameters });
  }

  async connectProducerTransport({
    lobbyCode,
    connectionID,
    transportID,
    dtlsParameters,
  }: ConnectTransportDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(lobbyCode);
    const connection = lobbyEnv.connections.get(connectionID);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const producerTransport = connection.mediasoup.producerTransport;
    if (!producerTransport) {
      throw new Error(
        "Producer transport you are trying to connect to was not created on the server"
      );
    }
    if (producerTransport.id !== transportID) {
      throw new Error(
        "Producer transport you are trying to connect has different id"
      );
    }

    await producerTransport.connect({ dtlsParameters });
  }

  async createConsumerTransport(dto: CreateTransportDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(dto.lobbyCode);
    const consumerTransport = await this.createTransport(lobbyEnv.router);

    const connection = lobbyEnv.connections.get(dto.connectionID);
    if (!connection) {
      throw new Error("Connection not found");
    }
    connection.mediasoup.consumerTransport = consumerTransport;

    return {
      id: consumerTransport.id,
      iceParameters: consumerTransport.iceParameters,
      iceCandidates: consumerTransport.iceCandidates,
      dtlsParameters: consumerTransport.dtlsParameters,
    };
  }

  async createProducerTransport(dto: CreateTransportDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(dto.lobbyCode);
    const producerTransport = await this.createTransport(lobbyEnv.router);

    const connection = lobbyEnv.connections.get(dto.connectionID);
    if (!connection) {
      throw new Error("Connection not found");
    }
    connection.mediasoup.producerTransport = producerTransport;

    return {
      id: producerTransport.id,
      iceParameters: producerTransport.iceParameters,
      iceCandidates: producerTransport.iceCandidates,
      dtlsParameters: producerTransport.dtlsParameters,
    };
  }

  async joinLobby({ lobbyCode, connectionID, domain }: JoinLobbyDTO) {
    try {
      await this.getLobbyEnvByCode(lobbyCode);
    } catch (error) {
      await this.createEmptyLobbyWithCode(lobbyCode);
    }

    const lobbyEnv = await this.getLobbyEnvByCode(lobbyCode);

    const domainData = new DomainConnectionData(domain.name);

    lobbyEnv.connections.set(connectionID, {
      id: connectionID,
      mediasoup: {
        producerTransport: null,
        consumerTransport: null,
        producers: [],
        consumers: [],
      },
      domain: domainData,
    });
    return domainData;
  }

  async leaveLobby(dto: LeaveLobbyDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(dto.lobbyCode);

    const connection = lobbyEnv.connections.get(dto.connectionID);
    if (!connection) {
      throw new Error("Connection not found");
    }

    // Close all producers associated with this connection
    for (const producer of connection.mediasoup.producers) {
      producer.close();

      // Find and close all consumers across the lobby that are consuming from this producer
      lobbyEnv.connections.forEach((conn) => {
        const consumersToClose = conn.mediasoup.consumers.filter(
          (consumer) => consumer.producerId === producer.id
        );
        consumersToClose.forEach(async (consumer) => {
          consumer.close();
        });
        // Remove the closed consumers from the consumers list
        conn.mediasoup.consumers = conn.mediasoup.consumers.filter(
          (consumer) => !consumersToClose.includes(consumer)
        );
      });
    }

    // Close all consumers associated with this connection
    connection.mediasoup.consumers.forEach((consumer) => consumer.close());

    // Close the transports
    if (connection.mediasoup.producerTransport) {
      connection.mediasoup.producerTransport.close();
    }
    if (connection.mediasoup.consumerTransport) {
      connection.mediasoup.consumerTransport.close();
    }

    // Remove the connection from the lobby
    lobbyEnv.connections.delete(dto.connectionID);

    if (lobbyEnv.connections.size === 0) {
      this.lobbies.delete(dto.lobbyCode);
      lobbyEnv.router.close(); // Close the router if it's no longer needed
    }
  }

  async pauseProducer(dto: PauseProducerDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(dto.lobbyCode);
    const connection = lobbyEnv.connections.get(dto.connectionID);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const producer = connection.mediasoup.producers.find(
      (p) => p.id === dto.producerID
    );
    if (!producer) {
      throw new Error("Producer not found");
    }

    // Pause the producer
    await producer.pause();

    lobbyEnv.connections.forEach((conn) => {
      conn.mediasoup.consumers.forEach(async (consumer) => {
        if (consumer.producerId === dto.producerID) {
          // Ensure this consumer is linked to the producer we're pausing
          await consumer.pause();
        }
      });
    });
  }

  async resumeProducer(dto: ResumeProducerDTO) {
    const lobbyEnv = await this.getLobbyEnvByCode(dto.lobbyCode);
    const connection = lobbyEnv.connections.get(dto.connectionID);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const producer = connection.mediasoup.producers.find(
      (p) => p.id === dto.producerID
    );
    if (!producer) {
      throw new Error("Producer not found");
    }

    // Resume the producer
    await producer.resume();

    lobbyEnv.connections.forEach((conn) => {
      conn.mediasoup.consumers.forEach(async (consumer) => {
        if (consumer.producerId === dto.producerID) {
          // Ensure this consumer is linked to the producer we're resuming
          await consumer.resume();
        }
      });
    });
  }

  private async createEmptyLobbyWithCode(lobbyCode: string) {
    const router = await this.createRouter();
    const lobbyEnvironemnt = new LobbyEnvironment(lobbyCode, router);
    this.lobbies.set(lobbyCode, lobbyEnvironemnt);
    return lobbyEnvironemnt;
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

  private async getLobbyEnvByCode(lobbyCode: string) {
    const lobbyEnv = this.lobbies.get(lobbyCode);
    if (!lobbyEnv) {
      throw new Error("Lobby not found");
    }
    return lobbyEnv;
  }
}

export default LobbyService;
