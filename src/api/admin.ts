import { apiClient } from "./client";

export const getDashboardStats = async () => {
	const response = await apiClient.get("/admin/stats");
	return response.data;
};

export const getAllUsers = async (page = 1, limit = 20) => {
	const response = await apiClient.get(
		`/admin/users?page=${page}&limit=${limit}`,
	);
	return response.data;
};

export const getAllJobs = async (page = 1, limit = 20) => {
	const response = await apiClient.get(
		`/admin/jobs?page=${page}&limit=${limit}`,
	);
	return response.data;
};

export const updateUserStatus = async (userId: string, status: string) => {
	const response = await apiClient.patch(`/admin/users/${userId}`, { status });
	return response.data;
};

export const deleteJobById = async (jobId: string) => {
	const response = await apiClient.delete(`/admin/jobs/${jobId}`);
	return response.data;
};
