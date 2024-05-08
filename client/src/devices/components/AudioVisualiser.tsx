import React, { useEffect, useRef, useCallback } from "react";

interface AudioVisualizerProps {
  isRecording: boolean;
  audioStream: MediaStream;
  height: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  audioStream,
  height,
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const setupAudioContext = useCallback(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyser);
  }, [audioStream]);

  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");
    if (!canvasCtx || !analyserRef.current || !dataArrayRef.current) {
      return;
    }

    const WIDTH = canvas!.width;
    const HEIGHT = canvas!.height;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const middleIndex = bufferLength / 2; // Middle of the frequency bin array

    const draw = () => {
      animationFrameIdRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteFrequencyData(dataArrayRef.current!);

      canvasCtx.fillStyle = "rgb(0, 0, 0)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = WIDTH / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Scale the height by the distance from the center
        const distanceFromCenter = Math.abs(middleIndex - i);
        const scale = 1 - distanceFromCenter / middleIndex;
        const barHeight =
          (dataArrayRef.current![i] / 128.0) * (HEIGHT / 2) * scale;

        const gradient = i / bufferLength;
        const red = Math.floor(255 * gradient);
        const green = 255 - red;
        canvasCtx.fillStyle = `rgb(${red},${green},50)`;

        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 1; // Add a little space between bars
      }
    };
    draw();
  }, []);

  useEffect(() => {
    if (isRecording) {
      setupAudioContext();
      drawVisualizer();
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current
          .close()
          .then(() => console.log("Audio Context closed"));
      }
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording, audioStream, setupAudioContext, drawVisualizer]);

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full"
        height={height}
        style={{ border: "1px solid black", background: "black" }}
      />
    </div>
  );
};

export default AudioVisualizer;
