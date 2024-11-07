import dotenv from "dotenv";
import express, { Express } from "express";
import http, { Server as HTTPServer } from "http";
import cors from "cors";
import { setupSocket } from "./socket.js";
// Note: Use .js extension for ESM

dotenv.config();

try {
  const PORT: number = parseInt(process.env.PORT || "4000", 10);
  const ORIGIN = process.env.ORIGIN;

  if (!ORIGIN) {
    throw new Error("Missing required environment variable: ORIGIN");
  }

  const app: Express = express();
  const server: HTTPServer = http.createServer(app);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(
    cors({
      origin: "https://next-js-websocket-ebon.vercel.app/",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

  // Initialize Socket.IO with the HTTP server
  setupSocket(server);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}, acceptiong connection from ${ORIGIN}`);
  });
} catch (err) {
  console.error("Failed to start server:", err);
}
