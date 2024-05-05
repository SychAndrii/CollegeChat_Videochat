import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import defineRoutes from "./routing/routes";
import AppRouter from "./routing/AppRouter";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

main();

async function main() {
  await activateRoutes();
  startHttpServer();
}

async function activateRoutes() {
  const appRouter = new AppRouter(io);
  await appRouter.configureRoutes(defineRoutes);
}

function startHttpServer() {
  httpServer.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}
