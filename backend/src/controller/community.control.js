import Community from "../model/community.model";

export const createCommunity = async (req, res) => {
  try {
    const { name, description, tags } = req.body;
    
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
    const communities = await Community.find();
    res.json(communities);
    
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCommunity = async (req, res) => {
    try {
    const { id } = req.params;

    const community = await Community.findById(id).populate("creator", "username name profilePicture");

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json(community);

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
    if (community.members.includes(req.user.id)) {
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
    if (!community.members.includes(req.user.id)) {
      return res.status(400).json({ message: "Not a member" });
    }
    
    community.members = community.members.filter(member => member.toString() !== req.user.id);
    await community.save();
    
    res.json({ message: "Left successfully" });   
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};