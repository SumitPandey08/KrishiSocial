import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Advisory from '../model/advisory.model.js';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

dotenv.config();

const RAW_DIR = path.join(process.cwd(), '../agri-data/raw-pdfs');

async function runIngestion() {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is missing in .env");
        process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "models/gemini-embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        apiKey: process.env.GEMINI_API_KEY,
    });

    const files = fs.readdirSync(RAW_DIR);
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));

    for (const file of pdfFiles) {
        console.log(`Processing ${file}...`);
        const filePath = path.join(RAW_DIR, file);
        
        try {
            const text = execSync(`pdftotext "${filePath}" -`).toString();
            const chunks = chunkText(text, 1000, 200);
            
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                console.log(`  Vectorizing chunk ${i+1}/${chunks.length} for ${file}`);
                
                const vector = await embeddings.embedQuery(chunk);
                
                await Advisory.create({
                    text: chunk,
                    embedding: vector,
                metadata: {
                        source: file,
                        chunkIndex: i
                    }
                });
            }
            console.log(`Completed ${file}`);
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    }

    console.log("Ingestion complete.");
    process.exit(0);
}

function chunkText(text, size, overlap) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        let end = start + size;
        chunks.push(text.substring(start, end).trim());
        start += (size - overlap);
    }
    return chunks.filter(c => c.length > 100);
}

runIngestion().catch(err => {
    console.error(err);
    process.exit(1);
});
