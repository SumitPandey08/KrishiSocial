import express from "express";
import {
  createPost,
  getFeed,
  getPost,
  toggleLike,
  togglePostVote,
  deletePost,
  deleteComment,
  commentOnPost,
  getComments,
  getLikes,
  toggleCommentVote,
  markBestAnswer,
  verifyComment
} from "../controller/post.control.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/", protect, upload.array("media", 10), createPost); // up to 10 files
router.get("/feed", protect, getFeed);
router.get("/:id", protect, getPost);
router.post("/:id/like", protect, toggleLike);
router.patch("/:id/vote", protect, togglePostVote);
router.delete("/:id", protect, deletePost);

// Comments / Answers
router.post("/:id/comment", protect, commentOnPost);
router.get("/:id/comments", protect, getComments);
router.delete("/comment/:commentId", protect, deleteComment);
router.patch("/comment/:commentId/vote", protect, toggleCommentVote);
router.post("/comment/:commentId/best", protect, markBestAnswer);
router.post("/comment/:commentId/verify", protect, verifyComment);

// Likes
router.get("/:id/likes", protect, getLikes);

export default router;
