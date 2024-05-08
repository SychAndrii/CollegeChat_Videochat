import { DtlsParameters } from "mediasoup/node/lib/WebRtcTransport";
import { RtpParameters } from "mediasoup/node/lib/RtpParameters";
import { RtpCapabilities } from "mediasoup/node/lib/RtpParameters";

interface DomainConnectionDTO {
    name: string;
}

export interface JoinLobbyClientDTO {
  lobbyCode: string;
  domain: DomainConnectionDTO
}

export interface ConnectTransportClientDTO {
  transportID: string;
  dtlsParameters: DtlsParameters;
}

export interface SendProducerParametersClientDTO {
  kind: "audio" | "video";
  rtpParameters: RtpParameters;
  transportID: string;
}

export interface GetConsumerParametersClientDTO {
  kind: "audio" | "video";
  rtpCapabilities: RtpCapabilities;
  transportID: string;
  producerID: string;
}

export interface PauseProducerClientDTO {
  producerID: string;
}

export interface ResumeProducerClientDTO {
  producerID: string;
}