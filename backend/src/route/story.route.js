import express from "express";
import {
  createStory,
  getFeedStories,
  getStoriesByUserId,
  getStoryById,
  markStoryAsViewed,
  reactToStory,
  deleteStory,
} from "../controller/story.control.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Story creation
router.post("/", protect, upload.single("media"), createStory);

// Home feed story tray (followed users + current user, grouped & ordered)
router.get("/feed", protect, getFeedStories);

// Active stories for a specific user profile
router.get("/user/:userId", protect, getStoriesByUserId);

// Single story details by story ID
router.get("/:id", protect, getStoryById);

// Mark a story as viewed
router.post("/:id/view", protect, markStoryAsViewed);

// React to a story (both /:id/react and /react for flexible client consumption)
router.post("/:id/react", protect, reactToStory);
router.post("/react", protect, reactToStory);

// Delete story by story ID
router.delete("/:id", protect, deleteStory);

export default router;
