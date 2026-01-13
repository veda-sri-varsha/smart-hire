import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { applicationService } from "../services/application.service";
import ApiResponse from "../utils/api-response";
import CustomError from "../utils/customError";
import handler from "../utils/handler";
import {
	// applicationQuerySchema,
	createApplicationSchema,
	updateApplicationStatusSchema,
} from "../validations/application.validators";

export const createApplication = handler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new CustomError("Unauthorized", 401);
		}

		const data = createApplicationSchema.parse(req.body);
		const application = await applicationService.createApplication(
			req.user.id,
			data,
		);

		return ApiResponse.success(
			"Application submitted successfully",
			application,
		).send(res, 201);
	},
);

export const getMyApplications = handler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new CustomError("Unauthorized", 401);
		}

		const page = parseInt(req.query.page as string, 10) || 1;
		const limit = parseInt(req.query.limit as string, 10) || 10;

		const result = await applicationService.getUserApplications(
			req.user.id,
			page,
			limit,
		);

		return ApiResponse.success(
			"Your applications retrieved successfully",
			result,
		).send(res, 200);
	},
);

export const getApplicationById = handler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new CustomError("Unauthorized", 401);
		}

		const application = await applicationService.getApplicationById(
			req.params.id,
			req.user.id,
			req.user.role,
		);

		return ApiResponse.success(
			"Application retrieved successfully",
			application,
		).send(res, 200);
	},
);

export const getJobApplications = handler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new CustomError("Unauthorized", 401);
		}

		const { jobId } = req.params;
		const page = parseInt(req.query.page as string, 10) || 1;
		const limit = parseInt(req.query.limit as string, 10) || 10;

		const result = await applicationService.getJobApplications(
			jobId,
			req.user.id,
			page,
			limit,
		);

		return ApiResponse.success(
			"Job applications retrieved successfully",
			result,
		).send(res, 200);
	},
);

export const updateApplicationStatus = handler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new CustomError("Unauthorized", 401);
		}

		const data = updateApplicationStatusSchema.parse(req.body);
		const application = await applicationService.updateApplicationStatus(
			req.params.id,
			req.user.id,
			data,
		);

		return ApiResponse.success(
			"Application status updated successfully",
			application,
		).send(res, 200);
	},
);

export const withdrawApplication = handler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new CustomError("Unauthorized", 401);
		}

		const result = await applicationService.withdrawApplication(
			req.params.id,
			req.user.id,
		);

		return ApiResponse.success(result.message).send(res, 200);
	},
);

export const getJobApplicationStats = handler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new CustomError("Unauthorized", 401);
		}

		const { jobId } = req.params;
		const stats = await applicationService.getJobApplicationStats(
			jobId,
			req.user.id,
		);

		return ApiResponse.success(
			"Application statistics retrieved successfully",
			stats,
		).send(res, 200);
	},
);
