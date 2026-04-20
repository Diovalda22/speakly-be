import "dotenv/config";
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setIO } from "./config/socket.js";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

setIO(io);

httpServer.listen(3000, () => {
  console.log("server running on port 3000");
});
