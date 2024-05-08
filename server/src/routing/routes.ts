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
      "getOtherLobbyProducers",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.getOtherLobbyProducers
    )

    .addRouteWithMiddleware(
      "getProducerTransportParameters",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.getProducerTransportParameters
    )

    .addRouteWithMiddleware(
      "connectToProducerTransport",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.connectProducerTransport
    )

    .addRouteWithMiddleware(
      "getConsumerTransportParameters",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.getConsumerTransportParameters
    )

    .addRouteWithMiddleware(
      "connectToConsumerTransport",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.connectConsumerTransport
    )

    .addRouteWithMiddleware(
      "sendProducerParameters",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.sendProducerParameters
    )

    .addRouteWithMiddleware(
      "getConsumerParameters",
      [lobbyMiddleware.attemptedToJoinLobby],
      lobbyController.getConsumerParameters
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
