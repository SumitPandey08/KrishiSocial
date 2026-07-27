import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import StructuredAdvisory from '../model/structuredAdvisory.model.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

dotenv.config();

const RAW_DIR = path.join(process.cwd(), '../agri-data/raw-pdfs');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "models/gemini-embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runStructuredIngestion() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        console.error("Neither MONGODB_URI nor MONGO_URI is missing in .env");
        process.exit(1);
    }
    
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully.");
    } catch (connError) {
        console.error("MongoDB Connection Error:", connError.message);
        process.exit(1);
    }

    const files = fs.readdirSync(RAW_DIR);
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));

    for (const file of pdfFiles) {
        console.log(`Processing ${file}...`);
        const filePath = path.join(RAW_DIR, file);
        
        try {
            const text = execSync(`pdftotext "${filePath}" -`).toString();
            const chunks = chunkText(text, 10000, 1000); 
            
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                console.log(`  Extracting structured data from chunk ${i+1}/${chunks.length} of ${file}`);
                
                let structuredData = null;
                let retries = 3;
                while (retries > 0) {
                    try {
                        structuredData = await extractDataWithGemini(chunk);
                        break;
                    } catch (err) {
                        if (err.message.includes('429')) {
                            console.log(`    ⚠️ Rate limited. Waiting 30s... (${retries} retries left)`);
                            await sleep(30000);
                            retries--;
                        } else {
                            console.error(`    ❌ Extraction failed:`, err.message);
                            break;
                        }
                    }
                }
                
                if (structuredData && Array.isArray(structuredData)) {
                    for (const item of structuredData) {
                        if (!item.crop || !item.issue) continue;

                        const embedText = `${item.crop} ${item.issue} ${item.category} ${item.description} ${(item.symptoms || []).join(' ')}`;
                        
                        try {
                            const vector = await embeddings.embedQuery(embedText);
                            
                            await StructuredAdvisory.create({
                                ...item,
                                source: { file, page: i + 1 },
                                embedding: vector
                            });
                            console.log(`    ✅ Saved: ${item.crop} - ${item.issue}`);
                        } catch (embedError) {
                            console.error(`    ❌ Embedding error for ${item.issue}:`, embedError.message);
                        }
                    }
                }
                
                // Add a small delay between chunks even if successful to stay under rate limits
                await sleep(5000);
            }
            console.log(`Completed ${file}`);
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    }

    console.log("Structured Ingestion complete.");
    process.exit(0);
}

async function extractDataWithGemini(text) {
    const prompt = `
    You are an expert agricultural scientist. Extract structured information about crop pests, diseases, or deficiencies from the text provided.
    Return ONLY a JSON array of objects. Each object MUST follow this schema:
    {
      "crop": "string (the main crop affected)",
      "issue": "string (name of pest, disease, or deficiency)",
      "category": "string (one of: 'pest', 'disease', 'deficiency', 'weed', 'general')",
      "description": "string (brief summary of the issue)",
      "symptoms": ["string array of physical symptoms"],
      "management": {
        "cultural": ["string array of farming practices"],
        "biological": ["string array of biological control methods"],
        "chemical": [{
          "name": "string (pesticide/fungicide name)",
          "dosage": "string (recommended quantity)",
          "instructions": "string (how to apply)"
        }]
      },
      "preventiveMeasures": ["string array of ways to prevent this issue"]
    }
    
    Rules:
    - If the text doesn't contain enough info for a field, use an empty array or null.
    - If no agricultural issues are found, return [].
    - DO NOT include markdown like \`\`\`json.
    - Focus on accuracy and technical names.
    
    TEXT:
    ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
        return JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("    ❌ JSON Parse error. Raw response sample:", responseText.substring(0, 100));
        return [];
    }
}

function chunkText(text, size, overlap) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        let end = start + size;
        chunks.push(text.substring(start, end).trim());
        start += (size - overlap);
    }
    return chunks.filter(c => c.length > 500);
}

runStructuredIngestion().catch(err => {
    console.error(err);
    process.exit(1);
});
