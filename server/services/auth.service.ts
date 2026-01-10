import argon2 from "argon2";
import {
	sendPasswordChangedEmail,
	sendPasswordResetEmail,
	sendVerificationOtp,
	sendWelcomeEmail,
} from "../lib/mail.service";
import { authRepository } from "../repositories/auth.repository";
import * as jwtService from "../services/jwt.service";
import type { Role } from "../types/auth.types";
import CustomError from "../utils/customError";
import logger from "../utils/logger";

interface ClientInfo {
	ip?: string;
	userAgent?: string;
}

const generateOtp = (): string => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authService = {
	signup: async (
		email: string,
		name: string,
		password: string,
		clientInfo: ClientInfo = {},
		role?: Role,
	) => {
		logger.info("auth.signup.attempt", { email, ip: clientInfo.ip });

		const existingUser = await authRepository.findUserByEmail(email);
		if (existingUser) {
			throw new CustomError("Email already registered", 409);
		}

		const hashedPassword = await argon2.hash(password);
		const otp = generateOtp();
		const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

		const userRole = role ?? "USER";

		const user = await authRepository.createUser(
			email,
			name,
			userRole,
			hashedPassword,
			Number(otp),
			otpExpiry,
		);

		void sendVerificationOtp(user.email, otp, user.name ?? "User").catch(
			(err) => logger.error("Failed to send verification OTP", { err }),
		);

		const [accessToken, refreshToken] = await Promise.all([
			jwtService.signAccessToken({ id: user.id, role: user.role }),
			jwtService.signRefreshToken({ id: user.id, role: user.role }),
		]);

		const refreshHash = await argon2.hash(refreshToken);
		await authRepository.saveSession(
			user.id,
			refreshHash,
			jwtService.getRefreshTokenExpiry(),
			clientInfo.ip,
			clientInfo.userAgent,
		);

		logger.info("auth.signup.success", { userId: user.id, email });

		return { user, accessToken, refreshToken };
	},

	login: async (
		email: string,
		password: string,
		clientInfo: ClientInfo = {},
	) => {
		logger.info("auth.login.attempt", { email, ip: clientInfo.ip });

		const user = await authRepository.findUserByEmail(email);
		if (!user || !user.password) {
			logger.warn("auth.login.failed", { email, reason: "no_user" });
			throw new CustomError("Invalid credentials", 401);
		}

		if (!user.isEmailVerified) {
			logger.warn("auth.login.failed", { email, reason: "email_not_verified" });
			throw new CustomError(
				"Please verify your email before logging in. Check your inbox for the verification code.",
				403,
			);
		}

		if (user.lockedUntil && user.lockedUntil > new Date()) {
			const minutesLeft = Math.ceil(
				(user.lockedUntil.getTime() - Date.now()) / 60000,
			);
			logger.warn("auth.login.locked", {
				userId: user.id,
				lockedUntil: user.lockedUntil,
			});
			throw new CustomError(
				`Account locked. Try again in ${minutesLeft} minutes.`,
				423,
			);
		}

		if (user.status !== "ACTIVE") {
			logger.warn("auth.login.failed", { email, reason: "inactive" });
			throw new CustomError("Account is inactive", 403);
		}

		const isValid = await argon2.verify(user.password, password);

		if (!isValid) {
			logger.warn("auth.login.failed", { email, reason: "invalid_password" });
			const updated = await authRepository.incrementFailedLogin(user.id);
			const failedAttempts = updated.failedLoginAttempts ?? 0;

			if (failedAttempts >= 5) {
				const lockUntil = new Date(Date.now() + 30 * 60 * 1000);
				await authRepository.lockUser(user.id, lockUntil);
				logger.warn("auth.login.locked", {
					userId: user.id,
					lockedUntil: lockUntil,
				});
				throw new CustomError(
					"Account locked due to too many failed login attempts. Try again in 30 minutes.",
					423,
				);
			}

			throw new CustomError(
				`Invalid credentials. ${5 - failedAttempts} attempts remaining.`,
				401,
			);
		}

		await authRepository.resetFailedLogin(user.id);
		const revokedCount = await authRepository.revokeSessionsByUser(user.id);

		const [accessToken, refreshToken] = await Promise.all([
			jwtService.signAccessToken({ id: user.id, role: user.role }),
			jwtService.signRefreshToken({ id: user.id, role: user.role }),
		]);

		const refreshHash = await argon2.hash(refreshToken);
		await authRepository.saveSession(
			user.id,
			refreshHash,
			jwtService.getRefreshTokenExpiry(),
			clientInfo.ip,
			clientInfo.userAgent,
		);

		logger.info("auth.login.success", { userId: user.id, email });

		return {
			user,
			accessToken,
			refreshToken,
			sessionMessage:
				revokedCount > 0
					? "You have been logged out from other devices"
					: undefined,
		};
	},

	verifyEmail: async (email: string, otp: string) => {
		logger.info("auth.verify_email.attempt", { email });

		const user = await authRepository.findUserByEmail(email);
		if (!user) throw new CustomError("User not found", 404);
		if (user.isEmailVerified)
			throw new CustomError("Email already verified", 400);

		if (!user.verificationOtp || !user.verificationOtpExpiry) {
			throw new CustomError(
				"No verification OTP found. Please request a new one.",
				400,
			);
		}

		if (new Date() > user.verificationOtpExpiry) {
			throw new CustomError("OTP has expired. Please request a new one.", 400);
		}

		if (user.verificationOtp !== Number(otp)) {
			throw new CustomError("Invalid OTP", 400);
		}

		await authRepository.markEmailVerified(user.id);

		void sendWelcomeEmail(user.email, user.name ?? "User").catch((err) =>
			logger.error("Failed to send welcome email", { err }),
		);

		logger.info("auth.verify_email.success", { userId: user.id });
	},

	resendOtp: async (email: string) => {
		logger.info("auth.otp.resend.request", { email });

		const user = await authRepository.findUserByEmail(email);
		if (!user) {
			logger.info("auth.otp.resend.no_account", { email });
			return;
		}

		if (user.isEmailVerified) {
			logger.info("auth.otp.resend.already_verified", { email });
			return;
		}

		const otp = generateOtp();
		const expiry = new Date(Date.now() + 10 * 60 * 1000);

		await authRepository.updateUserOtp(user.id, Number(otp), expiry);

		void sendVerificationOtp(user.email, otp, user.name ?? "User").catch(
			(err) => logger.error("auth.otp.email_failed", { userId: user.id, err }),
		);

		logger.info("auth.otp.resent", { userId: user.id });
	},

	forgotPassword: async (email: string) => {
		logger.info("auth.forgot_password.request", { email });

		const user = await authRepository.findUserByEmail(email);
		if (!user) {
			logger.info("auth.forgot_password.no_account", { email });
			return;
		}

		const resetToken = await jwtService.generateResetToken(user.id);

		void sendPasswordResetEmail(
			user.email,
			resetToken,
			user.name ?? "User",
		).catch((err) =>
			logger.error("auth.forgot_password.email_failed", {
				userId: user.id,
				err,
			}),
		);

		logger.info("auth.forgot_password.email_sent", { userId: user.id });
	},

	resetPassword: async (token: string, newPassword: string) => {
		logger.info("auth.reset_password.attempt");

		const { id: userId } = await jwtService.verifyResetToken(token);

		const user = await authRepository.findUserById(userId);
		if (!user) throw new CustomError("Invalid or expired reset token", 400);

		const hashedPassword = await argon2.hash(newPassword);
		await authRepository.updateUserPassword(userId, hashedPassword);
		await authRepository.revokeSessionsByUser(userId);

		const userEmail = (user as { email: string }).email;
		const userName = (user as { name?: string }).name;
		void sendPasswordChangedEmail(userEmail, userName ?? "User").catch((err) =>
			logger.error("Failed to send password changed email", { err }),
		);

		logger.info("auth.reset_password.success", { userId });
	},

	changePassword: async (
		userId: string,
		currentPassword: string,
		newPassword: string,
	) => {
		logger.info("auth.change_password.attempt", { userId });

		const user = await authRepository.findUserById(userId);
		if (!user) throw new CustomError("User not found", 404);

		const userPassword = (user as { password?: string }).password;
		if (!userPassword)
			throw new CustomError("Cannot change password for OAuth accounts", 400);

		const isValid = await argon2.verify(userPassword, currentPassword);
		if (!isValid) throw new CustomError("Current password is incorrect", 400);

		const hashedPassword = await argon2.hash(newPassword);
		await authRepository.updateUserPassword(userId, hashedPassword);
		await authRepository.revokeSessionsByUser(userId);

		const userEmail = (user as { email: string }).email;
		const userName = (user as { name?: string }).name;
		void sendPasswordChangedEmail(userEmail, userName ?? "User").catch((err) =>
			logger.error("Failed to send password changed email", { err }),
		);

		logger.info("auth.change_password.success", { userId });
	},

	refreshToken: async (oldRefreshToken: string) => {
		logger.info("auth.refresh_token.attempt");

		const payload = await jwtService.verifyRefreshToken(oldRefreshToken);
		const sessions = await authRepository.findSessionsByUserId(payload.id);

		let validSession = null;
		for (const session of sessions) {
			if (session.revoked || new Date() > session.expiresAt) continue;
			const isValid = await argon2.verify(
				session.refreshTokenHash,
				oldRefreshToken,
			);
			if (isValid) {
				validSession = session;
				break;
			}
		}

		if (!validSession) throw new CustomError("Invalid or expired session", 401);

		const user = await authRepository.findUserById(payload.id);
		if (!user) throw new CustomError("User not found", 404);

		const userRole = (user as { role: string }).role;

		const [accessToken, refreshToken] = await Promise.all([
			jwtService.signAccessToken({ id: payload.id, role: userRole }),
			jwtService.signRefreshToken({ id: payload.id, role: userRole }),
		]);

		const refreshHash = await argon2.hash(refreshToken);
		await authRepository.revokeSessionById(validSession.id);
		await authRepository.saveSession(
			payload.id,
			refreshHash,
			jwtService.getRefreshTokenExpiry(),
		);

		logger.info("auth.refresh_token.success", { userId: payload.id });

		return { accessToken, refreshToken };
	},

	logout: async (userId: string, refreshToken?: string) => {
		logger.info("auth.logout.attempt", { userId });

		if (!refreshToken) {
			logger.info("auth.logout.no_token", { userId });
			return;
		}

		try {
			const sessions = await authRepository.findSessionsByUserId(userId);

			for (const session of sessions) {
				if (session.revoked) continue;
				const isMatch = await argon2.verify(
					session.refreshTokenHash,
					refreshToken,
				);
				if (isMatch) {
					await authRepository.revokeSessionById(session.id);
					logger.info("auth.logout.success", { userId, sessionId: session.id });
					return;
				}
			}

			logger.warn("auth.logout.session_not_found", { userId });
		} catch (err) {
			logger.error("auth.logout.error", { userId, err });
		}
	},

	logoutAll: async (userId: string) => {
		logger.info("auth.logout_all.attempt", { userId });
		const revokedCount = await authRepository.revokeSessionsByUser(userId);
		logger.info("auth.logout_all.success", { userId, revokedCount });
	},
};
