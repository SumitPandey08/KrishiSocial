import fs from "fs";
import csv from "csv-parser";
import path from "path";

// Embedded baseline crop requirements dataset (used when CSV is not present in live production)
const DEFAULT_CROP_DATASET = [
  { crop: "rice", nitrogen: 79.89, phosphorus: 47.58, potassium: 39.87, temperature: 23.69, humidity: 82.27, ph: 6.43, rainfall: 236.18 },
  { crop: "maize", nitrogen: 77.76, phosphorus: 48.44, potassium: 19.79, temperature: 22.39, humidity: 65.09, ph: 6.25, rainfall: 84.77 },
  { crop: "chickpea", nitrogen: 40.09, phosphorus: 67.79, potassium: 79.92, temperature: 18.87, humidity: 16.86, ph: 7.34, rainfall: 80.06 },
  { crop: "kidneybeans", nitrogen: 20.75, phosphorus: 67.54, potassium: 20.05, temperature: 20.12, humidity: 21.61, ph: 5.75, rainfall: 105.92 },
  { crop: "pigeonpeas", nitrogen: 20.73, phosphorus: 67.73, potassium: 20.29, temperature: 27.74, humidity: 48.06, ph: 5.79, rainfall: 149.46 },
  { crop: "mothbeans", nitrogen: 21.44, phosphorus: 48.01, potassium: 20.23, temperature: 28.19, humidity: 53.16, ph: 6.83, rainfall: 51.2 },
  { crop: "mungbean", nitrogen: 20.99, phosphorus: 47.28, potassium: 19.87, temperature: 28.53, humidity: 85.5, ph: 6.72, rainfall: 48.4 },
  { crop: "blackgram", nitrogen: 40.02, phosphorus: 67.47, potassium: 19.24, temperature: 29.97, humidity: 65.12, ph: 7.13, rainfall: 67.88 },
  { crop: "lentil", nitrogen: 18.77, phosphorus: 68.36, potassium: 19.41, temperature: 24.51, humidity: 64.8, ph: 6.93, rainfall: 45.68 },
  { crop: "pomegranate", nitrogen: 18.87, phosphorus: 18.75, potassium: 40.21, temperature: 21.84, humidity: 90.13, ph: 6.43, rainfall: 107.53 },
  { crop: "banana", nitrogen: 100.23, phosphorus: 82.01, potassium: 50.05, temperature: 27.38, humidity: 80.36, ph: 5.98, rainfall: 104.63 },
  { crop: "mango", nitrogen: 20.07, phosphorus: 27.18, potassium: 29.92, temperature: 31.21, humidity: 50.16, ph: 5.77, rainfall: 94.7 },
  { crop: "grapes", nitrogen: 23.18, phosphorus: 132.53, potassium: 200.11, temperature: 23.85, humidity: 81.88, ph: 6.03, rainfall: 69.61 },
  { crop: "watermelon", nitrogen: 99.42, phosphorus: 17, potassium: 50.22, temperature: 25.59, humidity: 85.16, ph: 6.5, rainfall: 50.79 },
  { crop: "muskmelon", nitrogen: 100.32, phosphorus: 17.72, potassium: 50.08, temperature: 28.66, humidity: 92.34, ph: 6.36, rainfall: 24.69 },
  { crop: "apple", nitrogen: 20.8, phosphorus: 134.22, potassium: 199.89, temperature: 22.63, humidity: 92.33, ph: 5.93, rainfall: 112.65 },
  { crop: "orange", nitrogen: 19.58, phosphorus: 16.55, potassium: 10.01, temperature: 22.77, humidity: 92.17, ph: 7.02, rainfall: 110.47 },
  { crop: "papaya", nitrogen: 49.88, phosphorus: 59.05, potassium: 50.04, temperature: 33.72, humidity: 92.4, ph: 6.74, rainfall: 142.63 },
  { crop: "coconut", nitrogen: 21.98, phosphorus: 16.93, potassium: 30.59, temperature: 27.41, humidity: 94.84, ph: 5.98, rainfall: 175.69 },
  { crop: "cotton", nitrogen: 117.77, phosphorus: 46.24, potassium: 19.56, temperature: 23.99, humidity: 79.84, ph: 6.91, rainfall: 80.4 },
  { crop: "jute", nitrogen: 78.4, phosphorus: 46.86, potassium: 39.99, temperature: 24.96, humidity: 79.64, ph: 6.73, rainfall: 174.79 },
  { crop: "coffee", nitrogen: 101.2, phosphorus: 28.74, potassium: 29.94, temperature: 25.54, humidity: 58.87, ph: 6.79, rainfall: 158.07 }
];

let cropDataset = [];
let isLoaded = false;

export const loadDataset = () => {
  if (isLoaded) return Promise.resolve();

  return new Promise((resolve) => {
    const csvPath = path.join(process.cwd(), "dataset/Crop_recommendation.csv");

    if (!fs.existsSync(csvPath)) {
      console.log("Local CSV dataset not found. Using embedded baseline dataset.");
      cropDataset = [...DEFAULT_CROP_DATASET];
      isLoaded = true;
      return resolve();
    }

    const loadedRows = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        loadedRows.push({
          nitrogen: Number(row.N),
          phosphorus: Number(row.P),
          potassium: Number(row.K),
          temperature: Number(row.temperature),
          humidity: Number(row.humidity),
          ph: Number(row.ph),
          rainfall: Number(row.rainfall),
          crop: row.label
        });
      })
      .on("end", () => {
        cropDataset = loadedRows.length > 0 ? loadedRows : [...DEFAULT_CROP_DATASET];
        console.log("Dataset loaded:", cropDataset.length);
        isLoaded = true;
        resolve();
      })
      .on("error", (err) => {
        console.warn("Warning reading CSV, falling back to embedded baseline dataset:", err.message);
        cropDataset = [...DEFAULT_CROP_DATASET];
        isLoaded = true;
        resolve();
      });
  });
};

export const getDataset = () => {
  if (cropDataset.length === 0) {
    return DEFAULT_CROP_DATASET;
  }
  return cropDataset;
};