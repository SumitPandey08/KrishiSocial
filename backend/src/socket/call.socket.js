import { EVENTS } from "../utils/event.constants.js";
import { callLogic, toggleParticipateLogic } from "../controller/call.control.js";

export default function registerCallHandlers(io, socket) {
  socket.on(EVENTS.INITIATE_CALL, async (data) => {
    try {
      const { initiaterId, chatId, callType } = data;
      const callData = await callLogic(initiaterId, chatId, callType);
      io.to(chatId).emit(EVENTS.CALL_INITIATED, callData);
    } catch (error) {
      console.error("Socket INITIATE_CALL Error:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on(EVENTS.TOGGLE_PARTICIPATE, async (data) => {
    try {
      const { callId, userId, action } = data;
      const result = await toggleParticipateLogic(callId, userId, action);
      io.to(result.chatId).emit(EVENTS.CALL_STATUS_UPDATED, result);
    } catch (error) {
      console.error("Socket TOGGLE_PARTICIPATE Error:", error.message);
      socket.emit("error", { message: error.message });
    }
  });
}


