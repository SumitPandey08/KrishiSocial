import axios from "axios"; // or use fetch if node version > 18
import User from "../model/user.model.js";
import { fetchMandiPrices } from "../services/mandiService.js";
import { get7DayWeather, getLocationName } from "../services/weatherService.js";
import { predictCropsV2 } from "../services/cropPrediction.js";

// Ensure node version is sufficient for fetch or install node-fetch/axios
// Assuming Node 18+ where global fetch is available

/*
|--------------------------------------------------------------------------
| 1️⃣ Weather Dashboard
|--------------------------------------------------------------------------
*/
export const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const weatherData = await get7DayWeather(lat, lon);

    // Get location name via reverse geocoding
    const locationName = await getLocationName(lat, lon);
    const location = locationName || `${parseFloat(lat).toFixed(2)}°, ${parseFloat(lon).toFixed(2)}°`;

    res.json({
      temperature: weatherData.current.temp,
      humidity: weatherData.current.humidity,
      description: weatherData.current.description,
      windSpeed: weatherData.current.windSpeed,
      location,
      icon: weatherData.current.icon,
      forecast: weatherData.forecast.map(item => ({
        time: item.date,
        temp: item.maxTemp,
        icon: item.icon,
        description: item.description
      }))
    });

  } catch (error) {
    console.error("Get Weather Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 2️⃣ Mandi Prices (Market Rates)
|--------------------------------------------------------------------------
*/
export const getMandiPrices = async (req, res) => {
  try {
    const { state, district, market, commodity, limit, offset } = req.query;
    
    const data = await fetchMandiPrices({
      state,
      district,
      market,
      commodity,
      limit: limit ? parseInt(limit) : 10,
      offset: offset ? parseInt(offset) : 0,
    });

    res.json({
      success: true,
      count: data.count,
      total: data.total,
      records: data.records,
      updated_date: data.updated_date
    });
  } catch (error) {
    console.error("Get Mandi Prices Error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to fetch Mandi prices",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/*
|--------------------------------------------------------------------------
| 3️⃣ Advanced Crop Recommendation (V2)
|--------------------------------------------------------------------------
*/
export const recommendCrops = async (req, res) => {
  try {
    console.log("Recommend Crops Params:", req.query);
    const { lat, lon, n, p, k, ph, budget, waterAvailability, durationPreference } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Location (lat, lon) is required for recommendations" });
    }

    const result = await predictCropsV2({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      nitrogen: n ? parseFloat(n) : null,
      phosphorus: p ? parseFloat(p) : null,
      potassium: k ? parseFloat(k) : null,
      ph: ph ? parseFloat(ph) : null,
      budget: budget ? parseFloat(budget) : null,
      waterAvailability: waterAvailability || "medium",
      durationPreference: durationPreference || "any"
    });

    if (!result.success) {
      return res.json({
        success: false,
        message: result.message,
        rejectionReason: result.rejectionReason
      });
    }

    res.json({
      success: true,
      data: result.data,
      insight: result.insight
    });

  } catch (error) {
    console.error("Recommend Crops Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 4️⃣ Crop Problem Diagnosis (Mock AI Integration)
|--------------------------------------------------------------------------
*/
export const diagnoseCrop = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required for diagnosis" });
    }

    // In a real application, you would pass this imageUrl to a Vision API or a custom ML model
    // Here we provide a mock response simulating an AI detection

    const mockDiagnoses = [
      { disease: "Leaf Blight", solution: "Spray Mancozeb 2g/L", confidence: 0.92 },
      { disease: "Yellow Vein Mosaic", solution: "Control whitefly vectors using Neem oil spray", confidence: 0.88 },
      { disease: "Nitrogen Deficiency", solution: "Apply Urea or NPK fertilizer", confidence: 0.95 },
      { disease: "Healthy Crop", solution: "No action needed. Keep up the good work!", confidence: 0.99 }
    ];

    // Pick a random mock diagnosis for demonstration
    const randomDiagnosis = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)];

    res.json({
      success: true,
      data: randomDiagnosis
    });

  } catch (error) {
    console.error("Diagnose Crop Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 5️⃣ Crop Advisory Feed (Mock AI Recommendations)
|--------------------------------------------------------------------------
*/
export const getAdvisory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // In a real application, this would use user.location, user.cropsGrown, weather API, and an AI service
    const advisories = [];

    if (user.cropsGrown && user.cropsGrown.includes("Wheat")) {
      advisories.push({
        crop: "Wheat",
        message: "It is the right time to apply the second dose of nitrogen fertilizer.",
        type: "Nutrient"
      });
    }

    if (user.farmingType === "Organic") {
      advisories.push({
        crop: "General",
        message: "Prepare your organic compost for the upcoming sowing season.",
        type: "Preparation"
      });
    }

    // Generic mock advisory based on mock weather
    advisories.push({
      crop: "All",
      message: "Heavy rain expected this week in your area. Avoid pesticide spraying.",
      type: "Weather"
    });

    res.json({
      success: true,
      advisories
    });

  } catch (error) {
    console.error("Get Advisory Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
