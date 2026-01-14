import type { Prisma } from "../../src/generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { ApplicationFilterQuery } from "../types/application.types";
import logger from "../utils/logger";

const applicationInclude = {
	user: {
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			profilePicture: true,
			resumeUrl: true,
		},
	},
	job: {
		select: {
			id: true,
			title: true,
			location: true,
			jobType: true,
			companyId: true,
			company: {
				select: {
					id: true,
					name: true,
					companyName: true,
					profilePicture: true,
					email: true,
				},
			},
		},
	},
};

export const applicationRepository = {
	create: async (data: {
		userId: string;
		jobId: string;
		resumeUrl?: string;
		coverLetter?: string;
	}) => {
		logger.info(`User ${data.userId} applying for job ${data.jobId}`);

		return prisma.application.create({
			data: {
				userId: data.userId,
				jobId: data.jobId,
				resumeUrl: data.resumeUrl,
				coverLetter: data.coverLetter,
				status: "APPLIED",
			},
			include: applicationInclude,
		});
	},

	findById: async (id: string) => {
		return prisma.application.findUnique({
			where: { id },
			include: applicationInclude,
		});
	},

	findByUserAndJob: async (userId: string, jobId: string) => {
		return prisma.application.findUnique({
			where: {
				userId_jobId: {
					userId,
					jobId,
				},
			},
		});
	},

	findMany: async (filters: ApplicationFilterQuery) => {
		const { page = 1, limit = 10, status, jobId, userId } = filters;
		const skip = (page - 1) * limit;

		const where: Prisma.ApplicationWhereInput = {};
		if (status) where.status = status;
		if (jobId) where.jobId = jobId;
		if (userId) where.userId = userId;

		const [applications, total] = await Promise.all([
			prisma.application.findMany({
				where,
				skip,
				take: limit,
				orderBy: { appliedAt: "desc" },
				include: applicationInclude,
			}),
			prisma.application.count({ where }),
		]);

		return {
			applications,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	},

	findByJobId: async (jobId: string, page = 1, limit = 10) => {
		const skip = (page - 1) * limit;

		const [applications, total] = await Promise.all([
			prisma.application.findMany({
				where: { jobId },
				skip,
				take: limit,
				orderBy: { appliedAt: "desc" },
				include: applicationInclude,
			}),
			prisma.application.count({ where: { jobId } }),
		]);

		return {
			applications,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	},

	findByUserId: async (userId: string, page = 1, limit = 10) => {
		const skip = (page - 1) * limit;

		const [applications, total] = await Promise.all([
			prisma.application.findMany({
				where: { userId },
				skip,
				take: limit,
				orderBy: { appliedAt: "desc" },
				include: applicationInclude,
			}),
			prisma.application.count({ where: { userId } }),
		]);

		return {
			applications,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	},

	updateStatus: async (
		id: string,
		status:
			| "APPLIED"
			| "SHORTLISTED"
			| "INTERVIEW"
			| "OFFERED"
			| "REJECTED"
			| "WITHDRAWN",
	) => {
		logger.info(`Updating application ${id} status to ${status}`);

		return prisma.application.update({
			where: { id },
			data: { status },
			include: applicationInclude,
		});
	},

	delete: async (id: string) => {
		logger.info(`Deleting application ${id}`);
		return prisma.application.delete({ where: { id } });
	},

	getJobStats: async (jobId: string) => {
		const stats = await prisma.application.groupBy({
			by: ["status"],
			where: { jobId },
			_count: true,
		});

		return stats.reduce(
			(acc, stat) => {
				acc[stat.status] = stat._count;
				return acc;
			},
			{} as Record<string, number>,
		);
	},
};
