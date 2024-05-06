import { DtlsParameters } from "mediasoup-client/lib/types";

export default interface ConnectTransportDTO {
  transportID: string;
  dtlsParameters: DtlsParameters;
}
