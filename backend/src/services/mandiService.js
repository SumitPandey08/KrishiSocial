import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.DATA_GOV_API_KEY;
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

/**
 * Fetch Mandi Prices from data.gov.in
 * @param {Object} options - Search options
 * @param {string} options.state - State name
 * @param {string} options.district - District name
 * @param {string} options.market - Market (Mandi) name
 * @param {string} options.commodity - Commodity name
 * @param {number} options.limit - Number of records (default 10)
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Object>} - API response
 */
export const fetchMandiPrices = async ({
  state,
  district,
  market,
  commodity,
  limit = 10,
  offset = 0,
} = {}) => {
  try {
    if (!API_KEY) {
      throw new Error("DATA_GOV_API_KEY is not configured in environment variables");
    }

    let url = `${BASE_URL}?api-key=${API_KEY}&format=json&limit=${limit}&offset=${offset}`;

    if (state) url += `&filters[state]=${encodeURIComponent(state)}`;
    if (district) url += `&filters[district]=${encodeURIComponent(district)}`;
    if (market) url += `&filters[market]=${encodeURIComponent(market)}`;
    if (commodity) url += `&filters[commodity]=${encodeURIComponent(commodity)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch Mandi prices");
    }

    return data;
  } catch (error) {
    console.error("Mandi Service Error:", error);
    throw error;
  }
};
