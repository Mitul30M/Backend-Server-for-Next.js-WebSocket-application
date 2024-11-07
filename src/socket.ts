import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

type MessageType = {
  userDB_id: string;
  message: string;
};

export const setupSocket = (server: HTTPServer): void => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  const userSocketMap: Map<string, string> = new Map();

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.query.userId as string | undefined;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("UserID not provided during connection");
    }

    socket.on("send-message", async (message : MessageType) => {
      const socketID = userSocketMap.get(message.userDB_id);
      io.emit("receive-message",message)
    });

    socket.on("disconnect", () => {
      console.log(`Client Disconnected: SocketID: ${socket.id}`);
      userSocketMap.forEach((value, key) => {
        if (value === socket.id) {
          userSocketMap.delete(key);
        }
      });
    });
  });
};


