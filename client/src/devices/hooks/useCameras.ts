import { useContext } from "react"
import { CamerasContext } from "../state"

export default () => {
    return useContext(CamerasContext);
}