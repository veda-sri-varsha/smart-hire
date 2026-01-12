import { prisma } from "../lib/prisma";

export const authRepository = {
	findUserByEmail: async (email: string) => {
		return prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				password: true,
				role: true,
				status: true,
				name: true,
				isEmailVerified: true,
				profilePicture: true,
				resumeUrl: true,
				lockedUntil: true,
				failedLoginAttempts: true,
				verificationOtp: true,
				verificationOtpExpiry: true,
			},
		});
	},

	createUser: async (
		email: string,
		name: string,
		role: "ADMIN" | "HR" | "USER" | "COMPANY",
		hashedPassword: string,
		verificationOtp: number,
		verificationOtpExpiry: Date,
		companyName?: string,
		companyWebsite?: string,
	) => {
		return prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
				role,
				status: "ACTIVE",
				isEmailVerified: false,
				verificationOtp,
				verificationOtpExpiry,
				companyName,
				companyWebsite,
			},
		});
	},

	saveSession: async (
		userId: string,
		refreshTokenHash: string,
		expiresAt: Date,
		ip?: string,
		userAgent?: string,
	) => {
		return prisma.session.create({
			data: {
				userId,
				refreshTokenHash,
				expiresAt,
				ip,
				userAgent,
				revoked: false,
			},
		});
	},

	findSessionsByUserId: async (userId: string) => {
		return prisma.session.findMany({
			where: { userId, revoked: false },
			orderBy: { createdAt: "desc" },
		});
	},

	revokeSessionsByUser: async (userId: string) => {
		const result = await prisma.session.updateMany({
			where: { userId, revoked: false },
			data: { revoked: true },
		});
		return result.count;
	},

	revokeSessionById: async (sessionId: string) => {
		return prisma.session.update({
			where: { id: sessionId },
			data: { revoked: true },
		});
	},

	incrementFailedLogin: async (userId: string) => {
		return prisma.user.update({
			where: { id: userId },
			data: { failedLoginAttempts: { increment: 1 } },
			select: { failedLoginAttempts: true },
		});
	},

	resetFailedLogin: async (userId: string) => {
		return prisma.user.update({
			where: { id: userId },
			data: { failedLoginAttempts: 0, lockedUntil: null },
			select: { failedLoginAttempts: true, lockedUntil: true },
		});
	},

	lockUser: async (userId: string, until: Date) => {
		return prisma.user.update({
			where: { id: userId },
			data: { lockedUntil: until },
			select: { lockedUntil: true },
		});
	},

	updateUserOtp: async (userId: string, otp: number, expiry: Date) => {
		return prisma.user.update({
			where: { id: userId },
			data: { verificationOtp: otp, verificationOtpExpiry: expiry },
		});
	},

	markEmailVerified: async (userId: string) => {
		return prisma.user.update({
			where: { id: userId },
			data: {
				isEmailVerified: true,
				verificationOtp: null,
				verificationOtpExpiry: null,
			},
		});
	},

	findUserById: async (userId: string) => {
		return prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, email: true, password: true, name: true, role: true },
		});
	},

	updateUserPassword: async (userId: string, hashedPassword: string) => {
		return prisma.user.update({
			where: { id: userId },
			data: { password: hashedPassword },
		});
	},
};
