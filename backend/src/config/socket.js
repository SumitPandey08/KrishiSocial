import { Server } from "socket.io";
import socketAuth from "../middleware/socketAuth.middleware.js";
import registerPostHandlers from "../socket/post.socket.js";
import registerCommentHandlers from "../socket/comment.socket.js";
import registerChatHandlers from "../socket/chat.socket.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("Connected:", socket.user.id);

    socket.join(socket.user.id);

    registerPostHandlers(io, socket);
    registerCommentHandlers(io, socket);
    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.user.id);
    });
  });

  return io;
};