import { cropAgent } from "../agents/cropRecommendation.js";

export const getCropRecommendation = async (req, res) => {

  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  try {
    const result = await cropAgent(location);
    res.json(result);
  } catch (error) {
    console.error("Error in crop recommendation:", error);
    res.status(500).json({ error: "Failed to get crop recommendation" });
  }

};

