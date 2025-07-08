import multer from "multer";
import path from "path";

// Storage config: store files in /uploads/resumes with unique filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes"); // make sure this folder exists or create it
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter to accept only PDF/DOC/DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
