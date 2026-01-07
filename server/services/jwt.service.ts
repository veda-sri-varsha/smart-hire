import jwt from "jsonwebtoken";
import config from "../config/index";
import CustomError from "../utils/customError";

interface TokenPayload {
	id: string;
	role: string;
}

interface ResetTokenPayload {
	id: string;
	type: "reset";
}

export const signAccessToken = (payload: TokenPayload): string => {
	return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
		expiresIn: config.ACCESS_TOKEN_EXPIRY,
	});
};

export const signRefreshToken = (payload: TokenPayload): string => {
	return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
		expiresIn: config.REFRESH_TOKEN_EXPIRY,
	});
};

export const verifyAccessToken = (token: string): TokenPayload => {
	try {
		const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as TokenPayload;
		return decoded;
	} catch {
		throw new CustomError("Invalid or expired access token", 401);
	}
};

export const verifyRefreshToken = (token: string): TokenPayload => {
	try {
		const decoded = jwt.verify(
			token,
			config.JWT_REFRESH_SECRET,
		) as TokenPayload;
		return decoded;
	} catch {
		throw new CustomError("Invalid or expired refresh token", 401);
	}
};

export const generateResetToken = (userId: string): string => {
	return jwt.sign(
		{ id: userId, type: "reset" } as ResetTokenPayload,
		config.JWT_ACCESS_SECRET,
		{ expiresIn: "1h" },
	);
};

export const verifyResetToken = (token: string): { id: string } => {
	try {
		const decoded = jwt.verify(
			token,
			config.JWT_ACCESS_SECRET,
		) as ResetTokenPayload;

		if (decoded.type !== "reset") {
			throw new Error("Invalid token type");
		}

		return { id: decoded.id };
	} catch {
		throw new CustomError("Invalid or expired reset token", 400);
	}
};

export const getRefreshTokenExpiry = (): Date => {
	const expiry = config.REFRESH_TOKEN_EXPIRY;
	const match = expiry.match(/^(\d+)([smhd])$/);

	if (!match) {
		return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	}

	const value = Number(match[1]);
	const unit = match[2];

	switch (unit) {
		case "s":
			return new Date(Date.now() + value * 1000);
		case "m":
			return new Date(Date.now() + value * 60 * 1000);
		case "h":
			return new Date(Date.now() + value * 60 * 60 * 1000);
		case "d":
			return new Date(Date.now() + value * 24 * 60 * 60 * 1000);
		default:
			return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	}
};
