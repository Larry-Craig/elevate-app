// server/src/controllers/savedJobController.js
import SavedJob from "../models/SavedJob.js";
import Job from "../models/Job.js";

export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id }).populate("job").sort({ savedAt: -1 });
    const jobs = savedJobs.map((item) => item.job);
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch saved jobs", error: err.message });
  }
};

export const saveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // Check if already saved
    const existing = await SavedJob.findOne({ user: userId, job: jobId });
    if (existing) return res.status(400).json({ msg: "Job already saved" });

    const savedJob = new SavedJob({ user: userId, job: jobId });
    await savedJob.save();

    res.status(201).json({ msg: "Job saved successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to save job", error: err.message });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    const deleted = await SavedJob.findOneAndDelete({ user: userId, job: jobId });
    if (!deleted) return res.status(404).json({ msg: "Saved job not found" });

    res.json({ msg: "Job unsaved successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to unsave job", error: err.message });
  }
};
