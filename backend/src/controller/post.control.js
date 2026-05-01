import mongoose from "mongoose";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import Follow from "../model/follow.model.js";
import Comment from "../model/comment.model.js";
import Like from "../model/like.model.js";
import CommentLike from "../model/commentLike.model.js";
import Community from "../model/community.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

/*
|--------------------------------------------------------------------------
| Create Post
|--------------------------------------------------------------------------
*/
export const createPost = async (req, res) => {
  try {
    const { caption, location, privacy, postType, community } = req.body;
    let hashtags = [];

    if (caption) {
      const regex = /#\w+/g;
      const matches = caption.match(regex);
      if (matches) {
        hashtags = matches.map((tag) => tag.substring(1));
      }
    }

    if (postType === "update" && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ message: "Please provide media for the post" });
    }

    let media = [];
    if (req.files && req.files.length > 0) {
      const mediaPromises = req.files.map((file) => {
        const resourceType = file.mimetype.startsWith("video/") ? "video" : "image";
        return uploadToCloudinary(file.buffer, resourceType).then((result) => ({
          url: result.secure_url,
          type: resourceType,
          thumbnail: result.resource_type === "video" ? result.secure_url.replace(".mp4", ".jpg") : undefined,
          width: result.width,
          height: result.height,
          duration: result.duration,
        }));
      });
      media = await Promise.all(mediaPromises);
    }

    // Handle community lookup
    let communityId = undefined;
    if (community) {
      if (mongoose.Types.ObjectId.isValid(community)) {
        communityId = community;
      } else {
        // Find community by name, or create if doesn't exist (to keep app working smoothly)
        let foundCommunity = await Community.findOne({ name: community });
        if (!foundCommunity) {
          foundCommunity = await Community.create({
            name: community,
            creator: req.user.id,
            description: `Community for ${community}`
          });
        }
        communityId = foundCommunity._id;
      }
    }

    const post = await Post.create({
      user: req.user.id,
      media,
      caption,
      hashtags,
      location: location ? JSON.parse(location) : undefined,
      privacy: privacy || "public",
      postType: postType || "update",
      community: communityId,
    });

    await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: 1 } });

    const populatedPost = await post.populate("user", "name username profilePicture");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Get Feed (Smart Algorithm)
