import express from "express";
import {
    applyToJob,
    getApplicationsByJob,
    getUserApplications,
    updateApplicationStatus,
    cancelApplication,
} from "../controllers/applicationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", requireAuth, applyToJob);

router.get("/me", requireAuth, getUserApplications);

router.get("/jobs/:jobId", requireAuth, getApplicationsByJob);

router.patch("/:application_id", requireAuth, updateApplicationStatus);

router.delete("/jobs/:jobId/cancel", requireAuth, cancelApplication);

export default router;