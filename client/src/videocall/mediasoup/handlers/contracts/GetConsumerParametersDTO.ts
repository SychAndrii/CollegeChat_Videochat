import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";

export default interface GetConsumerParametersDTO {
  kind: "audio" | "video";
  rtpCapabilities: RtpCapabilities;
  transportID: string;
  producerID: string;
}