|--------------------------------------------------------------------------
*/
export const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const following = await Follow.find({ follower: req.user.id }).select("following");
    const followingIds = following.map((f) => f.following);

    const feedQuery = {
      isArchived: false,
      privacy: "public"
    };

    const posts = await Post.aggregate([
      { $match: feedQuery },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: "$author" },
      {
        $addFields: {
          priorityScore: {
            $add: [
              { $cond: [{ $in: ["$author._id", followingIds] }, 50, 0] },
              { $cond: [
                { $and: [
                  { $ne: ["$author.district", ""] },
                  { $eq: ["$author.district", user.district] }
                ]}, 30, 0] 
              },
              { $cond: [
                { $gt: [{ $size: { $setIntersection: ["$author.cropsGrown", user.cropsGrown] } }, 0] },
                25, 0]
              },
              { $cond: [{ $eq: ["$author.role", "expert"] }, 20, 0] },
              { $add: ["$likesCount", { $multiply: ["$commentsCount", 2] }] }
            ]
          },
          isLiked: false
        }
      },
      { $sort: { priorityScore: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          "author.password": 0,
          "author.refreshToken": 0,
          "author.email": 0
        }
      }
    ]);

    const postIds = posts.map(p => p._id);
    const likedPosts = await Like.find({ 
      user: req.user.id, 
      post: { $in: postIds } 
    }).select("post");
    
    const likedPostIds = likedPosts.map(l => l.post.toString());

    const finalPosts = posts.map(post => ({
      ...post,
      user: post.author,
      isLiked: likedPostIds.includes(post._id.toString())
    }));

    res.json(finalPosts);
  } catch (error) {
    console.error("Smart Feed Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Post
|--------------------------------------------------------------------------
*/
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name username profilePicture");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = await Like.exists({ user: req.user.id, post: post._id });

    post.viewsCount += 1;
    await post.save();

    res.json({
      ...post.toObject(),
      isLiked: !!isLiked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Like / Unlike Post
|--------------------------------------------------------------------------
*/
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const action = req.query.action || "like";

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (action === "like") {
      if (!existingLike) {
        await Like.create({ user: userId, post: postId });
      }
    } else {
      if (existingLike) {
        await existingLike.deleteOne();
      }
    }
    
    const totalLikes = await Like.countDocuments({ post: postId });
    post.likesCount = totalLikes;
    
    await post.save();
    res.json({ 
      message: `Post ${action}d successfully`, 
      likesCount: post.likesCount,
      isLiked: action === "like"
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Comment / Answer on Post
|--------------------------------------------------------------------------
*/
export const commentOnPost = async (req, res) => {
  try {
    const { comment: text } = req.body;
    const postId = req.params.id;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(req.user.id);

    const comment = await Comment.create({
      user: req.user.id,
      post: postId,
      text,
      isExpertVerified: user.role === "expert", // Auto-verify if an expert answers
    });

    post.commentsCount += 1;
    await post.save();

    await User.findByIdAndUpdate(req.user.id, { $inc: { helpScore: 5 } });

    const populatedComment = await comment.populate("user", "name username profilePicture role");

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Upvote / Downvote Answer (Comment)
|--------------------------------------------------------------------------
*/
export const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const action = req.query.action || "like";

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const existingLike = await CommentLike.findOne({ user: userId, comment: commentId });

    if (action === "like") {
      if (!existingLike) {
        await CommentLike.create({ user: userId, comment: commentId });
      }
    } else {
      if (existingLike) {
        await existingLike.deleteOne();
      }
    }
    
    const totalLikes = await CommentLike.countDocuments({ comment: commentId });
    comment.likesCount = totalLikes;
    
    await comment.save();
    res.json({ 
      message: `Comment ${action}d successfully`, 
      likesCount: comment.likesCount,
      isLiked: action === "like"
    });
  } catch (error) {
    console.error("Toggle comment like error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Mark Best Answer (Only Post Owner)
|--------------------------------------------------------------------------
*/
export const markBestAnswer = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId).populate("post");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the question asker can mark the best answer" });
    }

    // Unmark any existing best answer for this post
    await Comment.updateMany({ post: comment.post._id }, { isBestAnswer: false });

    comment.isBestAnswer = true;
    await comment.save();

    // Reward the user who gave the best answer
    await User.findByIdAndUpdate(comment.user, { $inc: { helpScore: 20 } });

    res.json({ message: "Marked as best answer", comment });
  } catch (error) {
    console.error("Mark best answer error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Expert Verification
|--------------------------------------------------------------------------
*/
export const verifyComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = await User.findById(req.user.id);

    if (user.role !== "expert") {
      return res.status(403).json({ message: "Only experts can verify answers" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.isExpertVerified = true;
    await comment.save();

    // Extra reward for getting verified by an expert
    await User.findByIdAndUpdate(comment.user, { $inc: { helpScore: 10 } });

    res.json({ message: "Comment verified by expert", comment });
  } catch (error) {
    console.error("Verify comment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Get Comments
|--------------------------------------------------------------------------
*/
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate("user", "name username profilePicture role")
      .sort({ isBestAnswer: -1, likesCount: -1, createdAt: -1 });

    // Check which comments are liked by current user
    const commentIds = comments.map(c => c._id);
    const likedComments = await CommentLike.find({
      user: req.user.id,
      comment: { $in: commentIds }
    }).select("comment");

    const likedCommentIds = likedComments.map(l => l.comment.toString());

    const commentsWithIsLiked = comments.map(c => ({
      ...c.toObject(),
      isLiked: likedCommentIds.includes(c._id.toString())
    }));

    res.json(commentsWithIsLiked);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Get Likes
|--------------------------------------------------------------------------
*/
export const getLikes = async (req, res) => {
  try {
    const likes = await Like.find({ post: req.params.id })
      .populate("user", "name username profilePicture")
      .sort({ createdAt: -1 });

    res.json(likes.map(l => l.user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Post
|--------------------------------------------------------------------------
*/
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: req.params.id });
    await Like.deleteMany({ post: req.params.id });

    await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: -1 } });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const toggleSave = async (req, res) => {
  try {
    // Implement save/unsave logic here, similar to toggleLike
    res.json({ message: "Toggle save not implemented yet" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });  
  }
};