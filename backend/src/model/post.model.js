import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    postType: {
      type: String,
      enum: ["update", "question", "community"],
      default: "update",
      index: true,
    },

    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      index: true,
    },

    media: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["image", "video", "voice"],
          required: true,
        },
        thumbnail: String,
        width: Number,
        height: Number,
        duration: Number, // for videos and voice
      },
    ],

    caption: {
      type: String,
      maxlength: 2200,
    },

    hashtags: [
      {
        type: String,
        index: true,
      },
    ],

    tags: [
      {
        type: String, // e.g. "disease", "pest", "wheat"
        index: true,
      }
    ],

    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    location: {
      name: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    isExpertVerified: {
      type: Boolean,
      default: false,
    },

    // 🔥 IMPORTANT: store only counts
    likesCount: {
      type: Number,
      default: 0,
      index: true,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    savesCount: {
      type: Number,
      default: 0,
    },

    sharesCount: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    privacy: {
      type: String,
      enum: ["public", "private", "followers", "close_friends"],
      default: "public",
      index: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);


// 🔥 Important indexes for feed & explore
postSchema.index({ createdAt: -1 });
postSchema.index({ likesCount: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ tags: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;