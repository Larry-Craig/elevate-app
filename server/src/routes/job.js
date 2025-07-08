import express from "express";
import { getAllJobs, getJobById, applyToJob } from "../controllers/jobController.js";
import { protect } from "../middleware/auth.js";      // Auth middleware that sets req.user
import { isSeeker } from "../middleware/role.js";      // Role check middleware

const router = express.Router();

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Protected route: only logged-in seekers can apply
router.post("/apply/:jobId", protect, isSeeker, applyToJob);

export default router;

