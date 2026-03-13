import { prisma } from "./prisma";
import logger from "../utils/logger";

export async function checkAdmin() {
	try {
		logger.info("Checking admin users on startup...");
		const admins = await prisma.user.findMany({
			where: { role: "ADMIN" },
		});

		if (admins.length > 0) {
			for (const admin of admins) {
				if (!admin.isEmailVerified) {
					logger.info(`Verifying email for admin: ${admin.email}`);
					await prisma.user.update({
						where: { id: admin.id },
						data: { isEmailVerified: true },
					});
				}
			}
		} else {
			logger.info("No admin users found.");
		}
	} catch (error) {
		logger.error("Error checking admins:", error);
	}
}
