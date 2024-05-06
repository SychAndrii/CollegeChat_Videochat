import { getSocket } from "../socket";
import DomainConnectionDTO from "../types/DomainConnection";
import { JoinLobbyDTO } from "./contracts/JoinLobbyDTO";

const joinLobby = (lobbyCode: string, domain: DomainConnectionDTO) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    const dto: JoinLobbyDTO = {
      lobbyCode,
      domain
    };

    socket.emit("joinLobby", dto);

    socket.once("joinLobbySuccess", () => {
        resolve(true);
    });

    socket.once("error", (errorData: {message: string}) => {
        reject(errorData);
    })
  });
};

export default joinLobby;
