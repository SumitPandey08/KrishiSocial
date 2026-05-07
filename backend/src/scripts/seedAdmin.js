import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../model/user.model.js";
import connectDB from "../config/database.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@krishi.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = new User({
      name: "Krishi Admin",
      username: "admin",
      email: adminEmail,
      password: "123456",
      role: "admin",
      isVerified: true,
    });

    await admin.save();
    console.log("Admin seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
