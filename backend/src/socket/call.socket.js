import { EVENTS } from "../utils/event.constants.js";
import { callLogic, toggleParticipateLogic } from "../controller/call.control.js";

export default function registerCallHandlers(io, socket) {
  socket.on(EVENTS.INITIATE_CALL, async (data) => {
    try {
      const { initiaterId, initiatorId, chatId, callType, peerId, callId } = data || {};
      const callerId = initiatorId || initiaterId || socket.user?.id;
      
      let callData;
      if (callId) {
        callData = { callId, chatId };
      } else {
        callData = await callLogic(callerId, chatId, callType);
      }

      if (callData.isBusy) {
        socket.emit(EVENTS.CALL_BUSY, {
          isBusy: true,
          reason: callData.reason,
          message: callData.message,
          chatId,
          callId: callData.callId,
        });
        return;
      }
      
      const payload = {
        ...callData,
        peerId,
        remotePeerId: peerId,
        initiatorPeerId: peerId,
      };

      io.to(chatId).emit(EVENTS.CALL_INITIATED, payload);

      if (callData.receiverId) {
        io.to(callData.receiverId).emit(EVENTS.CALL_INITIATED, payload);
      }
    } catch (error) {
      console.error("Socket INITIATE_CALL Error:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on(EVENTS.TOGGLE_PARTICIPATE, async (data) => {
    try {
      const { callId, userId, action } = data || {};
      const activeUserId = userId || socket.user?.id;
      const result = await toggleParticipateLogic(callId, activeUserId, action);
      io.to(result.chatId).emit(EVENTS.CALL_STATUS_UPDATED, result);
    } catch (error) {
      console.error("Socket TOGGLE_PARTICIPATE Error:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on(EVENTS.CALL_ENDED, async (data) => {
    try {
      const { chatId, callId, userId } = data || {};
      const activeUserId = userId || socket.user?.id;
      if (callId) {
        try {
          await toggleParticipateLogic(callId, activeUserId, "end");
        } catch (err) {
          console.warn("Could not mark call as ended in DB:", err.message);
        }
        const roomId = `call_${callId}`;
        io.to(roomId).emit(EVENTS.CALL_ENDED, { callId, chatId });
      }
      if (chatId) {
        io.to(chatId).emit(EVENTS.CALL_ENDED, { callId, chatId });
      }
    } catch (error) {
      console.error("Socket CALL_ENDED Error:", error.message);
    }
  });

  socket.on(EVENTS.JOIN_CALL, (data) => {
    try {
      const { callId, userId, peerId } = data || {};
      if (!callId) return;
      const roomId = `call_${callId}`;
      socket.join(roomId);
      console.log(`Socket user ${userId || socket.user?.id} joined call room ${roomId} with peerId ${peerId}`);

      // Broadcast to other participant in the call room
      socket.to(roomId).emit(EVENTS.USER_JOINED_CALL, {
        userId: userId || socket.user?.id,
        peerId,
        callId,
      });
    } catch (error) {
      console.error("Socket JOIN_CALL Error:", error.message);
    }
  });

  socket.on(EVENTS.USER_JOINED_CALL, (data) => {
    try {
      const { callId, userId, peerId } = data || {};
      if (!callId) return;
      const roomId = `call_${callId}`;
      socket.to(roomId).emit(EVENTS.USER_JOINED_CALL, {
        userId: userId || socket.user?.id,
        peerId,
        callId,
      });
    } catch (error) {
      console.error("Socket USER_JOINED_CALL relay error:", error.message);
    }
  });

  socket.on(EVENTS.LEAVE_CALL, (data) => {
    try {
      const { callId, userId, peerId } = data || {};
      if (!callId) return;
      const roomId = `call_${callId}`;
      socket.leave(roomId);
      socket.to(roomId).emit(EVENTS.USER_LEFT_CALL, {
        userId: userId || socket.user?.id,
        peerId,
        callId,
      });
    } catch (error) {
      console.error("Socket LEAVE_CALL Error:", error.message);
    }
  });
}



