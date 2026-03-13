import {
	JobStatus,
	type JobType,
	type Prisma,
} from "../../src/generated/prisma/client";
import { JOB_INCLUDE, JOB_MINIMAL_INCLUDE } from "../constants/prisma-includes";
import { prisma } from "../lib/prisma";
import type { JobFilterQuery } from "../types/job.types";
import logger from "../utils/logger";

export const jobRepository = {
	create: async (data: Prisma.JobCreateInput) => {
		logger.info("Creating new job");
		return prisma.job.create({
			data,
			include: JOB_MINIMAL_INCLUDE,
		});
	},

	findById: async (id: string) => {
		logger.info(`Fetching job by id ${id}`);
		return prisma.job.findUnique({
			where: { id },
			include: JOB_INCLUDE,
		});
	},

	findMany: async (filters: JobFilterQuery) => {
		const page = filters.page ?? 1;
		const limit = filters.limit ?? 10;
		const skip = (page - 1) * limit;

		const where: Prisma.JobWhereInput = {};

		if (filters.jobType) {
			where.jobType = filters.jobType as JobType;
		}

		if (filters.location) {
			where.location = {
				contains: filters.location,
				mode: "insensitive",
			};
		}

		if (filters.salaryMin !== undefined) {
			where.salaryMin = { gte: filters.salaryMin };
		}

		if (filters.salaryMax !== undefined) {
			where.salaryMax = { lte: filters.salaryMax };
		}

		if (filters.experienceMin !== undefined) {
			where.experienceMin = { gte: filters.experienceMin };
		}

		if (filters.experienceMax !== undefined) {
			where.experienceMax = { lte: filters.experienceMax };
		}

		if (filters.skills) {
			where.skills = {
				contains: filters.skills,
				mode: "insensitive",
			};
		}

		if (filters.status) {
			where.status = filters.status;
		}

		if (filters.companyId) {
			where.companyId = filters.companyId;
		}

		if (filters.search) {
			where.OR = [
				{ title: { contains: filters.search, mode: "insensitive" } },
				{ description: { contains: filters.search, mode: "insensitive" } },
				{ skills: { contains: filters.search, mode: "insensitive" } },
			];
		}

		if (filters.category) {
			where.skills = {
				contains: filters.category,
				mode: "insensitive",
			};
		}

		if (filters.title) {
			where.title = {
				contains: filters.title,
				mode: "insensitive",
			};
		}

		const sortField = filters.sortBy || "createdAt";
		const sortOrder = filters.order || "desc";
		const orderBy: any = {};
		orderBy[sortField] = sortOrder;

		const [jobs, total] = await Promise.all([
			prisma.job.findMany({
				where,
				skip,
				take: limit,
				orderBy,
				include: JOB_MINIMAL_INCLUDE,
			}),
			prisma.job.count({ where }),
		]);

		return {
			data: jobs,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	},

	update: async (id: string, data: Prisma.JobUpdateInput) => {
		logger.info(`Updating job ${id}`);
		return prisma.job.update({
			where: { id },
			data,
			include: JOB_MINIMAL_INCLUDE,
		});
	},

	updateStatus: async (id: string, status: JobStatus) => {
		return prisma.job.update({
			where: { id },
			data: { status },
			include: JOB_MINIMAL_INCLUDE,
		});
	},

	delete: async (id: string) => {
		logger.info(`Archiving job ${id}`);
		return prisma.job.update({
			where: { id },
			data: { status: JobStatus.ARCHIVED },
		});
	},

	hardDelete: async (id: string) => {
		logger.warn(`Hard deleting job ${id}`);
		return prisma.job.delete({ where: { id } });
	},

	findByCompanyId: async (companyId: string, page = 1, limit = 10) => {
		const skip = (page - 1) * limit;

		const [jobs, total] = await Promise.all([
			prisma.job.findMany({
				where: { companyId },
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: JOB_MINIMAL_INCLUDE,
			}),
			prisma.job.count({ where: { companyId } }),
		]);

		return {
			data: jobs,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	},

	findFeatured: async (limit = 10) => {
		return prisma.job.findMany({
			where: { status: JobStatus.OPEN },
			take: limit,
			orderBy: { createdAt: "desc" },
			include: JOB_MINIMAL_INCLUDE,
		});
	},
};
