import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      index: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      index: true,
    },
    type: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  { timestamps: true }
);

// One vote per user per post (only applies when post is an ObjectId, ignoring comments/nulls)
voteSchema.index(
  { user: 1, post: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { post: { $type: "objectId" } } 
  }
);

// One vote per user per comment (only applies when comment is an ObjectId, ignoring posts/nulls)
voteSchema.index(
  { user: 1, comment: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { comment: { $type: "objectId" } } 
  }
);

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
