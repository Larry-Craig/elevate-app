import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Random OTP generator
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Elevate Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <b>${otp}</b></p>`,
  });
};

// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const newUser = new User({
      email,
      password: hashed,
      role,
      otp,
      otpExpires,
      isVerified: false,
    });

    await newUser.save();
    await sendOtpEmail(email, otp);

    res.json({ msg: "Signup successful. OTP sent to email." });
  } catch (err) {
    console.error("REGISTER ERROR:", err);  // 👈 Add this
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ msg: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ msg: "OTP verification failed", error: err.message });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    if (!user.isVerified) {
      return res.status(401).json({ msg: "Email not verified" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ msg: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};
