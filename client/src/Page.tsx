import useCameras from "./devices/hooks/useCameras";
import useMicrophones from "./devices/hooks/useMicrophones";

import useUpdateSelectedCamera from "./devices/hooks/useUpdateSelectedCamera";
import useUpdateSelectedMicrophone from "./devices/hooks/useUpdateSelectedMicrophone";

import useSelectedCamera from "./devices/hooks/useSelectedCamera";
import useSelectedMicrophone from "./devices/hooks/useSelectedMicrophone";

const Page = () => {
  const mics = useMicrophones();
  const cameras = useCameras();

  const updateSelectedMicrophone = useUpdateSelectedMicrophone();
  const updateSelectedCamera = useUpdateSelectedCamera();

  const selectedMicrophone = useSelectedMicrophone();
  const selectedCamera = useSelectedCamera();

  const microphonesSelect = (
    <select
      value={selectedMicrophone?.deviceId}
      onChange={(event) => updateSelectedMicrophone(event.target.value)}
    >
      {mics.map((m) => (
        <option
          key={m.deviceId}
          value={m.deviceId}
          className={selectedMicrophone?.deviceId === m.deviceId ? "text-red-500" : ""}
        >
          {m.label}
        </option>
      ))}
    </select>
  );

  const camerasSelect = (
    <select
      value={selectedCamera?.deviceId} // Set value to selected camera's deviceId
      onChange={(event) => updateSelectedCamera(event.target.value)}
    >
      {cameras.map((c) => (
        <option
          key={c.deviceId}
          value={c.deviceId}
          className={selectedCamera?.deviceId === c.deviceId ? "text-red-500" : ""}
        >
          {c.label}
        </option>
      ))}
    </select>
  );

  return (
    <>
      {microphonesSelect}
      <br />
      {camerasSelect}
    </>
  );
};

export default Page;


