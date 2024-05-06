import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  MicrophonesContext,
  CamerasContext,
  SelectedCameraContext,
  SelectedMicrophoneContext,
  UpdateSelectedCameraContext,
  UpdateSelectedMicrophoneContext,
} from "./state";

const DevicesProvider = ({ children }: { children: React.ReactNode }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const [selectedMicrophoneID, setSelectedMicrophoneID] = useState<
    string | null
  >(localStorage.getItem("selectedMicrophoneID"));
  const [selectedCameraID, setSelectedCameraID] = useState<string | null>(
    localStorage.getItem("selectedCameraID")
  );

  const updateSelectedCamera = (deviceID: string) => {
    console.log('UPDATING');
    
    const cameraExists = devices.filter(
      (d) => d.kind === "videoinput" && d.deviceId === deviceID
    );
    console.log(cameraExists);
    
    if (cameraExists) {
      setSelectedCameraID(deviceID);
    }
  };

  const updateSelectedMicrophone = (deviceID: string) => {
    const micExists = devices.filter(
      (d) => d.kind === "audioinput" && d.deviceId === deviceID
    );
    if (micExists) {
      setSelectedMicrophoneID(deviceID);
    }
  };

  useEffect(() => {
    if (selectedMicrophoneID) {
      localStorage.setItem("selectedMicrophoneID", selectedMicrophoneID);
    }
    if (selectedCameraID) {
      localStorage.setItem("selectedCameraID", selectedCameraID);
    }
  }, [selectedMicrophoneID, selectedCameraID]);

  const cameras = useMemo(() => {
    return devices.filter((d) => d.kind === "videoinput");
  }, [devices]);

  const microphones = useMemo(() => {
    return devices.filter((d) => d.kind === "audioinput");
  }, [devices]);

  const enumerateDevices = useCallback(async () => {
    try {
      const newDevices = await navigator.mediaDevices.enumerateDevices();
      console.log(newDevices);
      setDevices(newDevices);
    } catch (error) {
      console.error("Failed to enumerate devices:", error);
    }
  }, []);

  useEffect(() => {
    enumerateDevices();
  }, [enumerateDevices]);

  useEffect(() => {
    localStorage.setItem("selectedMicrophoneID", selectedMicrophoneID || "");
    localStorage.setItem("selectedCameraID", selectedCameraID || "");
  }, [selectedMicrophoneID, selectedCameraID]);

  return (
    <CamerasContext.Provider value={cameras}>
      <MicrophonesContext.Provider value={microphones}>
        <SelectedCameraContext.Provider
          value={cameras?.find((d) => d.deviceId === selectedCameraID) || null}
        >
          <SelectedMicrophoneContext.Provider
            value={
              microphones?.find((d) => d.deviceId === selectedMicrophoneID) ||
              null
            }
          >
            <UpdateSelectedCameraContext.Provider value={updateSelectedCamera}>
              <UpdateSelectedMicrophoneContext.Provider
                value={updateSelectedMicrophone}
              >
                {children}
              </UpdateSelectedMicrophoneContext.Provider>
            </UpdateSelectedCameraContext.Provider>
          </SelectedMicrophoneContext.Provider>
        </SelectedCameraContext.Provider>
      </MicrophonesContext.Provider>
    </CamerasContext.Provider>
  );
};

export default DevicesProvider;
