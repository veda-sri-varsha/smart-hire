import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(5000),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	JWT_ACCESS_SECRET: z.string().min(32),
	JWT_REFRESH_SECRET: z.string().min(32),
	ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
	REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
	FRONTEND_URL: z.url().default("http://localhost:3000"),
	VITE_SERVER_URL: z.string().url(),
	RESEND_API_KEY: z.string().min(1),
	FROM_EMAIL: z.email().min(1, "FROM_EMAIL is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("ENV validation failed:");
	console.error(parsed.error.format());
	process.exit(1);
}

export default parsed.data;
