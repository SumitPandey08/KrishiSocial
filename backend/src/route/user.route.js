import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  toggleFollow,
  getFollowers,
  getFollowing,
  searchUsers,
  deactivateAccount,
} from "../controller/user.control.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import User from "../model/user.model.js";

const router = express.Router();

// Public routes
router.get("/:username", getUserProfile);
router.get("/search", searchUsers);

// Protected routes
router.use(protect);

router.get("/me", getMyProfile);
router.put("/me", protect, updateProfile);
router.delete("/me/deactivate", protect, deactivateAccount);

// Picture upload route explicitly
router.put("/me/picture", protect, upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }
    const result = await uploadToCloudinary(req.file.buffer, "image");
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: result.secure_url },
      { new: true }
    ).select("name username profilePicture");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:userId/toggle-follow", protect, toggleFollow);
// router.post("/:userId/follow", protect, followUser);
// router.post("/:userId/unfollow", protect, unfollowUser);
router.get("/:userId/followers", protect, getFollowers);
router.get("/:userId/following", protect, getFollowing);

export default router;
