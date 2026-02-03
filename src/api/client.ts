import axios from "axios";

const BASE = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
	baseURL: BASE,
	withCredentials: true,
});

export const getAuthHeader = (): Record<string, string> => {
	const storedUser = localStorage.getItem("smart-hire-user");
	if (storedUser) {
		try {
			const user = JSON.parse(storedUser);
			if (user.accessToken) {
				return { Authorization: `Bearer ${user.accessToken}` };
			}
		} catch {
			// ignore
		}
	}
	return {};
};

export default apiClient;
