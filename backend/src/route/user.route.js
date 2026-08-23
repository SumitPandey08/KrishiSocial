import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  updateProfilePicture,
  toggleFollow,
  getFollowers,
  getFollowing,
  searchUsers,
  deactivateAccount,
} from "../controller/user.control.js";
import { protect, optionalAuth } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Specific Routes (Must be declared BEFORE dynamic /:username wildcard)
|--------------------------------------------------------------------------
*/

// 1. Search Users
router.get("/search", searchUsers);

// 2. Logged-in User Profile Routes
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateProfile);
router.put("/me/picture", protect, upload.single("profilePicture"), updateProfilePicture);
router.delete("/me/deactivate", protect, deactivateAccount);

// 3. User Follow Relationships
router.post("/:userId/toggle-follow", protect, toggleFollow);
router.get("/:userId/followers", protect, getFollowers);
router.get("/:userId/following", protect, getFollowing);

/*
|--------------------------------------------------------------------------
| Dynamic Parameterized Routes (Declared LAST)
|--------------------------------------------------------------------------
*/
// 4. Public User Profile by Username (Uses optionalAuth for viewer follower check + Redis cache)
router.get("/:username", optionalAuth, getUserProfile);

export default router;
