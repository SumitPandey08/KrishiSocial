/**
 * Coordinate-style Weather Cache Utility
 * Caches weather responses by latitude & longitude with TTL and spatial proximity matching (~5km).
 */

export interface CachedWeatherEntry {
  lat: number;
  lon: number;
  timestamp: number;
  data: any;
}

const CACHE_KEY_PREFIX = 'krishi_weather_coord_';
const LAST_WEATHER_KEY = 'krishi_last_weather_coord';
const DEFAULT_TTL_MS = 20 * 60 * 1000; // 20 minutes
const MAX_DISTANCE_KM = 5; // Coordinates within 5 km share the same weather cache

/**
 * Calculates distance in kilometers between two lat/lon points using Haversine formula
 */
export function getCoordinatesDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Normalizes coordinates to a grid key (~1.1 km precision)
 */
export function getCoordKey(lat: number, lon: number): string {
  return `${Number(lat).toFixed(2)}_${Number(lon).toFixed(2)}`;
}

/**
 * Get cached weather matching specific coordinates within threshold and TTL
 */
export function getCachedWeatherByCoords(
  lat: number,
  lon: number,
  maxAgeMs = DEFAULT_TTL_MS
): any | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Direct coordinate grid key lookup
    const directKey = `${CACHE_KEY_PREFIX}${getCoordKey(lat, lon)}`;
    const directItem = localStorage.getItem(directKey);
    if (directItem) {
      const entry: CachedWeatherEntry = JSON.parse(directItem);
      if (Date.now() - entry.timestamp < maxAgeMs) {
        return entry.data;
      }
    }

    // 2. Check last known weather entry for nearby distance match within MAX_DISTANCE_KM
    const lastItem = localStorage.getItem(LAST_WEATHER_KEY);
    if (lastItem) {
      const entry: CachedWeatherEntry = JSON.parse(lastItem);
      if (Date.now() - entry.timestamp < maxAgeMs) {
        const distance = getCoordinatesDistanceKm(lat, lon, entry.lat, entry.lon);
        if (distance <= MAX_DISTANCE_KM) {
          return entry.data;
        }
      }
    }
  } catch (err) {
    console.warn("Weather cache read error:", err);
  }

  return null;
}

/**
 * Get the most recent cached weather regardless of coordinates (useful for initial component render)
 */
export function getLastCachedWeather(maxAgeMs = DEFAULT_TTL_MS): { data: any; lat: number; lon: number } | null {
  if (typeof window === 'undefined') return null;

  try {
    const lastItem = localStorage.getItem(LAST_WEATHER_KEY);
    if (lastItem) {
      const entry: CachedWeatherEntry = JSON.parse(lastItem);
      if (Date.now() - entry.timestamp < maxAgeMs) {
        return { data: entry.data, lat: entry.lat, lon: entry.lon };
      }
    }
  } catch (err) {
    console.warn("Last weather cache read error:", err);
  }

  return null;
}

/**
 * Save weather data to coordinate cache
 */
export function setCachedWeather(lat: number, lon: number, data: any): void {
  if (typeof window === 'undefined') return;

  try {
    const entry: CachedWeatherEntry = {
      lat: Number(lat),
      lon: Number(lon),
      timestamp: Date.now(),
      data
    };

    const directKey = `${CACHE_KEY_PREFIX}${getCoordKey(lat, lon)}`;
    localStorage.setItem(directKey, JSON.stringify(entry));
    localStorage.setItem(LAST_WEATHER_KEY, JSON.stringify(entry));
  } catch (err) {
    console.warn("Weather cache write error:", err);
  }
}
