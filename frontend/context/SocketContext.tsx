'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("accessToken");
      const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
        auth: {
          token: token,
        },
      });

      socketInstance.on("connect", () => {
        setIsConnected(true);
        console.log("Socket connected");
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
        if (socket) {
            socket.disconnect();
            setSocket(null);
            setIsConnected(false);
        }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
