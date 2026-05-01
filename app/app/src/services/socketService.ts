import { io, Socket } from "socket.io-client";
import { API_URL } from "./api";
import * as SecureStore from "expo-secure-store";

// Convert http://ip:5000/api -> http://ip:5000
const SOCKET_URL = API_URL.replace('/api', '');

class SocketService {
  public socket: Socket | null = null;

  async connect() {
    const token = await SecureStore.getItemAsync("accessToken");

    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    this.socket?.off(event, callback);
  }
}

export const socketService = new SocketService();