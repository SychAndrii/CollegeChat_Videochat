import { DtlsParameters } from "mediasoup/node/lib/WebRtcTransport";
import { RtpParameters } from "mediasoup/node/lib/RtpParameters";
import { RtpCapabilities } from "mediasoup/node/lib/RtpParameters";

export interface JoinLobbyDTO {
  connectionID: string;
  lobbyCode: string;
  domain: {
    name: string;
  };
}

export interface GetRtpCapabilitiesDTO {
  lobbyCode: string;
}

export interface LeaveLobbyDTO {
  lobbyCode: string;
  connectionID: string;
}

export interface CreateTransportDTO {
  lobbyCode: string;
  connectionID: string;
}

export interface ConnectTransportDTO {
  connectionID: string;
  lobbyCode: string;
  transportID: string;
  dtlsParameters: DtlsParameters;
}

export interface CreateNewProducerDTO {
  kind: "audio" | "video";
  rtpParameters: RtpParameters;
  connectionID: string;
  transportID: string;
  lobbyCode: string;
}

export interface CreateEmptyLobbyWithCodeDTO {
  lobbyCode: string;
}

export interface CreateNewConsumerDTO {
  kind: "audio" | "video";
  rtpCapabilities: RtpCapabilities;
  connectionID: string;
  transportID: string;
  lobbyCode: string;
  producerID: string;
}

export interface PauseProducerDTO {
  producerID: string;
  lobbyCode: string;
  connectionID: string;
}

export interface ResumeProducerDTO {
  producerID: string;
  lobbyCode: string;
  connectionID: string;
}
