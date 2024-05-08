import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
  SelectItem,
} from "@/ui/select";

import useMicrophones from "../hooks/useMicrophones";
import useSelectedMicrophone from "../hooks/useSelectedMicrophone";

const MicrophoneSelect = () => {
  const mics = useMicrophones();
  const selectedMicrophone = useSelectedMicrophone();

  const microphoneSelected = (value: string) => {
    selectedMicrophone?.update(value);
  };

  return (
    <div className="w-full">
      <Select
        value={selectedMicrophone?.device?.deviceId}
        onValueChange={microphoneSelected}
        key="mics"
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a microphone" />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            <SelectLabel>Your connected microphones</SelectLabel>
            {mics.map((m: MediaDeviceInfo) => (
              <SelectItem
                key={m.deviceId}
                value={m.deviceId}
                className={`${
                  selectedMicrophone?.device?.deviceId === m.deviceId
                    ? "font-bold"
                    : ""
                }`}
              >
                {m.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MicrophoneSelect;
