import config from "../config";

const parseDurationToMs = (s: string) => {
	const match = s.match(/^(\d+)([smhd])$/i);
	if (!match) return 0;
	const value = Number(match[1]);
	switch (match[2].toLowerCase()) {
		case "s":
			return value * 1000;
		case "m":
			return value * 60 * 1000;
		case "h":
			return value * 60 * 60 * 1000;
		case "d":
			return value * 24 * 60 * 60 * 1000;
		default:
			return 0;
	}
};

export const accessTokenCookieOptions = () => ({
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict" as const,
	path: "/",
	maxAge: Math.floor(parseDurationToMs(config.ACCESS_TOKEN_EXPIRY) / 1000), // seconds
});

export const refreshTokenCookieOptions = () => ({
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict" as const,
	path: "/auth/refresh",
	maxAge: Math.floor(parseDurationToMs(config.REFRESH_TOKEN_EXPIRY) / 1000), // seconds
});
