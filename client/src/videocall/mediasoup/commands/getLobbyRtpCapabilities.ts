import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";

import { getSocket } from "../socket";

const getLobbyRtpCapabilities = () => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();

    // Request RTP Capabilities
    socket.emit("getLobbyRtpCapabilitiesSuccess");

    // Handle successful response
    socket.once(
      "getLobbyRtpCapabilitiesSuccess",
      (routerRtpCapabilities: RtpCapabilities) => resolve(routerRtpCapabilities)
    );

    // Handle error response
    socket.once("error", (errorData: { message: string }) => reject(errorData));
  });
};

export default getLobbyRtpCapabilities;
