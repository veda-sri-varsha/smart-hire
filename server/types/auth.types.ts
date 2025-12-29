export type SignupRequest = {
	email: string;
	password: string;
	name?: string;
};

export type LoginRequest = {
	email: string;
	password: string;
};

export type RefreshTokenRequest = {
	userId: string;
	refreshToken: string;
};

export type ChangePasswordRequest = {
	userId: string;
	currentPassword: string;
	newPassword: string;
};

export type ResetPasswordRequest = {
	token: string;
	newPassword: string;
};

export type VerifyEmailRequest = {
	email: string;
	otp: string;
};

export type VerifyEmailResponse = ApiResponse<AuthUserResponse>;

export type ResendOtpRequest = {
	email: string;
};

export type ForgotPasswordRequest = {
	email: string;
};

export type ContactUsRequest = {
	name: string;
	email: string;
	message: string;
};

export type AuthUserResponse = {
	id: string;
	email: string;
	name?: string | null;
	role: "ADMIN" | "HR" | "USER" | "COMPANY";
	status: "ACTIVE" | "INACTIVE" | "BLOCKED";
	isEmailVerified: boolean;
	profilePicture?: string | null;
	resumeUrl?: string | null;
	accessToken: string;
	refreshToken: string;
};

export type ApiResponse<T> = {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
};
