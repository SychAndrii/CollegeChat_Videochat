import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  MicrophonesContext,
  CamerasContext,
  SelectedCameraContext,
  SelectedMicrophoneContext,
} from "./state";

const DevicesProvider = ({ children }: { children: React.ReactNode }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophoneID, setSelectedMicrophoneID] = useState<
    string | null
  >(localStorage.getItem("selectedMicrophoneID"));
  const [selectedCameraID, setSelectedCameraID] = useState<string | null>(
    localStorage.getItem("selectedCameraID")
  );

  const updateSelectedCamera = useCallback((deviceID: string) => {
    setSelectedCameraID(deviceID);
    localStorage.setItem("selectedCameraID", deviceID);
  }, []);

  const updateSelectedMicrophone = useCallback((deviceID: string) => {
    setSelectedMicrophoneID(deviceID);
    localStorage.setItem("selectedMicrophoneID", deviceID);
  }, []);

  const enumerateDevices = useCallback(async () => {
    try {
      const newDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(newDevices);
    } catch (error) {
      console.error("Failed to enumerate devices:", error);
    }
  }, []);

  useEffect(() => {
    enumerateDevices();
    const handleDeviceChange = () => enumerateDevices();
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [enumerateDevices]);

  const cameras = useMemo(
    () => devices.filter((d) => d.kind === "videoinput"),
    [devices]
  );
  const microphones = useMemo(
    () => devices.filter((d) => d.kind === "audioinput"),
    [devices]
  );
  const selectedMicrophoneInfo = useMemo(
    () => microphones.find((d) => d.deviceId === selectedMicrophoneID),
    [microphones, selectedMicrophoneID]
  );
  const selectedCameraInfo = useMemo(
    () => cameras.find((d) => d.deviceId === selectedCameraID),
    [cameras, selectedCameraID]
  );

  return (
    <CamerasContext.Provider value={cameras}>
      <MicrophonesContext.Provider value={microphones}>
        <SelectedCameraContext.Provider
          value={
            selectedCameraInfo
              ? {
                  device: selectedCameraInfo,
                  update: updateSelectedCamera,
                }
              : null
          }
        >
          <SelectedMicrophoneContext.Provider
            value={
              selectedMicrophoneInfo
                ? {
                    device: selectedMicrophoneInfo,
                    update: updateSelectedMicrophone,
                  }
                : null
            }
          >
            {children}
          </SelectedMicrophoneContext.Provider>
        </SelectedCameraContext.Provider>
      </MicrophonesContext.Provider>
    </CamerasContext.Provider>
  );
};

export default DevicesProvider;
