import express from "express";
import {
  createStory,
  getFeedStories,
  deleteStory,
} from "../controller/story.control.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/", protect, upload.single("media"), createStory);
router.get("/feed", protect, getFeedStories);
router.delete("/:id", protect, deleteStory);

export default router;
