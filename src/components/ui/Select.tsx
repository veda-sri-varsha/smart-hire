import type { SelectHTMLAttributes } from "react";
import styles from "./Select.module.scss";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
	label?: string;
	error?: string;
	fullWidth?: boolean;
	options?: { value: string; label: string }[];
};

export default function Select({
	label,
	error,
	fullWidth,
	className,
	id,
	options,
	children,
	...props
}: SelectProps) {
	return (
		<div
			className={`${styles.container} ${fullWidth ? styles.fullWidth : ""} ${className ?? ""}`}
		>
			{label && (
				<label htmlFor={id} className={styles.label}>
					{label}
				</label>
			)}
			<select
				id={id}
				className={`${styles.select} ${error ? styles.error : ""}`}
				{...props}
			>
				{options
					? options.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))
					: children}
			</select>
			{error && <span className={styles.errorMessage}>{error}</span>}
		</div>
	);
}
