import { Socket } from "socket.io";

class LobbyClient {
  private socket: Socket;
  private lobbyCode: string | null = null;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  sendToClient(eventName: string, data?: any) {
    this.socket.emit(eventName, data);
  }

  broadcastToLobby(eventName: string, data?: any) {
    if (this.lobbyCode) this.socket.to(this.lobbyCode).emit(eventName, data);
  }

  joinLobby(lobbyCode: string) {
    this.lobbyCode = lobbyCode;
    this.socket.join(lobbyCode);
  }

  leaveLobby() {
    if (this.lobbyCode) this.socket.leave(this.lobbyCode);
  }

  getLobbyCode() {
    return this.lobbyCode;
  }

  getConnectionID() {
    return this.socket.id;
  }
}

export default LobbyClient;
