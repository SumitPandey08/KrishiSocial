import Advisory from "../model/advisory.model.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: "models/gemini-embedding-001",
  taskType: TaskType.RETRIEVAL_QUERY,
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Calculates cosine similarity between two vector arrays
 */
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const searchAdvisory = async (query, limit = 5) => {
  try {
    console.log(`[RAG Engine] Generating query embedding for: "${query}"...`);
    const queryVector = await embeddings.embedQuery(query);

    // 1. Try MongoDB Atlas Native $vectorSearch stage
    try {
      const atlasResults = await Advisory.aggregate([
        {
          "$vectorSearch": {
            "index": "vector",
            "path": "embedding",
            "queryVector": queryVector,
            "numCandidates": 100,
            "limit": limit
          }
        },
        {
          "$project": {
            "text": 1,
            "metadata": 1,
            "score": { "$meta": "vectorSearchScore" }
          }
        }
      ]);

      if (atlasResults && atlasResults.length > 0) {
        console.log(`[RAG Engine] MongoDB Atlas Vector Search returned ${atlasResults.length} matches.`);
        return atlasResults;
      }
    } catch (atlasErr) {
      console.log(`[RAG Engine] Atlas $vectorSearch index notice: ${atlasErr.message}. Falling back to in-memory vector similarity...`);
    }

    // 2. Vector Cosine Similarity Search Fallback over ingested documents
    console.log(`[RAG Engine] Running vector similarity search over database documents...`);
    const docs = await Advisory.find({}, { text: 1, metadata: 1, embedding: 1 });

    if (!docs || docs.length === 0) {
      console.log(`[RAG Engine] No advisory documents found in database.`);
      return [];
    }

    const scoredDocs = docs
      .map(doc => ({
        text: doc.text,
        metadata: doc.metadata,
        score: cosineSimilarity(queryVector, doc.embedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    console.log(`[RAG Engine] Vector similarity search retrieved ${scoredDocs.length} top scientific matches (Top score: ${scoredDocs[0]?.score?.toFixed(4)})`);
    return scoredDocs;

  } catch (error) {
    console.error("Vector Search Error:", error);
    return [];
  }
};
