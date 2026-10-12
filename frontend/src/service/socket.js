
import { io } from "socket.io-client";

const BACKEND_URL = "https://assignment-95mr.onrender.com";

export const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Socket connection error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});
