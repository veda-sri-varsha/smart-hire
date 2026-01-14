export type CreateApplicationRequest = {
	jobId: string;
	resumeUrl?: string;
	coverLetter?: string;
};

export type ApplicationStatus =
	| "APPLIED"
	| "SHORTLISTED"
	| "INTERVIEW"
	| "OFFERED"
	| "REJECTED"
	| "WITHDRAWN";

export type UpdateApplicationStatusRequest = {
	status: ApplicationStatus;
};

export type ApplicationFilterQuery = {
	page?: number;
	limit?: number;
	status?: ApplicationStatus;
	jobId?: string;
	userId?: string;
};

export type ApplicationResponse = {
	id: string;
	userId: string;
	jobId: string;
	resumeUrl: string | null;
	coverLetter: string | null;
	status: string;
	appliedAt: Date;
	updatedAt: Date;
	user: {
		id: string;
		name: string | null;
		email: string;
		phone: string | null;
		profilePicture: string | null;
	};
	job: {
		id: string;
		title: string;
		company: {
			id: string;
			name: string | null;
			companyName: string | null;
		};
	};
};

export type PaginatedApplicationsResponse = {
	applications: ApplicationResponse[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};
