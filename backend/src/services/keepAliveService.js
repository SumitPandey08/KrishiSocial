import axios from "axios";

/**
 * Service to periodically ping the backend to keep it awake on free hosting tiers (e.g. Render).
 * Render spins down free web services after 15 minutes of inactivity.
 * Pinging every 5 minutes ensures the server stays alive.
 *
 * @param {string} [customUrl] Optional custom URL to ping
 * @param {number} [intervalMinutes=5] Interval in minutes between pings (default 5)
 */
export const startKeepAliveService = (customUrl, intervalMinutes = 5) => {
  if (process.env.DISABLE_KEEP_ALIVE === "true") {
    console.log("[KeepAlive] Service is disabled via DISABLE_KEEP_ALIVE environment variable.");
    return null;
  }

  const port = process.env.PORT || 5000;
  const baseUrl =
    customUrl ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    process.env.SERVER_URL ||
    process.env.APP_URL ||
    `http://localhost:${port}`;

  let pingUrl = baseUrl.trim();
  if (!pingUrl.startsWith("http://") && !pingUrl.startsWith("https://")) {
    pingUrl = `https://${pingUrl}`;
  }

  // Remove trailing slash if present
  pingUrl = pingUrl.replace(/\/+$/, "");

  // Append health endpoint if not already in URL
  if (!pingUrl.endsWith("/api/health") && !pingUrl.endsWith("/health")) {
    pingUrl = `${pingUrl}/api/health`;
  }

  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`[KeepAlive] Service initialized. Target: ${pingUrl} (every ${intervalMinutes} min)`);

  const pingServer = async () => {
    try {
      const response = await axios.get(pingUrl, {
        timeout: 15000,
        headers: { "User-Agent": "Render-KeepAlive-Service/1.0" },
      });
      console.log(`[KeepAlive] Ping successful at ${new Date().toISOString()} - Status: ${response.status}`);
    } catch (error) {
      console.warn(`[KeepAlive] Ping warning at ${new Date().toISOString()}: ${error.message}`);
    }
  };

  // Initial ping after 30 seconds to allow the server to fully initialize
  const initialTimeout = setTimeout(pingServer, 30 * 1000);

  // Set recurring interval for pings
  const intervalId = setInterval(pingServer, intervalMs);

  return {
    stop: () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
      console.log("[KeepAlive] Service stopped.");
    },
  };
};
