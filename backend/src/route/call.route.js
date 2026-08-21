import express from "express";
import {
    initiateCall,
    toggleParticipate,
    getCallHistory,
    getCallDetails,
    getUserActiveCall,
} from "../controller/call.control.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/initiate", protect, initiateCall);
router.post("/toggle-participate", protect, toggleParticipate);
router.get("/active/:userId", protect, getUserActiveCall);
router.get("/history/:chatId", protect, getCallHistory);
router.get("/details/:callId", protect, getCallDetails);

export default router;