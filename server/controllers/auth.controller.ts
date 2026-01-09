import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { authService } from "../services/auth.service";
import type { AuthUserResponse } from "../types/auth.types";
import ApiResponse from "../utils/api-response";
import {
	accessTokenCookieOptions,
	clearCookieOptions,
	refreshTokenCookieOptions,
} from "../utils/cookie";
import handler from "../utils/handler";
import {
	changePasswordSchema,
	forgotPasswordSchema,
	loginSchema,
	resendOtpSchema,
	resetPasswordSchema,
	signupSchema,
	verifyEmailSchema,
} from "../validations/auth.vaildators";

const getClientInfo = (req: Request) => ({
	ip: req.ip,
	userAgent: req.headers["user-agent"],
});

export const signup = handler(async (req: Request, res: Response) => {
	const { email, name, password } = signupSchema.parse(req.body);
	const clientInfo = getClientInfo(req);

	const { user, accessToken, refreshToken } = await authService.signup(
		email,
		name,
		password,
		clientInfo,
	);

	res.cookie("accessToken", accessToken, accessTokenCookieOptions);
	res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

	const safeUser: AuthUserResponse = {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		status: user.status,
		isEmailVerified: user.isEmailVerified,
		profilePicture: user.profilePicture ?? null,
		resumeUrl: user.resumeUrl ?? null,
		refreshToken,
		accessToken,
	};

	return ApiResponse.success<AuthUserResponse>(
		"User registered successfully. Please verify your email.",
		safeUser,
	).send(res, 201);
});

export const login = handler(async (req: Request, res: Response) => {
	const { email, password } = loginSchema.parse(req.body);
	const clientInfo = getClientInfo(req);

	const { user, accessToken, refreshToken, sessionMessage } =
		await authService.login(email, password, clientInfo);

	res.cookie("accessToken", accessToken, accessTokenCookieOptions);
	res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

	const safeUser: Partial<AuthUserResponse> = {
		id: user.id,
		email: user.email,
		name: user.name ?? undefined,
		role: user.role,
		status: user.status,
		isEmailVerified: user.isEmailVerified,
		profilePicture: user.profilePicture ?? null,
		resumeUrl: user.resumeUrl ?? null,
		accessToken,
		refreshToken,
	};

	return ApiResponse.success<{
		user: Partial<AuthUserResponse>;
		sessionMessage?: string;
	}>("Login successful", {
		user: safeUser,
		sessionMessage,
	}).send(res, 200);
});

export const verifyEmail = handler(async (req: Request, res: Response) => {
	const { email, otp } = verifyEmailSchema.parse(req.body);
	await authService.verifyEmail(email, otp);
	return ApiResponse.success("Email verified successfully").send(res, 200);
});

export const resendOtp = handler(async (req: Request, res: Response) => {
	const { email } = resendOtpSchema.parse(req.body);
	await authService.resendOtp(email);
	return ApiResponse.success(
		"If an account exists, a verification OTP has been sent",
	).send(res, 200);
});

export const forgotPassword = handler(async (req: Request, res: Response) => {
	const { email } = forgotPasswordSchema.parse(req.body);
	await authService.forgotPassword(email);
	return ApiResponse.success(
		"If an account exists, a password reset link has been sent",
	).send(res, 200);
});

export const resetPassword = handler(async (req: Request, res: Response) => {
	const { token, newPassword } = resetPasswordSchema.parse(req.body);
	await authService.resetPassword(token, newPassword);
	return ApiResponse.success(
		"Password reset successfully. Please login with your new password.",
	).send(res, 200);
});

export const changePassword = handler(
	async (req: AuthRequest, res: Response) => {
		const { currentPassword, newPassword } = changePasswordSchema.parse(
			req.body,
		);

		if (!req.user?.id) {
			return ApiResponse.error("Unauthorized").send(res, 401);
		}

		await authService.changePassword(req.user.id, currentPassword, newPassword);

		res.clearCookie("accessToken", clearCookieOptions);
		res.clearCookie("refreshToken", clearCookieOptions);

		return ApiResponse.success(
			"Password changed successfully. Please login again.",
		).send(res, 200);
	},
);

export const refreshToken = handler(async (req: Request, res: Response) => {
	const oldRefreshToken = req.cookies?.refreshToken as string | undefined;

	if (!oldRefreshToken) {
		return ApiResponse.error("Refresh token not found").send(res, 401);
	}

	const { accessToken, refreshToken: newRefreshToken } =
		await authService.refreshToken(oldRefreshToken);

	res.cookie("accessToken", accessToken, accessTokenCookieOptions);
	res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

	return ApiResponse.success("Token refreshed successfully", {
		accessToken,
		refreshToken: newRefreshToken,
	}).send(res, 200);
});

export const logout = handler(async (req: AuthRequest, res: Response) => {
	const refreshToken = req.cookies?.refreshToken as string | undefined;
	const userId = req.user?.id;

	if (!userId) {
		return ApiResponse.error("Unauthorized").send(res, 401);
	}

	await authService.logout(userId, refreshToken);

	res.clearCookie("accessToken", clearCookieOptions);
	res.clearCookie("refreshToken", clearCookieOptions);

	return ApiResponse.success("Logged out successfully").send(res, 200);
});

export const logoutAll = handler(async (req: AuthRequest, res: Response) => {
	const userId = req.user?.id;

	if (!userId) {
		return ApiResponse.error("Unauthorized").send(res, 401);
	}

	await authService.logoutAll(userId);

	res.clearCookie("accessToken", clearCookieOptions);
	res.clearCookie("refreshToken", clearCookieOptions);

	return ApiResponse.success("Logged out from all devices successfully").send(
		res,
		200,
	);
});
