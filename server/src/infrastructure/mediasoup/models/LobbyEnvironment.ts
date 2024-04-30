import Lobby from "../../../core/models/Lobby";
import { Router } from "mediasoup/node/lib/Router";
import { WebRtcTransport } from "mediasoup/node/lib/WebRtcTransport";

interface Transports {
    producerTransport: WebRtcTransport;
    consumerTransport: WebRtcTransport;
}

export default class LobbyEnvironment {
  public lobby: Lobby;
  public router: Router;
  public transports: Map<string, Transports> = new Map();

  constructor(
    lobby: Lobby,
    router: Router
  ) {
    this.lobby = lobby;
    this.router = router;
  }
}
