import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { applyToJob } from "../controllers/seekerController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/resumes/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});
const upload = multer({ storage });

router.post("/apply", protect, upload.single("resume"), applyToJob);

export default router;
