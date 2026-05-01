import ee from '@google/earthengine';
import fs from 'fs';

// 1. Parse the Service Account Key
let credentials;
try {
  const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (creds) {
    if (creds.trim().startsWith('{')) {
      // It's a JSON string
      credentials = JSON.parse(creds);
    } else {
      // Assume it's a file path
      const fileContent = fs.readFileSync(creds, 'utf8');
      credentials = JSON.parse(fileContent);
    }
    
    // Fix for private key newline issues in some environments
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
  }
} catch (error) {
  console.error('Failed to parse Earth Engine credentials:', error);
}

let isInitialized = false;

/**
 * Initializes the Earth Engine API using Service Account credentials
 */
const initializeGEE = () => {
  if (isInitialized) return Promise.resolve();

  return new Promise((resolve, reject) => {
    if (!credentials || !credentials.client_email || !credentials.private_key) {
      return reject('Error: Missing client_email or private_key in credentials.');
    }

    // Authenticate using the Service Account private key object
    ee.data.authenticateViaPrivateKey(
      credentials,
      () => {
        // Initialize the client
        ee.initialize(
          null, 
          null, 
          () => {
            console.log('Earth Engine initialized successfully.');
            isInitialized = true;
            resolve();
          }, 
          (err) => reject(`EE Initialization failed: ${err}`)
        );
      },
      (err) => reject(`EE Authentication failed: ${err}`)
    );
  });
};

/**
 * Helper to fetch a single value from a GEE Image at a specific coordinate
 */
async function getLayerValue(imageName, lat, lon, selector = 0) {
  const point = ee.Geometry.Point([lon, lat]);
  
  try {
    const image = ee.Image(imageName).select(selector);
    const stats = image.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: point,
      scale: 250
    });

    return new Promise((resolve) => {
      stats.evaluate((result, error) => {
        if (error) {
          console.error(`Error evaluating layer ${imageName}:`, error);
          resolve(null);
        } else {
          const value = Object.values(result)[0];
          resolve(value);
        }
      });
    });
  } catch (err) {
    console.error(`Error accessing image ${imageName}:`, err);
    return null;
  }
}

/**
 * Returns a profile of soil properties for a given location
 */
export async function getSoilProfile(lat, lon) {
  try {
    await initializeGEE();
    
    // Updated asset IDs to correct v02 versions from OpenLandMap
    const [nitrogen, phosphorus, potassium, ph, carbon, annualRainfall] = await Promise.all([
      getLayerValue('OpenLandMap/SOL/SOL_NITROGEN-TOTAL_ISO-10694_M/v02', lat, lon, 'b0'),
      getLayerValue('OpenLandMap/SOL/SOL_P-EXTRACTABLE_USDA-4B4_M/v02', lat, lon, 'b0'),
      getLayerValue('OpenLandMap/SOL/SOL_K-EXTRACTABLE_USDA-4B1_M/v02', lat, lon, 'b0'),
      getLayerValue('OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02', lat, lon, 'b0'),
      getLayerValue('OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02', lat, lon, 'b0'),
      getLayerValue('WORLDCLIM/V1/BIO', lat, lon, 'bio12') // bio12 is Annual Precipitation
    ]);

    // Fallback logic if some nutrients are unavailable (using reasonable defaults for generic soil)
    return {
      latitude: lat,
      longitude: lon,
      nitrogen: nitrogen !== null ? nitrogen : 80, // Default nitrogen
      phosphorus: phosphorus !== null ? phosphorus : 45, // Default phosphorus
      potassium: potassium !== null ? potassium : 40, // Default potassium
      ph: ph ? parseFloat((ph / 10).toFixed(1)) : 6.5, // Default pH
      carbon_content: carbon !== null ? carbon : 2,
      annualRainfall: annualRainfall || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getSoilProfile:', error);
    return null;
  }
}

/**
 * Specific wrapper for Carbon data
 */
export async function getSoilCarbon(lat, lon) {
  const profile = await getSoilProfile(lat, lon);
  return profile ? profile.carbon_content : null;
}