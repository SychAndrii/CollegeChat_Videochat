import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { createWorker } from "mediasoup";

import LobbyController from "../controllers/LobbyController";
import RoutesContainerBuilder from "./RoutesContainerBuilder";
import LobbyClient from "../LobbyClient";
import LobbyService from "../services/LobbyService";
import LobbyMiddleware from "../middleware/LobbyMiddleware";

type SocketServer = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

type BuildRoutesCallback = (
  routesBuilder: RoutesContainerBuilder,
  lobbyController: LobbyController,
  lobbyMiddleware: LobbyMiddleware
) => void;

export default class AppRouter {
  private io: SocketServer;

  constructor(io: SocketServer) {
    this.io = io;
  }

  public async configureRoutes(buildRoutesCB: BuildRoutesCallback) {
    this.io.on("connection", async (socket: Socket) => {
      const worker = await createWorker();
      const lobbyService = new LobbyService(worker);

      const lobbyClient = new LobbyClient(socket);
      const lobbyMiddleware = new LobbyMiddleware(lobbyClient);
      const lobbyController = new LobbyController(lobbyService, lobbyClient);

      const routesBuilder = new RoutesContainerBuilder(socket);
      buildRoutesCB(routesBuilder, lobbyController, lobbyMiddleware);

      const routesContainer = routesBuilder.build();
      routesContainer.activateRoutes(lobbyClient);
    });
  }
}
