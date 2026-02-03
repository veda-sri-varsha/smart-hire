import type {
	JobFilterQuery,
	JobResponse,
	PaginatedJobsResponse,
} from "../../server/types/job.types";
import apiClient from "./client";

// Backend wraps responses in: { success: true, message: '...', data: {...} }
interface ApiWrapper<T> {
	success: boolean;
	message?: string;
	data: T;
}

export const getJobs = async (
	filters?: JobFilterQuery,
): Promise<PaginatedJobsResponse> => {
	const params = new URLSearchParams();
	if (filters) {
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				params.append(key, String(value));
			}
		});
	}
	const response = await apiClient.get<ApiWrapper<PaginatedJobsResponse>>(
		`/jobs?${params.toString()}`,
	);
	return response.data.data;
};

export const getJobById = async (id: string): Promise<JobResponse> => {
	const response = await apiClient.get<ApiWrapper<JobResponse>>(`/jobs/${id}`);
	return response.data.data;
};
