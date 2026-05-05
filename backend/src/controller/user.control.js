import User from "../model/user.model.js";
import Follow from "../model/follow.model.js";
import Post from "../model/post.model.js";

/*
|--------------------------------------------------------------------------
| 1️⃣ Get Logged In User Profile
|--------------------------------------------------------------------------
*/
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name username bio website profilePicture followersCount followingCount postsCount accountType isVerified createdAt village district state farmSize cropsGrown farmingType role"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 2️⃣ Get Public Profile (by username)
|--------------------------------------------------------------------------
*/
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username.toLowerCase() }).select(
      "name username bio website profilePicture followersCount followingCount postsCount accountType isVerified createdAt village district state farmSize cropsGrown farmingType role"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let isFollowing = false;
    if (req.user) {
      isFollowing = await Follow.exists({
        follower: req.user.id,
        following: user._id,
      });
    }

    let posts = [];

    if (user.accountType === "public" || isFollowing || (req.user && req.user.id === user._id.toString())) {
      posts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .limit(12)
        .select("media likesCount commentsCount createdAt postType caption");
    }

    res.json({
      ...user.toObject(),
      posts,
      isFollowing: !!isFollowing,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 3️⃣ Update Profile
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
    ).select("name username bio website profilePicture accountType village district state farmSize cropsGrown farmingType role");

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 4️⃣ Toggle Follow User
|--------------------------------------------------------------------------
*/
export const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existingFollow = await Follow.findOne({
      follower: req.user.id,
      following: userId,
    });

    if (existingFollow) {
      // Unfollow
      await existingFollow.deleteOne();
      await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });
      await User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: -1 } });
      return res.json({ message: "Unfollowed successfully", isFollowing: false });
    } else {
      // Follow
      await Follow.create({
        follower: req.user.id,
        following: userId,
      });
      await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });
      await User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: 1 } });
      return res.json({ message: "Followed successfully", isFollowing: true });
    }
  } catch (error) {
    console.error("Toggle Follow Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 5️⃣ Get Followers
|--------------------------------------------------------------------------
*/
export const getFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId })
      .populate("follower", "username profilePicture role")
      .select("follower");

    res.json(followers.map(f => f.follower));

  } catch (error) {
    console.error(error);
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
      .populate("following", "username profilePicture role")
      .select("following");

    res.json(following.map(f => f.following));

  } catch (error) {
    console.error(error);
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
    const query = req.query.q || req.query.query;

    if (!query) {
      return res.json([]);
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
    await User.findByIdAndUpdate(req.user.id, {
      accessibility: "deactivated",
    });

    res.json({ message: "Account deactivated" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};