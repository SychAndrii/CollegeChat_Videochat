export type getLobbyByCodeContract = string;

export type createEmptyLobbyWithCodeContract = string;

export type deleteLobbyWithCodeContract = string;

export interface addConnectionToLobbyContract {
    lobbyCode: string;
    connectionID: string;
    domain: {
        name: string;
    }
}

export interface removeConnectionFromLobbyContract {
    lobbyCode: string;
    connectionID: string;
}