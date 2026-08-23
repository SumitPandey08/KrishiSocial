import User from "../model/user.model.js";
import Follow from "../model/follow.model.js";
import Post from "../model/post.model.js";
import { getCache, setCache, deleteCache } from "../utils/redisCache.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

/*
|--------------------------------------------------------------------------
| 1️⃣ Get Logged In User Profile (/api/users/me)
|--------------------------------------------------------------------------
*/
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `user:me:${userId}`;

    // Check user-specific private cache first
    const cachedUser = await getCache(cacheKey);
    if (cachedUser) {
      return res.json(cachedUser);
    }

    const user = await User.findById(userId).select(
      "name username bio website profilePicture followersCount followingCount postsCount accountType isVerified createdAt village district state farmSize cropsGrown farmingType role email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cache private profile for 30 minutes
    await setCache(cacheKey, user, 1800);

    res.json(user);
  } catch (error) {
    console.error("Get My Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 2️⃣ Get Public Profile (by username)
|--------------------------------------------------------------------------
| Caches public profile data (user info + posts) while dynamically checking 
| viewer-specific `isFollowing` state to prevent cross-user data leakage.
*/
export const getUserProfile = async (req, res) => {
  try {
    const rawUsername = req.params.username;
    if (!rawUsername) {
      return res.status(400).json({ message: "Username is required" });
    }

    const username = rawUsername.toLowerCase().trim();
    const cacheKey = `user:profile:${username}`;

    let profileData = await getCache(cacheKey);

    if (!profileData) {
      const user = await User.findOne({ username }).select(
        "name username bio website profilePicture followersCount followingCount postsCount accountType isVerified createdAt village district state farmSize cropsGrown farmingType role"
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let posts = [];
      if (user.accountType === "public") {
        posts = await Post.find({ user: user._id, privacy: "public" })
          .sort({ createdAt: -1 })
          .limit(12)
          .select("media likesCount commentsCount createdAt postType caption");
      }

      profileData = {
        ...user.toObject(),
        posts,
      };

      // Cache public profile base data for 1 hour
      await setCache(cacheKey, profileData, 3600);
    }

    // Dynamically evaluate `isFollowing` for the current authenticated viewer
    let isFollowing = false;
    if (req.user && profileData._id) {
      const isOwnProfile = req.user.id === profileData._id.toString();
      if (!isOwnProfile) {
        isFollowing = await Follow.exists({
          follower: req.user.id,
          following: profileData._id,
        });
      }
    }

    res.json({
      ...profileData,
      isFollowing: Boolean(isFollowing),
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 3️⃣ Update Profile (/api/users/me)
|--------------------------------------------------------------------------
*/
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = [
      "name", "bio", "website", "profilePicture", "accountType", 
      "village", "district", "state", "farmSize", "cropsGrown", "farmingType"
    ];
    const filteredUpdates = {};

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      filteredUpdates,
      { new: true }
    ).select("name username bio website profilePicture accountType village district state farmSize cropsGrown farmingType role email followersCount followingCount postsCount");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Invalidate caches
    await deleteCache(
      `user:me:${req.user.id}`,
      `user:profile:${user.username.toLowerCase()}`
    );

    res.json(user);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 4️⃣ Update Profile Picture (/api/users/me/picture)
|--------------------------------------------------------------------------
*/
export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "image");
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: result.secure_url },
      { new: true }
    ).select("name username profilePicture followersCount followingCount postsCount role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Invalidate caches
    await deleteCache(
      `user:me:${req.user.id}`,
      `user:profile:${user.username.toLowerCase()}`
    );

    res.json(user);
  } catch (error) {
    console.error("Update Profile Picture Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 5️⃣ Toggle Follow User (/api/users/:userId/toggle-follow)
|--------------------------------------------------------------------------
*/
export const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(userId).select("username");
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: userId,
    });

    let isFollowing = false;

    if (existingFollow) {
      // Unfollow
      await existingFollow.deleteOne();
      await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });
      await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } });
      isFollowing = false;
    } else {
      // Follow
      await Follow.create({
        follower: currentUserId,
        following: userId,
      });
      await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });
      await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } });
      isFollowing = true;
    }

    // Invalidate cached profile data for target and current user
    await deleteCache(
      `user:me:${currentUserId}`,
      `user:me:${userId}`,
      `user:profile:${targetUser.username.toLowerCase()}`,
      `user:profile:${req.user.username?.toLowerCase()}`
    );

    const updatedTargetUser = await User.findById(userId).select("followersCount followingCount");

    res.json({
      message: isFollowing ? "Followed successfully" : "Unfollowed successfully",
      isFollowing,
      followersCount: updatedTargetUser?.followersCount ?? 0,
    });
  } catch (error) {
    console.error("Toggle Follow Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 6️⃣ Get Followers
|--------------------------------------------------------------------------
*/
export const getFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId })
      .populate("follower", "username name profilePicture role isVerified")
      .select("follower");

    res.json(followers.map(f => f.follower).filter(Boolean));
  } catch (error) {
    console.error("Get Followers Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 7️⃣ Get Following
|--------------------------------------------------------------------------
*/
export const getFollowing = async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.userId })
      .populate("following", "username name profilePicture role isVerified")
      .select("following");

    res.json(following.map(f => f.following).filter(Boolean));
  } catch (error) {
    console.error("Get Following Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 8️⃣ Search Users
|--------------------------------------------------------------------------
*/
export const searchUsers = async (req, res) => {
  try {
    const query = (req.query.q || req.query.query || "").trim();

    if (!query) {
      return res.json([]);
    }

    const cacheKey = `user:search:${query.toLowerCase()}`;
    const cachedResults = await getCache(cacheKey);
    if (cachedResults) {
      return res.json(cachedResults);
    }

    // Use regex for partial matches on username and name
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
      accessibility: "active",
    })
      .limit(20)
      .select("username name profilePicture isVerified followersCount role");

    // Cache frequent search queries for 5 minutes
    await setCache(cacheKey, users, 300);

    res.json(users);
  } catch (error) {
    console.error("Search Users Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 9️⃣ Deactivate Account
|--------------------------------------------------------------------------
*/
export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { accessibility: "deactivated" },
      { new: true }
    );

    if (user) {
      await deleteCache(
        `user:me:${req.user.id}`,
        `user:profile:${user.username.toLowerCase()}`
      );
    }

    res.json({ message: "Account deactivated" });
  } catch (error) {
    console.error("Deactivate Account Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};