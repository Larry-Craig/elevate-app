// routes/savedJob.js
import express from 'express';
import { getSavedJobs, saveJob, unsaveJob } from '../controllers/savedJobController.js';
import { protect } from '../middleware/authMiddleware.js'; // auth middleware

const router = express.Router();

router.get('/', protect, getSavedJobs);
router.post('/save/:jobId', protect, saveJob);
router.delete('/unsave/:jobId', protect, unsaveJob);

export default router;
