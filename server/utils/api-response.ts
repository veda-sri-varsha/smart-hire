import type { Response } from "express";

class ApiResponse<T = unknown> {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;

	private constructor(
		success: boolean,
		message?: string,
		data?: T,
		error?: string,
	) {
		this.success = success;
		this.message = message;
		this.data = data;
		this.error = error;
	}

	static success<T>(message?: string, data?: T) {
		return new ApiResponse<T>(true, message, data);
	}

	static error(message: string) {
		return new ApiResponse<null>(false, undefined, null, message);
	}

	send(res: Response, statusCode = 200) {
		return res.status(statusCode).json({
			success: this.success,
			message: this.message,
			data: this.data,
			error: this.error,
		});
	}
}

export default ApiResponse;
