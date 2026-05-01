import axios from "axios"; // or use fetch if node version > 18
import User from "../model/user.model.js";

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

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Weather API key not configured" });
    }

    // Current Weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    // 5 Day / 3 Hour Forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    if (!weatherRes.ok) {
      return res.status(weatherRes.status).json({ message: weatherData.message || "Failed to fetch weather data" });
    }

    // Process forecast data to get next few hours
    // Using the timezone offset from the API to show local time
    const timezoneOffset = weatherData.timezone; // in seconds

    const hourlyForecast = forecastData.list?.slice(0, 8).map(item => {
      // Create date and adjust for timezone offset to get local time
      const localTime = new Date((item.dt + timezoneOffset) * 1000);
      return {
        time: localTime.getUTCHours().toString().padStart(2, '0') + ":" + 
              localTime.getUTCMinutes().toString().padStart(2, '0'),
        temp: Math.round(item.main.temp),
        icon: item.weather[0]?.icon,
        description: item.weather[0]?.description
      };
    }) || [];

    res.json({
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      description: weatherData.weather[0]?.description,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
      location: weatherData.name,
      icon: weatherData.weather[0]?.icon,
      forecast: hourlyForecast
    });

  } catch (error) {
    console.error("Get Weather Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 2️⃣ Crop Problem Diagnosis (Mock AI Integration)
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
| 3️⃣ Crop Advisory Feed (Mock AI Recommendations)
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
