import type {
	ApplicationResponse,
	// CreateApplicationRequest,
} from "../../server/types/application.types";
import apiClient, { getAuthHeader } from "./client";

interface ApiWrapper<T> {
	success: boolean;
	message?: string;
	data: T;
}

export const applyToJob = async (
	formData: FormData,
): Promise<ApplicationResponse> => {
	const response = await apiClient.post<ApiWrapper<ApplicationResponse>>(
		`/applications`,
		formData,
		{
			headers: {
				...getAuthHeader(),
				"Content-Type": "multipart/form-data",
			},
		},
	);

	return response.data.data;
};

export const checkApplicationStatus = async (
	jobId: string,
): Promise<boolean> => {
	const response = await apiClient.get<ApiWrapper<{ hasApplied: boolean }>>(
		`/applications/check/${jobId}`,
		{
			headers: getAuthHeader(),
		},
	);
	return response.data.data.hasApplied;
};
