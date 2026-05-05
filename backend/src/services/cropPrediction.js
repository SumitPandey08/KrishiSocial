import { getDataset } from "./datasetLoader.js";
import { get14DayAgroWeather } from "./weatherService.js";
import { fetchMandiPrices } from "./mandiService.js";

const CROP_FINANCIAL_DATA = {
  rice: { 
    baseCost: 45000, baseYield: 45, type: "seasonal", duration: 4, 
    isWaterIntensive: true, requiresHighRainfall: true,
    risk: "Medium", strength: "High demand, stable market",
    rotation: "Wheat or Legumes (Pulse crops)"
  },
  maize: { 
    baseCost: 30000, baseYield: 60, type: "seasonal", duration: 4, 
    isWaterIntensive: false, requiresHighRainfall: false,
    risk: "Low", strength: "Versatile, easy to sell",
    rotation: "Mustard or Potato"
  },
  chickpea: { 
    baseCost: 25000, baseYield: 20, type: "seasonal", duration: 3, 
    isWaterIntensive: false, requiresHighRainfall: false,
    risk: "Low", strength: "Fixes soil nitrogen, low water",
    rotation: "Barley or Mustard"
  },
  kidneybeans: { 
    baseCost: 28000, baseYield: 15, type: "seasonal", duration: 3, 
    isWaterIntensive: false, requiresHighRainfall: false,
    risk: "Medium", strength: "High nutritional value",
    rotation: "Corn or Root vegetables"
  },
  pigeonpeas: { 
    baseCost: 22000, baseYield: 12, type: "seasonal", duration: 6, 
    isWaterIntensive: false, requiresHighRainfall: false,
    risk: "Low", strength: "Drought tolerant, enriches soil",
    rotation: "Sorghum or Millets"
  },
  mothbeans: { 
    baseCost: 15000, baseYield: 8, type: "seasonal", duration: 3, 
    isWaterIntensive: false, requiresHighRainfall: false,
    risk: "Low", strength: "Most drought resilient pulse",
    rotation: "Pearl Millet (Bajra)"
  },
  mungbean: { 
    baseCost: 18000, baseYield: 10, type: "seasonal", duration: 3, 
    isWaterIntensive: false, requiresHighRainfall: false,
    risk: "Medium", strength: "Short cycle, high market value",
    rotation: "Winter Wheat"
  },
  blackgram: { 
    baseCost: 20000, baseYield: 10, type: "seasonal", duration: 3, 
    isWaterIntensive: false, requiresHighRainfall: false,
    risk: "Low", strength: "Stable demand, safe choice",
    rotation: "Oilseeds or Mustard"
  },
  lentil: { 
    baseCost: 18000, baseYield: 12, type: "seasonal", duration: 3, 
    isWaterIntensive: false, requiresHighRainfall: false,
    risk: "Low", strength: "Nutrient dense, low cost",
    rotation: "Rice (Kharif cycle)"
  },
  pomegranate: { 
    baseCost: 80000, baseYield: 150, type: "horticulture", duration: 18, 
    isWaterIntensive: true, requiresHighRainfall: false,
    risk: "High", strength: "High export potential",
    rotation: "Intercropping with vegetables"
  },
  banana: { 
    baseCost: 120000, baseYield: 400, type: "horticulture", duration: 12, 
    isWaterIntensive: true, requiresHighRainfall: true,
    risk: "Medium", strength: "Continuous income stream",
    rotation: "Sugarcane or Turmeric"
  },
  mango: { 
    baseCost: 60000, baseYield: 100, type: "horticulture", duration: 60, 
    isWaterIntensive: false, requiresHighRainfall: false,
    risk: "Low", strength: "Long-term asset, low maintenance",
    rotation: "Intercropping with legumes"
  },
  grapes: { 
    baseCost: 150000, baseYield: 250, type: "horticulture", duration: 36, 
    isWaterIntensive: true, requiresHighRainfall: false,
    risk: "High", strength: "Premium market, high returns",
    rotation: "Cover crops (Clover)"
  },
  watermelon: { 
    baseCost: 40000, baseYield: 300, type: "seasonal", duration: 3, 
    isWaterIntensive: true, requiresHighRainfall: false,
    risk: "Medium", strength: "Fast cash crop, high yield",
    rotation: "Pulses or Grains"
  },
  muskmelon: { 
    baseCost: 35000, baseYield: 200, type: "seasonal", duration: 3, 
    isWaterIntensive: true, requiresHighRainfall: false,
    risk: "Medium", strength: "Good summer market demand",
    rotation: "Leafy vegetables"
  },
  apple: { 
    baseCost: 200000, baseYield: 150, type: "horticulture", duration: 60, 
    isWaterIntensive: true, requiresHighRainfall: false,
    risk: "High", strength: "Elite crop, high profitability",
    rotation: "Soil building cover crops"
  },
  orange: { 
    baseCost: 90000, baseYield: 120, type: "horticulture", duration: 48, 
    isWaterIntensive: true, requiresHighRainfall: false,
    risk: "Medium", strength: "Steady market, multiple harvests",
    rotation: "Green manure crops"
  },
  papaya: { 
    baseCost: 70000, baseYield: 500, type: "horticulture", duration: 9, 
    isWaterIntensive: true, requiresHighRainfall: false,
    risk: "Medium", strength: "Very high yield, quick fruit",
    rotation: "Ginger or Turmeric"
  },
  coconut: { 
    baseCost: 50000, baseYield: 80, type: "horticulture", duration: 72, 
    isWaterIntensive: true, requiresHighRainfall: true,
    risk: "Low", strength: "Lifetime yield, versatile use",
    rotation: "Cocoa or Pepper intercropping"
  },
  cotton: { 
    baseCost: 40000, baseYield: 25, type: "cash", duration: 6, 
    isWaterIntensive: true, requiresHighRainfall: false,
    risk: "High", strength: "Major industrial demand",
    rotation: "Groundnut or Soybeans"
  },
  jute: { 
    baseCost: 30000, baseYield: 30, type: "cash", duration: 5, 
    isWaterIntensive: true, requiresHighRainfall: true,
    risk: "Medium", strength: "Eco-friendly fiber demand",
    rotation: "Rice or Potato"
  },
  coffee: { 
    baseCost: 100000, baseYield: 15, type: "cash", duration: 36, 
    isWaterIntensive: true, requiresHighRainfall: true,
    risk: "High", strength: "Stable global export market",
    rotation: "Pepper or Cardamom intercropping"
  },
};

