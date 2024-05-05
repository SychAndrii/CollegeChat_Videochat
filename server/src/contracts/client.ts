import { DtlsParameters } from "mediasoup/node/lib/WebRtcTransport";
import { RtpParameters } from "mediasoup/node/lib/RtpParameters";
import { RtpCapabilities } from "mediasoup/node/lib/RtpParameters";

interface DomainConnectionDTO {
  domain: {
    name: string;
  }
}

export interface JoinLobbyClientDTO extends DomainConnectionDTO {
  lobbyCode: string;
}

export interface ConnectTransportClientDTO {
  transportID: string;
  dtlsParameters: DtlsParameters;
}

export interface SharePersonalProducerClientDTO {
  kind: "audio" | "video";
  rtpParameters: RtpParameters;
  transportID: string;
}

export interface SetupPersonalConsumerClientDTO {
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