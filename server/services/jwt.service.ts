import jwt from "jsonwebtoken";
import config from "../config/index.ts";

export const signAccessToken = async (payload: {
	id: string;
	role: string;
}): Promise<string> => {
	return jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = async (payload: {
	id: string;
	role: string;
}): Promise<string> => {
	return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: "1h" });
};

export const verifyRefreshToken = async (token: string) => {
	return jwt.verify(token, config.JWT_REFRESH_SECRET) as {
		id: string;
		role: string;
	};
};

export const getRefreshTokenExpiry = (): Date => {
	return new Date(Date.now() + 60 * 60 * 1000); 
};
