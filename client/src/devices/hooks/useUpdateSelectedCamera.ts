import { useContext } from "react";
import { UpdateSelectedCameraContext } from "../state";

export default () => {
  return useContext(UpdateSelectedCameraContext);
};
