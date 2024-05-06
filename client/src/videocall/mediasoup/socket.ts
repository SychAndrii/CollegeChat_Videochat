import { io, Socket } from "socket.io-client";

import newConnection from "./handlers/newConnection";

let socket: Socket | null = null;

// Initialize or return the existing socket
export const getSocket = () => {
  if (!socket) {
    socket = io();

    socket.on("newConnection", newConnection);
  }
  return socket;
};

// Disconnect the socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // Ensure the socket is nullified to clean up references
    console.log("Socket disconnected");
  }
};
