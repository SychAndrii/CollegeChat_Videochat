import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Initialize or return the existing socket
export const getSocket = () => {
  if (!socket) {
    socket = io();
    // Optionally set up event listeners here
    console.log("Socket initialized");
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
