import { getDataset } from "./datasetLoader.js";

export const predictCrops = (input) => {
  const dataset = getDataset();

  // 1️⃣ Climate filtering (Relaxed for robustness)
  const filtered = dataset.filter(row =>
    Math.abs(row.temperature - input.temperature) < 12 &&
    Math.abs(row.humidity - input.humidity) < 45
  );

  if (filtered.length === 0) return [];

  const cropStats = new Map();

  filtered.forEach(row => {
    // 2️⃣ Weighted scoring components for reasoning
    const diffs = {
      temp: Math.abs(row.temperature - input.temperature),
      humid: Math.abs(row.humidity - input.humidity),
      rain: input.rainfall ? Math.abs(row.rainfall - input.rainfall) : 0,
      nutrients: (
        (input.nitrogen ? Math.abs(row.nitrogen - input.nitrogen) : 0) +
        (input.phosphorus ? Math.abs(row.phosphorus - input.phosphorus) : 0) +
        (input.potassium ? Math.abs(row.potassium - input.potassium) : 0)
      ) / 3,
      ph: input.ph ? Math.abs(row.ph - input.ph) : 0
    };

    const totalScore = (4 * diffs.temp) + (2 * diffs.humid) + (1.2 * diffs.rain) + (1.5 * diffs.nutrients) + (3 * diffs.ph);

    const existing = cropStats.get(row.crop);
    if (!existing || totalScore < existing.score) {
      cropStats.set(row.crop, { score: totalScore, diffs, row });
    }
  });

  // 3️⃣ Sort and enrich with insights
  return Array.from(cropStats.entries())
    .sort((a, b) => a[1].score - b[1].score)
    .slice(0, 3)
    .map(([name, data]) => {
      const insights = [];
      if (data.diffs.ph < 0.5) insights.push("Optimal soil pH");
      if (data.diffs.temp < 3) insights.push("Ideal temperature");
      
      const warnings = [];
      if (data.diffs.humid > 30) warnings.push(input.humidity < data.row.humidity ? "Higher humidity preferred" : "Lower humidity preferred");
      if (data.diffs.rain > 50) warnings.push("Rainfall mismatch");

      return {
        name,
        confidence: Math.max(5, (100 * Math.exp(-data.score / 150))).toFixed(1), // Exponential decay for realistic confidence
        insights: insights.slice(0, 2),
        limitations: warnings.slice(0, 2)
      };
    });
};