import type {
	ApplicationResponse,
	// CreateApplicationRequest,
} from "../../server/types/application.types";
import type { ApiWrapper } from "../types/api";
import apiClient from "./client";

export const applyToJob = async (
	formData: FormData,
): Promise<ApplicationResponse> => {
	const response = await apiClient.post<ApiWrapper<ApplicationResponse>>(
		`/applications`,
		formData,
		{
			headers: {
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
	);
	return response.data.data.hasApplied;
};
