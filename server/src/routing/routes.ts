import RoutesContainerBuilder from "./RoutesContainerBuilder";
import LobbyController from "../controllers/LobbyController";
import LobbyMiddleware from "../middleware/LobbyMiddleware";

export default function defineRoutes(
  routesBuilder: RoutesContainerBuilder,
  lobbyController: LobbyController,
  lobbyMiddleware: LobbyMiddleware
) {
  routesBuilder
    .addRoute("joinLobby", lobbyController.joinLobby)

    .addRouteWithMiddleware(
      "getLobbyRtpCapabilities",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.getLobbyRtpCapabilities
    )

    .addRouteWithMiddleware(
      "createProducerTransport",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.createProducerTransport
    )

    .addRouteWithMiddleware(
      "connectToProducerTransport",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.connectProducerTransport
    )

    .addRouteWithMiddleware(
      "createConsumerTransport",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.createConsumerTransport
    )

    .addRouteWithMiddleware(
      "connectToConsumerTransport",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.connectConsumerTransport
    )

    .addRouteWithMiddleware(
      "sharePersonalProducer",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.sharePersonalProducer
    )

    .addRouteWithMiddleware(
      "setupPersonalConsumer",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.setupPersonalConsumer
    )

    .addRouteWithMiddleware(
      "pauseProducer",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.pauseProducer
    )

    .addRouteWithMiddleware(
      "resumeProducer",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.resumeProducer
    )

    .addRouteWithMiddleware(
      "disconnect",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.leaveLobby
    );
}
