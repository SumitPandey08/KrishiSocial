import mongoose from "mongoose";

const advisorySchema = new mongoose.Schema({
  text: { type: String, required: true },
  metadata: {
    source: String,
    page: Number,
    topic: String,
    crop: String
  },
  embedding: {
    type: [Number],
    required: true
  }
}, { timestamps: true });

const Advisory = mongoose.model("Advisory", advisorySchema);

export default Advisory;
