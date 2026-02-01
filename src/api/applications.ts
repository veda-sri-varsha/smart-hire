import axios from "axios";
import type {
	ApplicationResponse,
	CreateApplicationRequest,
} from "../../server/types/application.types";

const API_URL = "http://localhost:8000/applications";

// Backend wraps responses in: { success: true, message: '...', data: {...} }
interface ApiWrapper<T> {
	success: boolean;
	message?: string;
	data: T;
}

// Helper to get auth token from localStorage
const getAuthHeader = () => {
	const storedUser = localStorage.getItem("smart-hire-user");
	if (storedUser) {
		try {
			const user = JSON.parse(storedUser);
			if (user.accessToken) {
				return { Authorization: `Bearer ${user.accessToken}` };
			}
		} catch {
			// ignore parse errors
		}
	}
	return {};
};

export const applyToJob = async (
	data: CreateApplicationRequest,
): Promise<ApplicationResponse> => {
	const response = await axios.post<ApiWrapper<ApplicationResponse>>(`${API_URL}`, data, {
		withCredentials: true,
		headers: getAuthHeader(),
	});
	return response.data.data;
};
