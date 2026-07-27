import { analyzeImage } from "../tools/cropImageAI.js";
import { searchAdvisory } from "../config/vector.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

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
    
    if (!detectionResults || !detectionResults.detected) {
      return {
        success: false,
        message: detectionResults.description || "No crop disease, pest, or nutrient deficiency detected in the provided image.",
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
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-flash-latest",
      maxOutputTokens: 3000,
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = PromptTemplate.fromTemplate(`
You are an expert agronomist, plant pathologist, and crop protection advisor.
A farmer has uploaded an image of their crop. Here are the visual diagnostic findings:
- Crop: {crop}
- Identified Issue: {issue}
- Category: {category}
- Severity Level: {severity}
- Confidence Score: {confidence}%
- Affected Parts: {affectedParts}
- Observed Symptoms: {symptoms}
- Visual Inspection: {description}

Using the verified scientific advisory context provided below, construct a comprehensive, highly practical treatment & management plan for the farmer.

Scientific Advisory Context:
{context}

Return ONLY a valid JSON object matching this exact structure:
{{
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
    {{
      "name": "Chemical Product / Active Ingredient (e.g. Mancozeb 75% WP)",
      "dosage": "Exact Dosage (e.g. 2.0 to 2.5 grams per Liter of water)",
      "timing": "Application Frequency (e.g. Spray every 7-10 days at morning/evening)",
      "precautions": "Safety gear, wind warning, or harvest interval (PHI)"
    }}
  ],
  "prevention": [
    "Long-term cultural practice 1 (e.g. Crop rotation with non-host crops)",
    "Cultural practice 2 (e.g. Field sanitation and weed management)",
    "Resistant cultivars or soil solarization advice"
  ],
  "fertilizerWateringAdvice": "Specific irrigation adjustments (e.g. avoid overhead watering) and foliage/soil nutrition to accelerate crop recovery.",
  "recommendationMarkdown": "A fully detailed, beautifully structured markdown report including headings (##), bold key terms, numbered steps, and bullet points."
}}

Do not include markdown code block backticks (like \`\`\`json). Output raw JSON text only.
    `);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const aiOutput = await chain.invoke({
      crop,
      issue,
      category,
      severity,
      confidence,
      affectedParts: (affectedParts || []).join(", "),
      symptoms: (symptoms || []).join("; "),
      description,
      context: context || "No specific vector document matched. Relying on expert agronomic knowledge base."
    });

    // Parse AI output JSON safely
    let structuredData = null;
    let fallbackMarkdown = aiOutput;

    try {
      const cleaned = aiOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      structuredData = JSON.parse(match ? match[0] : cleaned);
      if (structuredData.recommendationMarkdown) {
        fallbackMarkdown = structuredData.recommendationMarkdown;
      }
    } catch (parseErr) {
      console.warn("Could not parse structured JSON from AI output, using raw text fallback.", parseErr);
    }

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
      recommendation: fallbackMarkdown,
      sources: advisoryResults.map(r => r.metadata?.source || r.metadata?.title).filter(Boolean)
    };

  } catch (error) {
    console.error("Disease Agent Error:", error);
    throw error;
  }
};
