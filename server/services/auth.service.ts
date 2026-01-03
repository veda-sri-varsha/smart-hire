import argon2 from "argon2";
import jsonwebtoken from "jsonwebtoken";
import config from "../config";
import { authRepository } from "../repositories/auth.repository";
import type { AuthUserResponse } from "../types";

export const authService = {
	signup: async (email: string, name: string, password: string) => {
		const existingUser = await authRepository.findUserByEmail(email);
		if (existingUser) throw new Error("Email already registered");

		const hashedPassword = await argon2.hash(password);
		const user = await authRepository.createUser(email, name, hashedPassword);

		const accessToken = jsonwebtoken.sign(
			{ id: user.id, role: user.role },
			config.JWT_ACCESS_SECRET,
			{ expiresIn: "15m" },
		);

		const refreshToken = jsonwebtoken.sign(
			{ id: user.id },
			config.JWT_REFRESH_SECRET,
			{ expiresIn: "7d" },
		);

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			status: user.status,
			isEmailVerified: user.isEmailVerified,
			profilePicture: user.profilePicture ?? null,
			resumeUrl: user.resumeUrl ?? null,
			accessToken,
			refreshToken,
		} as AuthUserResponse;
	},

	login: async (email: string, password: string) => {
		const user = await authRepository.findUserByEmail(email);
		if (!user) throw new Error("Invalid credentials");
		if (user.status !== "ACTIVE") throw new Error("Account inactive");

		const isValid = await argon2.verify(user.password, password);
		if (!isValid) throw new Error("Invalid credentials");

		const accessToken = jsonwebtoken.sign(
			{ id: user.id, role: user.role },
			config.JWT_ACCESS_SECRET,
			{ expiresIn: "15m" },
		);

		const refreshToken = jsonwebtoken.sign(
			{ id: user.id },
			config.JWT_REFRESH_SECRET,
			{ expiresIn: "7d" },
		);

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			status: user.status,
			isEmailVerified: user.isEmailVerified,
			profilePicture: user.profilePicture ?? null,
			resumeUrl: user.resumeUrl ?? null,
			accessToken,
			refreshToken,
		} as AuthUserResponse;
	},
};
