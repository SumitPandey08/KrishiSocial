import { analyzeImage } from "../tools/cropImageAI.js";
import { searchAdvisory } from "../config/vector.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CHAT_FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.7-flash",
  "gemini-flash-latest"
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Builds a beautiful, comprehensive Markdown prescription report from diagnostic findings and structured AI data.
 */
function buildRecommendationMarkdown(det, structuredData) {
  let md = `## 🌾 AI Crop Diagnostic & Prescription Report\n\n`;
  md += `**Target Crop:** ${det.crop || 'Plant'} | **Diagnosis:** ${det.issue || 'Condition'} (${det.category || 'General'})\n\n`;
  md += `**Severity:** ${det.severity || 'Moderate'} | **AI Confidence:** ${det.confidence || 85}%\n\n`;

  if (det.description) {
    md += `### 🔍 Visual Diagnostic Findings\n${det.description}\n\n`;
  }

  if (structuredData?.summary) {
    md += `### 📋 Agronomist Summary\n${structuredData.summary}\n\n`;
  }

  if (structuredData?.immediateActions && structuredData.immediateActions.length > 0) {
    md += `### ⚡ Urgent Immediate Actions (First 24-48 Hours)\n`;
    structuredData.immediateActions.forEach((act, idx) => {
      md += `${idx + 1}. **Step ${idx + 1}:** ${act}\n`;
    });
    md += `\n`;
  }

  if (structuredData?.organicCure && structuredData.organicCure.length > 0) {
    md += `### 🌱 Eco-Friendly & Organic Treatments\n`;
    structuredData.organicCure.forEach((cure) => {
      md += `- ${cure}\n`;
    });
    md += `\n`;
  }

  if (structuredData?.chemicalCure && structuredData.chemicalCure.length > 0) {
    md += `### 🧪 Chemical Prescriptions & Recommended Dosages\n`;
    structuredData.chemicalCure.forEach((chem, idx) => {
      md += `#### Option ${idx + 1}: ${chem.name || 'Treatment'}\n`;
      md += `- **Dosage:** ${chem.dosage || 'Refer to manufacturer label'}\n`;
      md += `- **Timing:** ${chem.timing || 'Spray early morning or late evening'}\n`;
      if (chem.precautions) {
        md += `- **Safety & Precautions:** ${chem.precautions}\n`;
      }
      md += `\n`;
    });
  }

  if (structuredData?.prevention && structuredData.prevention.length > 0) {
    md += `### 🛡️ Long-term Field Prevention & Cultural Practices\n`;
    structuredData.prevention.forEach((prev) => {
      md += `- ${prev}\n`;
    });
    md += `\n`;
  }

  if (structuredData?.fertilizerWateringAdvice) {
    md += `### 💧 Irrigation & Fertilizer Management\n${structuredData.fertilizerWateringAdvice}\n`;
  }

  return md.trim();
}

/**
 * Invokes Gemini with fallback models and JSON mode enabled.
 */
