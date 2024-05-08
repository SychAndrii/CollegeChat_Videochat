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

  const drawInitialState = useCallback(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");
    if (canvasCtx) {
      const WIDTH = canvas!.width;
      const HEIGHT = canvas!.height;

      canvasCtx.fillStyle = "rgb(200, 200, 200)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, HEIGHT / 2);
      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
    }
  }, []);

  const setupAudioContext = useCallback(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const dataArray = new Uint8Array(analyser.fftSize);

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

    const draw = () => {
      animationFrameIdRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteTimeDomainData(dataArrayRef.current!);

      canvasCtx.fillStyle = "rgb(200, 200, 200)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";
      canvasCtx.beginPath();

      const sliceWidth = WIDTH / dataArrayRef.current!.length;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current!.length; i++) {
        const v = dataArrayRef.current![i] / 128.0;
        const y = v * HEIGHT / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
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
      drawInitialState();
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
  }, [isRecording, audioStream, setupAudioContext, drawVisualizer, drawInitialState]);

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full"
        height={height}
        style={{ border: "1px solid black", background: "white" }}
      />
    </div>
  );
};

export default AudioVisualizer;
