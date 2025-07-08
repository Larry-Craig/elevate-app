import jwt from "jsonwebtoken";

// middleware/auth.js
export const isSeeker = (req, res, next) => {
  if (req.user.role !== "seeker") {
    return res.status(403).json({ msg: "Access denied. Only seekers allowed." });
  }
  next();
};

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
};
