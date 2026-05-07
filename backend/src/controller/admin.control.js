import User from "../model/user.model.js";
import Community from "../model/community.model.js";
import Post from "../model/post.model.js";

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalCommunities = await Community.countDocuments({ status: "approved" });
    const pendingCommunities = await Community.countDocuments({ status: "pending" });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalPosts,
        totalCommunities,
        pendingCommunities,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCommunityRequests = async (req, res) => {
  try {
    const requests = await Community.find({ status: "pending" })
      .populate("creator", "name username email profilePicture")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching community requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCommunityStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const community = await Community.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!community) {
      return res.status(404).json({ success: false, message: "Community not found" });
    }

    res.json({
      success: true,
      message: `Community request ${status}`,
      community,
    });
  } catch (error) {
    console.error("Error updating community status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ["farmer", "expert", "krishi_center", "government", "admin"];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
