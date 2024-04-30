import express from "express";
import http from "http";
import WebSocket from "ws";
// import * as mediasoup from "mediasoup";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.WebSocketServer({ server });

main();

async function main() {

  // Mediasoup setup
  /*
  const worker = await mediasoup.createWorker();

  let router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000,
      },
    ],
  });
  */

  wss.on("connection", (ws) => {
    ws.on("message", async (message) => {
      // Handle incoming messages and mediasoup signaling here
      console.log("Received message:", message);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}
