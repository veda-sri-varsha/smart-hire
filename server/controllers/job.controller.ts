import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { jobService } from "../services/job.service";
import ApiResponse from "../utils/api-response";
import handler from "../utils/handler";
import {
	createJobSchema,
	jobQuerySchema,
	updateJobSchema,
	updateJobStatusSchema,
} from "../validations/job.validators";

const requireUser = (req: AuthRequest) => {
	if (!req.user) {
		throw new Error("Unauthorized");
	}
	return req.user;
};

export const createJob = handler(async (req: AuthRequest, res: Response) => {
	const data = createJobSchema.parse(req.body);
	const { id: companyId } = requireUser(req);

	const job = await jobService.createJob(data, companyId);
	return ApiResponse.success("Job created", job).send(res, 201);
});

export const getAllJobs = handler(async (req: Request, res: Response) => {
	const filters = jobQuerySchema.parse(req.query);
	const jobs = await jobService.getAllJobs(filters);

	return ApiResponse.success("Jobs fetched", jobs).send(res);
});

export const getJobById = handler(async (req: Request, res: Response) => {
	const job = await jobService.getJobById(req.params.id);
	return ApiResponse.success("Job fetched", job).send(res);
});

export const getMyJobs = handler(async (req: AuthRequest, res: Response) => {
	const { id: companyId } = requireUser(req);

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;

	const jobs = await jobService.getCompanyJobs(companyId, page, limit);
	return ApiResponse.success("My jobs", jobs).send(res);
});

export const updateJob = handler(async (req: AuthRequest, res: Response) => {
	const data = updateJobSchema.parse(req.body);
	const { id: companyId } = requireUser(req);

	const job = await jobService.updateJob(req.params.id, companyId, data);

	return ApiResponse.success("Job updated", job).send(res);
});

export const updateJobStatus = handler(
	async (req: AuthRequest, res: Response) => {
		const data = updateJobStatusSchema.parse(req.body);
		const { id: companyId } = requireUser(req);

		const job = await jobService.updateJobStatus(
			req.params.id,
			companyId,
			data,
		);

		return ApiResponse.success("Job status updated", job).send(res);
	},
);

export const deleteJob = handler(async (req: AuthRequest, res: Response) => {
	const { id: companyId } = requireUser(req);

	const result = await jobService.deleteJob(req.params.id, companyId);

	return ApiResponse.success(result.message).send(res);
});

export const getFeaturedJobs = handler(async (req: Request, res: Response) => {
	const limit = Number(req.query.limit) || 10;
	const jobs = await jobService.getFeaturedJobs(limit);

	return ApiResponse.success("Featured jobs", jobs).send(res);
});

export const searchJobs = handler(async (req: Request, res: Response) => {
	const { q } = req.query;

	if (!q || typeof q !== "string") {
		return ApiResponse.error("Search query required").send(res, 400);
	}

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;

	const result = await jobService.searchJobs(q, page, limit);
	return ApiResponse.success("Search results", result).send(res);
});
