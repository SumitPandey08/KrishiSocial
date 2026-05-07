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

export const getCropRecommendation = async (location: string | { lat: number; lon: number }) => {
  try {
    const params = typeof location === 'string' 
      ? { location }
      : { lat: location.lat, lon: location.lon };
    
    const response = await api.get("/agent/crop-recommendation", { params });
    return response.data;
  } catch (error) {
    console.error("Get crop recommendation error:", error);
    throw error;
  }
};

export const getMandiPrices = async (params: {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  limit?: number;
  offset?: number;
} = {}) => {
  try {
    const response = await api.get("/farmer/mandi", { params });
    return response.data;
  } catch (error) {
    console.error("Get Mandi prices error:", error);
    throw error;
  }
};

export const getAdvancedCropRecommendation = async (params: {
  lat: number;
  lon: number;
  n?: number;
  p?: number;
  k?: number;
  ph?: number;
  budget?: number;
  waterAvailability?: string;
  durationPreference?: string;
}) => {
  try {
    const response = await api.get("/farmer/recommend", { params });
    return response.data;
  } catch (error) {
    console.error("Get advanced crop recommendation error:", error);
    throw error;
  }
};