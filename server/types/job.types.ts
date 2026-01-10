export type CreateJobRequest = {
	title: string;
	description: string;
	location: string;
	salaryMin?: number;
	salaryMax?: number;
	experienceMin?: number;
	experienceMax?: number;
	jobType: "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT" | "FREELANCE";
	skills: string; 
	status?: "DRAFT" | "OPEN";
};

export type UpdateJobRequest = Partial<CreateJobRequest>;

export type UpdateJobStatusRequest = {
	status: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
};

export type JobFilterQuery = {
	page?: number;
	limit?: number;
	jobType?: string;
	location?: string;
	salaryMin?: number;
	salaryMax?: number;
	experienceMin?: number;
	experienceMax?: number;
	skills?: string;
	search?: string;
	status?: "OPEN" | "CLOSED";
	companyId?: string;
};

export type JobResponse = {
	id: string;
	title: string;
	description: string;
	location: string;
	salaryMin: number | null;
	salaryMax: number | null;
	experienceMin: number | null;
	experienceMax: number | null;
	jobType: string;
	skills: string;
	status: string;
	companyId: string;
	company: {
		id: string;
		name: string | null;
		companyName: string | null;
		profilePicture: string | null;
	};
	_count?: {
		applications: number;
	};
	createdAt: Date;
	updatedAt: Date;
};

export type PaginatedJobsResponse = {
	jobs: JobResponse[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};
