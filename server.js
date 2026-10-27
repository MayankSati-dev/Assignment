import "dotenv/config";
import { createServer } from "http";
import { createApp } from "./src/app.js";
import { setupSocket } from "./src/socket.js";
import {connecttoDb} from "./mongodb.js"

const server = createServer();
const io = setupSocket(server);
const app = createApp(io);
connecttoDb()
server.removeAllListeners("request");
server.on("request", app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});