import { EVENTS } from "../utils/event.constants.js";
import { sendMessageLogic } from "../controller/message.control.js";
import Chat from "../model/chat.model.js";

/**
 * Chat Socket Handlers
 * This file manages real-time communication for chats.
 */
export default function registerChatHandlers(io, socket) {
  
  // 1. JOIN ROOM: When a user opens a chat, they join a specific "room"
  // This allows us to send messages only to the people in this specific conversation.
  socket.on(EVENTS.JOIN_CHAT, ({ chatId }) => {
    socket.join(chatId);
    console.log(`User ${socket.user?.id} joined chat: ${chatId}`);
  });

  // 2. LEAVE ROOM: When a user closes the chat window.
  socket.on(EVENTS.LEAVE_CHAT, ({ chatId }) => {
    socket.leave(chatId);
    console.log(`User ${socket.user?.id} left chat: ${chatId}`);
  });

  // 3. NEW MESSAGE: The core real-time feature
  socket.on(EVENTS.NEW_MESSAGE, async (data) => {
    try {
      const { chatId, content, messageType, mediaUrl } = data;

      // A. Call the "Brain" (Shared Logic) to save to DB
      const message = await sendMessageLogic({
        userId: socket.user.id,
        chatId,
        content,
        messageType,
        mediaUrl,
      });

      // B. Broadcast to everyone in the room (including sender's other tabs)
      // io.to(chatId) sends to everyone in that specific room
      io.to(chatId).emit(EVENTS.NEW_MESSAGE, message);

      // C. Handle Notifications (Optional but recommended)
      // We notify participants who might NOT be in the room right now
      const chat = await Chat.findById(chatId);
      chat.participants.forEach((participantId) => {
        if (participantId.toString() !== socket.user.id) {
          // Send a private notification to the specific user's room (their userId)
          io.to(participantId.toString()).emit(EVENTS.NOTIFICATION_RECEIVED, {
            type: "NEW_MESSAGE",
            chatId,
            message: content || "Sent a media file",
            sender: socket.user.name,
          });
        }
      });

    } catch (error) {
      console.error("Socket NEW_MESSAGE Error:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  // 4. TYPING INDICATOR (Extra polish for UX)
  socket.on("typing", ({ chatId }) => {
    // notify others in the room that this user is typing
    socket.to(chatId).emit("typing", { userId: socket.user.id, name: socket.user.name });
  });

  socket.on("stopTyping", ({ chatId }) => {
    socket.to(chatId).emit("stopTyping", { userId: socket.user.id });
  });
}
