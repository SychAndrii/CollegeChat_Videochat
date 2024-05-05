import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";

const getDevice = async (rtpCapabilities: RtpCapabilities) => {
  const device = new Device();
  await device.load({ routerRtpCapabilities: rtpCapabilities });
  return device;
};

export default getDevice;
