import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import type {
	AuthUserResponse,
	LoginRequest,
	SignupRequest,
} from "../../server/types/auth.types";
import { login as apiLogin, signup as apiSignup } from "../api/auth";

interface AuthContextType {
	user: AuthUserResponse | null;
	isLoading: boolean;
	login: (data: LoginRequest) => Promise<AuthUserResponse>;
	signup: (data: SignupRequest) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUserResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Hydrate from localStorage
		const storedUser = localStorage.getItem("smart-hire-user");
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (error) {
				console.error("Failed to parse user from local storage", error);
				localStorage.removeItem("smart-hire-user");
			}
		}
		setIsLoading(false);
	}, []);

	const login = async (data: LoginRequest): Promise<AuthUserResponse> => {
		setIsLoading(true);
		try {
			const response = await apiLogin(data);
			// API returns: { success: true, data: { user: {...}, sessionMessage: '...' } }
			const userData =
				response.data?.data?.user || response.data?.user || response.data;
			setUser(userData);
			localStorage.setItem("smart-hire-user", JSON.stringify(userData));
			return userData;
		} catch (error) {
			console.error("Login failed", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const signup = async (data: SignupRequest) => {
		setIsLoading(true);
		try {
			const response = await apiSignup(data);
			// API returns: { success: true, data: {...user} } - signup returns user directly in data
			const userData = response.data?.data || response.data;
			setUser(userData);
			localStorage.setItem("smart-hire-user", JSON.stringify(userData));
		} catch (error) {
			console.error("Signup failed", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("smart-hire-user");
		// Optional: Call apiLogout if backend supports cookie clearing
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

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
