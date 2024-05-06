import { RtpParameters } from "mediasoup-client/lib/RtpParameters";

export default interface SendProducerParametersDTO {
  kind: "audio" | "video";
  rtpParameters: RtpParameters;
  transportID: string;
}
