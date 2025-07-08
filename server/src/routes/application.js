import express from "express";
import {
  applyToJob,
  getMyApplications, // ✅ new import
} from "../controllers/applicationController.js";
import { protect, isSeeker } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Apply to job
router.post("/apply", protect, isSeeker, upload.single("resume"), applyToJob);

// Get all applications of logged-in job seeker
router.get("/mine", protect, isSeeker, getMyApplications); // ✅ new route

export default router;
