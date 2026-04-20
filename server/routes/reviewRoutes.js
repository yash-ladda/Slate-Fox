import express from "express";
import { submitOrUpdateReview, getMyReviewForJob } from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST covers both Create and Update due to Upsert logic
router.post("/", requireAuth, submitOrUpdateReview);

// GET to check if the user has already reviewed this person for this job
router.get("/check", requireAuth, getMyReviewForJob);

export default router;