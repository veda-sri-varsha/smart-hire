import { z } from "zod";

export const jobTypeEnum = z.enum([
	"FULL_TIME",
	"PART_TIME",
	"INTERNSHIP",
	"CONTRACT",
	"FREELANCE",
]);

export const jobCreateStatusEnum = z.enum(["DRAFT", "OPEN"]);

export const jobFullStatusEnum = z.enum([
	"DRAFT",
	"OPEN",
	"CLOSED",
	"ARCHIVED",
]);

export const createJobSchema = z
	.object({
		title: z
			.string()
			.min(5, "Job title must be at least 5 characters")
			.max(200),
		description: z
			.string()
			.min(50, "Job description must be at least 50 characters")
			.max(5000),
		location: z
			.string()
			.min(2, "Location must be at least 2 characters")
			.max(200),

		salaryMin: z.coerce.number().int().min(0).optional(),
		salaryMax: z.coerce.number().int().min(0).optional(),

		experienceMin: z.coerce.number().int().min(0).max(50).optional(),
		experienceMax: z.coerce.number().int().min(0).max(50).optional(),

		jobType: jobTypeEnum,
		skills: z.string().min(2).max(500),

		status: jobCreateStatusEnum.optional().default("OPEN"),
	})
	.refine(
		(data) => {
			if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
				return data.salaryMin <= data.salaryMax;
			}
			return true;
		},
		{
			message: "Minimum salary must be less than or equal to maximum salary",
			path: ["salaryMin"],
		},
	)
	.refine(
		(data) => {
			if (
				data.experienceMin !== undefined &&
				data.experienceMax !== undefined
			) {
				return data.experienceMin <= data.experienceMax;
			}
			return true;
		},
		{
			message:
				"Minimum experience must be less than or equal to maximum experience",
			path: ["experienceMin"],
		},
	);


export const updateJobSchema = createJobSchema.omit({ status: true }).partial();

export const updateJobStatusSchema = z.object({
	status: jobFullStatusEnum,
});

export const jobQuerySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	limit: z.coerce.number().int().min(1).max(100).optional().default(10),
	jobType: z.string().optional(),
	location: z.string().optional(),
	salaryMin: z.coerce.number().int().min(0).optional(),
	salaryMax: z.coerce.number().int().min(0).optional(),
	experienceMin: z.coerce.number().int().min(0).optional(),
	experienceMax: z.coerce.number().int().min(0).optional(),
	skills: z.string().optional(),
	search: z.string().optional(),
	status: z.enum(["OPEN", "CLOSED"]).optional(),
	companyId: z.string().uuid().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type UpdateJobStatusInput = z.infer<typeof updateJobStatusSchema>;
export type JobQueryInput = z.infer<typeof jobQuerySchema>;
