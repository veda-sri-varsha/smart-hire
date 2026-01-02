import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import ApiResponse from "../utils/api-response";

export interface AuthRequest extends Request {
	user: {
		id: string;
		role: "ADMIN" | "HR" | "USER" | "COMPANY";
	};
}

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): void => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		ApiResponse.error("Unauthorized").send(res, 401);
		return;
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_ACCESS_SECRET as string,
		) as AuthRequest["user"];

		req.user = decoded;
		next();
	} catch {
		ApiResponse.error("Invalid or expired token").send(res, 401);
	}
};
