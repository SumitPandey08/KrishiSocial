import { getCropRecommendation } from "../controller/agent.control.js";
import express from "express";

const router = express.Router();

router.get("/crop-recommendation", getCropRecommendation);

export default router;