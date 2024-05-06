import { useContext } from "react"
import { MicrophonesContext } from "../state"

export default () => {
    return useContext(MicrophonesContext);
}