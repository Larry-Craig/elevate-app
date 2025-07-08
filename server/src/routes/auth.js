import express from "express";
import { register, verifyOtp, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);  // <-- this line must exist!

export default router;
