export interface ConnectToLobbyContract {
    connection: {
        name: string;
        id: string;
    };
    lobby: {
        code: string;
    }
}

export interface DisconnectFromLobbyContract {
    connection: {
        id: string;
    };
    lobby: {
        code: string;
    }
}

export type GetLobbyContract = string;