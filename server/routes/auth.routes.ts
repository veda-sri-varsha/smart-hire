import { Router } from "express";
import { login, resendOtp, signup,logout } from "../controllers/auth.controller";
import { authLimiter, otpLimiter } from "../middleware/rate-limiter.middleware";

const router = Router();

// Apply auth rate limiter to sensitive auth endpoints
router.post("/signup", authLimiter, signup);
router.post("/logizn", authLimiter, login);
router.post("/logout", authLimiter, logout);

// OTP endpoints have stricter limits
router.post("/resend-otp", otpLimiter, resendOtp);

export default router;
