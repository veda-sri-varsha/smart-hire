import type { CookieOptions } from "express";
import config from "../config/index";

const parseDurationToSeconds = (duration: string): number => {
	const match = duration.match(/^(\d+)([smhd])$/);
	if (!match) return 15 * 60;

	const value = Number(match[1]);
	const unit = match[2];

	switch (unit) {
		case "s":
			return value;
		case "m":
			return value * 60;
		case "h":
			return value * 60 * 60;
		case "d":
			return value * 24 * 60 * 60;
		default:
			return 15 * 60;
	}
};

const ACCESS_TOKEN_MAX_AGE = parseDurationToSeconds(config.ACCESS_TOKEN_EXPIRY);
const REFRESH_TOKEN_MAX_AGE = parseDurationToSeconds(
	config.REFRESH_TOKEN_EXPIRY,
);

const isProduction = config.NODE_ENV === "production";

export const accessTokenCookieOptions: CookieOptions = {
	httpOnly: true,
	secure: isProduction,
	sameSite: "strict",
	path: "/",
	maxAge: ACCESS_TOKEN_MAX_AGE * 1000,
};

export const refreshTokenCookieOptions: CookieOptions = {
	httpOnly: true,
	secure: isProduction,
	sameSite: "strict",
	path: "/api/auth/refresh",
	maxAge: REFRESH_TOKEN_MAX_AGE * 1000,
};

export const clearCookieOptions: CookieOptions = {
	httpOnly: true,
	secure: isProduction,
	sameSite: "strict",
	path: "/",
};
