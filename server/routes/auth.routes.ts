import { Router } from "express";
import {
	login,
	logout,
	resendOtp,
	signup,
} from "../controllers/auth.controller";
import { authLimiter, otpLimiter } from "../middleware/rate-limiter.middleware";

const router = Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", authLimiter, logout);
router.post("/resend-otp", otpLimiter, resendOtp);

export default router;
