import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * cropImageAI - Specialized tool for analyzing agricultural images using Gemini 1.5 Flash.
 */



const VISION_FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.7-flash",
  "gemini-flash-latest"
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes Gemini content generation with multi-model fallback and exponential backoff retry.
 */
async function generateContentWithFallback(genAI, parts, maxRetriesPerModel = 2) {
  let lastError = null;

  for (const modelName of VISION_FALLBACK_MODELS) {
    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        console.log(`[cropImageAI] Analyzing with model "${modelName}" (Attempt ${attempt}/${maxRetriesPerModel})...`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { responseMimeType: "application/json" }
        });
        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();
        if (text && text.trim().length > 0) {
          console.log(`[cropImageAI] Successfully analyzed image using model "${modelName}".`);
          return text;
        }
      } catch (error) {
        lastError = error;
        const status = error.status || error.statusCode;
        const isTemporary = status === 503 || status === 429 || status === 500 || status === 504 || 
          (error.message && (error.message.includes("503") || error.message.includes("high demand") || error.message.includes("quota")));

        console.warn(`[cropImageAI] Model "${modelName}" attempt ${attempt} failed: ${status || error.message}`);

        if (attempt < maxRetriesPerModel && isTemporary) {
          const waitTime = attempt * 1200;
          console.log(`[cropImageAI] Retrying "${modelName}" in ${waitTime}ms...`);
          await sleep(waitTime);
        } else {
          // Switch to next model in fallback list
          break;
        }
      }
    }
  }

  throw lastError || new Error("All Gemini vision models failed to respond.");
}

/**
 * Analyzes an image of a crop to detect health issues, diseases, or pests.
 * 
 * @param {Buffer} imageBuffer - The image data as a buffer.
 * @param {string} [mimetype="image/jpeg"] - The mimetype of the image.
 * @returns {Promise<Object>} - The analysis result.
 */
export const analyzeImage = async (imageBuffer, mimetype = "image/jpeg") => {
  if (!imageBuffer) {
    console.error("analyzeImage: No image buffer provided");
    return { detected: false, crop: null, issue: null, confidence: 0, description: "No image provided." };
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("analyzeImage: GEMINI_API_KEY is not configured");
    return { detected: false, crop: null, issue: null, confidence: 0, description: "AI service not configured." };
  }

  try {
    const base64Image = imageBuffer.toString("base64");
    console.log(`Starting Gemini analysis of crop image (${mimetype})...`);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const prompt = `You are a world-class plant pathologist and agricultural AI vision expert.
Analyze this crop image thoroughly for any plant health issues, diseases, pests, physiological disorders, or nutrient deficiencies.

Return ONLY a valid JSON object with the following strict keys:
- detected (boolean): true if a plant, crop, pest, disease, or deficiency is visible, false if non-agricultural image.
- crop (string): Identified plant/crop species (e.g. "Tomato", "Rice", "Maize", "Cotton", "Wheat", "Potato", "Apple").
- issue (string): Precise disease/pest/condition name with scientific name if known (e.g. "Early Blight (Alternaria solani)", "Fall Armyworm (Spodoptera frugiperda)", "Healthy Crop").
- severity (string): One of ["Critical", "High", "Moderate", "Low", "Healthy"].
- category (string): One of ["Fungal", "Bacterial", "Viral", "Pest/Insect", "Nutrient Deficiency", "Environmental Stress", "Healthy"].
- confidence (number): Diagnostic confidence percentage between 0 and 100.
- affectedParts (array of strings): Specific plant parts affected, e.g. ["Leaves", "Stems", "Fruit", "Under-leaf"].
- symptoms (array of strings): List of 3-5 distinct visible physical symptoms (e.g., "Concentric dark brown leaf spots", "Chlorotic yellow halo around lesions", "Leaf drop on lower foliage").
- description (string): Comprehensive 3-4 sentence professional visual inspection summary detailing location of damage, lesion size/color, leaf texture change, and stage of spread.

Do not include any markdown fences (like \`\`\`json). Output raw JSON text only.`;

    const text = await generateContentWithFallback(genAI, [
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimetype
        }
      }
    ]);
    
    // Clean potential markdown or extra whitespace & extract JSON block safely
    const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    const jsonResult = JSON.parse(jsonMatch ? jsonMatch[0] : cleanedText);

    return {
      detected: jsonResult.detected ?? false,
      crop: jsonResult.crop || "Crop",
      issue: jsonResult.issue || "Unspecified Condition",
      severity: jsonResult.severity || (jsonResult.detected ? "Moderate" : "Healthy"),
      category: jsonResult.category || "General",
      confidence: Math.min(100, Math.max(0, Number(jsonResult.confidence) || 85)),
      affectedParts: Array.isArray(jsonResult.affectedParts) ? jsonResult.affectedParts : ["Leaves"],
      symptoms: Array.isArray(jsonResult.symptoms) ? jsonResult.symptoms : [],
      description: jsonResult.description || "Visual inspection performed on crop image."
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { 
      detected: false, 
      crop: null, 
      issue: null, 
      severity: "Low",
      category: "Unknown",
      confidence: 0, 
      affectedParts: [],
      symptoms: [],
      error: error.message 
    };
  }
};
