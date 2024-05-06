import { Consumer, Producer, Transport } from "mediasoup-client/lib/types";

import React, { useState } from "react";

import { LobbyContext } from "../state";
import { Lobby } from "../state";

interface ProviderProps {
  children: React.ReactNode;
}

interface Mediasoup {
  sendTransport: Transport | null;
  recvTransport: Transport | null;
  producers: Producer[];
  consumers: Consumer[];
}

interface FullLobbyState {
  mediasoup: Mediasoup;
  api: Lobby;
}

const LobbyProvider = ({ children }: ProviderProps) => {
  const [lobby] = useState<FullLobbyState>({
    mediasoup: {
      sendTransport: null,
      recvTransport: null,
      producers: [],
      consumers: [],
    },
    api: {
      code: null,
      connections: [],
    },
  });

  return (
    <LobbyContext.Provider value={lobby.api}>{children}</LobbyContext.Provider>
  );
};

export default LobbyProvider;
