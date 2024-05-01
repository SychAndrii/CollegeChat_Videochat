import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import LobbyService from "./services/LobbyService";
import { createWorker } from "mediasoup";
import {
  GetRtpCapabilitiesDTO,
  ConnectTransportDTO,
  CreateTransportDTO,
  SharePersonalProducerDTO,
  JoinLobbyNoConnectionIdentifierDTO,
  JoinLobbyDTO,
  SetupPersonalConsumerDTO,
  StopProducerDTO,
  ResumeProducerDTO,
  LeaveLobbyDTO,
} from "./contracts/client";
import LobbyController from "./controllers/LobbyController";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

main();

async function main() {
  await addSocketEvents();
  startHttpServer();
}

async function addSocketEvents() {
  const worker = await createWorker();
  const lobbyService = new LobbyService(worker);
  const lobbyController = new LobbyController(lobbyService);

  io.on("connection", (socket: Socket) => {
    let lobbyCode: string | null = null;
    let connectionID: string | null = null;

    socket.on("getLobbyRtpCapabilities", (data: GetRtpCapabilitiesDTO) =>
      lobbyController.getLobbyRtpCapabilities(socket, data)
    );

    socket.on("joinLobby", (data: JoinLobbyNoConnectionIdentifierDTO) => {
      const joinLobbyDTO: JoinLobbyDTO = {
        ...data,
        connectionID: socket.id,
      };

      lobbyCode = joinLobbyDTO.lobbyCode;
      connectionID = joinLobbyDTO.connectionID;

      lobbyController.joinLobby(socket, joinLobbyDTO);
    });

    socket.on("leaveLobby", (data: LeaveLobbyDTO) =>
      lobbyController.leaveLobby(socket, data)
    );

    socket.on("createProducerTransport", (data: CreateTransportDTO) =>
      lobbyController.createProducerTransport(socket, data)
    );

    socket.on("connectToProducerTransport", (data: ConnectTransportDTO) =>
      lobbyController.connectProducerTransport(socket, data)
    );

    socket.on("createConsumerTransport", (data: CreateTransportDTO) =>
      lobbyController.createConsumerTransport(socket, data)
    );

    socket.on("connectToConsumerTransport", (data: ConnectTransportDTO) =>
      lobbyController.connectProducerTransport(socket, data)
    );

    socket.on("sharePersonalProducer", (data: SharePersonalProducerDTO) =>
      lobbyController.sharePersonalProducer(socket, data)
    );

    socket.on("setupPersonalConsumer", (data: SetupPersonalConsumerDTO) =>
      lobbyController.setupPersonalConsumer(socket, data)
    );

    socket.on("pauseProducer", (data: StopProducerDTO) =>
      lobbyController.stopProducer(socket, data)
    );

    socket.on("resumeProducer", (data: ResumeProducerDTO) =>
      lobbyController.resumeProducer(socket, data)
    );

    socket.on("disconnect", () => {
      if(lobbyCode && connectionID) {
        lobbyController.leaveLobby(socket, {
          lobbyCode,
          connectionID
        });
      }
    })
  });
}

function startHttpServer() {
  httpServer.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}
