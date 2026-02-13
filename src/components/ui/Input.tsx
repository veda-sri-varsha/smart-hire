import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	fullWidth?: boolean;
}

export default function Input({
	label,
	error,
	fullWidth,
	className,
	id,
	...props
}: InputProps) {
	return (
		<div
			className={`${styles.container} ${fullWidth ? styles.fullWidth : ""} ${className ?? ""}`}
		>
			{label && (
				<label htmlFor={id} className={styles.label}>
					{label}
				</label>
			)}
			<input
				id={id}
				className={`${styles.input} ${error ? styles.error : ""}`}
				{...props}
			/>
			{error && <span className={styles.errorMessage}>{error}</span>}
		</div>
	);
}