async function generateStructuredRecommendation(promptText, maxRetries = 2) {
  let lastError = null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  for (const modelName of CHAT_FALLBACK_MODELS) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[DiseaseAgent] Synthesizing recommendation with model "${modelName}" (Attempt ${attempt}/${maxRetries})...`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json"
          }
        });

        const result = await model.generateContent(promptText);
        const response = await result.response;
        const text = response.text();

        if (text && text.trim().length > 0) {
          console.log(`[DiseaseAgent] Successfully synthesized recommendation with model "${modelName}".`);
          return text;
        }
      } catch (error) {
        lastError = error;
        const status = error.status || error.statusCode;
        const isTemporary = status === 503 || status === 429 || status === 500 || status === 504 || 
          (error.message && (error.message.includes("503") || error.message.includes("high demand") || error.message.includes("quota")));

        console.warn(`[DiseaseAgent] Model "${modelName}" attempt ${attempt} failed: ${status || error.message}`);

        if (attempt < maxRetries && isTemporary) {
          const waitTime = attempt * 1200;
          console.log(`[DiseaseAgent] Retrying "${modelName}" in ${waitTime}ms...`);
          await sleep(waitTime);
        } else {
          break;
        }
      }
    }
  }

  throw lastError || new Error("All Gemini models failed for recommendation synthesis.");
}

/**
 * Disease Detection and Cure Recommendation Agent
 * 
 * Flow:
 * 1. Image AI -> Detect disease/pest from image
 * 2. RAG Advisory -> Fetch relevant scientific/expert advice
 * 3. Recommendation -> Synthesize final recommendation for farmer
 */
export const diseaseAgent = async (imageBuffer, mimetype) => {
  try {
    // 1. Analyze Image with Vision AI
    console.log("Disease Agent: Analyzing crop image...");
    const detectionResults = await analyzeImage(imageBuffer, mimetype);
    
    if (detectionResults?.error) {
      return {
        success: false,
        error: detectionResults.error,
        message: "AI Vision analysis temporarily unavailable due to high demand. Please try again shortly.",
        detection: detectionResults
      };
    }

    if (!detectionResults || !detectionResults.detected) {
      return {
        success: false,
        message: detectionResults?.description || "No crop disease, pest, or nutrient deficiency detected in the provided image.",
        detection: detectionResults
      };
    }

    const { crop, issue, severity, category, confidence, affectedParts, symptoms, description } = detectionResults;

    // 2. RAG - Search vector database for advisory content
    console.log(`Disease Agent: Searching advisory vector DB for ${crop} - ${issue}...`);
    const searchQuery = `${crop} ${issue} ${category} cure treatment chemical biological organic dosage prevention symptoms`;
    const advisoryResults = await searchAdvisory(searchQuery);

    const context = advisoryResults.map(r => r.text).join("\n\n");

    // 3. Synthesize Comprehensive Structured Recommendation with Gemini
    console.log("Disease Agent: Synthesizing expert recommendation...");

    const promptText = `You are an expert agronomist, plant pathologist, and crop protection advisor.
A farmer has uploaded an image of their crop. Here are the visual diagnostic findings:
- Crop: ${crop}
- Identified Issue: ${issue}
- Category: ${category}
- Severity Level: ${severity}
- Confidence Score: ${confidence}%
- Affected Parts: ${(affectedParts || []).join(", ")}
- Observed Symptoms: ${(symptoms || []).join("; ")}
- Visual Inspection: ${description}

Scientific Advisory Context:
${context || "No specific vector document matched. Relying on expert agronomic knowledge base."}

Return a valid JSON object matching this exact structure:
{
  "summary": "Clear 2-3 sentence explanation of the disease/pest, how it damages the crop, and urgency.",
  "immediateActions": [
    "Step 1: Specific urgent physical/cultural step",
    "Step 2: Second immediate action to prevent field spread",
    "Step 3: Third action regarding infected plant material"
  ],
  "organicCure": [
    "Biological/Organic option 1 (e.g. Neem oil 10,000 PPM @ 3ml/L water)",
    "Biological/Organic option 2 (e.g. Trichoderma viride application)"
  ],
  "chemicalCure": [
    {
      "name": "Chemical Product / Active Ingredient (e.g. Mancozeb 75% WP)",
      "dosage": "Exact Dosage (e.g. 2.0 to 2.5 grams per Liter of water)",
      "timing": "Application Frequency (e.g. Spray every 7-10 days at morning/evening)",
      "precautions": "Safety gear, wind warning, or harvest interval (PHI)"
    }
  ],
  "prevention": [
    "Long-term cultural practice 1 (e.g. Crop rotation with non-host crops)",
    "Cultural practice 2 (e.g. Field sanitation and weed management)",
    "Resistant cultivars or soil solarization advice"
  ],
  "fertilizerWateringAdvice": "Specific irrigation adjustments (e.g. avoid overhead watering) and foliage/soil nutrition to accelerate crop recovery."
}`;

    const rawJsonText = await generateStructuredRecommendation(promptText);

    // Parse AI output JSON safely
    let structuredData = null;
    try {
      const cleaned = rawJsonText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      structuredData = JSON.parse(match ? match[0] : cleaned);
    } catch (parseErr) {
      console.warn("Could not parse structured JSON from AI output:", parseErr);
    }

    const recommendationMarkdown = buildRecommendationMarkdown(detectionResults, structuredData);

    return {
      success: true,
      detection: {
        detected: true,
        crop,
        issue,
        severity,
        category,
        confidence,
        affectedParts,
        symptoms,
        description
      },
      structuredData,
      recommendation: recommendationMarkdown,
      sources: advisoryResults.map(r => r.metadata?.source || r.metadata?.title).filter(Boolean)
    };

  } catch (error) {
    console.error("Disease Agent Error:", error);
    throw error;
  }
};
