import { prisma } from "../lib/prisma";

type SessionCreateReturn = {
	id: string;
	userId: string;
	refreshTokenHash: string;
	expiresAt: Date;
	ip?: string | null;
	userAgent?: string | null;
	revoked: boolean;
	createdAt: Date;
};

type PrismaSessionClient = {
	session: {
		create: (args: {
			data: {
				userId: string;
				refreshTokenHash: string;
				expiresAt: Date;
				ip?: string;
				userAgent?: string;
			};
		}) => Promise<SessionCreateReturn>;
		updateMany: (args: {
			where: { userId: string };
			data: { revoked: boolean };
		}) => Promise<{ count: number }>;
	};
};

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
			},
		});
	},

	createUser: async (email: string, name: string, hashedPassword: string) => {
		return prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
				role: "USER",
				status: "ACTIVE",
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
		return (prisma as unknown as PrismaSessionClient).session.create({
			data: { userId, refreshTokenHash, expiresAt, ip, userAgent },
		});
	},

	revokeSessionsByUser: async (userId: string) => {
		return (prisma as unknown as PrismaSessionClient).session.updateMany({
			where: { userId },
			data: { revoked: true },
		});
	},

	incrementFailedLogin: async (
		userId: string,
	): Promise<{ failedLoginAttempts?: number }> => {
		const rows = await prisma.$queryRaw<Array<{ failedLoginAttempts: number }>>`
			UPDATE "User"
			SET "failedLoginAttempts" = COALESCE("failedLoginAttempts", 0) + 1
			WHERE id = ${userId}
			RETURNING "failedLoginAttempts";
		`;
		return rows[0] ?? { failedLoginAttempts: 0 };
	},

	resetFailedLogin: async (
		userId: string,
	): Promise<{ failedLoginAttempts?: number; lockedUntil?: Date | null }> => {
		const rows = await prisma.$queryRaw<
			Array<{ failedLoginAttempts: number; lockedUntil: Date | null }>
		>`
			UPDATE "User"
			SET "failedLoginAttempts" = 0, "lockedUntil" = NULL
			WHERE id = ${userId}
			RETURNING "failedLoginAttempts", "lockedUntil";
		`;
		return rows[0] ?? { failedLoginAttempts: 0, lockedUntil: null };
	},

	lockUser: async (
		userId: string,
		until: Date,
	): Promise<{ lockedUntil?: Date | null }> => {
		const rows = await prisma.$queryRaw<Array<{ lockedUntil: Date }>>`
			UPDATE "User"
			SET "lockedUntil" = ${until}
			WHERE id = ${userId}
			RETURNING "lockedUntil";
		`;
		return rows[0] ?? { lockedUntil: null };
	},

	updateUserOtp: async (userId: string, otp: number, expiry: Date) => {
		return prisma.user.update({
			where: { id: userId },
			data: { verificationOtp: otp, verificationOtpExpiry: expiry },
		});
	},
};
