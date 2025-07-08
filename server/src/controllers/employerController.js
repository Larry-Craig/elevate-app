import Job from "../models/Job.js";

export const postJob = async (req, res) => {
  try {
    console.log("✔ Received job post request");

    // Use req.user._id (MongoDB ObjectId) for creator reference
    const employerId = req.user?._id || null;

    // Create new job, ensuring employer field is set correctly
     const newJob = new Job({ ...req.body, postedBy: employerId });

    await newJob.save();

    res.status(201).json({ msg: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error("Job posting error:", err);
    res.status(500).json({ msg: "Job posting failed", error: err.message });
  }
};
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    console.error("Failed to fetch employer jobs:", err);
    res.status(500).json({ msg: "Failed to fetch your jobs", error: err.message });
  }
};