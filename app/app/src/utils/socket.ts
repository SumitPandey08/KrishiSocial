import { io } from "socket.io-client";

const URL = "http://localhost:5001";

let socket: ReturnType<typeof io> | null = null;

export const connectSocket = (token: string) => {
  socket = io(URL, {
    transports: ["websocket"],
    auth: {
      token: token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const getSocket = () => socket;

export const EVENTS = {
  LIKE_POST: "likePost",
  POST_LIKED: "postLiked",

  ADD_COMMENT: "addComment",
  NEW_COMMENT: "newComment",

  JOIN_POST: "joinPostRoom",
};