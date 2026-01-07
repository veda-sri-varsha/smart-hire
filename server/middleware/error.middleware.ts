import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import ApiResponse from "../utils/api-response";
import CustomError from "../utils/customError";
import logger from "../utils/logger";

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: NextFunction,
): void => {
	logger.error("Error caught by error handler", {
		error: error.message,
		stack: error.stack,
		path: req.path,
		method: req.method,
	});

	// Zod validation errors
	if (error instanceof ZodError) {
		const messages = error.issues.map((err) => err.message).join(", ");
		ApiResponse.error(messages).send(res, 400);
		return;
	}

	// Custom errors
	if (error instanceof CustomError) {
		ApiResponse.error(error.message).send(res, error.statusCode);
		return;
	}

	// JWT errors
	if (error.name === "JsonWebTokenError") {
		ApiResponse.error("Invalid token").send(res, 401);
		return;
	}

	if (error.name === "TokenExpiredError") {
		ApiResponse.error("Token expired").send(res, 401);
		return;
	}

	// Default error
	ApiResponse.error("Internal server error").send(res, 500);
};
