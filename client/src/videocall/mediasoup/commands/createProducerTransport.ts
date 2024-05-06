import { Device } from "mediasoup-client";

import { getSocket } from "../socket";
import TransportParameters from "../types/TransportParameters";
import ConnectTransportDTO from "./contracts/ConnectTransportDTO";
import SendProducerParametersDTO from "./contracts/SendProducerParametersDTO";
import sendProducerParameters from "./sendProducerParameters";

const createProducerTransport = (device: Device) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();

    socket.emit("getProducerTransportParameters");

    socket.once(
      "getProducerTransportParametersSuccess",
      (transportParameters: TransportParameters) => {
        const producerTransport =
          device.createSendTransport(transportParameters);

        producerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            // Signal local DTLS parameters to the server side transport.
            const dto: ConnectTransportDTO = {
              transportID: producerTransport.id,
              dtlsParameters: dtlsParameters,
            };

            socket.emit("connectToProducerTransport", dto);
            socket.once("connectToProducerTransportSuccess", () => {
              // Tell the transport that parameters were transmitted.
              callback();
              resolve(producerTransport);
            });
            socket.once("error", (errorData: { message: string }) => {
              const errorObject = new Error(errorData.message);
              errback(errorObject);
            });
          }
        );

        producerTransport.on(
          "produce",
          async ({ kind, rtpParameters }, callback, errback) => {
            const dto: SendProducerParametersDTO = {
              kind,
              rtpParameters,
              transportID: producerTransport.id,
            };

            try {
              const newProducerID = await sendProducerParameters(dto);
              callback({ id: newProducerID });
            } catch (err) {
              const errData = err as {message: string};
              const errorObject = new Error(errData.message);
              errback(errorObject);
            }
          }
        );
      }
    );
    socket.once("error", (errorData: { message: string }) => {
      reject(errorData);
    });
  });
};

export default createProducerTransport;
