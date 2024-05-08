import { createContext } from "react";

export const MicrophonesContext = createContext<MediaDeviceInfo[]>([]);
export const CamerasContext = createContext<MediaDeviceInfo[]>([]);

interface SelectedDeviceType {
  device: MediaDeviceInfo;
  update: (deviceID: string) => void;
}

type SelectedMicrophoneContextType = SelectedDeviceType | null;
type SelectedCameraContextType = SelectedDeviceType | null;

export const SelectedCameraContext =
  createContext<SelectedCameraContextType>(null);

export const SelectedMicrophoneContext =
  createContext<SelectedMicrophoneContextType>(null);
