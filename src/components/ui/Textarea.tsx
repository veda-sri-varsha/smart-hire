import type { TextareaHTMLAttributes } from "react";
import styles from "./Textarea.module.scss";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	fullWidth?: boolean;
}

export default function Textarea({
	label,
	error,
	fullWidth,
	className,
	id,
	...props
}: TextareaProps) {
	return (
		<div
			className={`${styles.container} ${fullWidth ? styles.fullWidth : ""} ${className ?? ""}`}
		>
			{label && (
				<label htmlFor={id} className={styles.label}>
					{label}
				</label>
			)}
			<textarea
				id={id}
				className={`${styles.textarea} ${error ? styles.error : ""}`}
				{...props}
			/>
			{error && <span className={styles.errorMessage}>{error}</span>}
		</div>
	);
}
