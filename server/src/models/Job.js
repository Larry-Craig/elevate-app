// models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  jobType: { type: String, default: "Full-time" },
  salary: String,
  requirements: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  applications: [
    {
      seeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
