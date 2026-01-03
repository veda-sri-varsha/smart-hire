import argon2 from "argon2";
import jsonwebtoken, { type SignOptions } from "jsonwebtoken";
import config from "../config";

const signJwt = (payload: object, secret: string, options?: SignOptions) => {
	return jsonwebtoken.sign(
		payload as unknown as string | object,
		secret as unknown as jsonwebtoken.Secret,
		options,
	);
};

const expirySeconds = (expiry: string) =>
	Math.floor((parseExpiryToDate(expiry).getTime() - Date.now()) / 1000);

import { sendVerificationOtp } from "../lib/mail.service";
import { authRepository } from "../repositories/auth.repository";
import type { AuthUserResponse } from "../types";
import logger from "../utils/logger";

const parseExpiryToDate = (expiry: string) => {
	const m = expiry.match(/^(\d+)([smhd])$/i);
	if (!m) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const n = Number(m[1]);
	switch (m[2].toLowerCase()) {
		case "s":
			return new Date(Date.now() + n * 1000);
		case "m":
			return new Date(Date.now() + n * 60 * 1000);
		case "h":
			return new Date(Date.now() + n * 60 * 60 * 1000);
		case "d":
			return new Date(Date.now() + n * 24 * 60 * 60 * 1000);
		default:
			return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	}
};

export const authService = {
	signup: async (
		email: string,
		name: string,
		password: string,
		ip?: string,
		userAgent?: string,
	) => {
		logger.info("auth.signup.attempt", { email, ip });
		const existingUser = await authRepository.findUserByEmail(email);
		if (existingUser) throw new Error("Email already registered");

		const hashedPassword = await argon2.hash(password);
		const user = await authRepository.createUser(email, name, hashedPassword);

		const accessToken = signJwt(
			{ id: user.id, role: user.role },
			config.JWT_ACCESS_SECRET,
			{ expiresIn: expirySeconds(config.ACCESS_TOKEN_EXPIRY) },
		);

		const refreshToken = signJwt({ id: user.id }, config.JWT_REFRESH_SECRET, {
			expiresIn: expirySeconds(config.REFRESH_TOKEN_EXPIRY),
		});

		// Hash refresh token before storing
		const refreshHash = await argon2.hash(refreshToken);
		await authRepository.saveSession(
			user.id,
			refreshHash,
			parseExpiryToDate(config.REFRESH_TOKEN_EXPIRY),
			ip,
			userAgent,
		);

		logger.info("auth.signup.success", { userId: user.id, email });

		return {
			user,
			accessToken,
			refreshToken,
		} as unknown as {
			user: AuthUserResponse;
			accessToken: string;
			refreshToken: string;
		};
	},

	login: async (
		email: string,
		password: string,
		ip?: string,
		userAgent?: string,
	) => {
		logger.info("auth.login.attempt", { email, ip });
		const user = await authRepository.findUserByEmail(email);
		if (!user) {
			logger.warn("auth.login.failed", { email, reason: "no_user" });
			throw new Error("Invalid credentials");
		}
		const userWithLock = user as unknown as { lockedUntil?: Date | null };
		// Check lockout
		if (userWithLock.lockedUntil && userWithLock.lockedUntil > new Date()) {
			logger.warn("auth.login.locked", {
				userId: user.id,
				lockedUntil: userWithLock.lockedUntil,
			});
			throw new Error("Account locked. Try again later");
		}
		if (user.status !== "ACTIVE") {
			logger.warn("auth.login.failed", { email, reason: "inactive" });
			throw new Error("Account inactive");
		}

		const isValid = await argon2.verify(user.password, password);
		if (!isValid) {
			logger.warn("auth.login.failed", { email, reason: "invalid_password" });
			// Increment failed attempts and potentially lock
			const updated = await authRepository.incrementFailedLogin(user.id);
			if (
				(updated as unknown as { failedLoginAttempts?: number })
					.failedLoginAttempts ??
				0 >= 5
			) {
				const lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
				await authRepository.lockUser(user.id, lockUntil);
				logger.warn("auth.login.locked", {
					userId: user.id,
					lockedUntil: lockUntil,
				});
			}
			throw new Error("Invalid credentials");
		} else {
			// Reset failed attempts on success
			await authRepository.resetFailedLogin(user.id);
		}

		const accessToken = signJwt(
			{ id: user.id, role: user.role },
			config.JWT_ACCESS_SECRET,
			{ expiresIn: expirySeconds(config.ACCESS_TOKEN_EXPIRY) },
		);

		const refreshToken = signJwt({ id: user.id }, config.JWT_REFRESH_SECRET, {
			expiresIn: expirySeconds(config.REFRESH_TOKEN_EXPIRY),
		});

		const refreshHash = await argon2.hash(refreshToken);
		await authRepository.saveSession(
			user.id,
			refreshHash,
			parseExpiryToDate(config.REFRESH_TOKEN_EXPIRY),
			ip,
			userAgent,
		);

		logger.info("auth.login.success", { userId: user.id, email });

		return {
			user,
			accessToken,
			refreshToken,
		} as unknown as {
			user: AuthUserResponse;
			accessToken: string;
			refreshToken: string;
		};
	},

	resendOtp: async (email: string) => {
		logger.info("auth.otp.resend.request", { email });
		const user = await authRepository.findUserByEmail(email);
		if (!user) {
			// Don't reveal account existence
			logger.info("auth.otp.resend.no_account", { email });
			return;
		}

		// Generate 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		// Update user with OTP (prisma will need verification fields)
		await authRepository.updateUserOtp(user.id, Number(otp), expiry);

		// Send email
		try {
			await sendVerificationOtp(user.email, otp, user.name ?? "");
			logger.info("auth.otp.resent", { userId: user.id });
		} catch (err) {
			logger.error("auth.otp.email_failed", { userId: user.id, err });
		}
	},
};
