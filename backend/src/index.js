import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";


// Routes
import authRoutes from "./route/auth.route.js";
import userRoutes from "./route/user.route.js";
import postRoutes from "./route/post.route.js";
import storyRoutes from "./route/story.route.js";
import farmerRoutes from "./route/farmer.route.js";
import agentRoutes from "./route/agent.route.js";
import communityRoutes from "./route/community.route.js";
import adminRoutes from "./route/admin.route.js";
import chatRoutes from "./route/chat.route.js";
import messageRoutes from "./route/message.route.js";

// Socket
import { initSocket } from "./config/socket.js";

import { loadDataset } from "./services/datasetLoader.js";

await loadDataset();

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method !== 'GET') console.log('Body:', req.body);
  next();
});

// Setup API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

initSocket(server);
