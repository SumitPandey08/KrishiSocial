import { getCropRecommendation, detectDisease } from "../controller/agent.control.js";
import express from "express";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/crop-recommendation", getCropRecommendation);
router.post("/detect-disease", upload.single("image"), detectDisease);

export default router;
