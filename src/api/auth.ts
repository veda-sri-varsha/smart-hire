import axios from "axios";

const API_URL = "http://localhost:8000/auth";

export const signup = (data: {
	name: string;
	email: string;
	password: string;
}) => {
	return axios.post(`${API_URL}/signup`, data, { withCredentials: true });
};

export const login = (data: { email: string; password: string }) => {
	return axios.post(`${API_URL}/login`, data, { withCredentials: true });
};
