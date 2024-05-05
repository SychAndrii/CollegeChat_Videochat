import {
  IceParameters,
  IceCandidate,
  DtlsParameters,
} from "mediasoup-client/lib/types";

export default interface TransportParameters {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
}
