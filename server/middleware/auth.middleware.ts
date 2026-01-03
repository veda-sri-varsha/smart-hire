import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import ApiResponse from "../utils/api-response";

export interface AuthRequest extends Request {
	user?: {
		id: string;
		role?: "ADMIN" | "HR" | "USER" | "COMPANY";
	};
}

const parseCookies = (cookieHeader?: string) => {
	const cookies: Record<string, string> = {};
	if (!cookieHeader) return cookies;
	for (const part of cookieHeader.split(";")) {
		const [k, ...v] = part.split("=");
		cookies[k?.trim()] = decodeURIComponent((v || []).join("=") || "");
	}
	return cookies;
};

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): void => {
	const authHeader = req.headers.authorization;
	let token: string | undefined;

	if (authHeader?.startsWith("Bearer ")) {
		token = authHeader.split(" ")[1];
	} else {
		const cookies = parseCookies(req.headers.cookie);
		if (cookies.accessToken) {
			token = cookies.accessToken;
		}
	}

	if (!token) {
		ApiResponse.error("Unauthorized").send(res, 401);
		return;
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_ACCESS_SECRET as string,
		) as { id: string; role?: "ADMIN" | "HR" | "USER" | "COMPANY" };

		req.user = { id: decoded.id, role: decoded.role };
		next();
	} catch {
		ApiResponse.error("Invalid or expired token").send(res, 401);
	}
};
