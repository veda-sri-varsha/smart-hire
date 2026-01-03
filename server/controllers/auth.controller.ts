import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import type { AuthUserResponse } from "../types/auth.types";
import ApiResponse from "../utils/api-response";
import {
	accessTokenCookieOptions,
	refreshTokenCookieOptions,
} from "../utils/cookie";
import handler from "../utils/handler";
import {
	loginSchema,
	resendOtpSchema,
	signupSchema,
} from "../validations/auth.vaildators";

export const signup = handler(async (req: Request, res: Response) => {
	const { email, name, password } = signupSchema.parse(req.body);

	const { user, accessToken, refreshToken } = await authService.signup(
		email,
		name,
		password,
		req.ip,
		req.headers["user-agent"] as string | undefined,
	);

	res.cookie("accessToken", accessToken, accessTokenCookieOptions());
	res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions());

	const safeUser: Partial<AuthUserResponse> = {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		status: user.status,
		isEmailVerified: user.isEmailVerified,
		profilePicture: user.profilePicture ?? null,
		resumeUrl: user.resumeUrl ?? null,
	};

	return ApiResponse.success<Partial<AuthUserResponse>>(
		"User registered successfully",
		safeUser,
	).send(res, 201);
});

export const login = handler(async (req: Request, res: Response) => {
	const { email, password } = loginSchema.parse(req.body);

	const { user, accessToken, refreshToken } = await authService.login(
		email,
		password,
		req.ip,
		req.headers["user-agent"] as string | undefined,
	);

	res.cookie("accessToken", accessToken, accessTokenCookieOptions());
	res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions());

	const safeUser: Partial<AuthUserResponse> = {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		status: user.status,
		isEmailVerified: user.isEmailVerified,
		profilePicture: user.profilePicture ?? null,
		resumeUrl: user.resumeUrl ?? null,
	};

	return ApiResponse.success<Partial<AuthUserResponse>>(
		"Login successful",
		safeUser,
	).send(res, 200);
});

export const resendOtp = handler(async (req: Request, res: Response) => {
	const body = resendOtpSchema.parse(req.body);

	await authService.resendOtp(body.email);

	return ApiResponse.success("OTP resent if the account exists").send(res, 200);
});
