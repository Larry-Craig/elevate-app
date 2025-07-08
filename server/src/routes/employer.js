import express from "express";
import { postJob, getMyJobs } from "../controllers/employerJobController.js";
import { protect } from "../middleware/auth.js";
import { isEmployer } from "../middleware/role.js";

const router = express.Router();

// ✅ Test route
router.get("/test", (req, res) => {
  res.json({ msg: "Employer route is working!" });
});

// ✅ Employer job routes
router.post("/jobs", protect, isEmployer, postJob);
router.get("/jobs", protect, isEmployer, getMyJobs);

export default router;
