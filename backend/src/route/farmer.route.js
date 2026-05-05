import express from "express";
import { getWeather, diagnoseCrop, getAdvisory, getMandiPrices, recommendCrops } from "../controller/farmer.control.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes

// Protected routes
router.use(protect);

router.post("/diagnose", diagnoseCrop);
router.get("/advisory", getAdvisory);

router.get("/mandi", getMandiPrices);
router.get("/weather", getWeather);
router.get("/recommend", recommendCrops);

export default router;