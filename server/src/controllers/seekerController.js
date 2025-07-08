import User from "../models/User.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import Application from "../models/Application.js";

export const applyToJob = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const { jobId, coverLetter } = req.body;
    const resumePath = req.file ? req.file.path : null;

    const application = new Application({
      seeker: seekerId,
      job: jobId,
      coverLetter,
      resume: resumePath,
    });

    await application.save();
    res.status(201).json({ msg: "Application submitted", application });
  } catch (err) {
    res.status(500).json({ msg: "Application failed", error: err.message });
  }
};

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads/resumes";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + file.fieldname + ext;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowed = [".pdf", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

export const updateSeekerProfile = async (req, res) => {
  const { email, name, location, phone, summary } = req.body;
  const resume = req.file ? req.file.filename : null;

  try {
    const user = await User.findOne({ email, role: "seeker" });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = name;
    user.location = location;
    user.phone = phone;
    user.summary = summary;
    if (resume) user.resume = resume;

    await user.save();
    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Error updating profile", error: err.message });
  }
};
