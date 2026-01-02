import type { NextFunction, Response } from "express";
import ApiResponse from "../utils/api-response";
import type { AuthRequest } from "./auth.middleware";

export const authorizeRoles =
	(...roles: AuthRequest["user"]["role"][]) =>
	(req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return ApiResponse.error("Forbidden").send(res, 403);
		}
		next();
	};
