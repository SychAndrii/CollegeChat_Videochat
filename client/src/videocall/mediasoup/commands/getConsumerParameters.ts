import { RtpParameters } from "mediasoup-client/lib/RtpParameters";

import { getSocket } from "../socket";
import GetConsumerParametersDTO from "../handlers/contracts/GetConsumerParametersDTO";

const getConsumerParameters = (dto: GetConsumerParametersDTO) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();

    socket.emit("getConsumerParameters", dto);
    socket.once(
      "getConsumerParametersSuccess",
      async (params: {
        id: string;
        producerId: string;
        kind: "video" | "audio";
        rtpParameters: RtpParameters;
      }) => {
        resolve(params);
      }
    );
    socket.once("error", (errorData: { message: string }) => {
      reject(errorData);
    });
  });
};

export default getConsumerParameters;
