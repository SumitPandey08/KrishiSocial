import axios from "axios";

export const getWeather = async (city) => {

  const API_KEY = process.env.OPENWEATHER_API_KEY;

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const res = await axios.get(url);

  return {
    temperature: res.data.main.temp,
    humidity: res.data.main.humidity,
    rainfall: res.data.rain?.["1h"] || 0,
    coord: res.data.coord
  };
};