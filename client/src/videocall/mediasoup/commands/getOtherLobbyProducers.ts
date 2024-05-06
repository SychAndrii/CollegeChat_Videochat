import { MediaKind } from "mediasoup-client/lib/RtpParameters";
import { getSocket } from "../socket";

const getOtherLobbyProducers = () => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();

      socket.emit("getOtherLobbyProducers");

      socket.once(
        "getOtherLobbyProducersSuccess",
        async (otherProducers: {kind: MediaKind, producerID: string}[]) => resolve(otherProducers)
      );

      socket.once("error", (errorData: {message: string}) => {
        reject(errorData);
      })
    });
};

export default getOtherLobbyProducers;
