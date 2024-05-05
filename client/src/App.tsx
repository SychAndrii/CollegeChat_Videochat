import { useState } from 'react'
import VideoCallProvider from './videocall/providers/VideoCallProvider'

function App() {

  return (
    <VideoCallProvider>
      <h1 className=' text-red-500'>Hello there</h1>
    </VideoCallProvider>
  )
}

export default App
