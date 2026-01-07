import { Router } from "express";
import {
	changePassword,
	forgotPassword,
	login,
	logout,
	logoutAll,
	refreshToken,
	resendOtp,
	resetPassword,
	signup,
	verifyEmail,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authLimiter, otpLimiter } from "../middleware/rate-limiter.middleware";

const router = Router();

// Public routes
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", authMiddleware, logout);
router.post("/logout-all", authMiddleware, logoutAll);
router.post("/refresh-token", authLimiter, refreshToken);
router.post("/verify-email", otpLimiter, verifyEmail);
router.post("/resend-otp", otpLimiter, resendOtp);
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/reset-password", otpLimiter, resetPassword);

// Protected routes
router.post("/change-password", authMiddleware, changePassword);

export default router;
