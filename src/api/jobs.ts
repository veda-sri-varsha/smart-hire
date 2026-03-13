import type {
	JobFilterQuery,
	JobResponse,
	PaginatedJobsResponse,
} from "../../server/types/job.types";
import type { ApiWrapper } from "../types/api";
import apiClient from "./client";

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

export const getLocations = async (): Promise<string[]> => {
	const response = await apiClient.get<ApiWrapper<string[]>>("/jobs/locations");
	return response.data.data;
};

export const getCategories = async (): Promise<string[]> => {
	const response =
		await apiClient.get<ApiWrapper<string[]>>("/jobs/categories");
	return response.data.data;
};
