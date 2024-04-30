export type getLobbyByCodeContract = string;

export type createEmptyLobbyWithCodeContract = string;

export type deleteLobbyWithCodeContract = string;

export interface addConnectionToLobbyContract {
    lobby: {
        code: string;
    };
    connection: {
        id: string;
        name: string;
    }
}

export interface removeConnectionFromLobbyContract {
    lobby: {
        code: string;
    };
    connection: {
        id: string;
    }
}