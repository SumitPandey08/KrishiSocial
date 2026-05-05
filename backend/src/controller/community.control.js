import Community from "../model/community.model.js";

export const createCommunity = async (req, res) => {
  try {
    const { name, description, tags } = req.body;

    // Allowed to create (some auto-approved, some pending)
    const autoApproveRoles = ["expert", "krishi_center", "government", "admin"];
    const needsApprovalRoles = ["farmer"];
    
    let status = "pending";
    
    if (autoApproveRoles.includes(req.user.role)) {
      status = "approved";
    } else if (needsApprovalRoles.includes(req.user.role)) {
      if (!req.user.isVerified) {
        return res.status(403).json({ message: "Only verified farmers can request community creation" });
      }
      status = "pending";
    } else {
      return res.status(403).json({ message: "You are not authorized to create communities" });
    }
    
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }   

    const existing = await Community.findOne({ name });

    if (existing) {
      return res.status(400).json({ message: "Community already exists" });
    }

    const community = new Community({
      name,
      description,
      tags,
      creator: req.user.id,
      members: [req.user.id],
      status,
    });

    await community.save();

    res.status(201).json(community);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCommunities = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { status: status || "approved" };
    
    const communities = await Community.find(query).populate("creator", "name username profilePicture");
    res.json(communities);
    
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCommunity = async (req, res) => {
    try {
    const { id } = req.params;

    const community = await Community.findById(id)
      .populate("creator", "username name profilePicture")
      .populate("members", "username name profilePicture");

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json(community);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateCommunityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (!["admin", "expert"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admins and experts can approve communities" });
    }

    const community = await Community.findByIdAndUpdate(id, { status }, { new: true });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json({ message: `Community ${status} successfully`, community });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const joinCommunity = async (req, res) => {    
    try {
    const { id } = req.params;

    const community = await Community.findById(id);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.status !== "approved") {
      return res.status(403).json({ message: "Community is not yet approved" });
    }
    
    const isMember = community.members.some(memberId => memberId.toString() === req.user.id.toString());
    if (isMember) {
      return res.status(400).json({ message: "Already a member" });
    }
    
    community.members.push(req.user.id);
    await community.save();
    
    res.json({ message: "Joined successfully" });   
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const leaveCommunity = async (req, res) => {
    try {
    const { id } = req.params;

    const community = await Community.findById(id);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    const isMember = community.members.some(memberId => memberId.toString() === req.user.id.toString());
    if (!isMember) {
      return res.status(400).json({ message: "Not a member" });
    }
    
    community.members = community.members.filter(member => member.toString() !== req.user.id.toString());
    await community.save();
    
    res.json({ message: "Left successfully" });   
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};