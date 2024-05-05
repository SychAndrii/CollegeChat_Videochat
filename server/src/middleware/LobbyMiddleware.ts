import LobbyClient from "../LobbyClient";

export default class LobbyMiddleware {
  private lobbyClient: LobbyClient;

  constructor(lobbyClient: LobbyClient) {
    this.lobbyClient = lobbyClient;
  }

  attemptedToJoinLobby() {
    const lobbyCode = this.lobbyClient.getLobbyCode();
    if(!lobbyCode) {
      this.lobbyClient.sendToClient("error", "You have to attempt to join the lobby first");
      return false;
    }
    return true;
  }
}
