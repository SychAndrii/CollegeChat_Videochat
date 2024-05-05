import {
  Producer,
  Consumer,
  Transport,
  Device,
} from "mediasoup-client/lib/types";

export default interface MediaSoupClient {
  device: Device;
  producers: Producer[];
  consumers: Consumer[];
  providerTransport: Transport | null;
  consumerTransport: Transport | null;
}
