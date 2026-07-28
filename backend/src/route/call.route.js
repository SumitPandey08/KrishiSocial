import express from "express";
import {
    initiateCall,
    toggleParticipate,
    getCallHistory,
} from "../controller/call.control.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/initiate", protect, initiateCall);
router.post("/toggle-participate", protect, toggleParticipate);
router.get("/history/:chatId", protect, getCallHistory);

export default router;