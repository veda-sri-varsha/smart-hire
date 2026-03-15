import { z } from "zod";

export const applicationStatusEnum = z.enum([
	"APPLIED",
	"SHORTLISTED",
	"INTERVIEW",
	"OFFERED",
	"REJECTED",
	"WITHDRAWN",
]);

export const createApplicationSchema = z.object({
	jobId: z.string().uuid("Invalid job ID"),
	resumeUrl: z.string().url("Invalid resume URL").optional(),
	coverLetter: z
		.string()
		.max(2000, "Cover letter must not exceed 2000 characters")
		.optional()
		.or(z.literal("")),
});

export const updateApplicationStatusSchema = z.object({
	status: applicationStatusEnum,
});

export const applicationQuerySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	limit: z.coerce.number().int().min(1).max(100).optional().default(10),
	status: applicationStatusEnum.optional(),
	jobId: z.string().uuid().optional(),
	userId: z.string().uuid().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<
	typeof updateApplicationStatusSchema
>;
export type ApplicationQueryInput = z.infer<typeof applicationQuerySchema>;
