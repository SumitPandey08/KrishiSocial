import { predictCropsV2 } from "../services/cropPrediction.js";
import { getWeather } from "../tools/WeatherApi.js";
import { getSoilProfile } from "../tools/soilProfile.js";

export const cropAgent = async (location, coords = null) => {
  try {

    let weather, lat, lon;
    
    if (coords && coords.lat && coords.lon) {
      // Use coordinates directly - need to get weather by coords
      lat = parseFloat(coords.lat);
      lon = parseFloat(coords.lon);
      weather = await getWeatherByCoords(lat, lon);
    } else {
      // Use location name
      weather = await getWeather(location);
      lat = weather.coord.lat;
      lon = weather.coord.lon;
    }

    if (!weather || (!weather.coord && !coords)) {
      throw new Error(`Weather data missing for location: ${location}`);
    }

    const soil = await getSoilProfile(lat, lon);

    const recommendedCrops = await predictCropsV2({
      lat,
      lon,
      nitrogen: soil?.nitrogen,
      phosphorus: soil?.phosphorus,
      potassium: soil?.potassium,
      ph: soil?.ph !== "Unknown" ? soil?.ph : null
    });

    const recommendations = recommendedCrops.success ? recommendedCrops.data : [];

    return {
      location,
      weather,
      soil: soil || "Unavailable",
      recommendations: recommendations.length > 0 ? recommendations : "No suitable crops found for these conditions.",
      insight: recommendedCrops.insight || null
    };

  } catch (error) {

    console.error("Crop Agent Error:", {
      location,
      error: error.message
    });

    throw error;
  }
};

async function getWeatherByCoords(lat, lon) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: data.rain?.["1h"] || 0,
      coord: data.coord,
      location: data.name // city name from OpenWeatherMap
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather: ${error.message}`);
  }
}