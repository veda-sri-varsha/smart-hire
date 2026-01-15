/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./api/auth";
import "./App.css";

const App = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState(""); // Show success/error
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			const res = await login({ email, password });
			console.log(res.data);

			setMessage("Login successful! Redirecting...");
			setTimeout(() => navigate("/dashboard"), 1500);
		} catch (err: any) {
			setMessage(err?.response?.data?.message || "Login failed");
		}
	};

	return (
		<div className="app-container">
			<h1>Hello, World!</h1>

			<input
				className="input-field"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				className="input-field"
				placeholder="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			<button type="button" onClick={handleLogin} className="action-button">
				Login
			</button>

			{message && <p className="message">{message}</p>}
		</div>
	);
};

export default App;
