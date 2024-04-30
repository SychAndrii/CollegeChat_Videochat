import Connection from "./Connection";

class Lobby {
  private connections: Connection[];
  private code: string;

  constructor(code: string) {
    this.connections = [];
    this.code = code;
  }

  getConnections() {
    return this.connections.slice();
  }

  removeConnection(conID: string) {
    const existingConnectionIndex = this.getConnectionIndex(conID);
    if (existingConnectionIndex === -1) {
        throw new Error("Connection with this ID does not exist in this lobby!");
    }
    this.connections.splice(existingConnectionIndex, 1);
  }

  addConnection(con: Connection) {
    const existingConnectionIndex = this.getConnectionIndex(con.id);
    if (existingConnectionIndex !== -1) {
      throw new Error("Connection with this ID already exists in this lobby!");
    }
    this.connections.push(con);
  }

  getCode() {
    return this.code;
  }

  private getConnectionIndex(connectionID: string) {
    return this.connections.findIndex((c) => c.id === connectionID);
  }
}

export default Lobby;
