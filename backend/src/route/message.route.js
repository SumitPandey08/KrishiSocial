import express from "express";
import {
  sendMessage,
  editMessage,
  deleteMessage,
  markAsRead,
} from "../controller/message.control.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", sendMessage);
router.put("/:messageId", editMessage);
router.delete("/:messageId", deleteMessage);
router.put("/chat/:chatId/read", markAsRead);

export default router;
