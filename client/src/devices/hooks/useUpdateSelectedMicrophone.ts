import { useContext } from "react";
import { UpdateSelectedMicrophoneContext } from "../state";

export default () => {
  return useContext(UpdateSelectedMicrophoneContext);
};
