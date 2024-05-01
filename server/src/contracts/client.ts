import { DtlsParameters } from "mediasoup/node/lib/WebRtcTransport";
import { RtpParameters } from "mediasoup/node/lib/RtpParameters";
import { RtpCapabilities } from "mediasoup/node/lib/RtpParameters";

export interface GetRtpCapabilitiesDTO {
  lobbyID: string;
}

export interface JoinLobbyNoConnectionIdentifierDTO {
  lobbyCode: string;
  domain: {
    name: string;
  };
}

export interface JoinLobbyDTO extends JoinLobbyNoConnectionIdentifierDTO {
  connectionID: string;
}

export interface LeaveLobbyDTO {
  lobbyCode: string;
  connectionID: string;
}

export interface CreateTransportDTO {
  lobbyCode: string;
  connectionID: string;
  domain: {
    name: string;
  };
}

export interface ConnectTransportDTO {
  connectionID: string;
  lobbyCode: string;
  transportID: string;
  dtlsParameters: DtlsParameters;
}

export interface SharePersonalProducerDTO {
  kind: "audio" | "video";
  rtpParameters: RtpParameters;
  connectionID: string;
  transportID: string;
  lobbyCode: string;
}

export interface SetupPersonalConsumerDTO {
  kind: "audio" | "video";
  rtpCapabilities: RtpCapabilities;
  connectionID: string;
  transportID: string;
  lobbyCode: string;
  producerID: string;
}

export interface CreateNewProducerDTO extends SharePersonalProducerDTO {
  
}

export interface CreateNewConsumerDTO extends SetupPersonalConsumerDTO {
  
}

export interface StopProducerDTO {
  producerID: string;
  lobbyCode: string;
  connectionID: string;
}

export interface ResumeProducerDTO {
  producerID: string;
  lobbyCode: string;
  connectionID: string;
}