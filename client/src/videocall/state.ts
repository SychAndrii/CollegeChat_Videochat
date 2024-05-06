import { createContext } from "react";

import DomainConnection from "./mediasoup/types/DomainConnection";

interface LobbyConnection extends DomainConnection {
  webcamStream: MediaStream;
  micStream: MediaStream;
  shareVideoStream: MediaStream;
  shareAudioStream: MediaStream;
}

export interface Lobby {
  code: string | null;
  connections: LobbyConnection[];
}

export const LobbyContext = createContext<Lobby>({
  code: null,
  connections: [],
});
