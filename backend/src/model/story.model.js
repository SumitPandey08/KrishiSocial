import mongoose from "mongoose";
import { deleteFromCloudinary } from "../utils/cloudinary.js";


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
      default: "public",
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

//function that run when story expires to delete the story and its media from cloudinary
storySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // await deleteFromCloudinary(doc.media.url);
    const publicId = doc.media.url.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }
});

const Story = mongoose.model("Story", storySchema);

export default Story;