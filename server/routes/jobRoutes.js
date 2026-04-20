import express from "express";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    cancelJob,
    getMyPostedJobs,
    getDashboardStats
} from "../controllers/jobController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-jobs", requireAuth, getMyPostedJobs);

router.get("/", getAllJobs);
router.get("/stats", requireAuth, getDashboardStats);
router.get("/:jobId", getJobById);

router.post("/", requireAuth, createJob);
router.put("/:jobId", requireAuth, updateJob);
router.patch("/:jobId/cancel", requireAuth, cancelJob);

export default router;