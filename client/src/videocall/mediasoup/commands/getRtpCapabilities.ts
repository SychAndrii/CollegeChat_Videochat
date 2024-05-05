import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";

import { getSocket } from "../socket";

const getRtpCapabilities = () => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();

    // Request RTP Capabilities
    socket.emit("getRtpCapabilities");

    // Handle successful response
    socket.on(
      "getLobbyRtpCapabilitiesSuccess",
      (routerRtpCapabilities: RtpCapabilities) => resolve(routerRtpCapabilities)
    );

    // Handle error response
    socket.on("error", (errorData: { message: string }) => reject(errorData));
  });
};

export default getRtpCapabilities;
