import type {
	ApplicationResponse,
	CreateApplicationRequest,
} from "../../server/types/application.types";
import apiClient, { getAuthHeader } from "./client";

// Backend wraps responses in: { success: true, message: '...', data: {...} }
interface ApiWrapper<T> {
	success: boolean;
	message?: string;
	data: T;
}

export const applyToJob = async (
	data: CreateApplicationRequest,
): Promise<ApplicationResponse> => {
	const response = await apiClient.post<ApiWrapper<ApplicationResponse>>(
		`/applications`,
		data,
		{ headers: getAuthHeader() },
	);
	return response.data.data;
};

export const uploadResume = async (file: File): Promise<string> => {
	const form = new FormData();
	form.append("file", file);

	const response = await apiClient.post<{ url: string }>(`/uploads`, form, {
		headers: {
			...getAuthHeader(),
			"Content-Type": "multipart/form-data",
		},
	});

	// expect backend to return { url: 'https://...' }
	return response.data.url;
};
