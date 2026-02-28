import { applicationRepository } from "../repositories/application.repository";
import { jobRepository } from "../repositories/job.repository";
import type {
	ApplicationResponse,
	CreateApplicationRequest,
	PaginatedApplicationsResponse,
	UpdateApplicationStatusRequest,
} from "../types/application.types";
import CustomError from "../utils/customError";
import logger from "../utils/logger";

export const applicationService = {
	createApplication: async (
		userId: string,
		data: CreateApplicationRequest,
	): Promise<ApplicationResponse> => {
		logger.info(`User ${userId} applying for job ${data.jobId}`);

		const job = await jobRepository.findById(data.jobId);
		if (!job) throw new CustomError("Job not found", 404);

		if (job.status !== "OPEN") {
			throw new CustomError(
				"This job is no longer accepting applications",
				400,
			);
		}

		if (job.companyId === userId) {
			throw new CustomError("You cannot apply to your own job posting", 400);
		}

		const existingApplication = await applicationRepository.findByUserAndJob(
			userId,
			data.jobId,
		);

		if (existingApplication) {
			throw new CustomError("You have already applied for this job", 409);
		}

		return applicationRepository.create({
			userId,
			jobId: data.jobId,
			resumeUrl: data.resumeUrl, // ← Comes from controller (S3 upload)
			coverLetter: data.coverLetter,
		});
	},

	checkApplication: async (userId: string, jobId: string): Promise<boolean> => {
		const application = await applicationRepository.findByUserAndJob(
			userId,
			jobId,
		);
		return !!application;
	},

	getApplicationById: async (
		id: string,
		userId: string,
		userRole: string,
	): Promise<ApplicationResponse> => {
		const application = await applicationRepository.findById(id);
		if (!application) throw new CustomError("Application not found", 404);

		const isOwner = application.userId === userId;
		const isCompany = application.job.companyId === userId;
		const isAdmin = userRole === "ADMIN";

		if (!isOwner && !isCompany && !isAdmin) {
			throw new CustomError(
				"You don't have permission to view this application",
				403,
			);
		}

		return application;
	},

	getUserApplications: async (
		userId: string,
		page = 1,
		limit = 10,
	): Promise<PaginatedApplicationsResponse> => {
		const result = await applicationRepository.findByUserId(
			userId,
			page,
			limit,
		);

		return {
			applications: result.applications,
			pagination: {
				page: result.page,
				limit: result.limit,
				total: result.total,
				totalPages: result.totalPages,
			},
		};
	},

	getJobApplications: async (
		jobId: string,
		companyId: string,
		page = 1,
		limit = 10,
	): Promise<PaginatedApplicationsResponse> => {
		const job = await jobRepository.findById(jobId);
		if (!job) throw new CustomError("Job not found", 404);

		if (job.companyId !== companyId) {
			throw new CustomError(
				"You can only view applications for your own jobs",
				403,
			);
		}

		const result = await applicationRepository.findByJobId(jobId, page, limit);

		return {
			applications: result.applications,
			pagination: {
				page: result.page,
				limit: result.limit,
				total: result.total,
				totalPages: result.totalPages,
			},
		};
	},

	updateApplicationStatus: async (
		id: string,
		companyId: string,
		data: UpdateApplicationStatusRequest,
	): Promise<ApplicationResponse> => {
		const application = await applicationRepository.findById(id);
		if (!application) throw new CustomError("Application not found", 404);

		if (application.job.companyId !== companyId) {
			throw new CustomError(
				"You can only update applications for your own jobs",
				403,
			);
		}

		if (application.status === "WITHDRAWN") {
			throw new CustomError(
				"Cannot update status of withdrawn application",
				400,
			);
		}

		return applicationRepository.updateStatus(id, data.status);
	},

	withdrawApplication: async (
		id: string,
		userId: string,
	): Promise<{ message: string }> => {
		const application = await applicationRepository.findById(id);
		if (!application) throw new CustomError("Application not found", 404);

		if (application.userId !== userId) {
			throw new CustomError("You can only withdraw your own applications", 403);
		}

		if (["OFFERED", "REJECTED"].includes(application.status)) {
			throw new CustomError("Cannot withdraw application at this stage", 400);
		}

		await applicationRepository.updateStatus(id, "WITHDRAWN");

		return { message: "Application withdrawn successfully" };
	},

	getJobApplicationStats: async (jobId: string, companyId: string) => {
		const job = await jobRepository.findById(jobId);
		if (!job) throw new CustomError("Job not found", 404);

		if (job.companyId !== companyId) {
			throw new CustomError(
				"You can only view statistics for your own jobs",
				403,
			);
		}

		const stats = await applicationRepository.getJobStats(jobId);

		return {
			total: Object.values(stats).reduce((sum, count) => sum + count, 0),
			byStatus: stats,
		};
	},
};
