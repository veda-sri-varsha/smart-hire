import apiClient from "./client";

export const signup = (data: {
	name: string;
	email: string;
	password: string;
}) => {
	return apiClient.post(`/auth/signup`, data);
};

export const login = (data: { email: string; password: string }) => {
	return apiClient.post(`/auth/login`, data);
};
