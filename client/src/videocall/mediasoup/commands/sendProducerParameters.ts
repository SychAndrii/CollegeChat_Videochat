import { getSocket } from "../socket";
import SendProducerParametersDTO from "./contracts/SendProducerParametersDTO";

const sendProducerParameters = (dto: SendProducerParametersDTO): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const socket = getSocket();

    socket.emit("sendProducerParameters", dto);

    socket.once(
      "sendProducerParametersSuccess",
      (response: { newProducerID: string }) => {
        const { newProducerID } = response;
        resolve(newProducerID);
      }
    );

    socket.once("error", (errorData: { message: string }) => {
      reject(new Error(errorData.message));  // Ensure to throw as Error
    });
  });
};

export default sendProducerParameters;
