import express from "express";
import {
  createChat,
  getUserChats,
  addParticipant,
  removeParticipant,
  deleteChat,
  getChatMessages,
  exitChat,
} from "../controller/chat.control.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createChat);
router.get("/", getUserChats);
router.put("/:chatId/add", addParticipant);
router.put("/:chatId/remove", removeParticipant);
router.delete("/:chatId", deleteChat);
router.get("/:chatId/messages", getChatMessages);
router.put("/:chatId/exit", exitChat);

export default router;
