import { useState, useCallback } from "react";

type DeviceInfo = MediaDeviceInfo | null;

export default function useStreamManager(
  device: DeviceInfo
): [MediaStream | null, () => Promise<void>, () => void, boolean] {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStream = useCallback(async () => {
    if (!device || !device.deviceId) {
      console.error("Invalid device or device ID.");
      return;
    }

    setLoading(true);
    try {
      const constraints: MediaStreamConstraints = {};
      if (device.kind === "videoinput") {
        constraints.video = { deviceId: { exact: device.deviceId } };
      } else if (device.kind === "audioinput") {
        constraints.audio = { deviceId: { exact: device.deviceId } };
      } else {
        console.error("Unsupported device type");
        return;
      }

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
    } catch (error) {
      console.error("Failed to get media stream", error);
      setStream(null);
    } finally {
      setLoading(false);
    }
  }, [device?.deviceId]);

  const closeStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  return [stream, fetchStream, closeStream, loading];
}
