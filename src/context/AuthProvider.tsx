import { type ReactNode, useEffect, useState } from "react";
import type {
	AuthUserResponse,
	LoginRequest,
	SignupRequest,
} from "../../server/types/auth.types";
import { login as apiLogin, signup as apiSignup } from "../api/auth";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUserResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const storedUser = localStorage.getItem("smart-hire-user");

		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch {
				localStorage.removeItem("smart-hire-user");
			}
		}

		setIsLoading(false);
	}, []);

	const login = async (data: LoginRequest) => {
		setIsLoading(true);
		try {
			const response = await apiLogin(data);

			const userData =
				response.data?.data?.user ?? response.data?.user ?? response.data;

			setUser(userData);
			localStorage.setItem("smart-hire-user", JSON.stringify(userData));

			return userData;
		} finally {
			setIsLoading(false);
		}
	};

	const signup = async (data: SignupRequest) => {
		setIsLoading(true);
		try {
			const response = await apiSignup(data);
			const userData = response.data?.data ?? response.data;

			setUser(userData);
			localStorage.setItem("smart-hire-user", JSON.stringify(userData));
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("smart-hire-user");
		window.location.href = "/login";
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				login,
				signup,
				logout,
				isAuthenticated: !!user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
