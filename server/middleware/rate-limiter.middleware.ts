import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5,
	message: { error: "Too many requests, please try again later." },
	standardHeaders: true,
	legacyHeaders: false,
});

export const otpLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 3,
	message: { error: "Too many OTP requests, please try again later." },
	standardHeaders: true,
	legacyHeaders: false,
});

export const generalRateLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 100,
	message: { error: "Rate limit exceeded" },
	standardHeaders: true,
	legacyHeaders: false,
});
