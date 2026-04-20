import express from "express";
import { login, signup, getCurrentUser, getUserById, updateProfile } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, getCurrentUser);
router.get("/profile/:userId", getUserById);
router.patch("/profile/:userId", requireAuth, updateProfile);

export default router;