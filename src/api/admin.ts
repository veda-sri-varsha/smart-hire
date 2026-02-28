import { apiClient, getAuthHeader } from "./client";

export const getDashboardStats = async () => {
	const headers = getAuthHeader();
	const response = await apiClient.get("/admin/stats", { headers });
	return response.data;
};

export const getAllUsers = async (page = 1, limit = 20) => {
	const headers = getAuthHeader();
	const response = await apiClient.get(
		`/admin/users?page=${page}&limit=${limit}`,
		{ headers },
	);
	return response.data;
};

export const getAllJobs = async (page = 1, limit = 20) => {
	const headers = getAuthHeader();
	const response = await apiClient.get(
		`/admin/jobs?page=${page}&limit=${limit}`,
		{ headers },
	);
	return response.data;
};

export const updateUserStatus = async (userId: string, status: string) => {
	const headers = getAuthHeader();
	const response = await apiClient.patch(
		`/admin/users/${userId}`,
		{ status },
		{ headers },
	);
	return response.data;
};

export const deleteJobById = async (jobId: string) => {
	const headers = getAuthHeader();
	const response = await apiClient.delete(`/admin/jobs/${jobId}`, { headers });
	return response.data;
};
