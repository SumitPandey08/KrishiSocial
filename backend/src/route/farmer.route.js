import express from "express";
import { getWeather, diagnoseCrop, getAdvisory } from "../controller/farmer.control.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/weather", getWeather);
router.post("/diagnose", diagnoseCrop);
router.get("/advisory", getAdvisory);

export default router;