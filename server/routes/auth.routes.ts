import { Router } from "express";
import { login, resendOtp, signup } from "../controllers/auth.controller";
import { authLimiter, otpLimiter } from "../middleware/rate-limiter.middleware";

const router = Router();

// Apply auth rate limiter to sensitive auth endpoints
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);

// OTP endpoints have stricter limits
router.post("/resend-otp", otpLimiter, resendOtp);

export default router;
