/**
 * Open-Meteo Weather Service
 * Provides free weather data for dashboards and agricultural planning.
 * No API key required.
 */

const FETCH_TIMEOUT = 5000; // 5 seconds timeout

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

/**
 * Get location name from coordinates using Open-Meteo Geocoding API
 */
export const getLocationName = async (lat, lon) => {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`;
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      // Build location string: city, district, state, country (prioritize available parts)
      const parts = [];
      if (result.city) parts.push(result.city);
      else if (result.town) parts.push(result.town);
      else if (result.village) parts.push(result.village);
      else if (result.municipality) parts.push(result.municipality);
      
      if (result.admin1) parts.push(result.admin1); // state/province
      
      return parts.join(", ");
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return null;
  }
};

/**
 * Maps WMO Weather interpretation codes to readable descriptions and icons.
 * Ref: https://open-meteo.com/en/docs
 */
const WMO_CODE_MAP = {
  0: { description: "Clear sky", icon: "01d" },
  1: { description: "Mainly clear", icon: "02d" },
  2: { description: "Partly cloudy", icon: "03d" },
  3: { description: "Overcast", icon: "04d" },
  45: { description: "Foggy", icon: "50d" },
  48: { description: "Depositing rime fog", icon: "50d" },
  51: { description: "Light drizzle", icon: "09d" },
  53: { description: "Moderate drizzle", icon: "09d" },
  55: { description: "Dense drizzle", icon: "09d" },
  61: { description: "Slight rain", icon: "10d" },
  63: { description: "Moderate rain", icon: "10d" },
  65: { description: "Heavy rain", icon: "10d" },
  71: { description: "Slight snow fall", icon: "13d" },
  73: { description: "Moderate snow fall", icon: "13d" },
  75: { description: "Heavy snow fall", icon: "13d" },
  77: { description: "Snow grains", icon: "13d" },
  80: { description: "Slight rain showers", icon: "09d" },
  81: { description: "Moderate rain showers", icon: "09d" },
  82: { description: "Violent rain showers", icon: "09d" },
  95: { description: "Thunderstorm", icon: "11d" },
  96: { description: "Thunderstorm with slight hail", icon: "11d" },
  99: { description: "Thunderstorm with heavy hail", icon: "11d" },
};

const getWeatherDescription = (code) => {
  return WMO_CODE_MAP[code] || { description: "Unknown", icon: "01d" };
};

/**
 * Fetch 7-day forecast for the weather dashboard.
 */
export const get7DayWeather = async (lat, lon) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    
    const response = await fetchWithTimeout(url, {
      headers: {
        'User-Agent': 'SocialApp/1.0'
      }
    });
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Open-Meteo 7-day Parse Error. Response was:", text.substring(0, 500));
      throw new Error("Invalid response from weather service");
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch weather from Open-Meteo");
    }

    const current = {
      temp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      ...getWeatherDescription(data.current.weather_code)
    };

    const forecast = data.daily.time.map((date, index) => {
      const weather = getWeatherDescription(data.daily.weather_code[index]);
      return {
        date,
        maxTemp: Math.round(data.daily.temperature_2m_max[index]),
        minTemp: Math.round(data.daily.temperature_2m_min[index]),
        description: weather.description,
        icon: weather.icon
      };
    });

    return { current, forecast };
  } catch (error) {
    console.error("Open-Meteo 7-day Error:", error.message);
    // Return a graceful fallback instead of throwing
    return {
      current: { temp: 25, humidity: 60, windSpeed: 5, description: "Weather service unavailable", icon: "01d" },
      forecast: Array(7).fill({ date: new Date().toISOString().split('T')[0], maxTemp: 30, minTemp: 20, description: "N/A", icon: "01d" })
    };
  }
};

/**
 * Fetch 14-day agricultural forecast for the recommendation engine.
 */
export const get14DayAgroWeather = async (lat, lon) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration&timezone=auto&forecast_days=14`;
    
    const response = await fetchWithTimeout(url, {
      headers: {
        'User-Agent': 'SocialApp/1.0'
      }
    });
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Open-Meteo 14-day Agro Parse Error. Response was:", text.substring(0, 500));
      throw new Error("Invalid response from agro weather service");
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch agro weather from Open-Meteo");
    }

    return data.daily.time.map((date, index) => ({
      date,
      maxTemp: data.daily.temperature_2m_max[index],
      minTemp: data.daily.temperature_2m_min[index],
      precipitation: data.daily.precipitation_sum[index],
      evapotranspiration: data.daily.et0_fao_evapotranspiration[index]
    }));
  } catch (error) {
    console.error("Open-Meteo 14-day Agro Error:", error.message);
    // Return 14 days of average/placeholder data to keep the recommendation engine running
    return Array(14).fill(0).map((_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxTemp: 30,
      minTemp: 22,
      precipitation: 0,
      evapotranspiration: 5
    }));
  }
};
