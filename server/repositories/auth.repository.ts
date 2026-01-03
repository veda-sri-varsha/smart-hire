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
};
