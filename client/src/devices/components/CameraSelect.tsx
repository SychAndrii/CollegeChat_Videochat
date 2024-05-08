import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
  SelectItem,
} from "@/ui/select";

import useCameras from "../hooks/useCameras";
import useSelectedCamera from "../hooks/useSelectedCamera";

const CameraSelect = () => {
  const cams = useCameras();
  const selectedCamera = useSelectedCamera();

  const cameraSelected = (value: string) => {
    selectedCamera?.update(value);
  };

  return (
    <div className="w-full">
      <Select
        value={selectedCamera?.device.deviceId}
        onValueChange={cameraSelected}
        key="cams"
      >
        <SelectTrigger className="w-[350px]">
          <SelectValue placeholder="Select a camera" />
        </SelectTrigger>
        <SelectContent className="w-[350px]">
          <SelectGroup>
            <SelectLabel>Your connected cameras</SelectLabel>
            {cams.map((cam: MediaDeviceInfo) => (
              <SelectItem
                key={cam.deviceId}
                value={cam.deviceId}
                className={`${
                  selectedCamera?.device.deviceId === cam.deviceId
                    ? "font-bold"
                    : ""
                }`}
              >
                {cam.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CameraSelect;
