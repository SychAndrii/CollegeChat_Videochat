import { Producer } from "mediasoup-client/lib/types";
import { getSocket } from "../socket";
import PauseProducerDTO from "./contracts/PauseProducerDTO";

const pauseProducer = async (producer: Producer) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();

    if (producer.paused) {
      console.log("Producer is already paused.");
      return;
    }

    producer.pause();

    const dto: PauseProducerDTO = {
      producerID: producer.id,
    };

    socket.emit("pauseProducer", dto);
    socket.on("pauseProducerSuccess", () => {
      resolve(true);
    });
    socket.on("error", () => {
      reject();
    });
  });
};

export default pauseProducer;
