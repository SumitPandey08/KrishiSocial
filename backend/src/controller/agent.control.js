import { cropAgent } from "../agents/cropRecommendation.js";

export const getCropRecommendation = async (req, res) => {

  const { location, lat, lon } = req.query;

  if (!location && (!lat || !lon)) {
    return res.status(400).json({ error: "Location or lat/lon coordinates are required" });
  }

  const locationParam = location || `${lat},${lon}`;
  const coords = lat && lon ? { lat, lon } : null;

  try {
    const result = await cropAgent(locationParam, coords);
    res.json(result);
  } catch (error) {
    console.error("Error in crop recommendation:", error);
    res.status(500).json({ error: "Failed to get crop recommendation" });
  }

};

