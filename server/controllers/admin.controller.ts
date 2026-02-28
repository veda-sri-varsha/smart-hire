import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import ApiResponse from "../utils/api-response";
import logger from "../utils/logger";

export const getDashboardStats = async (_req: Request, res: Response) => {
	try {
		logger.info("Fetching admin dashboard stats");

		const [
			totalUsers,
			activeUsers,
			totalCompanies,
			activeCompanies,
			totalHr,
			activeHr,
			activeJobs,
			expiredJobs,
			totalApplications,
			activeApplicants,
		] = await Promise.all([
			// Users
			prisma.user.count({ where: { role: "USER", isDeleted: false } }),
			prisma.user.count({
				where: { role: "USER", status: "ACTIVE", isDeleted: false },
			}),

			// Companies
			prisma.user.count({ where: { role: "COMPANY", isDeleted: false } }),
			prisma.user.count({
				where: { role: "COMPANY", status: "ACTIVE", isDeleted: false },
			}),

			// HR
			prisma.user.count({ where: { role: "HR", isDeleted: false } }),
			prisma.user.count({
				where: { role: "HR", status: "ACTIVE", isDeleted: false },
			}),

			// Jobs
			prisma.job.count({ where: { status: "OPEN" } }),
			prisma.job.count({ where: { status: { in: ["CLOSED", "ARCHIVED"] } } }),

			// Applications
			prisma.application.count(),
			prisma.application
				.groupBy({
					by: ["userId"],
					_count: true,
				})
				.then((groups) => groups.length), // Count of unique users who applied
		]);

		// Recent Users
		const recentUsers = await prisma.user.findMany({
			where: { role: "USER", isDeleted: false },
			orderBy: { createdAt: "desc" },
			take: 5,
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
				status: true,
				profilePicture: true,
			},
		});

		// Recent Companies
		const recentCompanies = await prisma.user.findMany({
			where: { role: "COMPANY", isDeleted: false },
			orderBy: { createdAt: "desc" },
			take: 5,
			select: {
				id: true,
				name: true,
				companyName: true,
				email: true,
				createdAt: true,
				status: true,
				profilePicture: true,
			},
		});

		// Analytics for Charts
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		// User registrations by day (last 7 days)
		const userRegistrations = await prisma.user.groupBy({
			by: ["createdAt"],
			where: {
				createdAt: { gte: sevenDaysAgo },
				isDeleted: false,
				role: "USER",
			},
			_count: true,
		});

		// Applications by day (last 7 days)
		const applicationsOverTime = await prisma.application.groupBy({
			by: ["appliedAt"],
			where: {
				appliedAt: { gte: sevenDaysAgo },
			},
			_count: true,
		});

		// Jobs by status
		const jobsByStatus = await prisma.job.groupBy({
			by: ["status"],
			_count: true,
		});

		// Users by role
		const usersByRole = await prisma.user.groupBy({
			by: ["role"],
			where: { isDeleted: false },
			_count: true,
		});

		// Format data for charts
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - (6 - i));
			return date.toISOString().split("T")[0];
		});

		const userRegistrationsByDay = last7Days.map((day) => {
			const count = userRegistrations
				.filter((r) => r.createdAt.toISOString().split("T")[0] === day)
				.reduce((sum, r) => sum + r._count, 0);
			return { date: day, count };
		});

		const applicationsByDay = last7Days.map((day) => {
			const count = applicationsOverTime
				.filter((a) => a.appliedAt.toISOString().split("T")[0] === day)
				.reduce((sum, a) => sum + a._count, 0);
			return { date: day, count };
		});

		res.json({
			success: true,
			data: {
				users: { total: totalUsers, active: activeUsers },
				companies: { total: totalCompanies, active: activeCompanies },
				hr: { total: totalHr, active: activeHr },
				jobs: { active: activeJobs, expired: expiredJobs },
				applications: { total: totalApplications, activeApplicants },
				recentUsers,
				recentCompanies,
				// Chart data
				analytics: {
					userRegistrations: userRegistrationsByDay,
					applicationsOverTime: applicationsByDay,
					jobsByStatus: jobsByStatus.map((j) => ({
						status: j.status,
						count: j._count,
					})),
					usersByRole: usersByRole.map((u) => ({
						role: u.role,
						count: u._count,
					})),
				},
			},
		});
	} catch (error) {
		logger.error("Error fetching admin stats", { error });
		ApiResponse.error("Failed to fetch dashboard statistics").send(res);
	}
};

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 20;
		const skip = (page - 1) * limit;

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where: { isDeleted: false },
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
					status: true,
					isEmailVerified: true,
					createdAt: true,
					phone: true,
					location: true,
				},
			}),
			prisma.user.count({ where: { isDeleted: false } }),
		]);

		res.json({
			success: true,
			data: {
				users,
				pagination: {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
				},
			},
		});
	} catch (error) {
		logger.error("Error fetching users", { error });
		ApiResponse.error("Failed to fetch users").send(res);
	}
};

export const getAllJobs = async (req: Request, res: Response) => {
	try {
		logger.info("Fetching all jobs for admin");
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 20;
		const skip = (page - 1) * limit;

		logger.info(`Query params: page=${page}, limit=${limit}, skip=${skip}`);

		const [jobs, total] = await Promise.all([
			prisma.job.findMany({
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					company: {
						select: {
							id: true,
							name: true,
							companyName: true,
							email: true,
						},
					},
					_count: {
						select: { applications: true },
					},
				},
			}),
			prisma.job.count(),
		]);

		logger.info(
			`Successfully fetched ${jobs.length} jobs out of ${total} total`,
		);

		res.json({
			success: true,
			data: {
				jobs,
				pagination: {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
				},
			},
		});
	} catch (error: any) {
		logger.error("Error fetching jobs", {
			error: error.message,
			stack: error.stack,
			name: error.name,
		});
		ApiResponse.error(`Failed to fetch jobs: ${error.message}`).send(res);
	}
};

export const updateUserStatus = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!["ACTIVE", "INACTIVE", "BLOCKED"].includes(status)) {
			return ApiResponse.error("Invalid status").send(res, 400);
		}

		const user = await prisma.user.update({
			where: { id },
			data: { status },
			select: {
				id: true,
				name: true,
				email: true,
				status: true,
			},
		});

		logger.info(`User status updated: ${id} -> ${status}`);
		res.json({ success: true, data: user });
	} catch (error) {
		logger.error("Error updating user status", { error });
		ApiResponse.error("Failed to update user status").send(res);
	}
};

export const deleteJob = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		await prisma.job.update({
			where: { id },
			data: { status: "ARCHIVED" },
		});

		logger.info(`Job archived: ${id}`);
		res.json({ success: true, message: "Job archived successfully" });
	} catch (error) {
		logger.error("Error deleting job", { error });
		ApiResponse.error("Failed to delete job").send(res);
	}
};
