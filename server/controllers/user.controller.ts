import argon2 from "argon2";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getUsers = async (_req: Request, res: Response) => {
	const users = await prisma.user.findMany({
		where: { isDeleted: false },
		select: {
			id: true,
			email: true,
			name: true,
			role: true,
			status: true,
			isEmailVerified: true,
			createdAt: true,
		},
	});

	res.json({ success: true, data: users });
};

/**
 * POST /users
 */
export const createUser = async (req: Request, res: Response) => {
	const { email, name, password, role } = req.body;

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		return res.status(409).json({ message: "Email already exists" });
	}

	const hashedPassword = await argon2.hash(password);

	const user = await prisma.user.create({
		data: {
			email,
			name,
			password: hashedPassword,
			role,
		},
	});

	res.status(201).json({
		success: true,
		data: {
			id: user.id,
			email: user.email,
			name: user.name,
		},
	});
};
