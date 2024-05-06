import { Device } from "mediasoup-client";

import { getSocket } from "../socket";
import TransportParameters from "../types/TransportParameters";
import ConnectTransportDTO from "./contracts/ConnectTransportDTO";

const createConsumerTransport = (device: Device) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();

    socket.emit("getConsumerTransportParameters");

    socket.once(
      "getConsumerTransportParametersSuccess",
      (transportParameters: TransportParameters) => {
        const consumerTransport =
          device.createRecvTransport(transportParameters);

        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            // Signal local DTLS parameters to the server side transport.
            const dto: ConnectTransportDTO = {
              transportID: consumerTransport.id,
              dtlsParameters: dtlsParameters,
            };

            socket.emit("connectToConsumerTransport", dto);
            socket.once(
              "connectToConsumerTransportSuccess",
              () => {
                // Tell the transport that parameters were transmitted.
                callback();
                resolve(consumerTransport);
              }
            );

            socket.once("error", (errorData: { message: string }) => {
              const errorObject = new Error(errorData.message);
              errback(errorObject);
            });
          }
        );
      }
    );
    socket.once("error", (errorData: { message: string }) => {
      reject(errorData);
    });
  });
};

export default createConsumerTransport;
