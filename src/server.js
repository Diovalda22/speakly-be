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

  // User join room pribadi berdasarkan userId untuk notifikasi
  socket.on("joinRoom", (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined room user:${userId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

setIO(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
