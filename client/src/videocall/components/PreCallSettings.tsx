import { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Label } from "@/ui/label";
import { Checkbox } from "@/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import Webcam from "react-webcam";

import AudioVisualizer from "@/devices/components/AudioVisualiser";
import MicrophoneSelect from "@/devices/components/MicrophoneSelect";
import useSelectedMicrophone from "@/devices/hooks/useSelectedMicrophone";
import CameraSelect from "@/devices/components/CameraSelect";
import useSelectedCamera from "@/devices/hooks/useSelectedCamera";
import useStreamManager from "@/devices/hooks/useStreamManager";

const PreCallSettings = () => {
  const selectedMic = useSelectedMicrophone();
  const selectedCam = useSelectedCamera();

  const [isTestingMic, setIsTestingMic] = useState(false);
  const [isTestingCam, setIsTestingCam] = useState(false);

  const [micStream, openMicStream, closeMicStream] = useStreamManager(
    selectedMic?.device || null
  );
  const [cameraStream, openCameraStream, closeCameraStream] = useStreamManager(
    selectedCam?.device || null
  );

  useEffect(() => {
    setIsTestingMic(false);
    closeMicStream();
  }, [selectedMic?.device.deviceId]);

  useEffect(() => {
    setIsTestingCam(false);
    closeCameraStream();
  }, [selectedCam?.device.deviceId]);

  console.log(cameraStream);

  const toggleMicStream = async () => {
    if (isTestingMic) {
      closeMicStream();
      setIsTestingMic(false);
    } else {
      await openMicStream();
      setIsTestingMic(true);
    }
  };

  const toggleCamStream = async () => {
    if (isTestingCam) {
      closeCameraStream();
      setIsTestingCam(false);
    } else {
      await openCameraStream();
      setIsTestingCam(true);
    }
  };
  

  return (
    <Tabs defaultValue="mic">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="mic">Microphone</TabsTrigger>
        <TabsTrigger value="cam">Camera</TabsTrigger>
      </TabsList>
      <TabsContent value="mic">
        <Card>
          <CardHeader>
            <CardTitle>Microphone settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Select your device</Label>
              <MicrophoneSelect />
            </div>
            <div className="space-y-1">
              <div className=" flex w-full justify-between items-center">
                <Label>Test your microphone</Label>
                <Button
                  disabled={selectedMic === null}
                  onClick={toggleMicStream}
                >
                  <span>{isTestingMic ? "Stop testing" : "Test audio"}</span>
                </Button>
              </div>
              <AudioVisualizer
                isRecording={isTestingMic}
                audioStream={micStream!}
                height={80}
              />
            </div>
            <div className="space-y-1">
              <div className="items-center flex justify-center space-x-2">
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Join as muted
                  </label>
                </div>
                <Checkbox id="terms1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="cam">
        <Card>
          <CardHeader>
            <CardTitle>Camera settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Select your device</Label>
              <CameraSelect />
            </div>
            <div className="space-y-1">
              <div className=" flex w-full justify-between items-center">
                <Label>Test your camera</Label>
                <Button
                  disabled={selectedCam === null}
                  onClick={toggleCamStream}
                >
                  <span>{isTestingCam ? "Stop testing" : "Test camera"}</span>
                </Button>
              </div>
              <div
                style={{ width: "100%", height: "auto", background: "black" }}
              >
                {cameraStream && isTestingCam ? (
                  <Webcam
                    audio={false}
                    videoConstraints={{
                      deviceId: selectedCam!.device.deviceId,
                    }}
                    style={{
                      width: "100%",
                      height: "420px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "420px",
                      background: "black",
                    }}
                  ></div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <div className="items-center flex justify-center space-x-2">
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="camoff"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Join with camera off
                  </label>
                </div>
                <Checkbox id="camoff" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PreCallSettings;
