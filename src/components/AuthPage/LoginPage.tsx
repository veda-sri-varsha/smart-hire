import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import styles from "./AuthCard.module.scss";

interface AuthCardProps {
	initialMode?: "login" | "register";
}

export default function AuthCard({ initialMode = "login" }: AuthCardProps) {
	const [mode, setMode] = useState<"login" | "register">(initialMode);
	const { login, signup } = useAuth();
	const navigate = useNavigate();

	// Form State
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setMode(initialMode);
	}, [initialMode]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			if (mode === "login") {
				const user = await login({ email, password });
				if (user.role === "ADMIN") {
					navigate({ to: "/admin" });
					return;
				}
			} else {
				if (password !== confirmPassword) {
					setError("Passwords do not match");
					setLoading(false);
					return;
				}
				await signup({ name, email, password });
			}
			// Redirect to home or dashboard on success
			navigate({ to: "/" });
		} catch (err: any) {
			console.error("Auth error:", err);
			const message =
				err.response?.data?.message ||
				err.message ||
				"Authentication failed. Please check your credentials.";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.card}>
				<h1 className={styles.title}>
					{mode === "login" ? "Welcome Back" : "Create Account"}
				</h1>
				<p className={styles.subtitle}>
					{mode === "login"
						? "Sign in to access your account"
						: "Sign up to get started with Smart Hire"}
				</p>

				<div className={styles.tabs}>
					<button
						type="button"
						className={`${styles.tab} ${mode === "login" ? styles.active : ""}`}
						onClick={() => setMode("login")}
					>
						Sign In
					</button>
					<button
						type="button"
						className={`${styles.tab} ${mode === "register" ? styles.active : ""}`}
						onClick={() => setMode("register")}
					>
						Sign Up
					</button>
				</div>

				{error && <div className={styles["error-message"]}>{error}</div>}

				<form className={styles.form} onSubmit={handleSubmit}>
					{mode === "register" && (
						<Input
							label="Full Name"
							id="name"
							type="text"
							placeholder="John Doe"
							fullWidth
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					)}

					<Input
						label="Email Address"
						id="email"
						type="email"
						placeholder="you@example.com"
						fullWidth
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<Input
						label="Password"
						id="password"
						type="password"
						placeholder="••••••••"
						fullWidth
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					{mode === "register" && (
						<Input
							label="Confirm Password"
							id="confirm"
							type="password"
							placeholder="••••••••"
							fullWidth
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					)}

					<Button
						type="submit"
						fullWidth
						className={styles.submitBtn}
						disabled={loading}
					>
						{loading
							? "Processing..."
							: mode === "login"
								? "Sign In"
								: "Create Account"}
					</Button>
				</form>
			</div>
		</div>
	);
}