const getRegionConfig = (lat) => {
  if (lat > 28) return { labor: 1.2, irrigation: 0.8, name: "North India" };
  if (lat < 18) return { labor: 1.1, irrigation: 1.0, name: "South India" };
  return { labor: 0.9, irrigation: 1.1, name: "Central/West India" };
};

export const predictCropsV2 = async (input) => {
  const { 
    lat, lon, nitrogen, phosphorus, potassium, ph, 
    budget, waterAvailability, durationPreference = "any" 
  } = input;
  
  const hasHighWater = waterAvailability === "high" || waterAvailability === "Abundant";
  const region = getRegionConfig(lat);

  const dataset = getDataset();
  const weatherData = await get14DayAgroWeather(lat, lon);
  const avgTemp = weatherData.reduce((acc, d) => acc + (d.maxTemp + d.minTemp) / 2, 0) / weatherData.length;
  const totalRainfall = weatherData.reduce((acc, d) => acc + d.precipitation, 0);
  const avgPrecipitation = totalRainfall * (30 / 14);

  let marketPrices = {};
  let priceTrendMsg = "Market prices stable";
  try {
    const mandiData = await fetchMandiPrices({ limit: 100 });
    if (mandiData?.records?.length > 0) {
      mandiData.records.forEach(r => { 
        marketPrices[r.commodity.toLowerCase()] = parseFloat(r.modal_price); 
      });
      priceTrendMsg = "Live Mandi data integrated ↑";
    }
  } catch (err) {}

  const fallbackPrices = {
    rice: 2200, maize: 1900, chickpea: 5200, kidneybeans: 8000, pigeonpeas: 6500,
    mothbeans: 5500, mungbean: 7000, blackgram: 6500, lentil: 6000, pomegranate: 7000,
    banana: 1500, mango: 4000, grapes: 5000, watermelon: 1000, muskmelon: 1500,
    apple: 8000, orange: 3500, papaya: 2000, coconut: 3000, cotton: 7000,
    jute: 5000, coffee: 15000
  };

  const results = [];
  const rejections = [];
  const uniqueCrops = [...new Set(dataset.map(row => row.crop))].filter(Boolean);

  uniqueCrops.forEach(cropLabel => {
    const fin = CROP_FINANCIAL_DATA[cropLabel] || { 
      baseCost: 50000, baseYield: 20, type: "seasonal", duration: 4, 
      risk: "Medium", strength: "Standard crop", rotation: "Legumes" 
    };
    
    // --- 🌍 Location-Aware Financials ---
    const finalCost = fin.baseCost * region.labor * (fin.isWaterIntensive ? region.irrigation : 1.0);

    // --- ❌ HARD REJECTIONS ---
    if (budget && budget < finalCost) {
      rejections.push({ crop: cropLabel, reason: `Requires ₹${Math.round(finalCost).toLocaleString()} budget in ${region.name}.` });
      return;
    }
    if (durationPreference === "short-term" && fin.duration > 6) {
      rejections.push({ crop: cropLabel, reason: `${fin.duration}m growth cycle is too long.` });
      return;
    }
    if (fin.requiresHighRainfall && avgPrecipitation < 40 && !hasHighWater) {
      rejections.push({ crop: cropLabel, reason: "Insufficient rainfall (Irrigation not selected)." });
      return;
    }

    const cropRows = dataset.filter(row => row.crop === cropLabel);
    const req = {
      n: cropRows.reduce((acc, r) => acc + (r.nitrogen || 0), 0) / cropRows.length,
      p: cropRows.reduce((acc, r) => acc + (r.phosphorus || 0), 0) / cropRows.length,
      k: cropRows.reduce((acc, r) => acc + (r.potassium || 0), 0) / cropRows.length,
      temp: cropRows.reduce((acc, r) => acc + (r.temperature || 0), 0) / cropRows.length,
      ph: cropRows.reduce((acc, r) => acc + (r.ph || 0), 0) / cropRows.length,
    };

    const diffs = {
      n: nitrogen ? Math.max(0, req.n - nitrogen) : 0,
      p: phosphorus ? Math.max(0, req.p - phosphorus) : 0,
      k: potassium ? Math.max(0, req.k - potassium) : 0,
      temp: Math.abs(req.temp - avgTemp),
      ph: ph ? Math.abs(req.ph - ph) : 0
    };

    const soilScore = Math.max(0, 100 - (diffs.n * 0.1 + diffs.p * 0.1 + diffs.k * 0.1 + diffs.ph * 10));
    if (soilScore < 10) {
      rejections.push({ crop: cropLabel, reason: "Soil pH is critically incompatible." });
      return;
    }

    const weatherScore = Math.max(0, 100 - (diffs.temp * 5));
    let suitability = (weatherScore * 0.6 + soilScore * 0.4);
    
    // 🔥 Water Utilization Logic
    if (hasHighWater && fin.isWaterIntensive) suitability += 15;
    if (!hasHighWater && fin.isWaterIntensive) suitability -= 20;
    suitability = Math.min(100, Math.max(0, suitability));

    // 🔥 Realistic Yield Logic
    const weatherFactor = weatherScore / 100;
    const soilFactor = soilScore / 100;
    const actualYield = fin.baseYield * weatherFactor * soilFactor;

    const marketPrice = marketPrices[cropLabel] || fallbackPrices[cropLabel];
    const profit = Math.round(actualYield * marketPrice - finalCost);
    
    // 🔥 Confidence-Based ROI Range
    const roiMin = ((profit * 0.8 / finalCost) * 100).toFixed(1);
    const roiMax = ((profit * 1.2 / finalCost) * 100).toFixed(1);
    const roiRange = `${roiMin}% - ${roiMax}%`;
    const profitRange = `₹${(profit * 0.8 / 1000).toFixed(1)}k - ₹${(profit * 1.2 / 1000).toFixed(1)}k`;

    let riskPenalty = 0;
    if (waterAvailability === "low" && fin.isWaterIntensive) riskPenalty += 30;
    if (ph > 8 || ph < 5) riskPenalty += 20;
    if (fin.risk === "High") riskPenalty += 15;

    const budgetFit = budget ? Math.min(100, (1 - (finalCost / budget)) * 100) : 100;

    const finalScore = (
      (suitability * 0.5) +
      (Math.min(100, Math.max(0, parseFloat(roiMax))) * 0.2) -
      (riskPenalty * 0.1) +
      (Math.max(0, budgetFit) * 0.2)
    );

    results.push({
      name: cropLabel.charAt(0).toUpperCase() + cropLabel.slice(1),
      suitability: Math.round(suitability),
      roi: roiRange,
      expectedProfit: profitRange,
      riskLevel: riskPenalty > 40 ? "High" : riskPenalty > 15 ? "Medium" : "Low",
      duration: fin.duration,
      type: fin.type,
      score: finalScore,
      strength: fin.strength,
      rotation: fin.rotation,
      marketInsight: marketPrices[cropLabel] ? "Live Mandi price found" : "Using average market price",
      why: `Optimized for ${region.name} with ${budgetFit > 50 ? 'available budget' : 'local climate'}.`
    });
  });

  const sortedResults = results.sort((a, b) => b.score - a.score).slice(0, 3);

  // 🔥 Final Recommendation Layer (Advisory)
  if (sortedResults.length > 0) {
    sortedResults[0].rankLabel = "🥇 Best Choice";
    if (sortedResults.length > 1) {
      const isSecondSafe = sortedResults[1].riskLevel === "Low" && sortedResults[0].riskLevel !== "Low";
      sortedResults[1].rankLabel = isSecondSafe ? "🥈 Safe Choice" : "🥈 Runner Up";
    }
    if (sortedResults.length > 2) {
      sortedResults[2].rankLabel = "🥉 Backup";
    }
  }

  if (sortedResults.length === 0) {
    return {
      success: false,
      message: "Criteria Mismatch",
      rejectionReason: rejections[0]?.reason || "No suitable crops found."
    };
  }

   return { success: true, data: sortedResults, insight: priceTrendMsg };
};
