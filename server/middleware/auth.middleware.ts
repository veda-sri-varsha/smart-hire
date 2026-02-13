import type { NextFunction, Request, Response } from "express";
import * as jwtService from "../services/jwt.service";
import ApiResponse from "../utils/api-response";
import logger from "../utils/logger";

export interface AuthRequest extends Request {
	user?: {
		id: string;
		role: "ADMIN" | "HR" | "USER" | "COMPANY";
	};
}

export const authMiddleware = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		let token: string | undefined;

		const authHeader = req.headers.authorization;

		// Log presence of authentication info for debugging
		logger.debug("Auth attempt", {
			hasAuthHeader: Boolean(authHeader),
			hasCookie: Boolean(req.cookies?.accessToken),
		});

		if (authHeader?.startsWith("Bearer ")) {
			token = authHeader.substring(7);
		} else if (req.cookies?.accessToken) {
			token = req.cookies.accessToken;
		}

		if (!token) {
			ApiResponse.error("Unauthorized - Missing token").send(res, 401);
			return;
		}

		const payload = await jwtService.verifyAccessToken(token);

		req.user = {
			id: payload.id,
			role: payload.role as "ADMIN" | "HR" | "USER" | "COMPANY",
		};

		logger.debug("User authenticated", { userId: payload.id });

		next();
	} catch (error) {
		logger.warn("Token verification failed", { error });
		ApiResponse.error("Unauthorized - Invalid or expired token").send(res, 401);
	}
};
