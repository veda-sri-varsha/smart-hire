import { prisma } from "../lib/prisma.ts";
import { jobRepository } from "../repositories/job.repository";
import type {
	CreateJobRequest,
	JobFilterQuery,
	JobResponse,
	PaginatedJobsResponse,
	UpdateJobRequest,
	UpdateJobStatusRequest,
} from "../types/job.types";
import CustomError from "../utils/customError";
import logger from "../utils/logger";
import { toPaginatedResponse } from "../utils/pagination";

export const jobService = {
	getUniqueLocations: async (): Promise<string[]> => {
		const jobs = await prisma.job.findMany({
			where: { status: "OPEN" },
			select: { location: true },
			distinct: ["location"],
		});
		return jobs.map((j) => j.location).filter(Boolean);
	},

	getUniqueCategories: async (): Promise<string[]> => {
		// Categories are stored as 'skills' or we can extract from a specific field if exists.
		// For now, let's assume 'skills' contains category-like tags or use a hardcoded fallback if empty.
		const jobs = await prisma.job.findMany({
			where: { status: "OPEN" },
			select: { skills: true },
			distinct: ["skills"],
		});
		const categories = new Set<string>();
		jobs.forEach((j) => {
			if (j.skills) {
				j.skills.split(",").forEach((s) => categories.add(s.trim()));
			}
		});
		return Array.from(categories);
	},
	createJob: async (
		data: CreateJobRequest,
		companyId: string,
	): Promise<JobResponse> => {
		logger.info(companyId, "Creating job");
		const job = await jobRepository.create({
			...data,
			company: {
				connect: { id: companyId },
			},
		});
		return job as JobResponse;
	},

	getJobById: async (id: string): Promise<JobResponse> => {
		const job = await jobRepository.findById(id);
		if (!job || job.status === "ARCHIVED")
			throw new CustomError("Job not found", 404);
		return job as JobResponse;
	},

	getAllJobs: async (
		filters: JobFilterQuery,
	): Promise<PaginatedJobsResponse> => {
		const result = await jobRepository.findMany(filters);
		return toPaginatedResponse(
			result.data as JobResponse[],
			result.total,
			result.page,
			result.limit,
		);
	},

	getCompanyJobs: async (
		companyId: string,
		page = 1,
		limit = 10,
	): Promise<PaginatedJobsResponse> => {
		const result = await jobRepository.findByCompanyId(companyId, page, limit);
		return toPaginatedResponse(
			result.data as JobResponse[],
			result.total,
			result.page,
			result.limit,
		);
	},

	updateJob: async (
		id: string,
		companyId: string,
		data: UpdateJobRequest,
	): Promise<JobResponse> => {
		const job = await jobRepository.findById(id);
		if (!job) throw new CustomError("Job not found", 404);
		if (job.companyId !== companyId)
			throw new CustomError("You can only update your own jobs", 403);
		if (job.status === "ARCHIVED")
			throw new CustomError("Cannot update archived job", 400);
		const updatedJob = await jobRepository.update(id, data);
		return updatedJob as JobResponse;
	},

	updateJobStatus: async (
		id: string,
		companyId: string,
		data: UpdateJobStatusRequest,
	): Promise<JobResponse> => {
		const job = await jobRepository.findById(id);
		if (!job) throw new CustomError("Job not found", 404);
		if (job.companyId !== companyId)
			throw new CustomError("You can only update your own jobs", 403);
		const updatedJob = await jobRepository.updateStatus(id, data.status);
		return updatedJob as JobResponse;
	},

	deleteJob: async (
		id: string,
		companyId: string,
	): Promise<{ message: string }> => {
		const job = await jobRepository.findById(id);
		if (!job) throw new CustomError("Job not found", 404);
		if (job.companyId !== companyId)
			throw new CustomError("You can only delete your own jobs", 403);
		await jobRepository.delete(id);
		return { message: "Job deleted successfully" };
	},

	getFeaturedJobs: async (limit = 10): Promise<JobResponse[]> => {
		const jobs = await jobRepository.findFeatured(limit);
		return jobs as JobResponse[];
	},

	searchJobs: async (
		searchTerm: string,
		page = 1,
		limit = 10,
	): Promise<PaginatedJobsResponse> => {
		const result = await jobRepository.findMany({
			search: searchTerm,
			status: "OPEN",
			page,
			limit,
		});
		return toPaginatedResponse(
			result.data as JobResponse[],
			result.total,
			result.page,
			result.limit,
		);
	},
};
