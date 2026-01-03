const swaggerSpec = {
	openapi: "3.0.1",
	info: {
		title: "SmartHire API",
		version: "1.0.0",
		description:
			"API documentation for SmartHire authentication and user flows",
	},
	servers: [
		{
			url:
				process.env.VITE_SERVER_URL ??
				`http://localhost:${process.env.PORT ?? 5000}`,
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
			cookieAuth: {
				type: "apiKey",
				in: "cookie",
				name: "accessToken",
			},
		},
		schemas: {
			SignupRequest: {
				type: "object",
				properties: {
					email: { type: "string", format: "email" },
					name: { type: "string" },
					password: { type: "string" },
				},
				required: ["email", "password"],
			},
			LoginRequest: {
				type: "object",
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string" },
				},
				required: ["email", "password"],
			},
			ResendOtpRequest: {
				type: "object",
				properties: { email: { type: "string", format: "email" } },
				required: ["email"],
			},
			AuthUserResponse: {
				type: "object",
				properties: {
					id: { type: "string" },
					email: { type: "string", format: "email" },
					name: { type: "string" },
					role: { type: "string" },
					status: { type: "string" },
					isEmailVerified: { type: "boolean" },
					profilePicture: { type: ["string", "null"] },
					resumeUrl: { type: ["string", "null"] },
				},
			},
			ApiResponse: {
				type: "object",
				properties: {
					message: { type: "string" },
					data: { type: ["object", "null"] },
				},
			},
		},
	},
	paths: {
		"/auth/signup": {
			post: {
				tags: ["Auth"],
				summary: "Register a new user",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/SignupRequest" },
						},
					},
				},
				responses: {
					"201": {
						description: "User created (tokens set in secure cookies)",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/ApiResponse" },
							},
						},
					},
					"400": { description: "Validation error" },
					"409": { description: "Email already registered" },
				},
			},
		},
		"/auth/login": {
			post: {
				tags: ["Auth"],
				summary: "Log in a user",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/LoginRequest" },
						},
					},
				},
				responses: {
					"200": {
						description: "Login successful (tokens set in secure cookies)",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/ApiResponse" },
							},
						},
					},
					"401": { description: "Invalid credentials" },
				},
			},
		},
		"/auth/resend-otp": {
			post: {
				tags: ["Auth"],
				summary: "Resend verification OTP",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/ResendOtpRequest" },
						},
					},
				},
				responses: {
					"200": { description: "OTP resent if account exists" },
					"429": { description: "Too many requests" },
				},
			},
		},
	},
};

export default swaggerSpec;
