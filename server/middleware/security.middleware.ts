import type { NextFunction, Request, Response } from "express";

export const securityMiddleware = (
	_req: Request,
	res: Response,
	next: NextFunction,
): void => {
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("X-Frame-Options", "DENY");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.removeHeader("X-Powered-By");

	if (process.env.NODE_ENV === "production") {
		res.setHeader(
			"Strict-Transport-Security",
			"max-age=63072000; includeSubDomains; preload",
		);
	}

	res.setHeader(
		"Content-Security-Policy",
		"default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'",
	);

	next();
};
