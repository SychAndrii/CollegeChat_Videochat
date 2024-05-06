import { useContext } from "react";
import { SelectedCameraContext } from "../state";

export default () => {
  return useContext(SelectedCameraContext);
};
