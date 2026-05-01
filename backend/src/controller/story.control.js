import Story from "../model/story.model.js";
import Follow from "../model/follow.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

/*
|--------------------------------------------------------------------------
| Create Story
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
      thumbnail: resourceType === "video" ? result.secure_url.replace(".mp4", ".jpg") : undefined,
    };

    const story = await Story.create({
      user: req.user.id,
      media,
      caption,
      privacy: privacy || "followers",
    });

    const populatedStory = await story.populate("user", "username profilePicture");

    res.status(201).json(populatedStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Get Feed Stories
|--------------------------------------------------------------------------
*/
export const getFeedStories = async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.user.id }).select("following");
    const followingIds = following.map((f) => f.following);
    
    followingIds.push(req.user.id);

    // Group stories by user and get active ones (expiresAt > now)
    const activeStories = await Story.find({
      user: { $in: followingIds },
      expiresAt: { $gt: new Date() }
    })
    .populate("user", "username profilePicture")
    .sort({ createdAt: 1 });

    // Format output like Instagram: Group by user
    const groupedStories = activeStories.reduce((acc, story) => {
      const userId = story.user._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: [],
        };
      }
      acc[userId].stories.push({
        _id: story._id,
        media: story.media,
        caption: story.caption,
        createdAt: story.createdAt,
      });
      return acc;
    }, {});

    res.json(Object.values(groupedStories));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Story
|--------------------------------------------------------------------------
*/
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this story" });
    }

    await story.deleteOne();

    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};