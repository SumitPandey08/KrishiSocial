import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    callType: {
      type: String,
      enum: ["video", "audio"],
      required: true,
    },
    isCameraOn: {
      type: Boolean,
      default: function () {
        // Automatically default camera to false if it's an audio call
        return this.callType === "video";
      },
    },
    isMicrophoneOn: {
      type: Boolean,
      default: true,
    },
    initiator: { // initiator is the user who started the call
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Speeds up queries for user call history
    },
    participants: { // contains all users involved in the call, including the initiator
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      validate: [arrayMinLength, "A call must have at least one participant."],
    },
    callStatus: {
      type: String,
      enum: ["initiated", "ringing", "accepted", "rejected", "ended", "missed"],
      default: "initiated",
      index: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true, // Speeds up loading call logs inside a specific chat
    },
    // Production Ready: Advanced Call Tracking
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0,
    },
  },
  { timestamps: true }
);

// Custom validator for participants array
function arrayMinLength(val) {
  return val.length > 0;
}

// Pre-save middleware to calculate duration automatically when call ends
callSchema.pre("save", function (next) {
  if (this.isModified("callStatus") && this.callStatus === "ended") {
    this.endedAt = new Date();
    if (this.startedAt) {
      this.duration = Math.round((this.endedAt - this.startedAt) / 1000);
    }
  }
  next();
});

const Call = mongoose.model("Call", callSchema);

export default Call;
