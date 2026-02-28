import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
// @ts-expect-error
import { PrismaClient } from "../src/generated/prisma/client.ts";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	try {
		console.log("Starting check-admin script...");
		console.log("PrismaClient initialized.");

		const admins = await prisma.user.findMany({
			where: { role: "ADMIN" },
		});

		console.log(`Found ${admins.length} admins.`);

		if (admins.length > 0) {
			for (const admin of admins) {
				console.log(
					`Admin: ${admin.email}, Verified: ${admin.isEmailVerified}, Role: ${admin.role}`,
				);

				if (!admin.isEmailVerified) {
					console.log(`Verifying email for admin: ${admin.email}`);
					await prisma.user.update({
						where: { id: admin.id },
						data: { isEmailVerified: true },
					});
					console.log(`Verified email for admin: ${admin.email}`);
				}
			}
		} else {
			console.log("No admin users found.");
		}
	} catch (error) {
		console.error("Error in check-admin script:", error);
		if (error instanceof Error) {
			console.error(error.message);
			console.error(error.stack);
		}
	} finally {
		await prisma.$disconnect();
	}
}

main();
