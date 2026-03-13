import axios from "axios";

const BASE = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
	baseURL: BASE,
	withCredentials: true,
});

// Request Interceptor: Add Auth Header
apiClient.interceptors.request.use(
	(config) => {
		const storedUser = localStorage.getItem("smart-hire-user");
		if (storedUser) {
			try {
				const user = JSON.parse(storedUser);
				if (user.accessToken) {
					config.headers.Authorization = `Bearer ${user.accessToken}`;
				}
			} catch {
				// ignore invalid JSON
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response Interceptor: Handle Global Errors (like 401)
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Optional: Auto logout or refresh token logic
			console.warn("Unauthorized! Clearing session...");
			localStorage.removeItem("smart-hire-user");
			// Since we don't have access to router here easily, we could redirect or emit event
		}
		return Promise.reject(error);
	},
);

export default apiClient;
