import mongoose from "mongoose";
import Story from "../model/story.model.js";
import Follow from "../model/follow.model.js";
import User from "../model/user.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

/*
|--------------------------------------------------------------------------
| 1️⃣ Create Story
|--------------------------------------------------------------------------
*/
export const createStory = async (req, res) => {
  try {
    const { caption, privacy } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please provide media for the story" });
    }

    const resourceType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    const result = await uploadToCloudinary(req.file.buffer, resourceType);

    const media = {
      url: result.secure_url,
      type: resourceType,
      thumbnail: resourceType === "video" ? result.secure_url.replace(/\.[^/.]+$/, ".jpg") : undefined,
    };

    const story = await Story.create({
      user: req.user.id,
      media,
      caption: caption || "",
      privacy: privacy || "followers",
    });

    const populatedStory = await story.populate("user", "name username profilePicture isVerified");

    res.status(201).json(populatedStory);
  } catch (error) {
    console.error("Create Story Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 2️⃣ Get Feed Stories (Home Feed Story Tray)
|--------------------------------------------------------------------------
| Aggregates active stories from followed users and logged-in user.
| Grouped by user, sorted so own stories are first, followed by accounts
| with unread/unseen stories, and finally all-viewed accounts.
*/
export const getFeedStories = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // 1. Get IDs of users followed by the current user
    const following = await Follow.find({ follower: currentUserId }).select("following");
    const followingIds = following.map((f) => f.following);

    // Include the current user's own stories in the feed tray
    const allUserIds = [...followingIds, currentUserId];

    const now = new Date();

    // 2. Fetch active stories from these users (sorted chronologically for reel playback)
    const activeStories = await Story.find({
      user: { $in: allUserIds },
      expiresAt: { $gt: now },
    })
      .populate("user", "name username profilePicture isVerified")
      .sort({ createdAt: 1 });

    // 3. Group stories by user and format for the story tray
    const groupedMap = new Map();

    for (const story of activeStories) {
      if (!story.user) continue;

      const userIdStr = story.user._id.toString();
      const isOwnStory = userIdStr === currentUserId;

      const isViewedByMe = story.viewers.some(
        (viewer) => viewer.user && viewer.user.toString() === currentUserId
      );

      const myReaction = story.reactions.find(
        (r) => r.user && r.user.toString() === currentUserId
      )?.emoji || null;

      if (!groupedMap.has(userIdStr)) {
        groupedMap.set(userIdStr, {
          user: story.user,
          isOwnStory,
          hasUnseen: false,
          latestStoryCreatedAt: story.createdAt,
          stories: [],
        });
      }

      const userGroup = groupedMap.get(userIdStr);

      // Track if there is any unviewed story for followed users
      if (!isViewedByMe && !isOwnStory) {
        userGroup.hasUnseen = true;
      }

      if (new Date(story.createdAt) > new Date(userGroup.latestStoryCreatedAt)) {
        userGroup.latestStoryCreatedAt = story.createdAt;
      }

      // Format story item (mask other viewers' personal info for privacy in feed)
      userGroup.stories.push({
        _id: story._id,
        media: story.media,
        caption: story.caption,
        privacy: story.privacy,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        isViewed: isViewedByMe,
        viewsCount: story.viewers.length,
        reactionsCount: story.reactions.length,
        myReaction,
      });
    }

    const groupedArray = Array.from(groupedMap.values());

    // 4. Sort story tray:
    // - Own story group comes first
    // - Followed users with unseen stories next (newest story first)
    // - Followed users where all stories are viewed last (newest story first)
    groupedArray.sort((a, b) => {
      if (a.isOwnStory) return -1;
      if (b.isOwnStory) return 1;

      if (a.hasUnseen && !b.hasUnseen) return -1;
      if (!a.hasUnseen && b.hasUnseen) return 1;

      return new Date(b.latestStoryCreatedAt) - new Date(a.latestStoryCreatedAt);
    });

    res.json(groupedArray);
  } catch (error) {
    console.error("Get Feed Stories Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 3️⃣ Get Stories By User ID (Profile Stories / User Tray)
|--------------------------------------------------------------------------
| Fetches all active stories for a specific user.
| - If owner: includes full viewer history and reactions list.
| - If follower / other: enforces privacy checks and returns sanitized view stats.
*/
export const getStoriesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const targetUser = await User.findById(userId).select(
      "name username profilePicture accountType isVerified"
    );
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOwnStory = targetUser._id.toString() === currentUserId;
    let isFollowing = false;

    if (!isOwnStory) {
      isFollowing = await Follow.exists({
        follower: currentUserId,
        following: targetUser._id,
      });

      if (targetUser.accountType === "private" && !isFollowing) {
        return res.status(403).json({
          message: "This account is private. Follow this user to see their stories.",
        });
      }
    }

    const now = new Date();
    const query = {
      user: targetUser._id,
      expiresAt: { $gt: now },
    };

    // If viewing someone else without following (on public account), only show public stories
    if (!isOwnStory && !isFollowing) {
      query.privacy = "public";
    }

    let storiesQuery = Story.find(query).sort({ createdAt: 1 });

    if (isOwnStory) {
      // Owner sees who viewed their stories and reactions
      storiesQuery = storiesQuery
        .populate("viewers.user", "name username profilePicture isVerified")
        .populate("reactions.user", "name username profilePicture");
    }

    const stories = await storiesQuery;

    let hasUnseen = false;
    const formattedStories = stories.map((story) => {
      const isViewedByMe = story.viewers.some((v) => {
        const viewerId = v.user?._id ? v.user._id.toString() : v.user?.toString();
        return viewerId === currentUserId;
      });

      const myReaction = story.reactions.find((r) => {
        const reactorId = r.user?._id ? r.user._id.toString() : r.user?.toString();
        return reactorId === currentUserId;
      })?.emoji || null;

      if (!isViewedByMe && !isOwnStory) {
        hasUnseen = true;
      }

      if (isOwnStory) {
        return {
          _id: story._id,
          media: story.media,
          caption: story.caption,
          privacy: story.privacy,
          viewers: story.viewers,
          viewsCount: story.viewers.length,
          reactions: story.reactions,
          reactionsCount: story.reactions.length,
          createdAt: story.createdAt,
          expiresAt: story.expiresAt,
          isViewed: true,
          myReaction,
        };
      } else {
        return {
          _id: story._id,
          media: story.media,
          caption: story.caption,
          privacy: story.privacy,
          viewsCount: story.viewers.length,
          reactionsCount: story.reactions.length,
          createdAt: story.createdAt,
          expiresAt: story.expiresAt,
          isViewed: isViewedByMe,
          myReaction,
        };
      }
    });

    res.json({
      user: targetUser,
      isOwnStory,
      hasUnseen,
      stories: formattedStories,
    });
  } catch (error) {
    console.error("Get Stories By User ID Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 4️⃣ Get Single Story By Story ID (Direct Link / Single Story View)
|--------------------------------------------------------------------------
| Fetches a single story document by its story ID.
| - Enforces privacy rules and expiration checks.
| - Populates viewer & reaction details for the owner.
*/
export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid story ID" });
    }

    const story = await Story.findById(id).populate(
      "user",
      "name username profilePicture accountType isVerified"
    );

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const isOwner = story.user._id.toString() === currentUserId;

    // Expired check
    if (!isOwner && story.expiresAt <= new Date()) {
      return res.status(410).json({ message: "This story has expired" });
    }

    // Privacy checks for non-owners
    if (!isOwner) {
      const isFollowing = await Follow.exists({
        follower: currentUserId,
        following: story.user._id,
      });

      if (story.privacy === "followers" && !isFollowing) {
        return res.status(403).json({ message: "You must follow this user to view this story" });
      }

      if (story.user.accountType === "private" && !isFollowing) {
        return res.status(403).json({ message: "This story is from a private account" });
      }
    }

    const isViewedByMe = story.viewers.some((v) => {
      const viewerId = v.user?._id ? v.user._id.toString() : v.user?.toString();
      return viewerId === currentUserId;
    });

    const myReaction = story.reactions.find((r) => {
      const reactorId = r.user?._id ? r.user._id.toString() : r.user?.toString();
      return reactorId === currentUserId;
    })?.emoji || null;

    if (isOwner) {
      await story.populate("viewers.user", "name username profilePicture isVerified");
      await story.populate("reactions.user", "name username profilePicture");

      return res.json({
        _id: story._id,
        user: story.user,
        media: story.media,
        caption: story.caption,
        privacy: story.privacy,
        viewers: story.viewers,
        viewsCount: story.viewers.length,
        reactions: story.reactions,
        reactionsCount: story.reactions.length,
        isHighlight: story.isHighlight,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        isOwnStory: true,
        isViewed: true,
        myReaction,
      });
    }

    res.json({
      _id: story._id,
      user: story.user,
      media: story.media,
      caption: story.caption,
      privacy: story.privacy,
      viewsCount: story.viewers.length,
      reactionsCount: story.reactions.length,
      isHighlight: story.isHighlight,
      createdAt: story.createdAt,
      expiresAt: story.expiresAt,
      isOwnStory: false,
      isViewed: isViewedByMe,
      myReaction,
    });
  } catch (error) {
    console.error("Get Story By ID Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 5️⃣ Mark Story As Viewed
|--------------------------------------------------------------------------
| Records the current user in the story's viewers list (if not already recorded).
*/
export const markStoryAsViewed = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid story ID" });
    }

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.expiresAt <= new Date()) {
      return res.status(410).json({ message: "Story has expired" });
    }

    const isOwner = story.user.toString() === currentUserId;
    const alreadyViewed = story.viewers.some(
      (v) => v.user && v.user.toString() === currentUserId
    );

    if (!alreadyViewed && !isOwner) {
      story.viewers.push({
        user: currentUserId,
        viewedAt: new Date(),
      });
      await story.save();
    }

    res.json({
      message: "Story marked as viewed",
      isViewed: true,
      viewsCount: story.viewers.length,
    });
  } catch (error) {
    console.error("Mark Story As Viewed Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 6️⃣ React To Story
|--------------------------------------------------------------------------
| Add, update, or remove an emoji reaction on a story.
*/
export const reactToStory = async (req, res) => {
  try {
    const storyId = req.params.id || req.body.storyId;
    const { emoji } = req.body;
    const currentUserId = req.user.id;

    if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ message: "Invalid story ID" });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.expiresAt <= new Date()) {
      return res.status(410).json({ message: "Story has expired" });
    }

    const existingReactionIndex = story.reactions.findIndex(
      (reaction) => reaction.user && reaction.user.toString() === currentUserId
    );

    if (!emoji) {
      // Remove reaction if empty
      if (existingReactionIndex !== -1) {
        story.reactions.splice(existingReactionIndex, 1);
      }
    } else if (existingReactionIndex !== -1) {
      // Update existing reaction
      story.reactions[existingReactionIndex].emoji = emoji;
      story.reactions[existingReactionIndex].reactedAt = new Date();
    } else {
      // Add new reaction
      story.reactions.push({ user: currentUserId, emoji, reactedAt: new Date() });
    }

    await story.save();

    res.json({
      message: emoji ? "Reaction updated successfully" : "Reaction removed successfully",
      myReaction: emoji || null,
      reactionsCount: story.reactions.length,
    });
  } catch (error) {
    console.error("React To Story Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 7️⃣ Delete Story
|--------------------------------------------------------------------------
*/
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid story ID" });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this story" });
    }

    if (story.media?.url) {
      try {
        const publicId = story.media.url.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    await story.deleteOne();

    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Delete Story Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
