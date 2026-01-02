import argon2 from "argon2";
import type { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import ApiResponse from "../utils/api-response";
import CustomError from "../utils/customError";
import handler from "../utils/handler";
import { loginSchema, signupSchema } from "../validations/auth.vaildators";

export const signup = handler(async (req: Request, res: Response) => {
	const { email, name, password } = signupSchema.parse(req.body);

	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) throw new CustomError("Email already registered", 409);

	const user = await prisma.user.create({
		data: {
			email,
			name,
			password: await argon2.hash(password),
			role: "USER",
			status: "ACTIVE",
		},
	});

	const publicUser = {
		id: user.id,
		email: user.email,
		password: user.password,
		name: user.name,
		role: user.role,
		status: user.status,
		isEmailVerified: user.isEmailVerified,
	};

	return ApiResponse.success("User registered successfully", publicUser).send(
		res,
		201,
	);
});

export const login = handler(async (req: Request, res: Response) => {
	const { email, password } = loginSchema.parse(req.body);

	const user = await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			password: true,
			role: true,
			status: true,
			name: true,
			isEmailVerified: true,
		},
	});

	if (!user) throw new CustomError("Invalid credentials", 401);
	if (user.status !== "ACTIVE") throw new CustomError("Account inactive", 403);

	const isValid = await argon2.verify(user.password, password);
	if (!isValid) throw new CustomError("Invalid credentials", 401);

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

	const publicUser = {
		id: user.id,
		name: user.name,
		role: user.role,
		isEmailVerified: user.isEmailVerified,
		accessToken,
		refreshToken,
	};

	return ApiResponse.success("Login successful", publicUser).send(res, 200);
});
