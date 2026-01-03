import "dotenv/config";
import cors from "cors";
import express from "express";
import { prisma } from "./lib/prisma.ts";
import userRoutes from "./routes/user.routes.ts";
import swaggerUi from "swagger-ui-express";
import config from "./config/index.ts";
import authRoutes from "./routes/auth.routes.ts";
import swaggerSpec from "./swagger";

const app = express();

import { generalLimiter } from "./middleware/rate-limiter.middleware";
import { securityMiddleware } from "./middleware/security.middleware";

app.use(securityMiddleware);
app.use(
	cors({
		origin: config.FRONTEND_URL,
		credentials: true,
	}),
);

app.use(express.json({ limit: "10kb" }));

app.use(generalLimiter);

app.get("/", (_req, res) => {
	res.send("Backend is alive!");
});

app.get("/health", async (_req, res) => {
	const startTime = Date.now();

	const healthStatus = {
		status: "healthy" as "healthy" | "unhealthy",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		server: {
			status: "up" as "up" | "down",
			responseTime: 0,
		},
		database: {
			status: "connected" as "connected" | "disconnected",
			responseTime: 0,
			error: undefined as string | undefined,
		},
	};

	const dbStartTime = Date.now();
	try {
		await prisma.$queryRaw`SELECT 1`;
		healthStatus.database.status = "connected";
		healthStatus.database.responseTime = Date.now() - dbStartTime;
	} catch (error) {
		healthStatus.status = "unhealthy";
		healthStatus.database.status = "disconnected";
		healthStatus.database.responseTime = Date.now() - dbStartTime;
		healthStatus.database.error =
			error instanceof Error ? error.message : "Unknown database error";
	}

	healthStatus.server.responseTime = Date.now() - startTime;

	const statusCode = healthStatus.status === "healthy" ? 200 : 503;
	res.status(statusCode).json(healthStatus);
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));

const PORT = config.PORT;
app.listen(PORT, "0.0.0.0", () => {
	console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
