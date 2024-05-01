import { Router } from "mediasoup/node/lib/Router";
import { WebRtcTransport } from "mediasoup/node/lib/WebRtcTransport";
import DomainConnectionData from "./DomainConnectionData";
import { Producer } from "mediasoup/node/lib/Producer";
import { Consumer } from "mediasoup/node/lib/Consumer";

interface Connection {
    id: string;
    mediasoup: {
      producerTransport: WebRtcTransport | null;
      consumerTransport: WebRtcTransport | null;
      producers: Producer[];
      consumers: Consumer[];
    }
    domain: DomainConnectionData
}

export default class LobbyEnvironment {
  public code: string;
  public router: Router;
  public connections: Map<string, Connection> = new Map();

  constructor(
    code: string,
    router: Router
  ) {
    this.code = code;
    this.router = router;
  }
}
