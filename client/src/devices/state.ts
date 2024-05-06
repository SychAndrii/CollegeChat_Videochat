import { createContext } from "react";

export const MicrophonesContext = createContext<MediaDeviceInfo[]>([]);
export const CamerasContext = createContext<MediaDeviceInfo[]>([]);

export const SelectedCameraContext = createContext<MediaDeviceInfo | null>(
  null
);
export const SelectedMicrophoneContext = createContext<MediaDeviceInfo | null>(
  null
);

export const UpdateSelectedCameraContext = createContext<
  (device: string) => void
>(() => {});
export const UpdateSelectedMicrophoneContext = createContext<
  (device: string) => void
>(() => {});
