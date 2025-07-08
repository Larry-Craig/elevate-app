// server/src/middleware/role.js

export const isEmployer = (req, res, next) => {
  if (req.user?.role !== "employer") {
    return res.status(403).json({ msg: "Access denied. Only employers allowed." });
  }
  next();
};

export const isSeeker = (req, res, next) => {
  if (req.user?.role !== "seeker") {
    return res.status(403).json({ msg: "Access denied. Only job seekers allowed." });
  }
  next();
};
