import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Synchronize Vote indexes to drop legacy unique index on null comment/post fields
    try {
      const Vote = (await import("../model/vote.model.js")).default;
      await Vote.syncIndexes();
      console.log("Vote indexes synchronized successfully");
    } catch (idxErr) {
      console.log("Vote index sync notice:", idxErr.message);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
