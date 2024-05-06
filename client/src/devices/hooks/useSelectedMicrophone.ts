import { useContext } from "react";
import { SelectedMicrophoneContext } from "../state";

export default () => {
    return useContext(SelectedMicrophoneContext);
}