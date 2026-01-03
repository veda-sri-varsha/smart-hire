import type { NextFunction, Response } from "express";
import ApiResponse from "../utils/api-response";
import type { AuthRequest } from "./auth.middleware";

type Role = "ADMIN" | "HR" | "USER" | "COMPANY";

export const authorizeRoles =
	(...roles: Role[]) =>
	(req: AuthRequest, res: Response, next: NextFunction) => {
		if (
			!req.user ||
			!roles.includes((req.user.role as Role) || ("USER" as Role))
		) {
			return ApiResponse.error("Forbidden").send(res, 403);
		}
		next();
	};
