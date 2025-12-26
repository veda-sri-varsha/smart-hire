import cors from "cors";
import express from "express";
import { prisma } from "./prisma"; // ✅ import prisma
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
	res.send("Backend is alive ✅");
});

// ✅ Health check route
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
		// Simple DB ping
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

// mount users router
app.use("/users", userRoutes);

// ✅ use env port for Render, 5000 for local
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
	console.log(`✅ Backend running on http://0.0.0.0:${PORT}`);
});
