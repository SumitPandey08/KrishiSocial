import api from "./api";

export const getWeather = async (lat: number, lon: number) => {
  try {
    const response = await api.get("/farmer/weather", {
      params: { lat, lon }
    });
    return response.data;
  } catch (error) {
    console.error("Get weather error:", error);
    throw error;
  }
};

export const getCropRecommendation = async (location: string) => {
  try {
    const response = await api.get("/agent/crop-recommendation", {
      params: { location }
    });
    return response.data;
  } catch (error) {
    console.error("Get crop recommendation error:", error);
    throw error;
  }
};
