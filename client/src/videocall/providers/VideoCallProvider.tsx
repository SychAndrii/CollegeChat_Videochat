import React from "react"
import MediaSoupProvider from "../mediasoup/MediaSoupProvider"

interface ProviderProps {
    children: React.ReactNode
}

const VideoCallProvider = ({ children }: ProviderProps) => {
    return (
        <MediaSoupProvider>
            {children}
        </MediaSoupProvider>
    )
}

export default VideoCallProvider