import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user document from DB (excluding password)
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }

      req.user = user; // full user document attached

      next();
    } catch (err) {
      console.error("Invalid token:", err);
      return res.status(401).json({ msg: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ msg: "Not authorized, no token" });
  }
};
