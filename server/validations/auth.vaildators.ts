import { z } from "zod";

const emailSchema = z
	.string()
	.trim()
	.email("Invalid email format")
	.max(254, "Email too long");

const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.max(128, "Password must not exceed 128 characters")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(
		/[^A-Za-z0-9]/,
		"Password must contain at least one special character",
	);

const otpSchema = z
	.string()
	.length(6, "OTP must be exactly 6 digits")
	.regex(/^\d{6}$/, "OTP must contain only digits");

const idSchema = z.string().uuid("Invalid ID");

export const signupSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	name: z.string().trim().max(100, "Name too long"),
});

export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
	email: emailSchema,
	otp: otpSchema,
});

export const resendOtpSchema = z.object({
	email: emailSchema,
});

export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

export const resetPasswordSchema = z.object({
	token: z.string().min(1, "Reset token is required"),
	newPassword: passwordSchema,
});

export const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: passwordSchema,
});

export const refreshTokenSchema = z.object({
	userId: idSchema,
	refreshToken: z.string().min(1, "Refresh token is required"),
});

export const googleLoginSchema = z.object({
	idToken: z.string().min(1, "Google ID token is required"),
});

export const contactUsSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
	email: emailSchema,
	message: z
		.string()
		.trim()
		.min(10, "Message must be at least 10 characters")
		.max(2000, "Message too long"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
export type ContactUsInput = z.infer<typeof contactUsSchema>;
