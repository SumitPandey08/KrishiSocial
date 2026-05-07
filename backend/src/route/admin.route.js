import express from "express";
import { protect, checkAdmin } from "../middleware/auth.middleware.js";
import {
  getStats,
  getCommunityRequests,
  updateCommunityStatus,
  getUsers,
  updateUserRole,
} from "../controller/admin.control.js";

const router = express.Router();

router.use(protect);
router.use(checkAdmin);

router.get("/stats", getStats);
router.get("/community-requests", getCommunityRequests);
router.patch("/community-status/:id", updateCommunityStatus);
router.get("/users", getUsers);
router.patch("/user-role/:id", updateUserRole);

export default router;
