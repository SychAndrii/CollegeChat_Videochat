import { Device } from "mediasoup-client";

import { getSocket } from "../socket";
import TransportParameters from "../types/TransportParameters";

const createProducerTransport = (device: Device) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();

    socket.emit("createProducerTransport");

    socket.once("createProducerTransportSuccess", (transportParameters: TransportParameters) => {
        const producerTransport = device.createSendTransport(transportParameters);
        producerTransport.on(
            "produce",
            async ({ kind, rtpParameters }, callback, errback) => {
              try {
                socket.emit("produce", {
                  transportId: producerTransport.id,
                  kind,
                  rtpParameters,
                });
                callback({ id });
              } catch (error) {
                errback(error);
              }
            }
          );

        resolve(producerTransport);
    });
    socket.once("error", (errorData: {message: string}) => {
        reject(errorData);
    })
  });
};

export default createProducerTransport;
