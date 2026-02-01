import axios from "axios";
import type {
	JobFilterQuery,
	JobResponse,
	PaginatedJobsResponse,
} from "../../server/types/job.types";

const API_URL = "http://localhost:8000/jobs";

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
	const response = await axios.get<ApiWrapper<PaginatedJobsResponse>>(
		`${API_URL}?${params.toString()}`,
		{ withCredentials: true },
	);
	return response.data.data;
};

export const getJobById = async (id: string): Promise<JobResponse> => {
	const response = await axios.get<ApiWrapper<JobResponse>>(`${API_URL}/${id}`, {
		withCredentials: true,
	});
	return response.data.data;
};
