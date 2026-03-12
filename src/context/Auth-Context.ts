import { createContext } from "react";
import type {
	AuthUserResponse,
	LoginRequest,
	SignupRequest,
} from "../../server/types/auth.types";

export type AuthContextType = {
	user: AuthUserResponse | null;
	isLoading: boolean;
	login: (data: LoginRequest) => Promise<AuthUserResponse>;
	signup: (data: SignupRequest) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);
