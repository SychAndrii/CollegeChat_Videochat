import { Device } from "mediasoup-client";
import ReceiveExternalProducerDTO from "./contracts/ReceiveExternalProducerDTO";
import { getSocket } from "../socket";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";

export default async function receiveExternalProducer(
  dto: ReceiveExternalProducerDTO,
  device: Device,
  rtpCapabilities: RtpCapabilities
) {
  // Check if the device is ready and can consume
  if (!device.loaded) {
    console.error(
      "Mediasoup device is not loaded. Cannot consume new producer."
    );
    return;
  }

  // Check if the device can consume the producer's media kind (audio/video)
  if (!device.canProduce("video")) {
    // Assuming it's video; adjust as necessary
    console.error("Device cannot consume video.");
    return;
  }

  try {
    // This function should handle creating and setting up the consumer on the client side.
    // It would need to request necessary transport and signaling to consume the new producer.
    await createConsumerForProducer({
      producerId: dto.producerID,
      rtpCapabilities,
    });

    console.log(`Consumer setup completed for producer ${dto.producerID}.`);
  } catch (error) {
    console.error(
      `Error setting up consumer for new producer ${dto.producerID}: ${error.message}`
    );
  }
}

// Example helper function, needs actual implementation details
async function createConsumerForProducer({ producerId, rtpCapabilities }) {
  const socket = getSocket();
  // Signal to the server that this client wants to consume the new producer
  socket.emit("setupConsumer", { producerId, rtpCapabilities });
  // Handle server response, setup local consumer based on server-provided parameters
  socket.on("consumerReady", (consumerParams) => {
    // Implementation would go here to actually create the consumer on the client side
    console.log(`Consumer ready for producer ${producerId}:`, consumerParams);
  });
}
