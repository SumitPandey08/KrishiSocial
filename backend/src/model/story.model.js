import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    media: {
      url: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["image", "video"],
        required: true,
      },
      thumbnail: String, // useful for video preview
    },

    caption: {
      type: String,
      maxlength: 300,
    },

    viewers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: String,
        reactedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    privacy: {
      type: String,
      enum: ["public", "followers", "close_friends"],
      default: "followers",
    },

    isHighlight: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000,
      index: { expires: 0 }, // TTL index for auto delete
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);

export default Story;