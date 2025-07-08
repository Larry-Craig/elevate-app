import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyToJob = async (req, res) => {
  try {
    const { coverLetter = "", additionalAnswers = "" } = req.body;
    const { jobId } = req.params;
    const applicantId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const resume = req.file ? `/uploads/resumes/${req.file.filename}` : null;

    const application = new Application({
      job: jobId,
      applicant: applicantId,
      resume,
      coverLetter,
      additionalAnswers,
    });

    await application.save();

    res.status(201).json({ msg: "✅ Application submitted successfully" });
  } catch (err) {
    console.error("❌ Application error:", err);
    res.status(500).json({ msg: "❌ Application failed", error: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const seekerId = req.user.id;

    const applications = await Application.find({ applicant: seekerId })
      .populate("job", "title location jobType")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch applications", error: err.message });
  }
};
