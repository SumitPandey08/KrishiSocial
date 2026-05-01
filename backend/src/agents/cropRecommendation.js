import { predictCrops } from "../services/cropPrediction.js";
import { getWeather } from "../tools/WeatherApi.js";
import { getSoilProfile } from "../tools/soilProfile.js";

export const cropAgent = async (location) => {
  try {

    const weather = await getWeather(location);

    if (!weather || !weather.coord) {
      throw new Error(`Weather data missing for location: ${location}`);
    }

    const soil = await getSoilProfile(
      weather.coord.lat,
      weather.coord.lon
    );

    const recommendedCrops = predictCrops({
      temperature: weather.temperature,
      humidity: weather.humidity,
      rainfall: soil?.annualRainfall ? (soil.annualRainfall / 12) : weather.rainfall, // Scale annual to monthly avg
      nitrogen: soil?.nitrogen,
      phosphorus: soil?.phosphorus,
      potassium: soil?.potassium,
      ph: soil?.ph !== "Unknown" ? soil?.ph : null
    });

    return {
      location,
      weather,
      soil: soil || "Unavailable",
      recommendations: recommendedCrops.length > 0 ? recommendedCrops : "No suitable crops found for these conditions."
    };

  } catch (error) {

    console.error("Crop Agent Error:", {
      location,
      error: error.message
    });

    throw error;
  }
};