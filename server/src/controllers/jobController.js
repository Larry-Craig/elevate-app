// server/src/controllers/jobController.js

import Job from "../models/Job.js";
import Application from "../models/Application.js";

// GET all jobs with optional filters
export const getAllJobs = async (req, res) => {
  try {
    const { keyword = "", location = "", jobType = "" } = req.query;

    const filter = {};

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ msg: "Failed to fetch jobs", error: err.message });
  }
};

// GET job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.status(200).json({ job });
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ msg: "Failed to fetch job", error: err.message });
  }
};

// POST Apply to a job
export const applyToJob = async (req, res) => {
  try {
    const applicantId = req.user._id;
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: applicantId,
    });
    if (existingApplication) {
      return res.status(400).json({ msg: "You have already applied to this job" });
    }

    const application = new Application({
      job: jobId,
      applicant: applicantId,
      resume: req.file ? req.file.path : "",
      coverLetter: req.body.coverLetter || "",
      status: "Pending",
      appliedAt: new Date(),
    });

    await application.save();

    res.status(201).json({ msg: "Application submitted successfully", application });
  } catch (err) {
    console.error("Apply to job error:", err);
    res.status(500).json({ msg: "Failed to apply to job", error: err.message });
  }
};
