// server/src/models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    type: String,
  },
  coverLetter: {
    type: String,
  },
  status: {
    type: String,
    default: "Pending", // could be "Pending", "Reviewed", "Rejected", etc.
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
