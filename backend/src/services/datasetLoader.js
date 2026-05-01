import fs from "fs";
import csv from "csv-parser";
import path from "path";

let cropDataset = [];
let isLoaded = false;

export const loadDataset = () => {
  if (isLoaded) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const csvPath = path.join(process.cwd(), "src/dataset/Crop_recommendation.csv");

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        cropDataset.push({
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
        console.log("Dataset loaded:", cropDataset.length);
        isLoaded = true;
        resolve();
      })
      .on("error", (err) => {
        console.error("Error loading CSV:", err);
        reject(err);
      });

  });
};

export const getDataset = () => cropDataset;