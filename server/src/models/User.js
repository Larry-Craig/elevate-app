import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["seeker", "employer"], required: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,

  // Seeker Profile Info
  name: String,
  location: String,
  phone: String,
  summary: String,
  resume: String, // store filename or cloud URL
});

const User = mongoose.model("User", userSchema);
export default User;

