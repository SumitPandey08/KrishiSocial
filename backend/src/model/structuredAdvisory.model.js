import mongoose from "mongoose";

const structuredAdvisorySchema = new mongoose.Schema({
  crop: { type: String, required: true, index: true },
  issue: { type: String, required: true, index: true }, 
  category: { 
    type: String, 
    enum: ['pest', 'disease', 'deficiency', 'weed', 'general'],
    required: true 
  },
  description: String,
  symptoms: [String],
  management: {
    cultural: [String],
    biological: [String],
    chemical: [{
      name: String,
      dosage: String,
      instructions: String
    }]
  },
  preventiveMeasures: [String],
  source: {
    file: String,
    page: Number
  },
  embedding: {
    type: [Number],
    required: true
  }
}, { timestamps: true });

structuredAdvisorySchema.index({ crop: 'text', issue: 'text', symptoms: 'text' });

const StructuredAdvisory = mongoose.model("StructuredAdvisory", structuredAdvisorySchema);

export default StructuredAdvisory;
