import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	error?: string;
	fullWidth?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, fullWidth, className, id, ...props }, ref) => {
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
					ref={ref}
					className={`${styles.input} ${error ? styles.error : ""}`}
					{...props}
				/>
				{error && <span className={styles.errorMessage}>{error}</span>}
			</div>
		);
	},
);

Input.displayName = "Input";

export default Input;
